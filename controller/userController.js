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


    handleRegister = async (req, res) => {
        // let transaction = await sequelize.transaction()


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

                res.status(201).json({
                    success: true,
                    message: 'Successfully created user',
                    data: result,
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
            if(account) {
                const pass = await bcrypt.compare(password, account.password)
                if(!pass) {
                    res.status(400).json({
                        success: false,
                        message: 'Password do not match',
    
                    })
                    return
                }
                res.status(200).json({
                    success: true,
                    message: 'Successfully logged in',
                    data: account.accountName
                })
                return
            }
            res.status(400).json({
                success: false,
                message: 'Account does not exist',
            })
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            })
        }
    }

    handleUpdateUser = async (req, res) => {
        const { fullName, dateOfBirth, address, email, introduce, avatar } = req.body
        const { userId } = req.params
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