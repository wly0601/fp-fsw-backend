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

	async listByCondition(condition) {
		// eslint-disable-next-line no-useless-catch
		try {
			const users = await usersRepository.findAll(condition);
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