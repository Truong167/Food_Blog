const express = require('express')
const { sequelize } = require('./models')

const PORT = 4000
const app = express()

const connectDb = async () => {
    console.log('Checking connection')
    try {
        await sequelize.authenticate()
        console.log('Authenticating')
    } catch (error) {
        console.log(error)
    }
}

(async () => {
    await connectDb()

    console.log('Connected to database')

    app.listen(PORT, () => console.log(`Serving on port ${PORT}`))

})()

// app.get('/', (req, res) => {
//     res.send("Hello, world!")
// })

