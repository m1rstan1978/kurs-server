const jwt = require('jsonwebtoken')

module.exports = function(req,res, next) {
    if(req.method === 'OPTIONS') {
        next()
    }
    try {
        const token = req.headers.authorization.split(' ')[1]
        if(!token) {
            return res.status(403).json({message:'Пользователь не авторизован'})
        }
        const decoded = jwt.verify(token,'SECRET_KEY')
        if(decoded) {
            next()
        }
        else {
            return res.status(403).json({message:'Пользователь не авторизован'})
        }
    }

    catch {
        return res.status(403).json({message:'Пользователь не авторизован'})
    }
}