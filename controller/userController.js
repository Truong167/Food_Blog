const db = require('../models/index')
let multerConfig = require("../middlewares/utils/multerConfig");

const {
    checkEmailExists,
} = require('../middlewares/validator')
const {sequelize} = require('../models/index');
const { Op } = require('sequelize');
require('dotenv').config()
const fs = require('fs')



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
            let userId = req.userId
            let user = await db.User.findByPk(id, {
                include: [
                    {
                        model: db.Recipe,
                        attributes: [
                            "recipeId", "recipeName", "date", "numberOfLikes", "image", "status",
                            [sequelize.literal(`(SELECT CASE WHEN EXISTS 
                                (SELECT * FROM "Favorite" WHERE "recipeId" = "Recipes"."recipeId" and "userId" = ${userId}) 
                                THEN True ELSE False end isFavorite) `), "isFavorite"]
                        ],
                        order: [['date', 'DESC']],
                    },
                ],
                attributes: {
                    exclude: ["dateUpdatedRecipe", "createdAt", "updatedAt"], 
                    include: [[sequelize.literal(` (SELECT CASE WHEN EXISTS 
                        (Select * from "Follow" where "userIdFollowed" = "User"."userId" and "userIdFollow" = ${userId}) 
                        then True else False end isFollow) `), "isFollow"]]
                },
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
        const userId  = req.userId
        let uploadFile = multerConfig().fields([
            {
                name: 'user',
                maxCount: 1
            },
        ])
        uploadFile(req, res, async (error) => {
            const { fullName, dateOfBirth, address, email, introduce } = req.body
            if(error) {
                return res.status(440).json({
                    success: false, 
                    message: `Error when trying to upload: ${error}`,
                    data: ""
                })
            }
            if(!fullName || !dateOfBirth || !address || !email) {
                res.status(418).json({
                    success: false,
                    message: "Please provide all required fields",
                    data: ""
                })
                return
            }
            const emailCheck = await checkEmailExists(email, userId)
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
                let oldImage = user.avatar
                if(user) {
                    user.fullName = fullName
                    user.dateOfBirth = dateOfBirth
                    user.address = address
                    user.email = email
                    user.avatar = req.files.user ? `/user/${req.files.user[0].filename}` : oldImage
                    user.introduce = introduce ? introduce : ''
                    
                    if(req.files.user && oldImage !== null){
                        fs.unlink(`public/image${oldImage}`, error => {
                            if(error) throw error
                        })
                    }

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

    getUserFollowing = async (req, res) => {
        const { userId } = req.params
        const userId1 = req.userId
        try {
            let userFollow = await db.Follow.findAll({
                where: {
                    userIdFollow: userId
                },
                attributes: ["userIdFollowed"],
            })
            let count = await db.Follow.count({
                where: {
                    userIdFollow: userId
                }
            })
            if(userFollow && userFollow.length > 0){
                let newFollowerData = userFollow.map(item => item.dataValues.userIdFollowed)
                let users = await db.User.findAll({
                    where: {
                        userId: {
                            [Op.or]: [newFollowerData]
                        }
                    },
                    attributes: [
                        "userId", "fullName", "avatar",
                        [sequelize.literal(` (SELECT CASE WHEN EXISTS 
                            (Select * from "Follow" where "userIdFollowed" = "User"."userId" and "userIdFollow" = ${userId1}) 
                            then True else False end isFollow) `), "isFollow"]
                    ]
                })
                const newData = {users, count}
                res.status(200).json({
                    success: true,
                    message: "Successfully get data",
                    data: newData,
                })
                return
            }
            res.status(441).json({
                success: false,
                message: "User do not follow anyone",
                data: "",
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error,
                data: ""
            })
        }
    } 

    getUserFollow = async (req, res) => {
        const { userId } = req.params
        const userId1 = req.userId
        try {
            let userFollow = await db.Follow.findAll({
                where: {
                    userIdFollowed: userId
                },
                attributes: ["userIdFollow"],
            })
            let count = await db.Follow.count({
                where: {
                    userIdFollowed: userId
                }
            })
            if(userFollow && userFollow.length > 0){
                let newFollowerData = userFollow.map(item => item.dataValues.userIdFollow)
                let users = await db.User.findAll({
                    where: {
                        userId: {
                            [Op.or]: [newFollowerData]
                        }
                    },
                    attributes: [
                        "userId", "fullName", "avatar",
                        [sequelize.literal(` (SELECT CASE WHEN EXISTS 
                            (Select * from "Follow" where "userIdFollowed" = "User"."userId" and "userIdFollow" = ${userId1}) 
                            then True else False end isFollow) `), "isFollow"]
                    ]
                })
                const newData = {users, count}
                res.status(200).json({
                    success: true,
                    message: "Successfully get data",
                    data: newData
                })
                return
            }
            res.status(442).json({
                success: false,
                message: "No one is following this user",
                data: "",
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error,
                data: ""
            })
        }
    } 
}

module.exports = new userController