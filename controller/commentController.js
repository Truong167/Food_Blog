
const db = require('../models/index')

class commentController {
    index = (req, res) => {
        res.send('comments')
    }

    handleCreateComment = async (req, res) => {
        try {
            let { id } = req.params
            let { comment, userId } = req.body
            let recipe = db.Recipe.findByPk(id)
            if(recipe) {
                await db.Comment.create({
                    userId: userId,
                    recipeId: id,
                    date: Date.now(),
                    comment: comment
                })
                res.json({success: true, message: 'Successfully added'})
                return
            }
            res.json({success: false, message: 'Recipe not found'})
        } catch (error) {
            res.status(500).json({success: false, message: error.message})
        }
    }

    handleUpdateComment = async (req, res) => {
        try {
            let { userId, recipeId } = req.params
            let { comment } = req.body
            let commentData = await db.Comment.findOne({where: {userId: userId, recipeId: recipeId}})
            if(commentData) {
                commentData.comment = comment
                await commentData.save()
                res.json({success: true, message: 'Successfully updated comment'})
                return
            }
            res.json({success: false, message: 'Comment not found'})
        } catch (error) {
            res.status(500).json({success: false, message: error.message})
        }
    }

    handleDeleteComment = async (req, res) => {
        try {
            let { userId, recipeId } = req.params
            let comment = await db.Comment.findOne({where: {userId: userId, recipeId: recipeId}})
            if(comment) {
                await comment.destroy()
                res.json({success: true, message: 'Successfully deleted comment'})
                return
            }
            res.json({success: false, message: 'Comment not found'})
        } catch (error) {
            res.status(500).json({success: false, message: error.message})
        }
    }
}

// Create, update, delete recipe need to fix

module.exports = new commentController