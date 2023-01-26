const express = require('express')

const router = express.Router()
const recipeController = require('../controller/recipeController')

// http://localhost:8080/api/v1/user

router.get('/getAllUser', recipeController.getAllUser)

module.exports = router