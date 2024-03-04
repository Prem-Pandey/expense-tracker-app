
const Razorpay = require("razorpay");
const jwt = require('jsonwebtoken');
const UserModel = require("../models/UserModel");

const Purchase = (order, User) => {
    console.log("RAZORPAY_KEY_ID:", process.env.RAZORPAY_KEY_ID);
    console.log("type of order...."+ typeof order)
    console.log("type of User...."+ typeof User)
    return {
        async purchasepremium(req, res, next) {
            try {
                // Check if user is authenticated
                const authHeader = req.headers.authorization;
                if (!authHeader) {
                    return res.status(401).json({ message: "Unauthorized" });
                }
                const token = authHeader.split(' ')[1];
                
                // Verify JWT token
                jwt.verify(token, '123@key', async (err, decoded) => {
                    if (err) {
                        return res.status(401).json({ message: "Invalid token" });
                    }

                    // Fetch user from database based on decoded user id
                    try {
                        console.log("decoded........."+ decoded);
                        console.log("decoded user id......"+ decoded.id)
                        const user = await User.findByPk(decoded.id);
                        if (!user) {
                            return res.status(401).json({ message: 'User not found' });
                        }

                        
                        // Proceed with premium membership purchase
                        const rzp = new Razorpay({
                            key_id: process.env.RAZORPAY_KEY_ID,
                            key_secret: process.env.RAZORPAY_KEY_SECRET
                        });
                        const amount = 2500;

                        rzp.orders.create({ amount, currency: "INR" }, async(err, Order) => {
                            if (err) {
                                return next(err);
                            }
                           
                            try {
                                const newOrder = await order.create({
                                    paymentId: Order.id,
                                    orderId: Order.id,
                                    status: "PENDING",
                                    UserId: user.id,
                                });
                               
                                return res.status(201).json({ order: newOrder, key_id: rzp.key_id });
                            } catch (error) {
                                console.error("Error creating order:", error);
                                return next(error);
                            }
                        });
                    } catch (error) {
                        console.error(error);
                        return res.status(500).json({ message: "Internal Server Error" });
                    }
                });
            } catch (err) {
                console.error(err);
                res.status(403).json({ message: "Something went wrong", error: err });
            }
        },
        async updateTransactionStatus(req, res) {
            try {
                // Extract necessary data from the request body
                const { order_id, payment_id } = req.body;
                console.log('Request Body:', JSON.stringify(req.body));
                // Update the transaction status in the database
                const transaction = await order.findOne({ where: { orderId: order_id } });
                if (!transaction) {
                    return res.status(404).json({ message: "Transaction not found" });
                }
                console.log("order type........"+typeof order);
                // Update the transaction status from 'PENDING' to 'SUCCESS'
                // order.status = 'SUCCESS';
                // order.paymentId = payment_id;
                // order.orderId = order_id;
                // await order.save();
                await order.update({ status: 'SUCCESS' }, { where: { orderId: order_id } });

                // Send a success response
                res.status(200).json({ message: "Transaction status updated successfully" });
            } catch (error) {
                // If an error occurs, log it and send a 500 Internal Server Error response
                console.error("Error updating transaction status:", error);
                res.status(500).json({ message: "Internal Server Error" });
            }
        }
    };
};

module.exports = Purchase;

