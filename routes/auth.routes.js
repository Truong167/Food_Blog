const express = require('express')

const router = express.Router()
const authController = require('../controller/authController')

// http://localhost:8080/api/v1/auth


router.post('/register', authController.handleRegister)
router.post('/login', authController.handleLogin)


module.exports = router