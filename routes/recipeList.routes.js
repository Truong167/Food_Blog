const express = require('express')

const router = express.Router()
const recipeListController = require('../controller/recipeListController')

// http://localhost:8080/api/v1/recipeList


// router.get('/search', recipeListController.handleSearchIngredient)

router.get('/deleteRecipeList/:id', recipeListController.handleDeleteRecipeList)


router.post('/createRecipeList', recipeListController.handleCreateRecipeList)
router.post('/createRecipe/:id/:idRecipe', recipeListController.handleCreateRecipe)
router.put('/updateRecipeList/:id', recipeListController.handleUpdateRecipeList)
router.delete('/deleteRecipe/:id/:idRecipe', recipeListController.handleDeleteRecipe)


module.exports = router