const { Products } = require("../models");

module.exports = {
	create(inputData) {
		return Products.create(inputData);
	},

	update(id, updatedData) {
		return Products.update(updatedData, {
			where: {
				id,
			},
		});
	},

	delete(id) {
		return Products.destroy({
			where: {
				id
			}
		});
	},

	find(id) {
		return Products.findByPk(id);
	},

	findAll(request) {
		return Products.findAll(request);
	},

	findOne(key) {
		return Products.findOne(key);
	},

	getTotalProducts() {
		return Products.count();
	},
};
