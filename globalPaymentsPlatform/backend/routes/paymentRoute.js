// Import necessary modules
const router = require('express').Router();
const Payment = require('../models/Payment');
const User = require('../models/User');
const authMiddleware = require('../middleWare/authMiddleware');
const { ObjectId } = require('mongodb'); 

// Payment POST Route - for processing a new payment
// This route was adapted from GeeksforGeeks:
// https://www.geeksforgeeks.org/how-to-build-a-basic-crud-app-with-node-js-and-reactjs/
// Author: braktim99
// https://www.geeksforgeeks.org/user/braktim99/contributions/
router.post('/', authMiddleware, async (req, res) => {
    try {
        // Destructure fields from the request body
        const { 
            amount, currency, 
            bankName, swiftCode, 
            method, userId, 
            reference, recipientName,
            accountNumber 
        } = req.body;

        console.log(`amount: ${amount}, currency: ${currency}, bankName: ${bankName}, swiftCode: ${swiftCode}`);

        // Define allowed currencies for validation
        const allowedCurrencies = [
            'USD', 'EUR', 'GBP', 'JPY', 'AUD', 
            'CAD', 'CHF', 'CNY', 'ZAR', 'INR', 
            'SGD', 'NZD', 'HKD', 'NOK', 'SEK', 
            'MXN'
        ];

        // Basic validation to ensure all required fields are provided
        if (!amount || !currency || !bankName || !swiftCode || !reference || 
            !recipientName || !accountNumber) {
            return res.status(400).send('All fields are required');
        }

        // Validate that the currency is one of the allowed currencies
        if (!allowedCurrencies.includes(currency)) {
            return res.status(400).send('Invalid currency');
        }

        // Store the payment data in a new Payment document
        const newPayment = new Payment({ 
            amount, currency, bankName, 
            method, swiftCode, userId, reference,
            recipientName, accountNumber  
        });

        // Validate and save the new payment document
        await newPayment.validate();
        await newPayment.save();

        // Respond with a success message
        res.status(201).send('Payment processed');
    } catch (error) {
        // Handle any errors with a 500 status and error message
        console.error('Server error', error);
        res.status(500).json({ message: 'Server error', error });
    }
});

// Payment GET Route - Retrieve payments for a specific user [for customer-dashboard page]
// This route was adapted from GeeksforGeeks:
// https://www.geeksforgeeks.org/how-to-build-a-basic-crud-app-with-node-js-and-reactjs/
// Author: braktim99
// https://www.geeksforgeeks.org/user/braktim99/contributions/
router.get('/:userId', authMiddleware, async (req, res) => {
    const { userId } = req.params;  // Extract userId from URL parameters
    
    try {
        // Convert userId to an ObjectId to query the database
        const userObjectId = new ObjectId(userId);

        // Fetch payments associated with the specific userId
        const payments = await Payment.find({ userId: userObjectId });
        
        // Send the payments in the response
        res.status(200).json({
            message: "User transactions retrieved",
            transactions: payments
        });
    } catch (err) {
        // Handle any errors with a 500 status and error message
        console.error('Error getting payments', err);
        res.status(500).json({ message: 'Server error', error: err });
    }
});

// Route to get all payments [for employee-dashboard page]
router.get('/', async (req, res) => {
    try {
        // Fetch all payments and populate the 'userId' field with the 'fullName'
        const payments = await Payment.find().populate('userId', 'fullName');
        
        // Respond with the payments
        res.json({
            message: "User transactions retrieved",
            transactions: payments
        });
    } catch (error) {
        // Handle any errors with a 500 status and error message
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// PUT Route to verify a payment
router.put('/verify/:paymentId', async (req, res) => {
    const { paymentId } = req.params;

    try {
        // Find the payment by ID
        const payment = await Payment.findById(paymentId);

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        // Update the payment status to 'verified'
        payment.status = 'verified';
        await payment.save();

        res.json({ message: 'Payment verified successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error verifying payment' });
    }
});

// PUT Route to revert a payment status to 'pending'
router.put('/revert/:paymentId', async (req, res) => {
    const { paymentId } = req.params;

    try {
        // Find the payment by ID
        const payment = await Payment.findById(paymentId);

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        // Revert the payment status to 'pending'
        payment.status = 'pending';
        await payment.save();

        res.json({ message: 'Payment reverted to pending' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error reverting payment' });
    }
});

// This code below was adapted from Medium.com:
// Fetch API Data on Button Click in React.
// https://medium.com/@wanguiwawerub/fetch-api-data-on-button-click-in-react-d87730224159
// and 
// Also inspired by this YouTube video:
// React JS – Fetch Data from any API – Button Click / Component Mount
// https://www.youtube.com/watch?v=4bgL-4v3quk

// PUT Route to toggle the payment status [for employee-dashboard page]
router.put('/toggle-status/:paymentId', async (req, res) => {
    const { paymentId } = req.params;

    try {
        // Find the payment by ID
        const payment = await Payment.findById(paymentId);

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        // Toggle the payment status between 'verified' and 'pending'
        payment.status = payment.status === 'verified' ? 'pending' : 'verified';
        await payment.save();

        res.json({ message: 'Payment status updated successfully', status: payment.status });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating payment status' });
    }
});

// DELETE route to delete a payment by ID
router.delete('/:paymentId', authMiddleware, async (req, res) => {
    const { paymentId } = req.params;  // Extract paymentId from URL parameters
    
    try {
        // Find and delete the payment by its ID
        const payment = await Payment.findByIdAndDelete(paymentId);
        
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        // Respond with a success message
        res.json({ message: 'Payment deleted successfully' });
    } catch (error) {
        console.error('Error deleting payment', error);
        res.status(500).json({ message: 'Error deleting payment', error });
    }
});

module.exports = router;
