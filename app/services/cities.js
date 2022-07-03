const citiesRepository = require("../repositories/cities");

module.exports = {
	async list() {
		try {
			const cities = await citiesRepository.findAll();
			const citiesCount = await citiesRepository.getTotalCities();

			return {
				data: cities,
					count: citiesCount,
				};
			} catch (err) {
				throw err;
			}
		},

	get(id) {
		return citiesRepository.find(id);
	},

	getOne(key) {
		return citiesRepository.findOne(key);
	},
};