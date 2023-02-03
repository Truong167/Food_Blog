const express = require('express')

const router = express.Router()
const favoriteController = require('../controller/favoriteController')

// http://localhost:8080/api/v1/favorite/

router.get('/', favoriteController.index)
router.post('/create/:recipeId/:userId', favoriteController.handleCreateFavorite)
router.delete('/delete/:recipeId/:userId', favoriteController.handleDeleteFavorite)



module.exports = router