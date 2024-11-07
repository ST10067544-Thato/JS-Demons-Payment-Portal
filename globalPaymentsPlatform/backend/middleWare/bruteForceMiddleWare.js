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
    minWait: 1 * 60 * 1000, // 5 minutes
    maxWait: 2 * 60 * 1000, // 1 hour
    
    // Custom callback to handle failed login attempts once the rate limit is reached
    failCallback: function (req, res, next, nextValidRequestDate) {
        // Respond with a 429 status code (Too Many Requests) and inform the user
        res.status(429).json({
            message: 'Too many failed attempts. Please try again later.',
            nextValidRequestDate
        });
    }
});

module.exports = bruteForce;