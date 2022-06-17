'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Transaction_Histories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      product_id: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "Products",
          },
          key: "id",
        },
      },
      buyer_id: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "Users",
          },
          key: "id",
        },
      },
      seller_id: {
        type: Sequelize.INTEGER,
      },
      integer_price: {
        type: Sequelize.INTEGER
      },
      bargain_price: {
        type: Sequelize.INTEGER
      },
      date_of_bargain: {
        type: Sequelize.DATE
      },
      acc_by_seller: {
        type: Sequelize.BOOLEAN
      },
      date_of_acc_or_not: {
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
    await queryInterface.dropTable('Transaction_Histories');
  }
};