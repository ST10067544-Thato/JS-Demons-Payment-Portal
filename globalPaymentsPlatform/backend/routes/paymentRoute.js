const router = require('express').Router()
const Payment = require('../models/Payment')
const User = require('../models/User'); // Make sure User model is correctly imported
const authMiddleware = require('../middleware/authMiddleware')
const { ObjectId } = require('mongodb');  // Make sure you import ObjectId

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

// Payment GET Route [this is for the customer-dashboard page]
router.get('/:userId', authMiddleware, async (req, res) => {
    // This router was adapted from geeskforgeeks
    // https://www.geeksforgeeks.org/how-to-build-a-basic-crud-app-with-node-js-and-reactjs/
    // braktim99
    // https://www.geeksforgeeks.org/user/braktim99/contributions/?itm_source=geeksforgeeks&itm_medium=article_author&itm_campaign=auth_user
    const { userId } = req.params;  // Get the userId from the URL

    try {
        // Convert the userId to an ObjectId before querying the database
        const userObjectId = new ObjectId(userId);

        // Fetch payments for the specific user
        const payments = await Payment.find({ userId: userObjectId }); // Filter payments by userId (as ObjectId)
        
        res.status(200).json({
            message: "User transactions retrieved",
            transactions: payments
        });
    } catch (err) {
        console.error('Error getting payments', err);
        res.status(500).json({ message: 'Server error', error: err });
    }
});

// Route to get all payments [this is for the employee-dashboard page]
router.get('/', async (req, res) => {
    try {
        const payments = await Payment.find().populate('userId', 'fullName'); // Populate userId with fullName
        res.json({
            message: "user transactions retrieved",
            transactions: payments
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Server-side route to verify a payment
router.put('/verify/:paymentId', async (req, res) => {
    const { paymentId } = req.params;
  
    try {
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

// Route to revert a payment status to 'pending'
router.put('/revert/:paymentId', async (req, res) => {
    const { paymentId } = req.params;
  
    try {
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

// Route to toggle the payment status [this is for the employee-dashboard page]
router.put('/toggle-status/:paymentId', async (req, res) => {
    const { paymentId } = req.params;

    try {
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
}) 

module.exports = router 