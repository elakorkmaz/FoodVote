'use strict';
module.exports = function(sequelize, DataTypes) {
  var meal = sequelize.define('meal', {
    title: DataTypes.STRING,
    slug: DataTypes.STRING,
    content: DataTypes.TEXT,
    likes: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return meal;
};