const wishRepository = require("../repositories/wishlist");

module.exports = {
	findOrCreate(requestBody) {
		return wishRepository.findOrCreate(requestBody);
	},

	delete(id) {
		return wishRepository.delete(id);
	},

	async listByCondition(request) {
		return await wishRepository.findAll(request);
	},

	async getOne(request) {
		return await wishRepository.findOne(request);
	}
};