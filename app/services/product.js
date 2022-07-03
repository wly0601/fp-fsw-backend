const productRepository = require("../repositories/product");

module.exports = {
	create(requestBody) {
		return productRepository.create(requestBody);
	},

	update(id, requestBody) {
		return productRepository.update(id, requestBody);
	},

	delete(id) {
		return productRepository.delete(id);
	},

	async list() {
		try {
			const products = await productRepository.findAll();
			const productCount = await productRepository.getTotalProducts();

			return {
					data: products,
					count: productCount,
				};
			} catch (err) {
				throw err;
			}
		},

	get(id) {
		return productRepository.find(id);
	},

	getOne(key) {
		return productRepository.findOne(key);
	},
};
