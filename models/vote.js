'use strict';
module.exports = function(sequelize, DataTypes) {
  var vote = sequelize.define('vote', {
    number: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return vote;
};