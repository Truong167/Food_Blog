const express = require('express')

const router = express.Router()
const ingredientTagController = require('../controller/ingredientTagController')

// http://localhost:8080/api/v1/ingredientTag


// router.delete('/deleteIngredient/:id', ingredientController.handleDeleteIngredient)
router.get('/search', ingredientTagController.handleSearchIngredient)
router.get('/search/:slug', ingredientTagController.handleSearchRecipe)





module.exports = router