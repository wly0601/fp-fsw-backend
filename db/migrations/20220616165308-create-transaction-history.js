'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TransactionHistories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      productId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "Products",
          },
          key: "id",
        },
      },
      buyerId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "Users",
          },
          key: "id",
        },
      },
      sellerId: {
        type: Sequelize.INTEGER,
      },
      initialPrice: {
        type: Sequelize.INTEGER
      },
      bargainPrice: {
        type: Sequelize.INTEGER
      },
      dateOfBargain: {
        type: Sequelize.DATE
      },
      accBySeller: {
        type: Sequelize.BOOLEAN
      },
      dateOfAccOrNot: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('TransactionHistories');
  }
};