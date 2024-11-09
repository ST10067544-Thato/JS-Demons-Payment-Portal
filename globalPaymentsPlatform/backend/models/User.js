// This file was adapted from geeksforgeeks
// https://www.geeksforgeeks.org/how-to-use-mongodb-and-mongoose-with-node-js/
// abdullahaz93z
// https://www.geeksforgeeks.org/user/abdullahaz93z/contributions/?itm_source=geeksforgeeks&itm_medium=article_author&itm_campaign=auth_user

const mongoose = require('mongoose');

// Mongoose schema to store users in MongoDB
const userSchema = new mongoose.Schema({ 
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        match: [/^[A-Za-z0-9!@#$%^&*()_+=\-{}[\]:;"'<>,.?/\\|~`]+$/, 'Username can only contain letters, numbers, and symbols, with no spaces'] 
    },
    fullName: {
        type: String,
        required: true,
        match: [/^[A-Za-z\s]+$/, 'Full name can only contain letters and spaces'] 
    },
    idNumber: {
        type: String,
        required: true,
        unique: true,
        match: [/^\d{13}$/, 'ID number must be a 13-digit number']
    },
    accountNumber: {
        type: String,
        required: true,
        unique: true,
        match: [/^\d{10}$/, 'Account number must be a 10-digit number'] 
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        enum: ['customer', 'employee'],
        default: 'customer' // Default role is customer
    }
});

module.exports = mongoose.model('User', userSchema);
