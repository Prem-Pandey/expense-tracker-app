const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
const Order = sequelize.define('order', {
    paymentId:{
        type: DataTypes.STRING,
    },
    orderId:{
        type: DataTypes.STRING,
    },
    status: {
        type: DataTypes.STRING,
    },
    UserId: {
        type: DataTypes.INTEGER, // Assuming userId is an INTEGER
        allowNull: false,
      },
})

// Define association to User model

return Order;
}
