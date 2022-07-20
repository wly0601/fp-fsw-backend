const { Cities } = require("../models");

module.exports = {
	find(id) {
		return Cities.findByPk(id);
	},

	findAll() {
		return Cities.findAll();
	},

	findOne(key) {
		return Cities.findOne(key);
	},

	getTotalCities() {
		return Cities.count();
	},
};