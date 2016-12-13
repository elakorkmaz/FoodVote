var slug = require('slug');

module.exports = function(sequelize, DataTypes) {
  var Menu = sequelize.define('Menu', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    image: DataTypes.STRING,
    info: DataTypes.TEXT
  }, {
  hooks: {
    beforeCreate: function(menu, options) {
      if (!menu.slug) {
        // error prone, what if there are 2 same titles
        menu.slug = slug(menu.title, { lower: true });
      }
    }
  },
  classMethods: {
      associate: function(models) {
        // associations can be defined here
        this.hasMany(models.Vote);
        this.hasMany(models.UserMenu);
        this.belongsToMany(models.User, { through: 'UserMenu'});
      }
    }
  });
  return Menu;
};
