'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TransactionHistory extends Model {
    static associate(models) {
      this.belongsTo(models.Users, {
        foreignKey: "buyerId",
        as: "buyer",
      });
      this.belongsTo(models.Products, {
        foreignKey: "productId",
        as: "product",
      });
    }
  }
  TransactionHistory.init({
    productId: DataTypes.INTEGER,
    buyerId: DataTypes.INTEGER,
    bargainPrice: DataTypes.INTEGER,
    dateOfBargain: DataTypes.DATE,
    accBySeller: DataTypes.BOOLEAN,
    dateOfAccOrNot: DataTypes.DATE,
    isCanceled: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'TransactionHistory',
  });
  return TransactionHistory;
};