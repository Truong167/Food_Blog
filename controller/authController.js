const bcrypt = require('bcryptjs')
const db = require('../models/index')
const {
    checkEmailExists,
    validateEmail,
    validatePassword,
    checkAccountExists
} = require('../middlewares/validator')
const {sequelize} = require('../models/index')
const jwt = require('jsonwebtoken')
require('dotenv').config()

class authController {
    
    handleRegister = async (req, res) => {

        const { fullName, dateOfBirth, address, email, introduce, avatar, accountName, password, password2 } = req.body

        const prm0 = new Promise((resolve, rejects) => {
            let x = checkEmailExists(email)
            resolve(x)
        })
        const prm1 = new Promise((resolve, rejects) => {
            let x = checkAccountExists(accountName)
            resolve(x)
        })
        let x = await Promise.all([prm0, prm1])
        let [emailCheck, accountCheck] = [...x]
        if(!fullName || !dateOfBirth || !address || !email || !accountName || !password || !password2){
            res.status(400).json({
                success: false,
                message: 'Please provide all required fields',
            })
        } else if( password != password2){
            res.status(400).json({
                success: false,
                message: 'The entered passwords do not match',
            })
        } else if(!validatePassword(password)){
            res.status(400).json({
                success: false,
                message:
                  'Your password must be at least 6 characters long and contain a lowercase letter, an uppercase letter, a numeric digit and a special character.',
              })
        } else if(!validateEmail(email)){
            res.status(400).json({
                success: false,
                message: 'Email address has invalid format',
            })
        } else if(emailCheck){
            res.status(400).json({
                success: false,
                message: 'Email already exists',
            })
        } else if(accountCheck){
            res.status(400).json({
                success: false,
                message: 'Account already exists',
            })
        } else {
            try {
                const result = await sequelize.transaction(async t => {
                    let user = await db.User.create({
                        fullName: fullName,
                        dateOfBirth: dateOfBirth,
                        address: address,
                        email: email,
                        introduce: introduce ? introduce : null,
                        avatar: avatar ? avatar : null
                    }, { transaction: t })
                    let account = await db.Account.create({
                        accountName: accountName,
                        password: bcrypt.hashSync(password, 10),
                        userId: user.userId
                    }, { transaction: t })
                    return {user, account}
                })

                // const accessToken = jwt.sign({userId: result.user.userId}, process.env.ACCESS_TOKEN_SECRET)

                res.status(201).json({
                    success: true,
                    message: 'Successfully register',
                });
            } catch (error) {
                res.status(500).json({
                    success: false,
                    message: error.message,
                })
            }
        }
    }

    handleLogin = async (req, res) => {
        const { accountName, password } = req.body
        if(!accountName || !password) {
            res.status(400).json({
                success: false,
                message: 'Please all provide required fields',
            })
            return
        }
        try {
            let account = await db.Account.findByPk(accountName)
            if(!account)
            return res.status(400).json({
                success: false,
                message: 'Account does not exist',
            })
            const pass = await bcrypt.compare(password, account.password)
            if(!pass)
            return  res.status(400).json({
                success: false,
                message: 'Password do not match',
            })

            const accessToken = jwt.sign({userId: account.userId}, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '2h'
            })
            res.status(200).json({
                success: true,
                message: 'Successfully logged in',
                data: account.accountName,
                accessToken
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            })
        }
    }
}

module.exports = new authController