'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Follow extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Follow.init({
    userIdFollow: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    userIdFollowed: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    dateUpdate: DataTypes.DATE,
    isSeen: DataTypes.BOOLEAN,
  }, {
    sequelize,
    freezeTableName: true,
    modelName: 'Follow'
  });
  return Follow;
};