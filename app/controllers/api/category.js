const categoryServices = require("../../services/categories");

module.exports = {
  async getCategory(req, res) {
    try {
      const category = await categoryServices.get(req.params.id);

      if (!category) {
        throw new Error(`Category with id ${req.params.id} not found!`);
      }

      res.status(200).json(category);
    } catch (err) {
      res.status(404).json({
        error: {
          name: err.name,
          message: err.message,
        }
      });
    }
  },

  async getAllCategories(req, res) {
    const getAll = await categoryServices.list();

    res.status(200).json({
      status: "success",
      data: getAll
    });
  }
};