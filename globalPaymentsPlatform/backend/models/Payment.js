// This file was adapted from geeksforgeeks
// https://www.geeksforgeeks.org/how-to-use-mongodb-and-mongoose-with-node-js/
// abdullahaz93z
// https://www.geeksforgeeks.org/user/abdullahaz93z/contributions/?itm_source=geeksforgeeks&itm_medium=article_author&itm_campaign=auth_user

const mongoose = require('mongoose');

// Mongoose schema to store payments in Mongodb
const paymentSchema = new mongoose.Schema({ 
    amount: {
        type: Number,
        required: true,
        min: [0, 'Amount must be a positive number'] 
    },
    currency: {
        type: String,
        required: true,
        enum: [
            'USD', 'EUR', 'GBP', 'JPY', 'AUD', 
            'CAD', 'CHF', 'CNY', 'ZAR', 'INR', 
            'SGD', 'NZD', 'HKD', 'NOK', 'SEK', 
            'MXN'
        ], 
        default: 'ZAR'
    },
    bankName: {
        type: String,
        required: true,
    },
    reference:{
        type: String,
        required: true,
    },
    method: {
        type: String,
        required: true,
        enum: ['SWIFT', 'Wise', 'PayPal'],
        default: 'SWIFT'
    },
    swiftCode: {
        type: String,
        required: true,
    },
    recipientName: {
        type: String,
        required: true,
    },
    accountNumber: {
        type: String,
        required: true,
        match: [/^\d{10}$/, 'Account number must be a 10-digit number'] 
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'verified'], 
        default: 'pending'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true,
        ref: 'User' 
    }
});

module.exports = mongoose.model('Payment', paymentSchema);
