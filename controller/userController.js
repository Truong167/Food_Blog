
const db = require('../models/index')
const sequelize = require('sequelize');

class userController {
    getAllUser = async (req, res) => {
        try {
            // Select * from User
            let data = await db.User.findAll()
            res.json({success: true, data: data})
        } catch (error) {
            res.status(500).json({success: false, message: error.message})
        }
    }

    getUserById = async (req, res) => {
        try {
            let { id } = req.params
            let user = await db.User.findByPk(id, {
                include: [
                    {
                        model: db.Recipe,
                        attributes: ['recipeName', 'numberOfLikes'],
                        limit: 3,
                        order: [['numberOfLikes', 'DESC']]
                    },
                ],
            })

            if(user) {
                let count = await db.Recipe.count({where: {userId: id}})
                let count1 = await db.Follow.count({where: {userIdFollowed: id}})
    
                res.json({success: true, data: user, count, count1})
                return
            }
            res.status(500).json({success: false, message: 'User not found'})

        } catch (error) {
            res.status(500).json({success: false, message: error.message})
        }
    }
}

module.exports = new userController