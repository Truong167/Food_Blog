
const db = require('../models/index')
const sequelize = require('sequelize')

const { Op } = sequelize


class ingredientTagController {
    
    handleSearchIngredient = async (req, res) => {

        // http://localhost:8080/api/v1/ingredientTag/search?q=mì
        // 
        try {
            let { q } = req.query
            let ingredient = await db.IngredientTag.findAll({
                where: {
                    name: {
                        [Op.iLike]: `%${q}%`
                    }
                }
            })
            
            if(ingredient && ingredient.length > 0) {
                res.json({success: true, message: 'Successfully search', data: ingredient})
                return
            }
            res.json({success: false, message: 'Ingredient not found', })
            
        } catch (error) {
            res.status(500).json({success: false, message: error.message})
        }
    }
}

module.exports = new ingredientTagController