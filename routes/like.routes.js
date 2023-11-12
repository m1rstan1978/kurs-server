const Router = require('express')
const router = new Router()

const likesController = require('../controllers/likes.controller')

router.post('/likes/create',likesController.createLike)
router.post('/likes/list',likesController.getLikes)

module.exports = router