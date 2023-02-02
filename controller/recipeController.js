
const db = require('../models/index')
const sequelize = require('sequelize')
const { Op } = sequelize

class recipeController {
    getRecipe = async (req, res) => {
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
            let { name, amount, prepareTime, cookTime, userId } = req.body
            await db.Recipe.create({
                recipeName: name,
                date: Date.now(),
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
        try {
            let { id } = req.params
            let recipe = await db.Recipe.findByPk(id)
            if(recipe) {
                const prm0 = new Promise((resolve, rejects) => {
                    let x = db.DetailList.destroy({where: {recipeId: id}})
                    resolve(x)
                })
                const prm1 = new Promise((resolve, rejects) => {
                    let x = db.Favorite.destroy({where: {recipeId: id}})
                    resolve(x)
                })
                const prm2 = new Promise((resolve, rejects) => {
                    let x = db.Comment.destroy({where: {recipeId: id}})
                    resolve(x)
                })
                const prm3 = new Promise((resolve, rejects) => {
                    let x = db.Step.destroy({where: {recipeId: id}})
                    resolve(x)
                })
                const prm4 = new Promise((resolve, rejects) => {
                    let x = db.DetailIngredient.destroy({where: {recipeId: id}})
                    resolve(x)
                })
                const prm5 = new Promise((resolve, rejects) => {
                    let x = recipe.destroy()
                    resolve(x)
                })

                await Promise.all([prm0, prm1, prm2, prm3, prm4, prm5])

                res.json({success: true, message: 'Successfully deleted recipe'})
                return
            }
            res.json({success: false, message: 'Recipe not found'})


        } catch (error) {
            res.status(500).json({success: false, message: error.message})
        }
    }

    getDetailRecipe = async (req, res) => {
        try {
            // Get id in URL
            // http://localhost:8080/api/v1/recipe/getRecipe/4   id = 4
            let recipeId  = req.params.id
            let recipe = await db.Recipe.findByPk(recipeId, {
                include: [
                {
                    model: db.DetailIngredient,
                    include: {
                        model: db.Ingredient,
                        attributes: ['name'],
                    },
                },
                {model: db.Step}
                ],
            })
            if(recipe) {
                res.json({success: true, recipe})
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

    getRecipeByIngredient = async (req, res) => {
        try {
            let { slug } = req.params
            let recipe = await db.Recipe.findAll({
                include: {
                    model: db.DetailIngredient,
                    required: true,
                    include: { 
                        model: db.Ingredient,
                        where: {
                            name: slug
                        },
                        attributes: []
                    },
                    attributes: []
                }
            })
            if(recipe && recipe.length > 0) {
                res.json({success: true, data: recipe})
                return
            }
            res.status(500).json({success: false, message: `Don't have recipe with '${slug}'`})
            
        } catch (error) {
            res.status(500).json({success: false, message: error.message})
        }
    }
}


// Create, update, delete recipe need to fix

module.exports = new recipeController