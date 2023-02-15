const express = require('express')
const userRouter = require('./user.routes')
const recipeRouter = require('./recipe.routes')
const recipeListRouter = require('./recipeList.routes')
const ingredientRouter = require('./ingredient.routes')
const commentRouter = require('./comment.routes')
const favoriteRouter = require('./favorite.routes')
const followRouter = require('./follow.routes')
const authRouter = require('./auth.routes')
const verifyToken = require('../middlewares/auth')




// http://localhost:8080/api/v1/


function routes(app){
    // app.use('/api/v1', )
    app.use('/api/v1/user',verifyToken, userRouter)
    app.use('/api/v1/recipe',verifyToken, recipeRouter)
    app.use('/api/v1/recipeList',verifyToken, recipeListRouter)
    app.use('/api/v1/ingredient', verifyToken, ingredientRouter)
    app.use('/api/v1/comment',verifyToken, commentRouter)
    app.use('/api/v1/favorite',verifyToken, favoriteRouter)
    app.use('/api/v1/follow',verifyToken, followRouter)
    app.use('/api/v1/auth',verifyToken, authRouter)
}

module.exports = routes