'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cities extends Model {
    static associate(models) {
      this.hasMany(models.Users, {
        foreignKey: 'city_id', 
      })
    }
  }
  Cities.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Cities',
  });
  return Cities;
};