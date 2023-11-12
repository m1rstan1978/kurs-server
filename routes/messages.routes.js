const Router = require('express')
const router = new Router()

const messagesController = require('../controllers/messages.controller')

router.post('/messages/invite',messagesController.inviteFriend)
router.post('/messages/create',messagesController.createMessage)
router.post('/messages/list',messagesController.getMessages)
router.post('/messages/all',messagesController.getAllChat)


module.exports = router