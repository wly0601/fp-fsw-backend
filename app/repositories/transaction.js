const { TransactionHistory } = require("../models");

module.exports = {
	create(inputData) {
		return TransactionHistory.create(inputData);
	},

	update(id, updatedData) {
		return TransactionHistory.update(updatedData, {
			where: {
				id,
			},
		});
	},

	find(id) {
		return TransactionHistory.findByPk(id);
	},

	findAll(request) {
		return TransactionHistory.findAll(request);
	},

	findOne(key) {
		return TransactionHistory.findOne(key);
	},

	getTotalTransaction() {
		return TransactionHistory.count();
	},
};