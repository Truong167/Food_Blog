'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class IngredientSeason extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  IngredientSeason.init({
    tag: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    seasonId: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
  }, {
    sequelize,
    freezeTableName: true,
    modelName: 'IngredientSeason',
  });
  return IngredientSeason;
};