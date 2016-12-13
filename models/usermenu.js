'use strict';
module.exports = function(sequelize, DataTypes) {
  var UserMenu = sequelize.define('UserMenu', {
    UserId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Users",
        key: "id"
      }
    },
    MenuId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Menus",
        key: "id"
      }
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        this.belongsTo(models.Menu);
        this.belongsTo(models.User);
      }
    }
  });
  return UserMenu;
};
