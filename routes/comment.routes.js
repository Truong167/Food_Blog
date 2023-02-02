const express = require('express')

const router = express.Router()
const commentController = require('../controller/commentController')

// http://localhost:8080/api/v1/comment/

router.get('/', commentController.index)
router.post('/createComment/:id', commentController.handleCreateComment)
router.put('/updateComment/:userId/:recipeId', commentController.handleUpdateComment)
router.delete('/deleteComment/:userId/:recipeId', commentController.handleDeleteComment)


module.exports = router