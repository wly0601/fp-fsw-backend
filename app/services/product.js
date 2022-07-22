const productRepository = require("../repositories/product");

module.exports = {
  create(requestBody) {
    return productRepository.create(requestBody);
  },

  update(id, requestBody) {
    return productRepository.update(id, requestBody);
  },

  delete(id) {
    return productRepository.delete(id);
  },

  async listByCondition(request) {
    return productRepository.findAll(request);
  },

  get(id) {
    return productRepository.find(id);
  },

  getOne(key) {
    return productRepository.findOne(key);
  },

  total(request) {
    return productRepository.getTotalProducts(request);
  }
};