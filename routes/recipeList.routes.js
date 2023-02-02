const express = require('express')

const router = express.Router()
const recipeListController = require('../controller/recipeListController')

// http://localhost:8080/api/v1/recipeList


// router.get('/search', recipeListController.handleSearchIngredient)


router.post('/createRecipeList', recipeListController.handleCreateRecipeList)
router.put('/updateRecipeList/:id', recipeListController.handleUpdateRecipeList)
router.get('/deleteRecipeList/:id', recipeListController.handleDeleteRecipeList)
router.post('/createRecipe/:id/:idRecipe', recipeListController.handleCreateRecipe)








module.exports = router