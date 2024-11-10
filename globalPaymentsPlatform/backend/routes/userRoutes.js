const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const sanitize = require('mongo-sanitize');

// Middleware for brute force protection and logging login attempts
const bruteForce = require('../middleware/bruteForceMiddleWare');
const loginAttemptLogger = require('../middleware/loginAttempMiddleWare');

// Login Route
// This router was adapted from bezkoder
// https://www.bezkoder.com/node-js-express-login-mongodb/#:~:text=In%20this%20tutorial,%20we%E2%80%99re%20gonna%20build%20a%20Node.js%20Express%20Login
// bezkoder
// https://www.bezkoder.com/author/bezkoder/
router.post('/login', bruteForce.prevent, loginAttemptLogger, async (req, res) => {
    try {
        const { username, accountNumber, password } = req.body;

        // Regular expressions for username and account number validation
        const usernamePattern = /^[a-zA-Z0-9_-]{3,15}$/; // Username: 3-15 characters
        const accountNumberPattern = /^[0-9]+$/; // Account number: Numeric only

        // Validate username inputs
        if (!usernamePattern.test(username)) {
            console.error('Invalid username. It must be 3-15 characters long and can include letters, numbers, underscores, or hyphens.');
            return res.status(400).send('Invalid username. It must be 3-15 characters long and can include letters, numbers, underscores, or hyphens.');
        }

        // Validate account number inputs
        if (!accountNumberPattern.test(accountNumber)) {
            console.error('Account number must be numeric.');
            return res.status(400).send('Account number must be numeric.');
        }

        // Sanitize inputs to avoid NoSQL injection
        const sanitizedUsername = sanitize(username);
        const sanitizedAccountNumber = sanitize(accountNumber);

        // Find the user by both username and account number
        const user = await User.findOne({ 
            $and: [
                { username: sanitizedUsername }, 
                { accountNumber: sanitizedAccountNumber }
            ]
        });

        // Check if user exists before accessing password property
        if (!user) {
            return res.status(400).send('Invalid credentials');
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        
        // If user is found and password matches, generate a JWT token
        if (isMatch) {
            const token = jwt.sign({ username, role: user.role }, process.env.JWT_SEC, { expiresIn: '1h' });
            res.status(201).json({ token, userId: user._id, role: user.role, fullName: user.fullName });
        } else {
            // If credentials are invalid, return a 400 response
            res.status(400).send('Invalid credentials');
        }
    } catch (error) {
        console.log("Server error", error);
        res.status(500).json({ message: "Server error", error });
    }
});

module.exports = router;
