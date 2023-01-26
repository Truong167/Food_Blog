'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Step extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Step.init({
    stepId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    description: DataTypes.STRING,
    image: DataTypes.STRING,
    recipeId: DataTypes.INTEGER
  }, {
    sequelize,
    freezeTableName: true,
    modelName: 'Step',
  });
  return Step;
};