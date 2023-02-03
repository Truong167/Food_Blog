const express = require('express')
const userRouter = require('./user.routes')
const recipeRouter = require('./recipe.routes')
const recipeListRouter = require('./recipeList.routes')
const ingredientRouter = require('./ingredient.routes')
const commentRouter = require('./comment.routes')
const favoriteRouter = require('./favorite.routes')
const followRouter = require('./follow.routes')



// http://localhost:8080/api/v1/


function routes(app){
    // app.use('/api/v1', )
    app.use('/api/v1/user', userRouter)
    app.use('/api/v1/recipe', recipeRouter)
    app.use('/api/v1/recipeList', recipeListRouter)
    app.use('/api/v1/ingredient', ingredientRouter)
    app.use('/api/v1/comment', commentRouter)
    app.use('/api/v1/favorite', favoriteRouter)
    app.use('/api/v1/follow', followRouter)
}

module.exports = routes