const express = require('express')

const router = express.Router()
const adminController = require('../controller/adminController')
const verifyToken = require('../middlewares/auth')


// http://localhost:8080/api/v1/admin

router.get('/getStatisticalOfIngredient', adminController.statisticalOfIngredient)


router.post('/login', adminController.handleLoginAdmin)
router.post('/createIngredient', adminController.createIngredient)

router.put('/updateIngredient/:ingredientId', adminController.updateIngredient)


router.delete('/deleteIngredient/:ingredientId', adminController.deleteIngredient)



module.exports = router