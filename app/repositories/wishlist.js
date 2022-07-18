const { userProduct } = require("../models");

module.exports = {
	findOrCreate(requestBody) {
		return userProduct.findOrCreate(requestBody);
	},

	delete(id) {
		return userProduct.destroy({
			where: {
				id
			}
		});
	},

	async findAll(request) {
		return await userProduct.findAll(request);
	},

	async findOne(request) {
		return await userProduct.findOne(request);
	}
};