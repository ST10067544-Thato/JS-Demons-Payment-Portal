// This file was adapted from geeksforgeeks
// https://www.geeksforgeeks.org/how-to-use-mongodb-and-mongoose-with-node-js/
// abdullahaz93z
// https://www.geeksforgeeks.org/user/abdullahaz93z/contributions/?itm_source=geeksforgeeks&itm_medium=article_author&itm_campaign=auth_user
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Get the MongoDB URI and database name from environment variables
    const ATLAS_URI = process.env.ATLAS_URI;
    const MONGODB_DB = process.env.MONGODB_DB; // Get the database name

    // Attempt to connect to the MongoDB server using the provided URI and database name
    await mongoose.connect(ATLAS_URI, {
      dbName: MONGODB_DB, // Use the database name from the environment variable
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('mongoDB is CONNECTED!!! :)');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    // Exit the process with a non-zero status code (1) to indicate failure
    process.exit(1);
  }
};

module.exports = { connectDB };