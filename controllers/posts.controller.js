const db = require('../db')
const path = require('path')
const fs = require('fs')
const uuid = require('uuid')
const urlPage = 'https://6bp98ls3-8000.euw.devtunnels.ms/posts/'

class postsController {
    async createPost(req,res) {
            try {
                const { content, createUser, createUserImageSrc } = req.body
                const checkPost = await db.query('SELECT content FROM posts WHERE content = $1',[content])
                if(checkPost.rows[0]) {
                    return res.status(400).json({message:'Пост уже создан'})
                }
                if(!req.files) {
                    const uuid__generate = uuid.v4()
                    const createPost = await db.query('INSERT INTO posts (uuid_posts, createUser, createUserImageSrc, content) values ($1, $2, $3, $4) RETURNING *',
                    [uuid__generate, createUser, createUserImageSrc,  content])
                    res.json(createPost)
                    return;
                }
                const { photo } = req.files
                const uuid__generate = uuid.v4()
                const filename = uuid.v4() + ".webp"
                const createPost = await db.query('INSERT INTO posts (uuid_posts, createUser, createUserImageSrc, content, imageSrc) values ($1, $2, $3, $4, $5) RETURNING *',
                [uuid__generate, createUser, createUserImageSrc, content, (urlPage + filename)])
                if(!createPost.rows.length) {
                    return res.status(400).json({message: 'Фотография не была добавлена'})
                }
                photo.mv( path.join( __dirname,'..', 'static','posts',filename) )
                res.json(createPost)
                return;
            }
            catch {
                return res.status(400).json({message:'Ошибка произошла внутри сервера'})
            }

    }
    async editPost(req, res) {
        try {
            const {content, uuid_post} = req.body
            const editText = await db.query('UPDATE posts set content = $1 WHERE uuid_posts = $2 RETURNING *',[content, uuid_post])
            res.json(editText)
        }
        catch {
            return res.status(400).json({message:'Ошибка произошла внутри сервера'})
        }
    }
    async deletePost(req, res) {
        try {
            const { uuid_post } = req.body
            const deleteP = await db.query('DELETE FROM posts WHERE uuid_posts = $1 RETURNING *',[uuid_post])
            const deleteC = await db.query('DELETE FROM comments WHERE uuid_comments = $1',[uuid_post])
            const deleteL = await db.query('DELETE FROM likes WHERE uuid_likes = $1',[uuid_post])
            res.json(uuid_post)
        }
        catch {
            return res.status(400).json({message:'Ошибка произошла внутри сервера'})
        }
    }
    async getAllPosts(req,res) {
        try {
            const getList = await db.query('SELECT * FROM posts')
            const sortArray = getList.rows.sort((a,b) => b.post_id - a.post_id)
            res.json(sortArray)
        }
        catch {
            return res.status(400).json({message:'Ошибка произошла внутри сервера'})
        }
    }
    async searchPost(req, res) {
        try{
            const { searchContent } = req.body
            const search = await db.query('SELECT * FROM posts WHERE content ILIKE $1',['%' + searchContent + '%'])
            res.json(search)
            return;
        }
        catch {
            return res.status(400).json({message:'Ошибка произошла внутри сервера'})
        }
    }
}

module.exports = new postsController()