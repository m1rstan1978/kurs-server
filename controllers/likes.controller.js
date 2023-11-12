const db = require('../db')

class likesController {
    async createLike(req,res) {
        try {
            const {uuid_like, likesname} = req.body
            const thatLike = await db.query('SELECT * FROM likes WHERE uuid_likes = $1',[uuid_like])
            let checkLike = false
            thatLike.rows.forEach( el => {
                if(likesname === el.likesname) {
                    checkLike = true
                }
            })
            if(checkLike) {
                const deleteLike = await db.query('DELETE FROM likes WHERE uuid_likes = $1 AND likesname = $2 RETURNING *',[uuid_like, likesname])
                const newLike = await db.query('SELECT * FROM likes WHERE uuid_likes = $1',[uuid_like])
                res.json(newLike)
                return;
            }
            const addLike = await db.query('INSERT INTO likes (uuid_likes, likesname) values ($1, $2) RETURNING *',[uuid_like, likesname])
            const newsLike = await db.query('SELECT * FROM likes WHERE uuid_likes = $1',[uuid_like])
            res.json(newsLike)
            return;
        }
        catch {
            return res.status(400).json({message:'Ошибка произошла внутри сервера'})
        }
    }
    async getLikes(req,res) {
        try {
            const {uuid_likes} = req.body
            const allListLikes = await db.query('SELECT * FROM likes WHERE uuid_likes = $1',[uuid_likes])
            res.json(allListLikes)
        }
        catch {
            return res.status(400).json({message:'Ошибка произошла внутри сервера'})
        }
    }
}

module.exports = new likesController()