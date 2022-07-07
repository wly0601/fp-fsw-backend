'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Status extends Model {
    static associate(models) {
      this.hasMany(models.Products, {
        foreignKey: 'statusId', 
        as: 'status',
      })
    }
  }
  Status.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Status',
  });
  return Status;
};