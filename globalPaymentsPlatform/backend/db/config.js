// This file was adapted from geeksforgeeks
// https://www.geeksforgeeks.org/how-to-use-mongodb-and-mongoose-with-node-js/
// abdullahaz93z
// https://www.geeksforgeeks.org/user/abdullahaz93z/contributions/?itm_source=geeksforgeeks&itm_medium=article_author&itm_campaign=auth_user

// Import the mongoose library to interact with MongoDB
const mongoose = require('mongoose')

// Get the MongoDB URI from environment variables
const ATLAS_URI = process.env.ATLAS_URI

// Define an asynchronous function to connect to the MongoDB database
const connectDB = async () =>{
    try {
        // Attempt to connect to the MongoDB server using the provided URI
        await mongoose.connect(ATLAS_URI);
        console.log('mongoDB is CONNECTED!!! :)')
    } catch (err) {
        console.error('MongoDB connection error:', err);
        // Exit the process with a non-zero status code (1) to indicate failure
        process.exit(1);
    }
}

// Export the connectDB function so it can be used in other files
module.exports = { connectDB }
