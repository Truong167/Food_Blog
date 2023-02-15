const bcrypt = require('bcryptjs')
const db = require('../models/index')
const {
    checkEmailExists,
    validateEmail,
    validatePassword,
    checkAccountExists
} = require('../middlewares/validator')
const {sequelize} = require('../models/index')

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
                        order: [['numberOfLikes', 'DESC']],
                    },
                ],
            })

            if(user) {
                let count = await db.Recipe.count({where: {userId: id}})
                let count1 = await db.Follow.count({where: {userIdFollowed: id}})
    
                res.status(200).json({success: true, data: user, count, count1})
                return
            }
            res.status(400).json({
                success: false, 
                message: 'User not found',
            })

        } catch (error) {
            res.status(500).json({
                success: false, 
                message: error.message,
            })
        }
    }

    handleUpdateUser = async (req, res) => {
        const { fullName, dateOfBirth, address, email, introduce, avatar } = req.body
        const userId  = req.userId
        const emailCheck = await checkEmailExists(email, userId)
        console.log(emailCheck)
        if(!fullName || !dateOfBirth || !address || !email) {
            res.status(400).json({
                success: false,
                message: "Please provide all required fields"
            })
            return
        }
        if(emailCheck) {
            res.status(400).json({
                success: false,
                message: "Email already exists "
            })
            return
        }
        try {
            let user = await db.User.findByPk(userId)
            if(user) {
                user.fullName = fullName
                user.dateOfBirth = dateOfBirth
                user.address = address
                user.email = email
                let updated = await user.save()

                res.status(200).json({
                    success: true,
                    message: "Successfully updated",
                    data: updated
                })
                return
            }

            res.status(400).json({
                success: false,
                message: "User not found"
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }
}

module.exports = new userController