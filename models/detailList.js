'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DetailList extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      DetailList.belongsTo(models.Recipe, {foreignKey: 'recipeId'})
      DetailList.belongsTo(models.RecipeList, {foreignKey: 'recipeListId'})
    }
  }
  DetailList.init({
    recipeListId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    recipeId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    date: DataTypes.DATE,
  }, {
    sequelize,
    freezeTableName: true,
    modelName: 'DetailList',
  });
  return DetailList;
};