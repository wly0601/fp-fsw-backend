const transactionRepository = require("../repositories/transaction");

module.exports = {
	create(requestBody) {
		return transactionRepository.create(requestBody);
	},

	update(id, requestBody) {
		return transactionRepository.update(id, requestBody);
	},

	async listByCondition(request) {
		return transactionRepository.findAll(request);
	},

	async list() {
		// eslint-disable-next-line no-useless-catch
		try {
			const transactions = await transactionRepository.findAll();
			const transactionCount = await transactionRepository.getTotalTransaction();

			return {
				data: transactions,
				count: transactionCount,
			};
		} catch (err) {
			throw err;
		}
	},

	get(id) {
		return transactionRepository.find(id);
	},

	getOne(key) {
		return transactionRepository.findOne(key);
	},
};