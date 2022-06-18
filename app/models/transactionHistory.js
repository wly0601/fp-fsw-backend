'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TransactionHistory extends Model {
    static associate(models) {
      this.belongsTo(models.Users, {
        foreignKey: "buyerId",
      });
      this.belongsTo(models.Products, {
        foreignKey: "productId",
      });
    }
  }
  TransactionHistory.init({
    productId: DataTypes.INTEGER,
    buyerId: DataTypes.INTEGER,
    sellerId: DataTypes.INTEGER,
    initialPrice: DataTypes.INTEGER,
    bargainPrice: DataTypes.INTEGER,
    dateOfBargain: DataTypes.DATE,
    accBySeller: DataTypes.BOOLEAN,
    dateOfAccOrNot: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'TransactionHistory',
  });
  return TransactionHistory;
};