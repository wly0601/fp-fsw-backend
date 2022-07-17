'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    static associate(models) {
      this.belongsTo(models.Cities, {
        foreignKey: 'cityId',
        as: 'city',
      });
      this.hasMany(models.Products, {
        foreignKey: 'sellerId',
        as: 'seller',
      });
      this.hasMany(models.TransactionHistory, {
        foreignKey: 'buyerId',
        as: 'buyer',
      });
    }
  }
  Users.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    encryptedPassword: DataTypes.STRING,
    photo: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    address: DataTypes.STRING,
    cityId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Users',
  });
  return Users;
};