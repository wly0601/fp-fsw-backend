'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class userProduct extends Model {
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
  userProduct.init({
    buyerId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'userProduct',
  });
  return userProduct;
};