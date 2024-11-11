const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const sanitize = require('mongo-sanitize');

// Middleware for brute force protection and logging login attempts
const bruteForce = require('../middleWare/bruteForceMiddleWare');
const loginAttemptLogger = require('../middleWare/loginAttempMiddleWare');

// Centralized error handling function
const handleError = (res, status, message) => {
  console.error(message);
  res.status(status).send(message);
};

// Login Route
// This router was adapted from bezkoder
// https://www.bezkoder.com/node-js-express-login-mongodb/#:~:text=In%20this%20tutorial,%20we%E2%80%99re%20gonna%20build%20a%20Node.js%20Express%20Login
// bezkoder
// https://www.bezkoder.com/author/bezkoder/
router.post('/login', bruteForce.prevent, loginAttemptLogger, async (req, res) => {
  try {
    const { username, accountNumber, password } = req.body;

    // Regular expressions for username and account number validation
    const usernamePattern = /^[a-zA-Z0-9_-]{3,15}$/;
    const accountNumberPattern = /^[0-9]+$/;

    // Validate username format
    if (!usernamePattern.test(username)) {
      return handleError(res, 400, 'Invalid username format. It must be 3-15 characters long and can include letters, numbers, underscores, or hyphens.');
    }

    // Validate account number format
    if (!accountNumberPattern.test(accountNumber)) {
      return handleError(res, 400, 'Invalid account number format. It must be numeric.');
    }

    // Sanitize inputs
    const sanitizedUsername = sanitize(username);
    const sanitizedAccountNumber = sanitize(accountNumber);

    // Find the user
    const user = await User.findOne({
      $and: [
        { username: sanitizedUsername },
        { accountNumber: sanitizedAccountNumber },
      ],
    });

    // Check if user exists
    if (!user) {
      return handleError(res, 400, 'Invalid credentials. User not found.');
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);

    // If credentials are valid, generate a JWT token
    if (isMatch) {
      const token = jwt.sign({ username, role: user.role }, process.env.JWT_SEC, { expiresIn: '1h' });
      res.status(201).json({ token, userId: user._id, role: user.role, fullName: user.fullName });
    } else {
      // If credentials are invalid, return a 400 response
      return handleError(res, 400, 'Invalid credentials. Incorrect password.');
    }
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;