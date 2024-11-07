const jwt = require('jsonwebtoken')

// Define the authentication middleware function
const authMiddleware = (req, res, next) => {
    // This function was adapted from dev
    // https://dev.to/taiwo17/nodejs-authentication-and-authorization-with-jwt-building-a-secure-web-application-236f#:~:text=This%20article%20covered%20JWT,%20authorization,%20authentication,%20and%20how%20to%20create
    // Taiwo Shobo
    // https://dev.to/taiwo17
    console.log('Request Headers:', req.headers);

    // Get the 'Authorization' header from the incoming request
    const authHeader = req.header('Authorization');
    console.log('Authorization Header:', authHeader);

    // If no 'Authorization' header is found, respond with a 401 Unauthorized error
    if (!authHeader) {
        return res.status(401).json({ message: 'No authorization header, access denied' });
    }

    // Split the 'Authorization' header into two parts: 'Bearer' and the token
    const parts = authHeader.split(' ');
    // Ensure the header follows the format: 'Bearer [token]'
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({ message: 'Authorization header format must be "Bearer [token]"' });
    }

    // Extract the token part from the header
    const token = parts[1];
    console.log('Token:', token);

    // If no token is provided, respond with a 401 Unauthorized error
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        // Verify the token using the secret stored in the environment variable JWT_SEC
        const decoded = jwt.verify(token, process.env.JWT_SEC);
        console.log('Decoded Token:', decoded);
        req.user = decoded;
        next();
    } catch (err) {
        console.error('Token Verification Error:', err);
        // Handle invalid tokens (e.g., if the signature is invalid)
        if (err.name === 'JsonWebTokenError') {
            console.error('TOKEN ERROR', err);
            return res.status(401).json({ message: 'Invalid token' });
        } 
        // Handle expired tokens (i.e., the token has passed its expiration time)
        else if (err.name === 'TokenExpiredError') {
            console.error('TOKEN ERROR', err);
            return res.status(401).json({ message: 'Token expired' });
        }
        // Respond with a 500 Server Error if something else goes wrong during authentication
        res.status(500).json({ message: 'Server error during authentication' });
    }
};


module.exports = authMiddleware 

