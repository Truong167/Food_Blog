'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ingredient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Ingredient.belongsTo(models.Recipe, {foreignKey: 'recipeId'})
    }
  }
  Ingredient.init({
    ingredientId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    description: DataTypes.STRING,
    recipeId: DataTypes.INTEGER
  }, {
    sequelize,
    freezeTableName: true,
    modelName: 'Ingredient',
  });
  return Ingredient;
};