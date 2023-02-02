'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Favorite extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Favorite.belongsTo(models.Recipe, {foreignKey: 'recipeId'})
      Favorite.belongsTo(models.User, {foreignKey: 'userId'})

    }
  }
  Favorite.init({
    userId: {
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
    modelName: 'Favorite'
  });
  return Favorite;
};