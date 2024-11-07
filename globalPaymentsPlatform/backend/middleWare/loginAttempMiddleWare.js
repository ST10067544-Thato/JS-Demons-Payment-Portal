const LoginAttempt = require('../models/loginAttempt')

// middleware function to log login attempts
const loginAttemptLogger = async (req, res, next) => {
    // Store the original `res.json` function
    const originalJson = res.json;
    
     // Override the `res.json` function to capture response data
    res.json = function(data) {
        const username = req.body.username;
        const ipAddress = req.id || req.connection.remoteAddress;
        const successfulLogin = !data.message || data.message !== "Invalid credentials";

        // Log the login attempt in the database

        // This LoginAttempt creation was adapted from geeksforgeeks
        // https://www.geeksforgeeks.org/how-to-use-mongodb-and-mongoose-with-node-js/
        // abdullahaz93z
        // https://www.geeksforgeeks.org/user/abdullahaz93z/contributions/?itm_source=geeksforgeeks&itm_medium=article_author&itm_campaign=auth_user

        LoginAttempt.create({ username, ipAddress, successfulLogin })
        .catch(err => console.error("Error loggin login attempt:", err));

        // Call the original `res.json` function with the original response data
        originalJson.call(this, data);
    };
    // Call the next middleware function in the stack
    next();
};

module.exports = loginAttemptLogger 