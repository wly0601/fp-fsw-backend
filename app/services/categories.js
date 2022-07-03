const categoryRepository = require("../repositories/categories");

module.exports = {
	async list() {
		try {
			const categories = await categoryRepository.findAll();
			const categoriesCount = await categoryRepository.getTotalCategories();

			return {
				data: categories,
				count: categoriesCount,
			};
		} catch (err) {
			throw err;
		}
	},

	get(id) {
		return categoryRepository.find(id);
	},

	getOne(key) {
		return categoryRepository.findOne(key);
	},
};
