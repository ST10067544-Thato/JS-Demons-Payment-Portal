import React, { useState } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  Typography,
  Container,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import MuiAlert from '@mui/lab/Alert';
import { useNavigate } from 'react-router-dom';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function PaymentDetails() {
  const [bankName, setBankName] = useState('');
  const [swiftCode, setSwiftCode] = useState('');
  const [reference, setReference] = useState(''); // Changed variable name
  const [recipientName, setRecipientName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState('success');
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    const amount = localStorage.getItem('amount');
    const currency = localStorage.getItem('currency');
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    try {
      // Sends a POST request to the payment API with user details
      // This router was adapted from geeskforgeeks
      // https://www.geeksforgeeks.org/how-to-build-a-basic-crud-app-with-node-js-and-reactjs/
      // braktim99
      // https://www.geeksforgeeks.org/user/braktim99/contributions/?itm_source=geeksforgeeks&itm_medium=article_author&itm_campaign=auth_user
      await axios.post('https://localhost:5000/api/payment', {
        amount,
        currency,
        bankName,
        swiftCode,
        reference,
        recipientName,
        accountNumber,
        userId
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }});
      setLoading(false); // Stop loading
      setMessage('Payment processed successfully!');
      setSeverity('success');
      setOpen(true);

      // Clear local storage after successful payment
      localStorage.removeItem('amount');
      localStorage.removeItem('currency');

      // Redirect to home after a delay
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setLoading(false); // Stop loading
      setMessage('Payment failed. Please try again.');
      setSeverity('error');
      setOpen(true);
    }
  };

  // Handle Snackbar close
  const handleClose = () => {
    setOpen(false);
  };

  // Validation regex patterns
  const referencePattern = /^[a-zA-Z0-9]+$/; // Letters and numbers only
  const accountNumberPattern = /^[0-9]+$/; // Numeric only
  const swiftCodePattern = /^[a-zA-Z0-9]+$/; // Letters and numbers only

  return (
    <Container maxWidth="sm" style={{ backgroundColor: '#f1f1f1', borderRadius: '10px', padding: '20px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)' }}>
      <Typography variant="h4" align="center" gutterBottom>Payment Details</Typography>
      {message && <Snackbar open={Boolean(message)} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleClose} severity={severity}>
          {message}
        </Alert>
      </Snackbar>}
      
      <form onSubmit={handlePayment}>
        <TextField
          label="Bank Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={bankName}
          onChange={(e) => setBankName(e.target.value)}
          required
        />

        <TextField
          label="SWIFT Code"
          variant="outlined"
          fullWidth
          margin="normal"
          value={swiftCode}
          onChange={(e) => {
            const value = e.target.value;
            if (swiftCodePattern.test(value) || value === '') { // Validate SWIFT code
              setSwiftCode(value);
            }
          }}
          required
        />

        <TextField
          label="Reference" // Changed to "Reference"
          variant="outlined"
          fullWidth
          margin="normal"
          value={reference}
          onChange={(e) => {
            const value = e.target.value;
            if (referencePattern.test(value) || value === '') { // Validate reference
              setReference(value);
            }
          }}
          required
        />

        <TextField
          label="Recipient Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={recipientName}
          onChange={(e) => setRecipientName(e.target.value)}
          required
        />

        <TextField
          label="Account Number" // Account Number with validation
          variant="outlined"
          fullWidth
          margin="normal"
          value={accountNumber}
          onChange={(e) => {
            const value = e.target.value;
            if (accountNumberPattern.test(value) || value === '') { // Validate account number
              setAccountNumber(value);
            }
          }}
          required
        />

        <Button 
          variant="contained" 
          color="primary" 
          fullWidth 
          type="submit" 
          style={{ marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          disabled={loading} // Disable the button while loading
        >
          {loading ? <CircularProgress size={24} style={{ color: 'white', marginRight: '10px' }} /> : 'Pay Now'} {/* Show loader or button text */}
        </Button>
      </form>
    </Container>
  );
}

export default PaymentDetails;
