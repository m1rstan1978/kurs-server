const db = require('../db')

class commentsController {
    async createComments(req, res) {
        try {
            const {username, uuid_comments, comment_text,userImageSrc } = req.body
            const writeComm = await db.query('INSERT INTO comments (username, userImageSrc, uuid_comments, comment_text) values ($1, $2, $3, $4) RETURNING *',
            [username, userImageSrc, uuid_comments, comment_text]) 
            res.json({message:'Комментарий успешно размещен'})
            return;
        }
        catch {
            return res.status(400).json({message:'Ошибка возникла внутри сервера'})
        }
    }
    async getListComm(req,res) {
        const {uuid_comments} = req.body
        const getArrComm = await db.query('SELECT * FROM comments WHERE uuid_comments = $1',[uuid_comments])
        res.json(getArrComm)
    }
}

module.exports = new commentsController()