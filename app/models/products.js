'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Products extends Model {
    static associate(models) {
      this.hasMany(models.TransactionHistory, {
        foreignKey: "productId",
        as: "product",
      });
      this.belongsTo(models.Categories, {
        foreignKey: "categoryId",
        as: "category",
      });
      this.belongsTo(models.Users, {
        foreignKey: "sellerId",
        as: "seller",
      });
      this.belongsTo(models.Status, {
        foreignKey: "statusId",
        as: "status",
      });
    }
  }
  Products.init({
    name: DataTypes.STRING,
    sellerId: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    categoryId: DataTypes.INTEGER,
    description: DataTypes.STRING(1000),
    images: DataTypes.ARRAY(DataTypes.STRING),
    statusId: DataTypes.INTEGER,
    numberOfWishlist: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Products',
  });
  return Products;
};