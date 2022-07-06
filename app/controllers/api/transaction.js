const transactionServices = require("../../services/transaction");
const productServices = require("../../services/product");
const {Products} = require("../../models")
const {Op} = require("sequelize");

function priceFormat(data) {
		const priceStr = data.toString();
		var i = priceStr.length;
		var renderPrice = '';
		var counter = 0;

		while (i > 0) {
			renderPrice = priceStr[i-1] + renderPrice;
			i--;
			counter++;
			if (counter == 3 && i !== 0) {
				renderPrice = '.' + renderPrice;
				counter = 0;
			}
		}

		return `Rp ${renderPrice}`;
};

function timeFormat(date){
	const monthNames=["Jan", "Feb" , "Mar" , "Apr" , "May" , "Jun" ,"Jul", "Aug" , "Sep", "Oct" , "Nov" , "Dec" ];
	if (date.getMinutes() < 10) {
		var minutes = '0' + date.getMinutes().toString();
	} else {
		minutes = date.getMinutes();
	}
	
	const timeRender = `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}, ${date.getHours()}:${minutes}`

	return timeRender;
}

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

	async getAllNotificationUser(req, res) {
		try {
			var result = []
			const getProduct = await productServices.listByCondition({
				where: {
					sellerId : req.params.id,
				}
			})

			const getProductSeller = getProduct.map((product) => {
				return product.id;
			})

			const getTransactionSeller = await transactionServices.listByCondition({
				where: {
					productId : {
						[Op.or]: getProductSeller
					}
				},
				include: {
					model: Products,
				}
			})

			const getTransactionBuyer = await transactionServices.listByCondition({
				where: {
					buyerId : req.params.id,
					accBySeller: {
						[Op.or]: [true, false]
					}
				},
				include: {
					model: Products,
				}
			})

			results = [].concat(
				getProduct.map((product) => {
					return ({
						information: "Product of this user.",
						product 
					})
				}),
				getTransactionSeller.map((ts) => {
					return ({
						information: "Product of this user that is bargained by someone else.",
						ts
					})
				}), 
				getTransactionBuyer.map((tb) => {
					return ({
						information: "Product of this user that want to buy.",
						tb
					})
				})
			)

			const messages = results.map((result) => {
				var msg, productId, image, name, price, time, information, show;
				if(result.information === "Product of this user."){
					show = result.product
					return ({
						msg: "Berhasil Diterbitkan",
						productId: show.id,
						image: show.images[0],
						name: show.name,
						price: priceFormat(show.price),
						time: timeFormat(show.createdAt),
						information: "Please GET /api/product/productId"
					})
				} else if (result.information === "Product of this user that is bargained by someone else."){
					show = result.ts
					return ({
						msg: "Penawaran Produk",
						transactionId: show.id,
						image: show.Product.images[0],
						name: show.Product.name,
						price: priceFormat(show.Product.price),
						bargainPrice: priceFormat(show.bargainPrice),
						time: timeFormat(show.dateOfBargain),
						information: "Please GET /api/transaction/transactionId"
					})
				} 
			})

			res.status(200).json({
				status: "success",
				data: messages
			})
		} catch (err) {
			res.status(400).json({
				status: "FAIL",
				message: err.message
			})
		}
	},


};