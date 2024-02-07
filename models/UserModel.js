const jwt = require('jsonwebtoken');
const { DataTypes } = require('sequelize');
const crypto = require('crypto');
module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
User.prototype.generateAuthToken = function () {
  const token = jwt.sign({ id: this.id }, '123@key');
  return token;
};
  
  return User;
};



