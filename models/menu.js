var slug = require('slug');

module.exports = function(sequelize, DataTypes) {
  var Menu = sequelize.define('Menu', {
    title: DataTypes.STRING,
    slug: DataTypes.STRING,
    image: DataTypes.STRING,
    info: DataTypes.TEXT,
    votes: DataTypes.INTEGER,
    
  }, {
  hooks: {
    beforeCreate: function(menu, options) {
      if (!menu.slug) {
        menu.slug = slug(menu.title, { lower: true });
      }
    }
  },
  classMethods: {
      associate: function(models) {
        // associations can be defined here
        this.hasMany(models.Vote);
      }
    }
  });
  return Menu;
};
