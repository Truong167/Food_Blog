
const db = require('../models/index')

class commentController {
    index = (req, res) => {
        res.send('comments')
    }

    getCommentOfRecipe = async (req, res) => {
        try {
            let {recipeId} = req.params
            let recipe = await db.Recipe.findByPk(recipeId)
            if(recipe) {
                let comment = await db.Comment.findAll({
                    where: {
                        recipeId: recipeId
                    },
                    include: {
                        model: db.User,
                        attributes: ["fullName", "avatar"]
                    },
                    attributes: {exclude: ["createdAt", "updatedAt"]}
                })
                let commentCount = await db.Comment.count({where: {recipeId: recipeId}})
                let newData = [{comment, commentCount: commentCount}]
                res.status(200).json({
                    success: true, 
                    message: 'Successfully get data',
                    data: newData
                })
                return
            }

            res.status(432).json({
                success: false,
                message: 'Recipe not found',
                data: ""
            })
        } catch(error) {
            res.status(500).json({
                success: false, 
                message: error,
                data: ""
            })
        }
    }

    handleCreateComment = async (req, res) => {
        try {
            let { recipeId } = req.params
            let userId = req.userId
            let { comment } = req.body
            let recipe = await db.Recipe.findByPk(recipeId)
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
            res.status(432).json({
                success: false,
                message: 'Recipe not found',
                data: ""
            })
        } catch (error) {
            res.status(500).json({
                success: false, 
                message: error.message,
                data: ""
            })
        }
    }

    handleUpdateComment = async (req, res) => {
        try {
            let { recipeId } = req.params
            let userId = req.userId
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
            res.status(434).json({
                success: false, 
                message: 'Comment not found',
                data: ""
            })
        } catch (error) {
            res.status(500).json({
                success: false, 
                message: error.message,
                data: ""
            })
        }
    }

    handleDeleteComment = async (req, res) => {
        try {
            let { recipeId } = req.params
            let userId = req.userId
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
            res.status(434).json({
                success: false, 
                message: 'Comment not found',
                data: ""
            })
        } catch (error) {
            res.status(500).json({
                success: false, 
                message: error.message,
                data: ""
            })
        }
    }
}


module.exports = new commentController