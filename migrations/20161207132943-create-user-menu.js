'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('UserMenus', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
       UserId: {
         type: Sequelize.INTEGER,
         allowNull: false,
         references: {
           model: 'Users',
           key: 'id'
         },
         onDelete: 'cascade'
       },
      MenuId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Menus',
          key: 'id'
        },
        onDelete: 'cascade'
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
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('UserMenus');
  }
};
