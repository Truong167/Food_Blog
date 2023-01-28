const express = require('express')

const router = express.Router()
const ingredientTagController = require('../controller/ingredientTagController')

// http://localhost:8080/api/v1/ingredientTag


// router.delete('/deleteIngredient/:id', ingredientController.handleDeleteIngredient)
router.get('/search', ingredientTagController.handleSearchIngredient)




module.exports = router