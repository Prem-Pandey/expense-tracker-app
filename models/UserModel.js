// userModel.js

const { DataTypes } = require('sequelize');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

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

  // Define association to Order model
  
  // Instance method to generate auth token
  User.prototype.generateAuthToken = function () {
    const token = jwt.sign({ id: this.id }, '123@key');
    return token;
  };

  User.findByPk = async function (id) {
    return User.findOne({ where: { id } });
  };
  // Instance method to create an order
  
  User.prototype.createOrder = async function(orderData, Order) {
    try {
      const order = await Order.create({
        paymentId: orderData.paymentId,
        orderId: orderData.orderId,
        status: orderData.status,
        UserId: this.id,
      });
      return order;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  };
  

  return User;
};
