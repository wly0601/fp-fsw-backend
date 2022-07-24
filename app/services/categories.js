const categoryRepository = require("../repositories/categories");

module.exports = {
  async list() {
    const categories = await categoryRepository.findAll();
    const categoriesCount = await categoryRepository.getTotalCategories();

    return {
      data: categories,
      count: categoriesCount,
    };
  },

  get(id) {
    return categoryRepository.find(id);
  },

  getOne(key) {
    return categoryRepository.findOne(key);
  },
};