const express = require('express')
const bodyParser = require('body-parser')
const routes = require('./routes/index.routes')
const connectDb = require('./config/connectDb')
require('dotenv').config()


const PORT = process.env.PORT || 7070
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

routes(app)


connectDb()


app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))



