const Router = require('express')
const router = new Router()

const commentsController = require('../controllers/comments.controller')

router.post('/comments/create',commentsController.createComments)
router.post('/comments/list',commentsController.getListComm)

module.exports = router