
const db = require('../models/index')

class recipeController {
    getAllRecipe = async (req, res) => {
        try {

            // Select * from Recipe, User where Recipe.userId = User.userId
            let data = await db.Recipe.findAll({
                // where: {userId: 2},
                include: [db.User],
                attributes: {
                    exclude: ['createdAt']
                }
            })
            res.json({success: true, data: data})
        } catch (error) {
            res.status(500).json({success: false, message: error.message})
        }
    }

    handleCreateRecipe = async (req, res) => {
        try {
            let { name, date, status, amount, prepareTime, cookTime, userId } = req.body
            await db.Recipe.create({
                recipeName: name,
                date: date,
                status: status,
                amount: amount,
                preparationTime: prepareTime,
                cookingTime: cookTime,
                // numberOfLikes: likes,
                userId: userId
            })

            res.json({success: true, message: 'Thêm thành công'})
        } catch (error) {
            res.status(500).json({success: false, message: error.message})
        }
    }

    handleUpdateRecpipe = async (req, res) => {
        try {
            let { recipeId, name, date, status, amount, prepareTime, cookTime } = req.body

            let recipe = await db.Recipe.findOne({
                where: {recipeId}
            })

            if(recipe) {
                recipe.recipeName = name
                recipe.date = date
                recipe.status = status
                recipe.amount = amount
                recipe.preparationTime = prepareTime
                recipe.cookingTime = cookTime

                await recipe.save()

                res.json({success: true, data: recipe})
            } else {
                res.json({success: false, message: 'Recipe not found'})
            }

        } catch (error) {
            res.status(500).json({success: false, message: error.message})
        }
    }

    handleDeleteRecipe = async (req, res) => {
        res.json({success: true, message: 'Delete Recipe'})
    }
}

module.exports = new recipeController