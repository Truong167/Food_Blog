const db = require('../models/index')
let multerConfig = require("../middlewares/utils/multerConfig");

const {
    checkEmailExists,
} = require('../middlewares/validator')
const {sequelize} = require('../models/index')
require('dotenv').config()



class userController {

    getAllUser = async (req, res) => {
        try {
            let data = await db.User.findAll()
            res.json({
                success: true, 
                message: "Successfully get data",
                data: data,
            })
        } catch (error) {
            res.status(500).json({
                success: false, 
                message: error.message,
                data: ""
            })
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
                    {
                        model: db.Follow,
                        attributes: []
                    },
                ],
                attributes: {
                    include: [
                        [sequelize.fn('COUNT', sequelize.col('Follows.userIdFollowed')), 'follow']
                    ]
                },
                group: ['User.userId']
            })
            if(user) {
                let countRecipe = await db.Recipe.count({where: {userId: id}})
                let newData = [{user, countRecipe: countRecipe}]
                res.status(200).json({
                    success: true, 
                    message: "Successfully get data", 
                    data: newData
                })
                return
            }
            res.status(426).json({
                success: false, 
                message: 'User not found',
                data: ""
            })

        } catch (error) {
            res.status(500).json({
                success: false, 
                message: error.message,
                data: ""
            })
        }
    }

    handleUpdateUser = async (req, res) => {
        const userId  = req.userId
        let uploadFile = multerConfig('public/image/user', userId)
        uploadFile( req, res, async (error) => {
            const { fullName, dateOfBirth, address, email, introduce, } = req.body
            const emailCheck = await checkEmailExists(email, userId)
            console.log(emailCheck)
            if(error) {
                return res.status(440).json({
                    success: false, 
                    message: `Error when trying to upload: ${error}`,
                    data: ""
                });
            }
            if(!fullName || !dateOfBirth || !address || !email) {
                res.status(418).json({
                    success: false,
                    message: "Please provide all required fields",
                    data: ""
                })
                return
            }
            if(emailCheck) {
                res.status(422).json({
                    success: false,
                    message: "Email already exists ",
                    data: ""
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
                    user.avatar = req.file ? `/user/${req.file.filename}` : null
                    user.introduce = introduce ? introduce : ''
                    
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
                    message: "User not found",
                    data: ""
                })
            } catch (error) {
                res.status(500).json({
                    success: false,
                    message: error.message,
                    data: ""
                })
            }
        })
    }

}

module.exports = new userController