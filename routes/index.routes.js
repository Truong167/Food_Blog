const express = require('express')
const userRouter = require('./user.routes')


// http://localhost:8080/api/v1/user


function routes(app){
    // app.use('/api/v1', )
    app.use('/api/v1/user', userRouter)
}

module.exports = routes