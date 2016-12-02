'use strict';
module.exports = function(sequelize, DataTypes) {
  var Menu = sequelize.define('Menu', {
    title: DataTypes.STRING,
    slug: DataTypes.STRING,
    image: DataTypes.STRING,
    info: DataTypes.TEXT,
    votes: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        this.hasOne(models.Vote);
      }
    }
  });
  return Menu;
};
