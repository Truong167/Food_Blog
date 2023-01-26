
const db = require('../models/index')

class recipeController {
    getAllUser = async (req, res) => {
        try {
            // Select * from User
            let data = await db.User.findAll()
            res.send(data)
        } catch (error) {
            console.log(error.message)
        }
    }

    getUserById = async (req, res) => {
        
    }
}

module.exports = new recipeController