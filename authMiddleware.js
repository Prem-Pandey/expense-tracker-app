// authMiddleware.js

// authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('./models/UserModel'); // Import User model

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    // Extract JWT token from request headers
    const token = req.headers.authorization.split(' ')[1];

    // Verify JWT token
    jwt.verify(token, '123@key', async (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        // Fetch user from database based on decoded user id
        try {
            const user = await User.findOne({ where: { id: decoded.userId } });
            if (!user) {
                return res.status(401).json({ message: 'User not found' });
            }

            // Add createOrder method to user object
            user.createOrder = async function(orderData) {
                // Call the createOrder method defined in the User model
                try {
                    const order = await this.createOrder(orderData);
                    return order;
                } catch (error) {
                    console.error("Error creating order:", error);
                    throw error; // Throw error for handling in calling function
                }
            };

            // Set user object to req.user
            req.user = user;
            next();
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    });
};

module.exports = authMiddleware;
