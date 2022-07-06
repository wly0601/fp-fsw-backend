const categoryServices = require("../../services/categories")
const {Op} = require("sequelize")
const { Categories, Cities, Users } = require("../../models")

module.exports = {
	getRoot(req, res){
		res.status(200).json({
			status: "OK",
			message: "Second Hand API is up and running!",
		});
	},

	generatePagination(req, count){
		const { page = 1, pageSize = 16} = req.query;
		const pageNumber = Math.ceil(count / pageSize);

		return {
			page,
			pageNumber,
			pageSize,
			count
		}
	},

	async getQuery(req){
		const { category, search } = req.query;
		const limit = req.query.pageSize || 16;
		const where = {};

		where.statusId = {
			[Op.ne] : 3
		}

		// const include = [
		// 	{
		// 		model: Categories,
		// 		where
		// 	},
		// 	{
		// 		model: Users,
		// 		include: {
		// 			model: Cities,
		// 		}
		// 	}
		// ]

		// if (category) {
		// 	const getCategoryName = await categoryServices.getOne({
		// 		where : {
		// 			name: category
		// 			}
		// 		})
		// 	where.categoryId = getCategoryName.id
		// }

		const query = {
			// include,
			where,
			limit		
		}

		return query
	},

}