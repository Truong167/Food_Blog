const db = require('../models/index')
let multerConfig = require("../middlewares/utils/multerConfig");

const {
    checkEmailExists,
} = require('../middlewares/validator')
const {sequelize} = require('../models/index');
const { Op } = require('sequelize');
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
            let userId = req.userId
            let checkUser = await db.User.findByPk(id)
            if(checkUser) {
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

                let user = await sequelize.query(`SELECT "User"."userId", "User"."fullName", "User"."dateOfBirth", "User"."address", 
                                                "User"."email", "User"."introduce", "User"."avatar", (SELECT CASE WHEN EXISTS 
                                                    (Select * from "Follow" where "userIdFollowed" = ${id} and "userIdFollow" = ${userId}) 
                                                    then True else False end isFollow) 
                                                    as "isFollow"
                                                FROM "User"
                                                WHERE "User"."userId" = ${id};`, {nest: true, plain: false, raw: true})
                let recipe = await sequelize.query(`SELECT "Recipes"."recipeId" AS 
                                                    "Recipes.recipeId", "Recipes"."recipeName" AS "Recipes.recipeName", "Recipes"."date" 
                                                    AS "Recipes.date", "Recipes"."numberOfLikes" AS "Recipes.numberOfLikes", "Recipes"."image" 
                                                    AS "Recipes.image", "Recipes"."status" AS "Recipes.status", (SELECT CASE WHEN EXISTS 
                                                    (SELECT * FROM "Favorite" WHERE "recipeId" = "Recipes"."recipeId" and "userId" = ${userId}) 
                                                    THEN True ELSE False end isFavorite) 
                                                    as "Recipes.isFavorite"
                                                    FROM "Recipe" AS "Recipes" 
                                                    WHERE "Recipes"."userId" = ${id};`, {nest: true, plain: false, raw: true})
                user = user.map(item => {
                    item.Recipes = recipe.map(recipeItem => {
                        return recipeItem.Recipes
                    })
                    return item
                })
                user = user[0]
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

    getUserFollowing = async (req, res) => {
        const { userId } = req.params
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
                    attributes: ["userId", "fullName", "avatar"]
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
                    attributes: ["userId", "fullName", "avatar"]
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