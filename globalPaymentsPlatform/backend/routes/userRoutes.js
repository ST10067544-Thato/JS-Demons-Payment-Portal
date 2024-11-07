const router = require('express').Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const User = require('../models/User')
const sanitize = require('mongo-sanitize');

const bruteForce = require('../middleware/bruteForceMiddleWare')
const loginAttemptLogger = require('../middleware/loginAttempMiddleWare')

// REGISTER Route
router.post('/register', async (req, res) => {
    // This router wa adapted from bezkoder
    // https://www.bezkoder.com/node-js-express-login-mongodb/#:~:text=In%20this%20tutorial,%20we%E2%80%99re%20gonna%20build%20a%20Node.js%20Express%20Login
    // bezkoder
    // https://www.bezkoder.com/author/bezkoder/
    try {
        const { username, fullName, idNumber, accountNumber, password } = req.body;

        const usernamePattern = /^[a-zA-Z0-9_-]{3,15}$/; // Username: 3-15 characters
        const accountNumberPattern = /^[0-9]+$/; // Account number: Numeric only
        const idNumberPattern = /^[0-9]{13}$/; // ID number: Exactly 13 digits

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

        // Validate id number inputs
        if (!idNumberPattern.test(idNumber)) {
            console.error('ID number must be exactly 13 digits.');
            return res.status(400).send('ID number must be exactly 13 digits.');
        }
        // Sanitize inputs to avoid NoSQL injection
        const sanitizedUsername = sanitize(username);
        const sanitizedIdNumber = sanitize(idNumber);
        const sanitizedAccountNumber = sanitize(accountNumber);

        // Check if username, idNumber, or accountNumber already exists
        const existingUser = await User.findOne({
            $or: [
                { idNumber: sanitizedIdNumber },
                { username: sanitizedUsername },
                { accountNumber: sanitizedAccountNumber }
            ]
        });

        // if user exists return a response status of 400 and an existing user message
        if (existingUser) {       
            console.error('username, account no. or id no. already exists');
            return res.status(400).send('account no. or id no. already exists');
        }

        // Hash the password and store user data if all validations pass
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create a new User object using the provided data
        const newUser = new User({ username: sanitizedUsername, fullName, idNumber: sanitizedIdNumber, accountNumber: sanitizedAccountNumber, password: hashedPassword });
        // Save the user to the database
        await newUser.save();
        res.status(201).send('User registered successfully.');

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error });
    }
});

// Login Route
router.post('/login', bruteForce.prevent, loginAttemptLogger, async (req, res) => {
    try {
        
        const { username, accountNumber, password } = req.body;
        
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
        
        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        
        // If user is found and password matches, generate a JWT token
        if (user && isMatch) {
            const token = jwt.sign({ username }, process.env.JWT_SEC, { expiresIn: '1h' });
            res.status(201).json({ token, userId: user._id });
        } else {
                        // If credentials are invalid, return a 400 response
            res.status(400).send('Invalid credentials');
        }
    } catch (error) {
        console.log("Server error",  error);
        // Catch and log server errors, then return a 500 response
        res.status(500).json({ message: "Server error", error });
    }
});


module.exports = router 