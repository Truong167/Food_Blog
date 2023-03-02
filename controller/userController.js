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
                        attributes: ["recipeId", "recipeName", "date", "numberOfLikes", "image", "status"],
                        limit: 3,
                        order: [['date', 'DESC']],
                    },
                    {
                        model: db.Follow,
                        attributes: []
                    },
                ],
                attributes: {exclude: ["dateUpdatedRecipe", "createdAt", "updatedAt"]}
            })
            if(user) {
                const prm0 = new Promise((resolve, rejects) => {
                    let x = db.Recipe.count({where: {userId: id}})
                    resolve(x)
                })
                const prm1 = new Promise((resolve, rejects) => {
                    let x = db.Follow.count({where: {userIdFollow: id}})
                    resolve(x)
                })
                const prm2 = new Promise((resolve, rejects) => {
                    let x = db.Follow.count({where: {userIdFollowed: id}})
                    resolve(x)
                })
                const x = await Promise.all([prm0, prm1, prm2])
                let [countRecipe, countFollowing, countFollowed] = [...x]

                let newData = {user, countRecipe, countFollowing, countFollowed}
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
        const userId  = 3
        let uploadFile = multerConfig('public/image/user', userId)
        uploadFile( req, res, async (error) => {
            const { fullName, dateOfBirth, address, email, introduce, } = req.body
            const emailCheck = await checkEmailExists(email, userId)
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