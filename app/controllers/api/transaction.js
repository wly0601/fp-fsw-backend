const transactionServices = require("../../services/transaction");
const productServices = require("../../services/product");

module.exports = {
	async createTransaction(req, res) {
		try {
            const {bargainPrice} = req.body
            const dateOfBargain = new Date()
			const product = await productServices.get(req.params.id)

            const transaction = await transactionServices.create({
				productId: product.id,
				buyerId: req.user.id,
				bargainPrice,
                dateOfBargain,
			});

			res.status(201).json(transaction);
		} catch (err) {
			res.status(422).json({
				error: {
					name: err.name,
					message: err.message,
				}
			});
		}
	},	

};