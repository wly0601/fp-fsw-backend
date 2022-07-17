const {
	Users
} = require("../models");

module.exports = {
	create(inputData) {
		return Users.create(inputData);
	},

	update(id, updatedData) {
		return Users.update(updatedData, {
			where: {
				id,
			},
		});
	},

	delete(id) {
		return Users.destroy({
			where: {
				id
			}
		});
	},

	find(id) {
		return Users.findByPk(id);
	},

	findAll() {
		return Users.findAll();
	},

	findOne(key) {
		return Users.findOne(key);
	},

	getTotalUsers() {
		return Users.count();
	},
};