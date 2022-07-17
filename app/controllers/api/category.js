const categoryServices = require("../../services/categories");

module.exports = {
  async getCategory(req, res) {
    try {
      const category = await categoryServices.get(req.params.id)

      if (!category) {
        res.status(404).json({
          status: "FAIL",
          message: `Category with id ${req.params.id} not found!`,
        });
        return
      }

      res.status(200).json(category);
    } catch (err) {
      res.status(400).json({
        error: {
          name: err.name,
          message: err.message,
        }
      });
    }
  },

  async getAllCategories(req, res) {
    try {
      const getAll = await categoryServices.list();

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