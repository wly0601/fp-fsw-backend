'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Products extends Model {
    static associate(models) {
      this.hasMany(models.TransactionHistory, {
        foreignKey: "productId",
      });
      this.belongsTo(models.Categories, {
        foreignKey: "categoryId",
      });
      this.belongsTo(models.Users, {
        foreignKey: "sellerId",
      });
      this.belongsTo(models.Status, {
        foreignKey: "statusId",
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