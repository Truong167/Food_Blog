'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class IngredientTag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  IngredientTag.init({
    tag: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    image: DataTypes.STRING,
    seasonId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'IngredientTag',
  });
  return IngredientTag;
};