'use strict';
const indonesiaCities = require("../../data/indonesia-cities.json")

module.exports = {
  async up(queryInterface, Sequelize){
    const cities = indonesiaCities.map((city, index) => ({
      id: index+1,
      name: city.city, 
      createdAt: new Date(),
      updatedAt: new Date(),      
    }))

    await queryInterface.bulkInsert('Cities', cities, {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Cities', {}, {});
  }
};
