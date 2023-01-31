const express = require('express')

const router = express.Router()
const recipeController = require('../controller/recipeController')

// http://localhost:8080/api/v1/recipe

router.get('/getAllRecipe', recipeController.getRecipe)
router.get('/getRecipe/:id', recipeController.getDetailRecipe)
router.get('/search', recipeController.handleSearchRecipe)
router.get('/getRecipeByIngredient/:slug', recipeController.getRecipeByIngredient)



router.post('/createRecipe', recipeController.handleCreateRecipe)
router.put('/updateRecipe/:id', recipeController.handleUpdateRecpipe)
router.put('/updatePrivacyRecipe/:id/', recipeController.updatePrivacyOfRecipe)
router.delete('/deleteRecipe', recipeController.handleDeleteRecipe)



module.exports = router