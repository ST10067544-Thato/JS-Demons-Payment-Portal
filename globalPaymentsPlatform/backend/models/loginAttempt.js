// This file was adapted from geeksforgeeks
// https://www.geeksforgeeks.org/how-to-use-mongodb-and-mongoose-with-node-js/
// abdullahaz93z
// https://www.geeksforgeeks.org/user/abdullahaz93z/contributions/?itm_source=geeksforgeeks&itm_medium=article_author&itm_campaign=auth_user

const mongoose = require('mongoose')

// Mongoose schema to store login attempts in Mongodb
const loginAttemptSchema = new mongoose.Schema({ 
    username: {
     type: String,
     required: true,
     immutable: true,
     trim: true,
     match: [/^[a-zA-Z0-9_]+$/, 'Only alphanumeric characters and underscores'] 
    },
    ipAddress: {
      type: String,
      required: true,
      immutable: true,
     },
    successfulLogin: {
      type: Boolean,
      required: true,
      immutable: true,
     },
    timestamp: { 
      type: Date, 
      default: Date.now,
      immutable: true 
    } 
  })
  
  module.exports = mongoose.model("LoginAttempt", loginAttemptSchema);