'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // User.hasOne(models.Account)
      User.hasMany(models.Recipe, {foreignKey: 'userId'})
    }
  }
  User.init({
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    fullName: DataTypes.STRING,
    dateOfBirth: DataTypes.DATE,
    address: DataTypes.STRING,
    email: DataTypes.STRING,
    introduce: DataTypes.STRING
  }, {
    sequelize,
    freezeTableName: true,
    modelName: 'User',
  });
  return User;
};