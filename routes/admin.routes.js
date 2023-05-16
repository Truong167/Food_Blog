const express = require('express')

const router = express.Router()
const adminController = require('../controller/adminController')
const verifyToken = require('../middlewares/auth')


// http://localhost:8080/api/v1/admin


router.post('/login', adminController.handleLoginAdmin)
router.get('/getStatisticalOfIngredient', adminController.statisticalOfIngredient)



module.exports = router