
const db = require('../models/index')
const sequelize = require('sequelize')

const { Op } = sequelize


class recipeListController {
    
    handleCreateRecipeList = async (req, res) => {
        try {
            let { name, userId } = req.body
            await db.RecipeList.create({
                name: name,
                date: Date.now(),
                userId: userId
            })
            
            res.json({success: true, message: 'Successfully added'})
        } catch (error) {
            res.status(500).json({success: false, message: error.message})
        }
    }

    handleUpdateRecipeList = async (req, res) => {
        try {
            let { name } = req.body
            let { id } = req.params
            let recipeList = await db.RecipeList.findByPk(id)

            if(recipeList) {
                recipeList.name = name

                await recipeList.save()

                res.json({success: true, message: 'Successfully updated recipe list'})
                return
            }

            res.json({success: false, message: 'Recipe list not found'})

        } catch (error) {
            res.status(500).json({success: false, message: error.message})
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

                res.json({success: true, message: 'Successfully deleted recipe list'})
                return
            }

            res.json({success: false, message: 'Recipe list not found'})

        } catch (error) {
            res.status(500).json({success: false, message: error.message})
        }

    }

    handleCreateRecipe = async (req, res) => {
        try {
            let { id, idRecipe } = req.params
            let recipe = await db.Recipe.findByPk(idRecipe)
            if(recipe) {
                await db.DetailList.create({
                    recipeListId: id,
                    recipeId: idRecipe,
                    date: Date.now()
                })
                res.json({success: true, message: 'Recipe created successfully'})
                return
            }
            res.json({success: true, message: 'Recipe not found'})

        } catch (error) {
            res.status(500).json({success: false, message: error.message})
        }
    }

}

module.exports = new recipeListController