'use strict';
module.exports = function(sequelize, DataTypes) {
  var Like = sequelize.define('Like', {
    number: DataTypes.INTEGER,
    MealId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Meals",
        key: "id"
      }
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Like;
};
