const db = require('../db')
const uuid = require('uuid')

class messagesControler {
    
    async inviteFriend(req,res) {
        try {
            const { inviteUsername, senderName } = req.body
            const searchFrined  = await db.query('SELECT login, imagesrc FROM users WHERE login = $1',[inviteUsername])
            const searchMe  = await db.query('SELECT login, imagesrc FROM users WHERE login = $1',[senderName])

            if(!searchFrined.rows.length) {
                return res.status(404).json({message:'Пользователя с данным логином не существует'})
            }
            if(inviteUsername === senderName) {
                return res.status(400).json({message:'Самого себя нельзя пригласить'})
            }
            const uuid__generate = uuid.v4()
    
            const currentDate = new Date();
            const dateOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
            const timeOptions = { hour: '2-digit', minute: '2-digit' };

            const dateAndTime = JSON.stringify({
                data:currentDate.toLocaleDateString('ru-RU', dateOptions),
                time:currentDate.toLocaleTimeString('ru-RU', timeOptions)
            })

            const checkMessage = await db.query('SELECT sender_name FROM messages WHERE (sender_name = $1 or receiver_name = $1) AND (sender_name = $2 or receiver_name = $2)',
            [senderName, inviteUsername])

            if(checkMessage.rows.length) {
                return res.status(400).json({message:'Чат между вами уже создан'})
            }
            const createMessages = await db.query('INSERT INTO messages (uuid_messages, sender_name, sender_imagesrc, receiver_name, receiver_imagesrc, dateandtime) values ($1, $2, $3, $4, $5, $6) RETURNING *',
            [uuid__generate, senderName, searchMe.rows[0].imagesrc, inviteUsername, searchFrined.rows[0].imagesrc, dateAndTime])

            res.json(createMessages.rows)
            return;
        }
        catch {
            return res.status(400).json({message:'Ошибка произошла внутри сервера'})
        }
    }
    
    async createMessage(req,res) {
        try {
            const {uuid_messages,content, writemessage, writeimagesrc } = req.body
            const currentDate = new Date();
            const dateOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
            const timeOptions = { hour: '2-digit', minute: '2-digit' };
            const dateAndTime = currentDate.toLocaleDateString('ru-RU', dateOptions) + ' ' +  currentDate.toLocaleTimeString('ru-RU', timeOptions) 

            const searchMessage = await db.query('SELECT * FROM messages WHERE uuid_messages = $1',[uuid_messages])

            if(!searchMessage.rows.length) {
                return res.status(400).json({message:'Чата не существует'})
            }

            const newMessage = await db.query(`INSERT INTO messages 
            (uuid_messages, sender_name, sender_imagesrc, receiver_name, receiver_imagesrc, writemessage, writeimagesrc, content, dateandtime) 
            values ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [searchMessage.rows[0].uuid_messages, searchMessage.rows[0].sender_name, searchMessage.rows[0].sender_imagesrc, 
            searchMessage.rows[0].receiver_name, searchMessage.rows[0].receiver_imagesrc,
            writemessage, writeimagesrc, content, dateAndTime])
            res.json(newMessage.rows)
            return;
        }
        catch {
            return res.status(400).json({message:'Ошибка произошла внутри сервера'})
        }
    }

    async getMessages(req, res) {
        try {
            const { name } = req.body 
            const getList = await db.query('SELECT * FROM messages WHERE (sender_name = $1 or receiver_name = $1) AND content IS NULL',[name])
            const newArr = getList.rows.map(el => {
                if(name === el.sender_name) {
                    return {
                        uuid_messages:el.uuid_messages,
                        name:el.receiver_name,
                        imagesrc:el.receiver_imagesrc 
                    }
                }
                else {
                    return {
                        uuid_messages:el.uuid_messages,
                        name:el.sender_name,
                        imagesrc:el.sender_imagesrc 
                    }
                }
            })
            res.json(newArr)
        }
        catch {
            return res.status(400).json({message:'Ошибка произошла внутри сервера'})
        }
    }

    async getAllChat(req, res) {
        try {
            const {uuid_messages} = req.body
            const searchMessages = await db.query('SELECT * FROM messages WHERE uuid_messages = $1 AND content IS NOT NULL',[uuid_messages])
            res.json(searchMessages)
        }
        catch {
            return res.status(400).json({message:'Ошибка произошла внутри сервера'})
        }
    }
}

module.exports = new messagesControler()