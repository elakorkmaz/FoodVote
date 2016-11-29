'use strict';
module.exports = function(sequelize, DataTypes) {
  var Like = sequelize.define('like', {
    number: DataTypes.INTEGER,
    MealId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return like;
};
