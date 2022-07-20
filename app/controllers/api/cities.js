const citiesServices = require("../../services/cities");

module.exports = {
  async getCity(req, res) {
    try {
      const city = await citiesServices.get(req.params.id);

      if (!city) {
        throw new Error(`City with id ${req.params.id} not found!`) 
      }

      res.status(200).json(city);
    } catch (err) {
      res.status(404).json({
        error: {
          name: err.name,
          message: err.message,
        }
      });
    }
  },

  async getAllCities(req, res) {
    const getAll = await citiesServices.list();

    res.status(200).json({
      status: "success",
      data: getAll
    });
  }
};