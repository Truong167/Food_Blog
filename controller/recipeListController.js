
const db = require('../models/index')


class recipeListController {
    
    handleCreateRecipeList = async (req, res) => {
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
            let userId = req.userId
            await db.RecipeList.create({
                name: name,
                date: Date.now(),
                userId: userId
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
            if(recipe) {
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

    handleDeleteRecipe = async (req, res) => {
        try {
            let { recipeListId, recipeId } = req.params
            let recipe = await db.DetailList.findOne({where: {recipeListId: recipeListId, recipeId: recipeId}})
            if(recipe) {
                let detailList = await recipe.destroy()
                res.status(200).json({
                    success: true,
                    message: 'Deleted successfully',
                    data: detailList
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

}

module.exports = new recipeListController