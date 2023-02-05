const express = require('express')

const router = express.Router()
const userController = require('../controller/userController')

// http://localhost:8080/api/v1/user

router.get('/getAllUser', userController.getAllUser)
router.get('/getUser/:id', userController.getUserById)


router.post('/register', userController.handleRegister)
router.post('/login', userController.handleLogin)
router.put('/update/:userId', userController.handleUpdateUser)



module.exports = router