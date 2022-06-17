'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Products extends Model {
    static associate(models) {
      this.hasMany(models.Transaction_History, {
        foreignKey: "product_id",
      });
      this.belongsTo(models.Categories, {
        foreignKey: "category_id",
      });
      this.belongsTo(models.Users, {
        foreignKey: "seller_id",
      });
    }
  }
  Products.init({
    name: DataTypes.STRING,
    seller_id: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    category_id: DataTypes.INTEGER,
    description: DataTypes.STRING(1000),
    images: DataTypes.ARRAY(DataTypes.STRING),
    status: DataTypes.STRING,
    number_of_whislist: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Products',
  });
  return Products;
};