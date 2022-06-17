'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    static associate(models) {
      this.belongsTo(models.Cities, {
        foreignKey: 'city_id',
      });
      this.hasMany(models.Products, {
        foreignKey: 'seller_id',
      });
      this.hasMany(models.Transaction_History, {
        foreignKey: 'buyer_id',
      });
    }
  }
  Users.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    encryptedPassword: DataTypes.STRING,
    photo: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    address: DataTypes.STRING,
    city_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Users',
  });
  return Users;
};