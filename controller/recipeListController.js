
const db = require('../models/index')
const multerConfig = require('../middlewares/utils/multerConfig')


class recipeListController {
    
    getRecipeList = async (req, res) => {
        try {
            const userId = req.userId
            const recipeList = await db.RecipeList.findAll({
                where: {
                    userId: userId
                },
                attributes: ["recipeListId", "name", "image"]
            })
            if(recipeList && recipeList.length > 0) {
                res.status(200).json({
                    success: true,
                    message: "Successfully get data",
                    data: recipeList
                })
                return
            }
            res.status(439).json({
                success: false,
                message: "User do not have any recipe list",
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

    handleCreateRecipeList = async (req, res) => {
        let uploadFile = multerConfig().fields([
            {
                name: 'recipeList',
                maxCount: 1
            }
        ]) 
        uploadFile(req, res, async (error) => {
            let { name } = req.body
            if(error) {
                res.status(440).json({
                    success: false,
                    message: error.message,
                    data: ""
                })
                return
            }
            if(!name) {
                res.status(418).json({
                    success: false,
                    message: 'Missing request data',
                    data: ""
                })
                return
            }
            try {
                let userId = req.userId
                const recipeList = await db.RecipeList.create({
                    name: name,
                    date: Date.now(),
                    userId: userId,
                    image: req.files.recipeList ? `/recipeList/${req.files.recipeList[0].filename}` : null
                })
                res.status(200).json({
                    success: true,
                    message: `Recipe list saved successfully.`,
                    data: recipeList,
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

    handleCreateRecipeList1 = async (req, res) => {
        let uploadFile = multerConfig().fields([
            {
                name: 'recipeList',
                maxCount: 2
            }
        ]) 
        uploadFile(req, res, async (error) => {
            let { name } = req.body
            if(error) {
                return res.status(440).json({
                    success: false, 
                    message: `Error when trying to upload: ${error}`,
                    data: ""
                })
            }
            if(!name) {
                res.status(418).json({
                    success: false,
                    message: 'Missing request data',
                    data: ""
                })
                return
            }
            try {
                let userId = req.userId
                let file = req.files.recipeList.map(item => {
                    let arr = []
                    arr.push(`/recipeList/${item.filename}`)
                    return arr
                })
                const recipeList = await db.RecipeList.create({
                    name: name,
                    date: Date.now(),
                    userId: userId,
                    image: file.join(',')
                })
                res.status(200).json({
                    success: true,
                    message: `Recipe list saved successfully.`,
                    data: recipeList,
                  })
            } catch (error) {
                res.status(500).json({
                    success: false, 
                    message: error,
                    data: ""
                })
            }

        })
    }

    handleUpdateRecipeList = async (req, res) => {
        let { name } = req.body
        if(!name) {
            res.status(418).json({
                success: false,
                message: 'Missing request data',
                data: ""
            })
            return
        }
        try {
            let { id } = req.params
            let recipeList = await db.RecipeList.findByPk(id)

            if(recipeList) {
                recipeList.name = name

                await recipeList.save()

                res.status(200).json({
                    success: true,
                    message: 'Successfully updated recipe list',
                    data: recipeList
                })
                return
            }

            res.status(433).json({
                success: false,
                message: 'Recipe list not found',
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

    handleDeleteRecipeList = async (req, res) => {
        try {
            let { id } = req.params
            const prm0 = new Promise((resolve, rejects) => {
                let x = db.DetailList.destroy({where: {recipeListId: id}})
                resolve(x)
            })
            const prm1 = new Promise((resolve, rejects) => {
                let x =  db.RecipeList.findByPk(id)
                resolve(x)
            })
            let x = await Promise.all([prm0, prm1])
            let [detailList, recipeList] = [...x]
            // let detailList = await db.DetailList.findAll({where: {recipeListId: id}})
            // let recipeList = await db.RecipeList.findByPk(id)

            if(recipeList) {
                // recipeList.name = name
                // await detailList.destroy()
                await recipeList.destroy()

                res.status(200).json({
                    success: true, 
                    message: 'Successfully deleted recipe list',
                    data: ""
                })
                return
            }

            res.status(433).json({
                success: false, 
                message: 'Recipe list not found',
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
        try {
            let { recipeListId, recipeId } = req.params
            let recipe = await db.Recipe.findByPk(recipeId)
            let dtRecipe = await db.DetailList.findOne({where: {recipeListId: recipeListId, recipeId: recipeId}})
            if(!recipe) {
                res.status(432).json({
                    success: true,
                    message: 'Recipe not found',
                    data: ""
                })
            } else if(dtRecipe) {
                res.status(432).json({
                    success: true,
                    message: 'Recipe is exist in recipe list',
                    data: ""
                })
            } else {
                let detailList = await db.DetailList.create({
                    recipeListId: recipeListId,
                    recipeId: recipeId,
                    date: Date.now()
                })
                res.status(200).json({
                    success: true, 
                    message: 'Recipe created successfully',
                    data: detailList
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
            let { recipeListId, recipeId } = req.params
            let recipe = await db.DetailList.findOne({where: {recipeListId: recipeListId, recipeId: recipeId}})
            if(recipe) {
                let detailList = await recipe.destroy()
                res.status(200).json({
                    success: true,
                    message: 'Deleted successfully',
                    data: ""
                })
                return
            }
            res.status(432).json({
                success: true, 
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


    getRecipe = async (req, res) => {
        try {
            let {recipeListId} = req.params
            let recipe = await db.DetailList.findAll({
                where: {
                    recipeListId: recipeListId
                },
                include: [
                    {
                        model: db.Recipe,
                        include: {model: db.User},
                        required: true
                    }
                ],
            })

            if(recipe && recipe.length > 0){
                recipe.isLike = true
                res.status(200).json({
                    success: true,
                    message: 'Successfully get data',
                    data: recipe
                })
                return
            }
            res.status(432).json({
                success: true, 
                message: 'Recipe list not found',
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

module.exports = new recipeListController