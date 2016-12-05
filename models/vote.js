'use strict';
module.exports = function(sequelize, DataTypes) {
  var Vote = sequelize.define('Vote', {
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
    }
  }
});
  return Vote;
};
