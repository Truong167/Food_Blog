
const db = require('../models/index')
const sequelize = require('sequelize')
const { response } = require('express')
const { Op } = sequelize

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
            let { name, date, amount, prepareTime, cookTime, userId } = req.body
            await db.Recipe.create({
                recipeName: name,
                date: date,
                amount: amount,
                preparationTime: prepareTime,
                cookingTime: cookTime,
                userId: userId
            })

            res.json({success: true, message: 'Successfully added'})
        } catch (error) {
            res.status(500).json({success: false, message: error.message})
        }
    }

    handleUpdateRecpipe = async (req, res) => {
        try {
            let { name, amount, prepareTime, cookTime } = req.body
            let recipeId  = req.params.id

            let recipe = await db.Recipe.findByPk(recipeId)

            if(recipe) {
                recipe.recipeName = name
                recipe.amount = amount
                recipe.preparationTime = prepareTime
                recipe.cookingTime = cookTime

                await recipe.save()

                res.json({success: true, message: 'Successfully updated recipe'})
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

    getDetailRecipe = async (req, res) => {
        try {
            // Get id in URL
            // http://localhost:8080/api/v1/recipe/getRecipe/4   id = 4
            let recipeId  = req.params.id
            let recipe = await db.Recipe.findByPk(recipeId, {
                include: [db.Step, db.Ingredient],
                attributes: ['recipeName', 'cookingTime', 'amount'],
            })
            if(recipe) {
                res.json({success: true, message: 'Step', recipe})
                return
            }
            res.status(500).json({success: false, message: 'Recipe not found'})
        } catch (error) {
            res.status(500).json({success: false, message: error.message})
        }

    }

    handleSearchRecipe = async (req, res) => {
        try {

            // http://localhost:8080/api/v1/recipe/search?q=mì
            const { q } = req.query
            let recipe = await db.Recipe.findAll({
                where: {
                    recipeName: {
                        [Op.iLike]: `%${q}%`
                    }
                },
                attributes: {
                    exclude: ['image']
                }
            })

            if(recipe && recipe.length > 0){
                res.json({success: true, data: recipe})
                return
            }

            res.status(500).json({success: false, message: 'Recipe not found'})
        } catch (error) {
            res.status(500).json({success: false, message: error.message})
        }
    }

    updatePrivacyOfRecipe = async (req, res) => {
        try {
            let { id } = req.params
            let { status } = req.body

            let recipe = await db.Recipe.findByPk(id)

            if(recipe) {
                recipe.status = status

                await recipe.save()
                res.status(500).json({success: true, message: 'Successfully updated recipe'})
                return
            }
            res.status(500).json({success: false, message: 'Recipe not found'})

        } catch (error) {
            res.status(500).json({success: false, message: error.message})
        }
    }
}

module.exports = new recipeController