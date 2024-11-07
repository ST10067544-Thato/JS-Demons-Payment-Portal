const express = require('express');
const app = express();
const cors = require('cors');
const { connectDB } = require('./db/config')
const userRoute = require('./routes/userRoutes');
const paymentRoute = require('./routes/paymentRoute');

// Connect to the database
connectDB();

// CORS configuration object
const corsOptions = {
    origin: 'http://localhost:3000',  
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
    allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id'],  
    credentials: true,  
    optionsSuccessStatus: 204  
};

// Enable CORS with the specified options 
app.use(cors(corsOptions))

// Parse JSON bodies for all incoming requests
app.use(express.json());

// Set up route handlers for user-related and payment-related routes
app.use('/api/user', userRoute);
app.use('/api/payment', paymentRoute);


module.exports = app