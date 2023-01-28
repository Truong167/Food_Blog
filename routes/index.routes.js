const express = require('express')
const userRouter = require('./user.routes')
const recipeRouter = require('./recipe.routes')
const ingredientRouter = require('./ingredient.routes')
const ingredientTagRouter = require('./ingredientTag.routes')




// http://localhost:8080/api/v1/user


function routes(app){
    // app.use('/api/v1', )
    app.use('/api/v1/user', userRouter)
    app.use('/api/v1/recipe', recipeRouter)
    app.use('/api/v1/ingredient', ingredientRouter)
    app.use('/api/v1/ingredientTag', ingredientTagRouter)

}

module.exports = routes