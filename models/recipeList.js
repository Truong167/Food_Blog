'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RecipeList extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      RecipeList.hasMany(models.DetailList, {foreignKey: 'recipeListId'})
      RecipeList.belongsTo(models.User, {foreignKey: 'userId'})
    }
  }
  RecipeList.init({
    recipeListId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: DataTypes.STRING,
    date: DataTypes.DATE,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    freezeTableName: true,
    modelName: 'RecipeList',
  });
  return RecipeList;
};