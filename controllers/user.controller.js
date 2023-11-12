const bcrypt = require('bcryptjs');
const db = require('../db')
const jwt = require('jsonwebtoken')
const secretKey  = 'SECRET_KEY'
const uuid = require('uuid')
const path = require('path')
const urlPage = 'https://kurs-server-vwrp.vercel.app/users/'

const generateAccessToken = (login) => {
    const payload = {
        login
    }
    return jwt.sign(payload, secretKey, {
        expiresIn:"24h"
    })
}

class UserController {
    async createUser(req,res) {
        try {
            const {login, password} = req.body
            const chechPerson = await db.query('SELECT * FROM users WHERE login = $1',[login])
            if(chechPerson.rows.length) {
                res.status(400).json({message:'Пользователь c данным логином уже создан'})
                return;
            }
            if(!req.files) {
                return res.status(400).json({message:'Вы не добавили фотографию'})
            }
            const { photo } = req.files
            const hashPassword = bcrypt.hashSync(password,5)
            const filename = uuid.v4() + ".webp"
            const newPerson = await db.query('INSERT INTO users (login,password, imageSrc) values ($1, $2, $3) RETURNING *',[login, hashPassword, urlPage + filename ])
            if(newPerson) {
                photo.mv( path.join( __dirname,'..', 'static','users',filename) )
                const token = generateAccessToken(login)
                res.json(
                    {
                        token:token
                    }
                )
                return;
            }
        }
        catch {
            return res.status(400).json({message:'Ошибка возникла внутри сервера'})
        }
    }
    async authUser(req,res) {
        try {
            const {login, password} = req.body
            const chechPerson = await db.query('SELECT * FROM users WHERE login = $1',[login])
            if(!chechPerson.rows.length) {
                return res.status(400).json({message:'Пользователь с логином: ' + login + ' ' + 'не найден'})
            }
            const validPassword = bcrypt.compareSync(password, chechPerson.rows[0].password)
            if(!validPassword) {
                return res.status(400).json({message:'Пожалуйста, проверьте свой пароль и логин аккаунта и попробуйте снова.'})
            }
            const token = generateAccessToken(login)
            res.json(token)
        }
        catch {
            return res.status(400).json({message:'Ошибка возникла внутри сервера'})
        }
    }
    async checkAuth(req,res) {
        try {
            const token = req.headers.authorization.split(' ')[1]
            const decoded = jwt.verify(token,'SECRET_KEY')
            const getInfo = await db.query('SELECT login, imagesrc FROM users WHERE login = $1',[decoded.login])
            if(decoded) {
                res.json(getInfo)
                return
            }
        }
        catch {
            return res.status(400).json({message:'Вы не авторизованы, войдите в аккаунт'})
        }
    }
}

module.exports = new UserController()