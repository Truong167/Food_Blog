const bcrypt = require('bcryptjs')
const db = require('../models/index')
const {
    checkEmailExists,
    validateEmail,
    validatePassword,
    checkAccountExists
} = require('../middlewares/validator')
const moment = require('moment')
const {sequelize} = require('../models/index')
const jwt = require('jsonwebtoken')
const mailer = require('../middlewares/utils/mailer')
const OtpGenerator = require('otp-generator')
const formatDate = require('../middlewares/utils/formatDate')
require('dotenv').config()

class adminController {
    
    handleLoginAdmin = async (req, res) => {
        const { accountName, password } = req.body
        if(!accountName || !password) {
            res.status(418).json({
                success: false,
                message: 'Please all provide required fields',
                data: ""
            })
            return
        }
        try {
            let account = await db.Admin.findByPk(accountName)
            if(!account)
            return res.status(424).json({
                success: false,
                message: 'Account does not exist',
                data: ""
            })
            const pass = await bcrypt.compare(password, account.password)
            if(!pass)
            return  res.status(425).json({
                success: false,
                message: 'Password do not match',
                data: ""
            })
            res.status(200).json({
                success: true,
                message: 'Successfully logged in',
                data: ''
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
                data: ""
            })
        }
    }

    statisticalOfIngredient = async (req, res) => {
        try {
            let ingredient = await db.DetailIngredient.findAll({
                include: {
                    model: db.Ingredient,
                    attributes: ["name", "image"]
                },
                attributes: [
                    "ingredientId",
                    [sequelize.fn('COUNT', sequelize.col('DetailIngredient.ingredientId')), 'recipeUsed']
                ],
                group: ['Ingredient.ingredientId', 'DetailIngredient.ingredientId']
            })

            if(ingredient && ingredient.length > 0){
                ingredient.map(item => {
                    item.dataValues.name = item.dataValues.Ingredient.dataValues.name
                    item.dataValues.image = item.dataValues.Ingredient.dataValues.image
                    delete item.dataValues['Ingredient']
                    return item
                })
    
                return res.status(200).json({
                    success: true, 
                    message: 'Successfully get data',
                    data: ingredient
                })
            }

            res.status(452).json({
                success: true, 
                message: 'Do not have statistical',
                data: ingredient
            })
            
        } catch (error) {
            res.status(500).json({
                success: false, 
                message: error.message,
                data: ""
            })
        }
    }
}

module.exports = new adminController