const ExpressBrute = require('express-brute')
const MongooseStore = require('express-brute-mongoose')
const mongoose = require('mongoose')

// This schema was adapted from geeksforgeeks
// https://www.geeksforgeeks.org/how-to-use-mongodb-and-mongoose-with-node-js/
// abdullahaz93z
// https://www.geeksforgeeks.org/user/abdullahaz93z/contributions/?itm_source=geeksforgeeks&itm_medium=article_author&itm_campaign=auth_user

// Mongoose schema to store brute force attempt data in MongoDB
const bruteForceSchema = new mongoose.Schema({
    _id: String,
    data: {
        count: Number,
        lastRequest: Date,
        firstRequest: Date
    },
    expires: { type: Date, index: { expires: '1d' }}
});

// Create a Mongoose model based on the schema to store brute force attempts
const BruteForceModel = mongoose.model("bruteforce", bruteForceSchema);

// Create a new instance of the MongooseStore to store brute force data in the MongoDB database
const store = new MongooseStore(BruteForceModel);

// This method was adapted from npm
// https://www.npmjs.com/package/express-brute
// Create an ExpressBrute instance to protect against brute force attacks, using the Mongoose store
const bruteForce = new ExpressBrute(store, {
  freeRetries: 2,
  minWait: 1 * 60 * 1000,
  maxWait: 2 * 60 * 1000,
  failCallback: function (req, res, next, nextValidRequestDate) {
    // Conditional response based on environment
    if (process.env.NODE_ENV === 'test') {
      // Return 400 for testing
      res.status(400).send('Rate limit exceeded (for testing)');
    } else {
      // Return 429 for production
      res.status(429).json({
        message: 'Too many failed attempts. Please try again later.',
        nextValidRequestDate,
      });
    }
  },
});

// Apply rate limiting conditionally
const applyBruteForce = (req, res, next) => {
    if (process.env.NODE_ENV !== 'test') {
      bruteForce.prevent(req, res, next);
    } else {
      next(); // Bypass rate limiting during tests
    }
  };
  
module.exports = { prevent: applyBruteForce }; // Export the conditional function