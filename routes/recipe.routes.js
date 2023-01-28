const express = require('express')

const router = express.Router()
const recipeController = require('../controller/recipeController')

// http://localhost:8080/api/v1/user

router.get('/getAllRecipe', recipeController.getAllRecipe)
router.post('/createRecipe', recipeController.handleCreateRecipe)
router.put('/updateRecipe', recipeController.handleUpdateRecpipe)
router.delete('/deleteRecipe', recipeController.handleDeleteRecipe)


module.exports = router