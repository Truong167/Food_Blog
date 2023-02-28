
const db = require('../models/index')
const {sequelize} = require('../models/index')
const Sequelize = require('sequelize')
const { Op } = Sequelize

class recipeController {
    getRecipe = async (req, res) => {
        try {

            // Select * from Recipe, User where Recipe.userId = User.userId
            let data = await db.Recipe.findAll({
                // where: {userId: 2},
                include: [db.User],
                attributes: {
                    exclude: ['createdAt']
                },
                order: [['date', 'DESC']]
            })
            if(data && data.length > 0) {
                return res.status(200).json({
                    success: true,
                    message: 'Successfully get data',
                    data: data
                })
            }
            res.status(429).json({
                success: false, 
                message: "Don't have recipe",
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

    handleCreateRecipe = async (req, res) => {
        let { name, amount, status, prepareTime, cookTime, ingredient, step } = req.body
        if(!name || !amount || !prepareTime || !cookTime || !status) {
            res.status(418).json({
                status: false,
                message: 'Please provide all required fields',
                data: ""
            })
            return
        }

        try {
            let  userId = req.userId
            const result = await sequelize.transaction(async t => {
                let recipe = await db.Recipe.create({
                    recipeName: name,
                    date: Date.now(),
                    amount: amount,
                    status: status,
                    preparationTime: prepareTime,
                    cookingTime: cookTime,
                    userId: userId
                }, { transaction: t })
                ingredient = ingredient.map(item => {
                    item.recipeId = recipe.recipeId
                    return item
                })
                step = step.map(item => {
                    item.recipeId = recipe.recipeId
                    return item
                })
                let ingre = await db.DetailIngredient.bulkCreate(ingredient, { transaction: t })
                let stepRes = await db.Step.bulkCreate(step, { transaction: t })
                return {recipe, ingre, stepRes}
            })
            res.status(200).json({
                success: true, 
                message: 'Successfully added',
                data: result
            })
        } catch (error) {
            res.status(500).json({
                success: false, 
                message: error, 
                data: ""
            })
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

                res.status(200).json({
                    success: true, 
                    message: 'Successfully updated recipe',
                    data: ""
                })
            } else {
                res.status(432).json({
                    success: false, 
                    message: 'Recipe not found',
                    data: ""
                })
            }

        } catch (error) {
            res.status(500).json({
                success: false, 
                message: error,
                data: ""
            })
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

                res.status(200).json({
                    success: true, 
                    message: 'Successfully deleted recipe',
                    data: ""
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
                res.json({
                    success: true,
                    message: "Successfully get data",
                    data: recipe
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
                res.status(200).json({
                    success: true,
                    message: 'Successfully search',
                    data: recipe
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

    updatePrivacyOfRecipe = async (req, res) => {
        try {
            let { id } = req.params
            let { status } = req.body

            let recipe = await db.Recipe.findByPk(id)

            if(recipe) {
                recipe.status = status

                let recipeData = await recipe.save()
                res.status(200).json({
                    success: true,
                    message: 'Successfully updated recipe',
                    data: recipeData
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

    getRecipeByIngredient = async (req, res) => {
        try {
            let { slug } = req.params
            let recipe = await db.Recipe.findAll({
                include: [ 
                    {
                        required: true,
                        model: db.User,
                        model: db.DetailIngredient,
                        include: { 
                            model: db.Ingredient,
                            where: {
                                name: slug
                            },
                            attributes: []
                        },
                        attributes: [],
                    },
                    {
                        model: db.User,
                        attributes: ["fullName", "avatar"]
                    }
                ],
                attributes: ["recipeId", "recipeName", "date", "numberOfLikes", "image"]
            })
            if(recipe && recipe.length > 0) {
                res.status(200).json({
                    success: true,
                    message: 'Successfully get data',
                    data: recipe
                })
                return
            }
            res.status(428).json({
                success: false, 
                message: `Don't have recipe with '${slug}'`,
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

    getPopularRecipe = async (req, res) => {
        let today = new Date()
        var newDate = new Date(today.getTime() - (60*60*24*7*1000))
        console.log(today)
        try {
            let recipe = await db.Recipe.findAll({
                where: {
                    date: {
                        // [Op.between]: ['2023-02-24', '2022-01-01']
                        [Op.lt]: today,
                        [Op.gt]: newDate
                    }
                    
                },
                include: [
                    {   
                        require: true,
                        duplicating: false,
                        model: db.Comment,
                        attributes: []
                    },
                ],
                attributes: {
                    include: [
                        [sequelize.fn('COUNT', sequelize.col('Comments.recipeId')), 'count']
                    ],
                },
                group: ['Recipe.recipeId'],
                order: [
                    ['numberOfLikes', 'DESC'],
                    ['count', 'DESC'],
                    ['date', 'ASC']
                ]
            })
            if(recipe && recipe.length > 0) {
                return res.status(200).json({
                    success: true,
                    message: "Successfully get data",
                    data: recipe
                })
            }
            res.status(432).json({
                success: false,
                message: "Recipe not found",
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


module.exports = new recipeController