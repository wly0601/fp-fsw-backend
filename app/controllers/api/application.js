const categoryServices = require("../../services/categories")
const {
	Op
} = require("sequelize")
const {
	Categories,
	Cities,
	Users
} = require("../../models")

module.exports = {
	getRoot(req, res) {
		res.status(200).json({
			status: "OK",
			message: "Second Hand API is up and running!",
		});
	},

	priceFormat(data) {
		const priceStr = data.toString();
		var i = priceStr.length;
		var renderPrice = '';
		var counter = 0;

		while (i > 0) {
			renderPrice = priceStr[i - 1] + renderPrice;
			i--;
			counter++;
			if (counter == 3 && i !== 0) {
				renderPrice = '.' + renderPrice;
				counter = 0;
			}
		}

		return `Rp ${renderPrice}`;
	},

	timeFormat(date) {
		const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		if (date.getMinutes() < 10) {
			var minutes = '0' + date.getMinutes().toString();
		} else {
			minutes = date.getMinutes();
		}

		const timeRender = `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}, ${date.getHours()}:${minutes}`

		return timeRender;
	},

	getOffset(req,count){
		const { page = 1, pageSize = 16 } = req.query;
		const offset = (page - 1)*pageSize; 
		return offset;		
	},

	generatePagination(req, count) {
		const {
			page = 1, pageSize = 16
		} = req.query;
		const numberOfPage = Math.ceil(count / pageSize);

		return {
			page,
			numberOfPage,
			pageSize,
			count
		}
	},

	async handleSearchQuery(req){
		const querySearch = req.query.search.split(' ')
		const comparison = [];

		for(let i = 0; i < querySearch.length; i++){
			comparison.push({
				name : {
					[Op.iLike] : '%' + querySearch[i],
				},
			});

			// comparison.push({
			// 	city : {
			// 		[Op.iLike] : '%' + querySearch[i],
			// 	},
			// });
		}		
		return comparison
	},

	async getQuery(req) {
		const {
			category,
			search
		} = req.query;
		const offset = this.getOffset(req)
		const limit = req.query.pageSize || 16;
		const order = [
			["numberOfWishlist", "DESC"],
			["price", "ASC"]
		]

		const statusId = {
			[Op.ne]: 3
		}

		var where = {
			statusId
		}

		const include = {
			model: Categories,
			as: "category",
			attributes: ["name"]
		};

		if (category) {
			const getCategoryName = await categoryServices.getOne({
				where : {
					name: {
							[Op.iLike]: category
						}
					}
				})

			if(!!getCategoryName) {
				where.categoryId = getCategoryName.id
			}
		}

		var getSearchResult;
		if(!!search){
			getSearchResult = await this.handleSearchQuery(req);
		}
		
		if(!!getSearchResult){
			where = {
				statusId,
				[Op.or] : getSearchResult
			}
		}

		console.log(where)

		const query = {
			include,
			where,
			offset,
			limit,
			order
		}

		return query
	},

}