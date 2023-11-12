const Router = require('express')
const router = new Router()
const authMiddleware = require('../middleware/authMiddleware')

const UserController =  require('../controllers/user.controller')

router.post('/user/registration',UserController.createUser)
router.post('/user/auth',UserController.authUser)
router.post('/user/check',UserController.checkAuth)

module.exports = router