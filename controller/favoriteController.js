
const db = require('../models/index')

class favoriteController {
    index = (req, res) => {
        res.send('favorite')
    }

    handleCreateFavorite = async (req, res) => {
        try {
            let { recipeId, userId } = req.params
            let recipe = await db.Recipe.findByPk(recipeId)
            if(recipe) {
                let favorite = await db.Favorite.create({
                    userId: userId,
                    recipeId: recipeId,
                    date: Date.now()
                })
                res.status(200).json({
                    success: true, 
                    message: 'Successfully',
                    data: favorite
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

    handleDeleteFavorite = async (req, res) => {
        try {
            let { recipeId, userId } = req.params
            let favorite = await db.Favorite.findOne({where: {userId: userId, recipeId: recipeId}})
            if(favorite) {
                let favoriteData = await favorite.destroy()
                res.status(200).json({
                    success: true, 
                    message: 'Successfully',
                    data: favoriteData,
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

}

// Create, update, delete recipe need to fix

module.exports = new favoriteController