const usersRepository = require("../repositories/users");

module.exports = {
	create(requestBody) {
		return usersRepository.create(requestBody);
	},

	update(id, requestBody) {
		return usersRepository.update(id, requestBody);
	},

	delete(id) {
		return usersRepository.delete(id);
	},

	async list() {
		try {
			const users = await usersRepository.findAll();
			const usersCount = await usersRepository.getTotalUsers();

			return {
				data: users,
				count: usersCount,
			};
		} catch (err) {
			throw err;
		}
	},

	get(id) {
		return usersRepository.find(id);
	},

	getOne(key) {
		return usersRepository.findOne(key);
	},
};