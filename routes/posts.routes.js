const Router = require('express')
const router = new Router()

const postsController = require('../controllers/posts.controller')

router.post('/posts/create',postsController.createPost)
router.get('/posts/list',postsController.getAllPosts)
router.put('/posts/edit',postsController.editPost)
router.post('/posts/delete',postsController.deletePost)
router.post('/posts/search',postsController.searchPost)


module.exports = router