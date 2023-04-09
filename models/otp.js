'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Otp extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

    }
  }
  Otp.init({
    email: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    value: DataTypes.STRING,
    duration: DataTypes.DATE,
  }, {
    sequelize,
    freezeTableName: true,
    modelName: 'Otp',
  });
  
  return Otp;
};