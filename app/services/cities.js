const citiesRepository = require("../repositories/cities");

module.exports = {
  async list() {
    const cities = await citiesRepository.findAll();
    const citiesCount = await citiesRepository.getTotalCities();

    return {
      data: cities,
      count: citiesCount,
    };
  },

  get(id) {
    return citiesRepository.find(id);
  },

  getOne(key) {
    return citiesRepository.findOne(key);
  },
};