
const db = require('../models/index')
const sequelize = require('sequelize')

const { Op } = sequelize


class ingredientController {
    

    handleDeleteIngredient = async (req, res) => {
        try {
            // http://localhost:8080/api/v1/ingredient/deleteIngredient/3

            let { id } = req.params
            let ingredient = await db.Ingredient.findByPk(id)
            if(ingredient) {
                await ingredient.destroy()
                res.json({success: true, message: 'Successfully deleted'})
                return
            }
            res.json({success: false, message: 'Ingredient not found'})
        } catch (error) {
            res.status(500).json({success: false, message: error.message})
        }
    }
}

module.exports = new ingredientController