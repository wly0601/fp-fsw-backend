const {
  Categories
} = require("../models");

module.exports = {
  find(id) {
    return Categories.findByPk(id);
  },

  findAll() {
    return Categories.findAll();
  },

  findOne(key) {
    return Categories.findOne(key);
  },

  getTotalCategories() {
    return Categories.count();
  },
};