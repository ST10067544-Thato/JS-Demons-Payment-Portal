import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  Typography,
  Container,
  Snackbar,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material';
import MuiAlert from '@mui/lab/Alert';
import { useNavigate } from 'react-router-dom';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function PaymentDetails() {
  const [bankName, setBankName] = useState('');
  const [swiftCode, setSwiftCode] = useState('');
  const [reference, setReference] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');
  const [loading, setLoading] = useState(false); // Loading state
  const [openCancelDialog, setOpenCancelDialog] = useState(false); // Cancel Dialog state
  const [cancelMessage, setCancelMessage] = useState(''); // Cancel message for Snackbar
  const [openCancelSnackbar, setOpenCancelSnackbar] = useState(false); // Snackbar for cancel
  const navigate = useNavigate();

  useEffect(() => {
    // Check if payment info exists in localStorage
    const amount = localStorage.getItem('amount');
    const currency = localStorage.getItem('currency');
    
    // If either of the required payment info is missing, redirect to PaymentInfo page
    if (!amount || !currency) {
      navigate('/payment-info');
    }
  }, [navigate]);

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    const amount = localStorage.getItem('amount');
    const currency = localStorage.getItem('currency');
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    try {
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
      setOpenCancelSnackbar(true); // Show success Snackbar

      // Clear local storage after successful payment
      localStorage.removeItem('amount');
      localStorage.removeItem('currency');

      setTimeout(() => {
        navigate('/customer-dashboard');
      }, 2000);
    } catch (err) {
      setLoading(false); // Stop loading
      setMessage('Payment failed. Please try again.');
      setSeverity('error');
      setOpenCancelSnackbar(true); // Show error Snackbar
    }
  };

  const handleClose = () => {
    setOpenCancelSnackbar(false);
  };

  const handleCancel = () => {
    setOpenCancelDialog(true); // Show confirmation dialog
  };

  const handleCancelConfirm = () => {
    // Clear the relevant localStorage items
    localStorage.removeItem('amount');
    localStorage.removeItem('currency');
  
    // Set the cancel message and show the Snackbar
    setCancelMessage('Transaction has been cancelled.');
    setOpenCancelSnackbar(true);

    // Close the dialog and navigate to the customer dashboard
    setOpenCancelDialog(false);
    setTimeout(() => {
      navigate('/customer-dashboard');
    }, 1000); // Add slight delay for Snackbar to show before redirecting
  };
  

  const handleCancelDismiss = () => {
    setOpenCancelDialog(false); // Close the cancel dialog without navigating
  };

  const referencePattern = /^[a-zA-Z0-9]+$/;
  const accountNumberPattern = /^[0-9]+$/;
  const swiftCodePattern = /^[a-zA-Z0-9]+$/;

  return (
    <Container maxWidth="sm" style={{ backgroundColor: '#f1f1f1', borderRadius: '10px', padding: '20px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)' }}>
      <Typography variant="h4" align="center" gutterBottom>Confirm Payment Details</Typography>
      
      {/* Snackbar for payment success or failure */}
      {message && <Snackbar open={Boolean(message)} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleClose} severity={severity}>
          {message}
        </Alert>
      </Snackbar>}

      {/* Snackbar for payment cancellation */}
      {cancelMessage && <Snackbar open={openCancelSnackbar} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleClose} severity="info">
          {cancelMessage}
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
            if (swiftCodePattern.test(value) || value === '') {
              setSwiftCode(value);
            }
          }}
          required
        />

        <TextField
          label="Reference"
          variant="outlined"
          fullWidth
          margin="normal"
          value={reference}
          onChange={(e) => {
            const value = e.target.value;
            if (referencePattern.test(value) || value === '') {
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
          label="Account Number"
          variant="outlined"
          fullWidth
          margin="normal"
          value={accountNumber}
          onChange={(e) => {
            const value = e.target.value;
            if (accountNumberPattern.test(value) || value === '') {
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
          disabled={loading} 
        >
          {loading ? <CircularProgress size={24} style={{ color: 'white', marginRight: '10px' }} /> : 'Pay Now'}
        </Button>

        {/* Cancel Payment Button */}
        <Button 
          variant="contained" 
          color="secondary" 
          fullWidth
          style={{ marginTop: '10px', backgroundColor: 'gray' }} 
          onClick={handleCancel}
        >
          Cancel Payment
        </Button>
      </form>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={openCancelDialog} onClose={handleCancelDismiss}>
        <DialogTitle>Confirm Cancellation</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to cancel the payment? This will discard all entered details.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDismiss} color="primary">No</Button>
          <Button onClick={handleCancelConfirm} color="secondary">Yes, Cancel</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default PaymentDetails;
