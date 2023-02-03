
const db = require('../models/index')

class commentController {
    index = (req, res) => {
        res.send('comments')
    }

    handleCreateComment = async (req, res) => {
        try {
            let { recipeId, userId } = req.params
            let { comment } = req.body
            let recipe = db.Recipe.findByPk(id)
            if(recipe) {
                let commentData = await db.Comment.create({
                    userId: userId,
                    recipeId: recipeId,
                    date: Date.now(),
                    comment: comment
                })
                res.status(200).json({
                    success: true, 
                    message: 'Successfully added',
                    data: commentData
                })
                return
            }
            res.status(400).json({
                success: false,
                message: 'Recipe not found',
                data: null
            })
        } catch (error) {
            res.status(500).json({
                success: false, 
                message: error.message,
                data: null
            })
        }
    }

    handleUpdateComment = async (req, res) => {
        try {
            let { userId, recipeId } = req.params
            let { comment } = req.body
            let commentData = await db.Comment.findOne({where: {userId: userId, recipeId: recipeId}})
            if(commentData) {
                commentData.comment = comment
                let data = await commentData.save()
                res.status(200).json({
                    success: true, 
                    message: 'Successfully updated comment',
                    data: data
                })
                return
            }
            res.status(400).json({
                success: false, 
                message: 'Comment not found',
                data: null
            })
        } catch (error) {
            res.status(500).json({
                success: false, 
                message: error.message,
                data: null
            })
        }
    }

    handleDeleteComment = async (req, res) => {
        try {
            let { userId, recipeId } = req.params
            let comment = await db.Comment.findOne({where: {userId: userId, recipeId: recipeId}})
            if(comment) {
                let commentData = await comment.destroy()
                res.status(200).json({
                    success: true, 
                    message: 'Successfully deleted comment',
                    data: commentData
                })
                return
            }
            res.status(400).json({
                success: false, 
                message: 'Comment not found',
                data: null
            })
        } catch (error) {
            res.status(500).json({
                success: false, 
                message: error.message,
                data: null
            })
        }
    }
}

// Create, update, delete recipe need to fix

module.exports = new commentController