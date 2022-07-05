const transactionServices = require("../../services/transaction");
const productServices = require("../../services/product");
const {Op} = require("sequelize");

module.exports = {
	async createTransaction(req, res) {
		try {
            const {bargainPrice,productId} = req.body
            const dateOfBargain = new Date()
			const product = await productServices.get(productId)

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
	async getAllNotification(req, res) {
		try {
			var result = []

			const getProduct = await productServices.listByCondition({
				where: {
					sellerId : req.user.id,
				}
			})

			const getProductSeller = getProduct.map((product) => {
				return product.id;
			})

			const getTransactionSeller = await transactionServices.listByCondition({
				where:{
					productId : {
						[Op.or]: getProductSeller
					}
				}
			})

			const getTransactionBuyer = await transactionServices.listByCondition({
				where:{
					buyerId : req.user.id
				}
			})

			result = getProduct.concat(getTransactionSeller).concat(getTransactionBuyer)

			res.status(200).json({
				status: "success",
				data: result
			})
		} catch (err) {
			res.status(400).json({
				status: "FAIL",
				message: err.message
			})
		}
	},


};