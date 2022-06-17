'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction_History extends Model {
    static associate(models) {
      this.belongsTo(models.Users, {
        foreignKey: "buyer_id",
      });
      this.belongsTo(models.Products, {
        foreignKey: "product_id",
      });
    }
  }
  Transaction_History.init({
    product_id: DataTypes.INTEGER,
    buyer_id: DataTypes.INTEGER,
    seller_id: DataTypes.INTEGER,
    integer_price: DataTypes.INTEGER,
    bargain_price: DataTypes.INTEGER,
    date_of_bargain: DataTypes.DATE,
    acc_by_seller: DataTypes.BOOLEAN,
    date_of_acc_or_not: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Transaction_History',
  });
  return Transaction_History;
};