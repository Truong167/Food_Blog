'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Recipe extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Recipe.belongsTo(models.User, {foreignKey: 'userId'});
      Recipe.hasMany(models.Ingredient, {foreignKey: 'recipeId'});
      Recipe.hasMany(models.Step, {foreignKey: 'recipeId'});
    }
  }
  Recipe.init({
    recipeId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    recipeName: DataTypes.STRING,
    date: DataTypes.DATE,
    status: {
        type: DataTypes.STRING,
        validate: {
            isIn: [['RT', 'CK']],
        }
    },
    amount: {
        type: DataTypes.INTEGER,
        validate: {
            min: 1,
        }
    },
    preparationTime: {
        type: DataTypes.INTEGER,
        validate: {
            min: 1,
        }
    },
    cookingTime: {
        type: DataTypes.INTEGER,
        validate: {
            min: 1,
        }
    },
    numberOfLikes: {
        type: DataTypes.INTEGER,
        validate: {
            min: 0
        }
    },
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    freezeTableName: true,
    modelName: 'Recipe',
  });
  return Recipe;
};