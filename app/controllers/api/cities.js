const citiesServices = require("../../services/cities");

module.exports = {
	async getCity(req, res) {
		try {
			const city = await citiesServices.get(req.params.id)

			if (!city) {
				res.status(404).json({
					status: "FAIL",
					message: `City with id ${req.params.id} not found!`,
				});
				return
			}

			res.status(200).json(city);
		} catch (err) {
			res.status(400).json({
				error: {
					name: err.name,
					message: err.message,
				}
			});
		}
	},

	async getAllCities(req, res) {
		try {
			const getAll = await citiesServices.list();

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
	}
}