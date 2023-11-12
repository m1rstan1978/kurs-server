const express = require('express')
const cors = require('cors')
const http = require('http');
const db = require('./db')
const { Server } = require('socket.io');

const userRouter = require('./routes/user.routes')
const postsRouter = require('./routes/posts.routes')
const commentsRouter = require('./routes/comments.routes')
const likesRouter = require('./routes/like.routes')
const messagesRouter = require('./routes/messages.routes')


const fileUpload = require('express-fileupload');

const PORT = process.env.PORT || 8000

const app = express()
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST','PUT','DELETE'],
    },
  });

app.use(cors())
app.use(express.json())
app.use(fileUpload());
app.use(express.static('static'))


app.use('/api',userRouter)
app.use('/api',postsRouter)
app.use('/api',commentsRouter)
app.use('/api',likesRouter)
app.use('/api',messagesRouter)

app.get('/api',async (req,res) => {
    const search = await db.query('SELECT * FROM users')
    res.json(search)
})



io.on('connection', (socket) => {
    socket.on('message',async (msg) => {
        try {
            if(msg === 'hello') {
                io.emit('allMessages','привет с сервера')
                return;
            }
            const searchMessages = await db.query('SELECT * FROM messages WHERE uuid_messages = $1 AND content IS NOT NULL',[msg])
            io.emit('allMessages',searchMessages.rows)
        }
        catch {
            return res.status(400).json({message:'Ошибка произошла внутри сервера'})
        }
    })
    socket.on('createPost',async (msg) => {
        try {
            const getList = await db.query('SELECT * FROM posts')
            const sortArray = getList.rows.sort((a,b) => b.post_id - a.post_id)
            io.emit('getAllPosts',sortArray)
        }
        catch {
            return res.status(400).json({message:'Ошибка произошла внутри сервера'})
        }
    })
    socket.on('connectServer',(msg) => {
        console.log(msg)
    })

});


server.listen(PORT, () => {
    console.log('Сервер запущен на порте:' + PORT)
})