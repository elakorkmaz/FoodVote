const bcrypt = require('bcrypt');

'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING
    },
    surname: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
      // set: function(password) {
      //   this.setDataValue('passwordDigest', bcrypt.hashSync(password, 10));
      // }
    },
    fullName: {
      type: DataTypes.VIRTUAL,
      get: function() {
        return this.getDataValue('name') + ' ' + this.getDataValue('surname');
      }
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    },
    hooks: {
      beforeCreate: function(user, options) {
      }
    },
  });
  return User;
};
