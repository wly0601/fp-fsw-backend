'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    const status = ['For Sale', 'Currently Bargained', 'Sold'];

    const insertStatus = status.map((stat) => ({
      name: stat,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await queryInterface.bulkInsert('Status', insertStatus, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Status', null, {});
  }
};