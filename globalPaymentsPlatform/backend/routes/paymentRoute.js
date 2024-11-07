const router = require('express').Router()
const Payment = require('../models/Payment')
const authMiddleware = require('../middleware/authMiddleware')

// Payment POST Route
router.post('/', authMiddleware, async (req, res) => {
    // This router was adapted from geeskforgeeks
    // https://www.geeksforgeeks.org/how-to-build-a-basic-crud-app-with-node-js-and-reactjs/
    // braktim99
    // https://www.geeksforgeeks.org/user/braktim99/contributions/?itm_source=geeksforgeeks&itm_medium=article_author&itm_campaign=auth_user
    try {
        const { 
            amount, currency, 
            bankName, swiftCode, 
            method, userId, 
            reference,
            recipientName,
            accountNumber 
        } = req.body;
        
        console.log(`amount: ${amount}, currency: 
            ${currency}, bankName: ${bankName}, 
            swiftCode: ${swiftCode}`)
        
        // Define allowed currencies for validation
        const allowedCurrencies = [
            'USD', 'EUR', 'GBP', 'JPY', 'AUD', 
            'CAD', 'CHF', 'CNY', 'ZAR', 'INR', 
            'SGD', 'NZD', 'HKD', 'NOK', 'SEK', 
            'MXN'
        ];

        // Basic validation to ensure all required fields are provided
        if (!amount || !currency || !bankName || !swiftCode || !reference
            || !recipientName
            || !accountNumber ) {
            return res.status(400).send('All fields are required');
        }

        // Validate that the currency is one of the allowed currencies
        if (!allowedCurrencies.includes(currency)) {
            return res.status(400).send('Invalid currency');
        }

        // Store payment data 
        const newPayment = new Payment({ 
            amount, currency, bankName, 
            method, swiftCode, userId, reference,
            recipientName,
            accountNumber  });
        
        await newPayment.validate(); // Validate the payment data
        await newPayment.save();  // Save the validated payment to the database

        // Respond with a success message
        res.status(201).send('Payment processed');
    } catch (error) {
        // return a 500 status with an error message for a server error
        console.error('server error', error)
        res.status(500).json({ message: 'Server error', error });

    }
});

// Payment GET Route
router.get('/:id', authMiddleware,  async (req, res) => {
    // This router was adapted from geeskforgeeks
    // https://www.geeksforgeeks.org/how-to-build-a-basic-crud-app-with-node-js-and-reactjs/
    // braktim99
    // https://www.geeksforgeeks.org/user/braktim99/contributions/?itm_source=geeksforgeeks&itm_medium=article_author&itm_campaign=auth_user
    try {
        // Fetch all payment records from the database
        const payments = await Payment.find();
        console.log(payments)
        // Respond with the retrieved payment data
        res.status(200).json({
            message: "user transactions retrieved",
            transactions: payments
        });
    } catch (err) {
        // return a 500 status with an error message for a server error
        console.error('Error getting posts', err);
        res.status(500).json({ message: 'Server error', error: err });
    }
})



module.exports = router 