const express = require('express')

const router = express.Router()
const recipeController = require('../controller/recipeController')

// http://localhost:8080/api/v1/user

router.get('/getAllRecipe', recipeController.getAllRecipe)
router.get('/getRecipe/:id', recipeController.getDetailRecipe)


router.post('/createRecipe', recipeController.handleCreateRecipe)
router.put('/updateRecipe/:id', recipeController.handleUpdateRecpipe)
router.delete('/deleteRecipe', recipeController.handleDeleteRecipe)



module.exports = router