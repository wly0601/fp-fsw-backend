const productServices = require("../../services/product");

module.exports = {
	async createProduct(req, res){
		try {
			const {
				name,
				price,
				categoryId,
				description,
				images
			} = req.body;

			if(typeof price !== 'number'){
				res.status(400).json({
					status: "FAIL",
					message: "Price must be float!"
				})
				return
			}

			const product = await productServices.create({
				name,
				sellerId: req.user.id,
				price,
				categoryId,
				description,
				images,
				status: "for sale",
				numberOfWhislist: 0,
			});

			res.status(201).json(product);
		}

		catch(err) {
			res.status(422).json({
				error: {
					name: err.name,
					message: err.message,
				}
			});
		}		
	},

	async updateProduct(req, res){
		try {
			const {
				name,
				price,
				categoryId,
				description,
				images
			} = req.body;

			const id = req.params.id;
			const product = await productServices.getOne({
				where: {
					id,
				}
			})

			if (!product) {
				res.status(404).json({
					status: "FAIL",
					message: `Product with id ${req.params.id} not found!`,
				});
				return;
			}

			const compareSellerId = req.user.id === product.sellerId;
			
			if (!compareSellerId) {
				res.status(401).json({
					status: "Unauthorized",
					message: "User who can edit their product is him/herself."
				});
				return;
			}

			if(typeof price !== 'number'){
				res.status(400).json({
					status: "FAIL",
					message: "Price must be float!"
				})
				return
			}

			await productServices.update(req.params.id, {
				name,
				sellerId: req.user.id,
				price,
				categoryId,
				description,
				images,
			});

			res.status(201).json({
				status: "Success",
				message: `Product with id ${req.params.id} has been updated.`,
			});
		} catch(err) {
			res.status(422).json({
				error: {
					name: err.name,
					message: err.message,
				}
			});
		}		
	},

	async getProduct(req, res) {
		try{
		const product = await productServices.get(req.params.id)

		if (!product) {
			res.status(404).json({
				status: "FAIL",
				message: `Product with id ${req.params.id} not found!`,
			});
			return
		}

		res.status(200).json(product);
	} catch(err){
		res.status(400).json({
			error: {
				name: err.name,
				message: err.message,
			}
		});
	}
	},

	async getAllProducts(req, res) {
		try {
			const getAll = await productServices.list();

			res.status(200).json({
				status: "success",
				data: getAll
			})
		} catch (err) {
			res.status(400).json({
				status: "FAIL",
				message: err.message
			})
		}
	},

	async deleteProduct(req, res){
		try{
		const id = req.params.id;
		const product = await productServices.getOne({
			where: {
				id,
			}
		})

		if (!product) {
			res.status(404).json({
				status: "FAIL",
				message: `Product with id ${req.params.id} not found!`,
			});
			return;
		}
		
		const compareSellerId = req.user.id === product.sellerId;
			
		if (!compareSellerId) {
			res.status(401).json({
				status: "Unauthorized.",
				message: "User who can delete their product is him/herself."
			});
			return;
		}

		await productServices.delete(req.params.id);
		res.status(200).json({
			status: "OK",
			message: `Product with id ${req.params.id} has been deleted.`,    	
		});
	} catch(err) {
		res.status(400).json({
			error: {
				name: err.name,
				message: err.message,
			}
		});
	}
	},

};