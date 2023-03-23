
const db = require('../models')
const {sequelize} = require('../models/index')
const Sequelize = require('sequelize')
const { Op } = Sequelize
let multerConfig = require("../middlewares/utils/multerConfig")


class recipeController {
    getRecipe = async (req, res) => {
        try {
            const userId = req.userId
            // Select * from Recipe, User where Recipe.userId = User.userId
            let data = await db.Recipe.findAll({
                include: [
                    {
                        model: db.User,
                        attributes: [
                            "fullName", "avatar", "userId",
                            [sequelize.literal(` (SELECT CASE WHEN EXISTS 
                                (Select * from "Follow" where "userIdFollowed" = "User"."userId" and "userIdFollow" = ${userId}) 
                                then True else False end isFollow) `), "isFollow"]
                        ]
                    },
                    {
                        model: db.DetailList,
                        include: {
                            model: db.RecipeList,
                            attributes: ["name"]
                        },
                        attributes: ["recipeListId"]
                    }, 
                ]
                ,
                attributes: [
                    "recipeId", "recipeName", "date", "numberOfLikes", "image", "status",
                    [sequelize.literal(`(SELECT CASE WHEN EXISTS 
                        (SELECT * FROM "Favorite" WHERE "recipeId" = "Recipe"."recipeId" and "userId" = ${userId}) 
                        THEN True ELSE False end isFavorite) `), "isFavorite"]
                ],
                order: [["date", 'DESC']]
            })
            if(data && data.length > 0) {
                data.map(item => {
                    item.dataValues.DetailLists.map(item => {
                        item.dataValues.name = item.dataValues.RecipeList.dataValues.name
                        delete item.dataValues['RecipeList']
                        return item
                    })
                })
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
        let uploadFile = multerConfig().fields(
            [
                {
                    name: 'recipe',
                    maxCount: 1
                },
                {
                    name: 'step',
                    maxCount: 20
                }
            ]
        )
        uploadFile( req, res, async (error) => {
            let { data} = req.body
            if(error) {
                return res.status(440).json({
                    success: false, 
                    message: `Error when trying to upload: ${error.message}`,
                    data: ""
                });
            } 
            console.log("data", data) 
            console.log("type", typeof data) 
            console.log("recipeName", data.recipeName) 
            console.log(req.files)  
            if(!data){
                res.status(418).json({
                            status: false,
                            message: 'Please provide all required fields: data',
                            data: ""
                        })
                        return
            }
            // if(!recipeName || !amount || !preparationTime || !cookingTime || !status || !DetailIngredients || !Steps) {

                // if(!amount) {
                //     res.status(418).json({
                //         status: false,
                //         message: 'Please provide all required fields: amount',
                //         data: ""
                //     })
                //     return
                // } else if(!recipeName){
                //     res.status(418).json({
                //         status: false,
                //         message: 'Please provide all required fields: recipeName',
                //         data: ""
                //     })
                //     return
                // }else if(!preparationTime){
                //     res.status(418).json({
                //         status: false,
                //         message: 'Please provide all required fields: preparationTime',
                //         data: ""
                //     })
                //     return
                // }else if(!status){
                //     res.status(418).json({
                //         status: false,
                //         message: 'Please provide all required fields: status',
                //         data: ""
                //     })
                //     return
                // }else if(!DetailIngredients){
                //     res.status(418).json({
                //         status: false,
                //         message: 'Please provide all required fields: DetailIngredients',
                //         data: ""
                //     })
                //     return
                // }else if(!Steps){
                //     res.status(418).json({
                //         status: false,
                //         message: 'Please provide all required fields: Steps',
                //         data: ""
                //     })
                //     return
                // }
                // else if(!cookingTime){
                //     res.status(418).json({
                //         status: false,
                //         message: 'Please provide all required fields: cookingTime',
                //         data: ""
                //     })
                //     return
                // }
                try {
                    data = JSON.parse(data)
                    let DetailIngredients = data.DetailIngredients
                    let Steps = data.Steps
                    let  userId = req.userId
                    const result = await sequelize.transaction(async t => {
                        let recipe = await db.Recipe.create({
                            recipeName: data.recipeName,
                            date: Date.now(),
                            amount: data.amount,
                            status: data.status,
                            preparationTime: data.preparationTime,
                            image: req.files.recipe ? `/recipe/${req.files.recipe[0].filename}` : null,
                            cookingTime: data.cookingTime,
                            description: data.description ? data.description : null,
                            userId: userId
                        }, { transaction: t })
                        // let ingredientName = [
                        //     {"ingredientNameId": "thitheo", "amount": "2kg"}
                        // ]
                        // let step = [
                        //     {"stepIndex": 1, "description": "TESSTTT"},
                        //     {"stepIndex": 2, "description": "TESSTTT"},
                        //     {"stepIndex": 3, "description": "TESSTTT"}
                        // ]
                        DetailIngredients  = data.DetailIngredients.map(item => {
                            item.recipeId = recipe.recipeId
                            return item
                        })
                        let index = 0
                        for(let i = 0; i < data.Steps.length; i++){
                            Steps[i].image = Steps[i].image ? `/step/${req.files.step[index].filename}` : null
                            Steps[i].recipeId = recipe.recipeId
                            index++
                        }
                        let ingre = await db.DetailIngredient.bulkCreate(DetailIngredients, { transaction: t })
                        let stepRes = await db.Step.bulkCreate(Steps, { transaction: t })
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
                        message: error.message, 
                        data: ""
                    })
                }
        })
    }

    handleCreateRecipe1 = async (req, res) => {
        let uploadFile = multerConfig().fields(
            [
                {
                    name: 'recipe',
                    maxCount: 1
                },
                {
                    name: 'step',
                    maxCount: 20
                }
            ]
        )
        uploadFile( req, res, async (error) => {
            let { recipeName, amount, status, preparationTime, cookingTime, description, DetailIngredients, Steps} = req.body
            if(error) {
                return res.status(440).json({
                    success: false, 
                    message: `Error when trying to upload: ${error.message}`,
                    data: ""
                });
            }    
            // if(!recipeName || !amount || !preparationTime || !cookingTime || !status || !DetailIngredients || !Steps) {

                if(!amount) {
                    res.status(418).json({
                        status: false,
                        message: 'Please provide all required fields: amount',
                        data: ""
                    })
                    return
                } else if(!recipeName){
                    res.status(418).json({
                        status: false,
                        message: 'Please provide all required fields: recipeName',
                        data: ""
                    })
                    return
                }else if(!preparationTime){
                    res.status(418).json({
                        status: false,
                        message: 'Please provide all required fields: preparationTime',
                        data: ""
                    })
                    return
                }else if(!status){
                    res.status(418).json({
                        status: false,
                        message: 'Please provide all required fields: status',
                        data: ""
                    })
                    return
                }else if(!DetailIngredients){
                    res.status(418).json({
                        status: false,
                        message: 'Please provide all required fields: DetailIngredients',
                        data: ""
                    })
                    return
                }else if(!Steps){
                    res.status(418).json({
                        status: false,
                        message: 'Please provide all required fields: Steps',
                        data: ""
                    })
                    return
                }
                else if(!cookingTime){
                    res.status(418).json({
                        status: false,
                        message: 'Please provide all required fields: cookingTime',
                        data: ""
                    })
                    return
                }
                try {
                    DetailIngredients = JSON.parse(DetailIngredients)
                    Steps = JSON.parse(Steps)
                    let  userId = req.userId
                    console.log(req.files)
                    const result = await sequelize.transaction(async t => {
                        let recipe = await db.Recipe.create({
                            recipeName: recipeName,
                            date: Date.now(),
                            amount: amount,
                            status: status,
                            preparationTime: preparationTime,
                            image: req.files.recipe ? `/recipe/${req.files.recipe[0].filename}` : null,
                            cookingTime: cookingTime,
                            description: description ? description : null,
                            userId: userId
                        }, { transaction: t })
                        // let ingredientName = [
                        //     {"ingredientNameId": "thitheo", "amount": "2kg"}
                        // ]
                        // let step = [
                        //     {"stepIndex": 1, "description": "TESSTTT"},
                        //     {"stepIndex": 2, "description": "TESSTTT"},
                        //     {"stepIndex": 3, "description": "TESSTTT"}
                        // ]
                        DetailIngredients = DetailIngredients.map(item => {
                            item.recipeId = recipe.recipeId
                            return item
                        })
                        for(let i = 0; i < Steps.length; i++){
                            Steps[i].image = req.files.step[i] ? `/step/${req.files.step[i].filename}` : null
                            Steps[i].recipeId = recipe.recipeId
                        }
                        let ingre = await db.DetailIngredient.bulkCreate(DetailIngredients, { transaction: t })
                        let stepRes = await db.Step.bulkCreate(Steps, { transaction: t })
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
                        message: error.message, 
                        data: ""
                    })
                }
        })
    }


    handleUpdateRecpipe = async (req, res) => {
        let uploadFile = multerConfig().fields([
            {
                name: "recipe",
                maxCount: 1
            },
            {
                name: "step",
                maxCount: 20
            }
        ])
        uploadFile(req, res, async error => {
            if(error){
                return res.status(440).json({
                    success: false,
                    message: `Error when trying to upload: ${error}`,
                    data: ""
                })
            }
            try {
                let { name, amount, prepareTime, cookTime, step, ingredient } = req.body
                let recipeId  = req.params.id
    
                let recipe = await db.Recipe.findByPk(recipeId)
    
                if(recipe) {
                    step = step.map(item => {
                        item.recipeId = recipe.recipeId
                        return item
                    })
                    ingredient = ingredient.map(item => {
                        item.recipeId = recipe.recipeId
                        return item
                    })
                    await db.Step.bulkCreate(step, {
                        updateOnDuplicate: ["stepId", "stepIndex", "description"],
                    })

                    await db.DetailIngredient.bulkCreate(ingredient, {
                        updateOnDuplicate: ["amount"]
                    })

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
                    message: error.message,
                    data: ""
                })
            }
        })
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
            let userId = req.userId
            let recipeId  = req.params.id
            let recipe = await db.Recipe.findByPk(recipeId, {
                    include: [
                    {
                        model: db.Step,
                        attributes: {exclude: ["createdAt", "updatedAt", "recipeId"]}
                    },
                    {
                        model: db.User,
                        attributes: [
                            "userId", "fullName", "avatar",
                            [sequelize.literal(` (SELECT CASE WHEN EXISTS 
                                (Select * from "Follow" where "userIdFollowed" = "User"."userId" and "userIdFollow" = ${userId}) 
                                then True else False end isFollow) `), "isFollow"]
                        ]
                    },
                    {
                        model: db.DetailList,
                        include: {
                            model: db.RecipeList,
                            attributes: ["name"]
                        },
                        attributes: ["recipeListId"]
                    }, 
                    {
                        model: db.DetailIngredient,
                        include: {
                            model: db.Ingredient,
                            attributes: ["name"]
                        },
                        attributes: ["ingredientId", "amount"]
                    }
                    ],
                    attributes: {
                        exclude: ["createdAt", "updatedAt"], 
                        include: [
                            [sequelize.literal(`(SELECT CASE WHEN EXISTS 
                            (SELECT * FROM "Favorite" WHERE "recipeId" = "Recipe"."recipeId" and "userId" = ${userId}) 
                            THEN True ELSE False end isFavorite) `), "isFavorite"], 
                    ]}
                })
        
            recipe.dataValues.DetailLists.map(item => {
                item.dataValues.name = item.dataValues.RecipeList.dataValues.name
                delete item.dataValues['RecipeList']
                return item
            })
            recipe.dataValues.DetailIngredients.map(item => {
                item.dataValues.name = item.dataValues.Ingredient.dataValues.name
                delete item.dataValues['Ingredient']
                return item
            })
            if(recipe) {
                res.json({
                    success: true,
                    message: "Successfully get data",
                    data: recipe,
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
            const {q} = req.query
            let recipe = await db.Recipe.findAll({
                where: {
                    recipeName: {
                        [Op.iLike]: `%${q}%`
                    }
                },
                attributes: ["recipeName"]
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
            let {status} = req.body

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
            let userId = req.userId
            let recipe = await db.Recipe.findAll({
                include: [ 
                    {
                        required: true,
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
                        attributes: [
                            "fullName", "avatar", "userId",
                            [sequelize.literal(` (SELECT CASE WHEN EXISTS 
                                (Select * from "Follow" where "userIdFollowed" = "User"."userId" and "userIdFollow" = ${userId}) 
                                then True else False end isFollow) `), "isFollow"]
                        ]
                    },
                    {
                        model: db.DetailList,
                        include: {
                            model: db.RecipeList,
                            attributes: ["name"]
                        },
                        attributes: ["recipeListId"]
                    }, 
                ],
                attributes: [
                    "recipeId", "recipeName", "date", "numberOfLikes", "image", "status",
                    [sequelize.literal(`(SELECT CASE WHEN EXISTS 
                        (SELECT * FROM "Favorite" WHERE "recipeId" = "Recipe"."recipeId" and "userId" = ${userId}) 
                        THEN True ELSE False end isFavorite) `), "isFavorite"]
                ]
            })
            if(recipe && recipe.length > 0) {
                recipe.map(item => {
                    item.dataValues.DetailLists.map(item => {
                        item.dataValues.name = item.dataValues.RecipeList.dataValues.name
                        delete item.dataValues['RecipeList']
                        return item
                    })
                })
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
        let userId = req.userId
        let today = new Date()
        var newDate = new Date(today.getTime() - (60*60*24*7*1000)) // lấy 7 ngày trước
        try {
            let recipe = await db.Recipe.findAll({
                where: {
                    date: {
                        [Op.lt]: today,
                        [Op.gt]: newDate
                    }
                    
                },
                include: [
                    {   
                        model: db.Comment,
                        attributes: []
                    },
                    {
                        model: db.User,
                        attributes: [
                            "fullName", "avatar", "userId",
                            [sequelize.literal(` (SELECT CASE WHEN EXISTS 
                                (Select * from "Follow" where "userIdFollowed" = "User"."userId" and "userIdFollow" = ${userId}) 
                                then True else False end isFollow) `), "isFollow"]
                        ]
                    },
                    {
                        model: db.DetailList,
                        include: {
                            model: db.RecipeList,
                            attributes: ["name"]
                        },
                        attributes: ["recipeListId"]
                    },
                ],
                attributes: [
                    "recipeId", "recipeName", "date", "numberOfLikes", "image", "status",
                    [sequelize.fn('COUNT', sequelize.col('Comments.recipeId')), 'count'],
                    [sequelize.literal(`(SELECT CASE WHEN EXISTS 
                        (SELECT * FROM "Favorite" WHERE "recipeId" = "Recipe"."recipeId" and "userId" = ${userId}) 
                        THEN True ELSE False end isFavorite) `), "isFavorite"]
                ],
                group: [
                    'Recipe.recipeId', "User.fullName", "User.avatar", "User.userId", "DetailLists.recipeId", 
                    "DetailLists.recipeListId", "DetailLists->RecipeList.recipeListId"
                ],
                order: [
                    ['numberOfLikes', 'DESC'],
                    ['count', 'DESC'],
                    ['date', 'ASC']
                ]
            })
            if(recipe && recipe.length > 0) {
                recipe.map(item => {
                    item.dataValues.DetailLists.map(item => {
                        item.dataValues.name = item.dataValues.RecipeList.dataValues.name
                        delete item.dataValues['RecipeList']
                        return item
                    })
                })
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

    getRecipeFromFollowers = async (req, res) => {
        try {
            const userId = req.userId
            let followers = await db.Follow.findAll({
                where: {
                    userIdFollow: userId,
                    isSeen: false,
                },
                attributes: ["userIdFollowed"]
            })
            if(followers && followers.length == 0) {
                res.status(436).json({
                    success: false,
                    message: "User do not follow anyone or do not have update from anyone",
                    data: "",
                })
                return
            }
            let newFollowerData = followers.map(item => item.dataValues.userIdFollowed)
            let recipe = await db.Recipe.findAll({
                where: {
                    userId: {
                        [Op.or]: [newFollowerData]
                    }
                },
                include: [
                    {
                        model: db.User,
                        attributes: [
                            "fullName", "avatar", "userId",
                            [sequelize.literal(` (SELECT CASE WHEN EXISTS 
                                (Select * from "Follow" where "userIdFollowed" = "User"."userId" and "userIdFollow" = ${userId}) 
                                then True else False end isFollow) `), "isFollow"]
                        ]
                    },
                    {
                        model: db.DetailList,
                        include: {
                            model: db.RecipeList,
                            attributes: ["name"]
                        },
                        attributes: ["recipeListId"]
                    }, 
                ],
                    attributes: [
                        "recipeId", "recipeName", "date", "numberOfLikes", "image", "status",
                        [sequelize.literal(`(SELECT CASE WHEN EXISTS 
                            (SELECT * FROM "Favorite" WHERE "recipeId" = "Recipe"."recipeId" and "userId" = ${userId}) 
                            THEN True ELSE False end isFavorite) `), "isFavorite"]
                    ],
                    order: [["date", 'DESC']]
            })
            if(recipe && recipe.length > 0 ){
                recipe.map(item => {
                    item.dataValues.DetailLists.map(item => {
                        item.dataValues.name = item.dataValues.RecipeList.dataValues.name
                        delete item.dataValues['RecipeList']
                        return item
                    })
                })
                res.status(200).json({
                    success: true,
                    message: "Successfully get data",
                    data: recipe,
                })
                return
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error,
                data: ""
            })
        }
    }

    handleGetRecipeByName = async (req, res) => {
        try {
            const {slug} = req.params
            const recipe = await db.Recipe.findAll({
                where: {
                    recipeName: {
                        [Op.iLike]: `%${slug}%`
                    }
                },
                include: {
                    model: db.User,
                    attributes: ["fullName", "avatar", "userId"]
                },
                    attributes: ["recipeId", "recipeName", "date", "numberOfLikes", "image", "description", "status"],
                    order: [["date", 'DESC']]
            })
            if(recipe && recipe.length > 0){
                res.status(200).json({
                    success: true,
                    message: "Successfully get data",
                    data: recipe
                })
                return
            }

            res.status(432).json({
                success: false,
                message: "Recipe not found",
                data: ""
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error,
                data: ""
            })
        }
    }

    getRecipeByUserId = async (req, res) => {
        try {
            const userId = req.userId
            const recipe = await db.Recipe.findAll({
                where: {
                    userId: userId
                },
                order: [["date", "DESC"]],
                attributes: ["recipeId", "recipeName", "date", "numberOfLikes", "image", "status"]
            })
            const user = await db.User.findByPk(userId)
            if(recipe && recipe.length > 0) {
                const newData = {user, recipe}
                res.status(200).json({
                    success: true,
                    message: "Successfully get data",
                    data: newData
                })
                return
            }

            res.status(432).json({
                success: true,
                message: "Recipe not found",
                data: recipe
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error,
                data: ""
            })
        }
    }

    searchRecipe = async (req, res) => {
        try {

            // http://localhost:8080/api/v1/recipe/search?q=mì
            const {q} = req.query
            const userId = req.userId
            let recipe = await db.Recipe.findAll({
                include: {
                    model: db.User,
                    attributes: [
                        "fullName", "avatar", "userId",
                        [sequelize.literal(` (SELECT CASE WHEN EXISTS 
                            (Select * from "Follow" where "userIdFollowed" = "User"."userId" and "userIdFollow" = ${userId}) 
                            then True else False end isFollow) `), "isFollow"]
                    ]
                },
                attributes: [
                    "recipeId", "recipeName", "date", "numberOfLikes", "image", "status",
                    [sequelize.literal(`(SELECT CASE WHEN EXISTS 
                        (SELECT * FROM "Favorite" WHERE "recipeId" = "Recipe"."recipeId" and "userId" = ${userId}) 
                        THEN True ELSE False end isFavorite) `), "isFavorite"]
                ],
                where: {
                    recipeName: {
                        [Op.iLike]: `%${q}%`
                    }
                },
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

    getRecipeFavorite = async (req, res) => {
        try {
            const userId = req.userId
            let recipeFavorite = await db.Favorite.findAll({
                where: {
                    userId: userId
                },
                attributes: ["recipeId"]
            })
            let recipeId = recipeFavorite.map(item => item.dataValues.recipeId)
            let recipe = await db.Recipe.findAll({
                where: {
                    recipeId: {
                        [Op.or]: [recipeId]
                    }
                },
                include: {
                    model: db.User,
                    attributes: [
                        "userId", "fullName", "avatar",
                        [sequelize.literal(` (SELECT CASE WHEN EXISTS 
                            (Select * from "Follow" where "userIdFollowed" = "User"."userId" and "userIdFollow" = ${userId}) 
                            then True else False end isFollow) `), "isFollow"]
                    ]
                },
                attributes: ["recipeId", "recipeName", "date", "numberOfLikes", "image", "status"]
            })
            if(recipe && recipe.length > 0) {

                res.status(200).json({
                    success: true,
                    message: 'Successfully search',
                    data: recipe
                })
                return
            }
            res.status(400).json({
                success: false,
                message: 'User do not have any recipe',
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