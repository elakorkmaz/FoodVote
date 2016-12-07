'use strict';
module.exports = function(sequelize, DataTypes) {
  var likes = sequelize.define('Like', {
    number: DataTypes.INTEGER,
    MealId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return likes;
};
