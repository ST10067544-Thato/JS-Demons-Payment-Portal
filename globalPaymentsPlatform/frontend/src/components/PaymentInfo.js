import React, { useState } from 'react';
import { TextField, Button, Typography, Container, MenuItem, Select, InputLabel, FormControl, Grid, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import mastercardLogo from './logos/mastercard.png'; // Assuming you have these logos in a "logos" folder
import paypalLogo from './logos/paypal.png';
import eftLogo from './logos/eft.png';
import swiftLogo from './logos/swift.png'; // Add SWIFT logo

function PaymentInfo() {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [openSnackbar, setOpenSnackbar] = useState(false); // For handling unavailable payment methods
  const navigate = useNavigate();

  const handleNext = () => {
    // Store the payment info in local storage to use in the next step
    localStorage.setItem('amount', amount);
    localStorage.setItem('currency', currency);
    
    // Navigate to Payment Details page
    navigate('/payment-details');
  };

  const handleUnavailablePayment = () => {
    setOpenSnackbar(true); // Show message when unavailable payment is clicked
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false); // Close the snackbar
  };

  return (
    <Container maxWidth="sm" style={{ backgroundColor: '#f1f1f1', borderRadius: '10px', padding: '30px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)' }}>
      <Typography variant="h4" align="center" gutterBottom>Payment Information</Typography>

      {/* Amount and Currency Section */}
      <form onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
        <FormControl variant="outlined" fullWidth margin="normal">
          <TextField
            label="Amount"
            type="number"
            variant="outlined"
            fullWidth
            margin="normal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </FormControl>
        
        <FormControl variant="outlined" fullWidth margin="normal">
          <InputLabel id="currency-label">Currency</InputLabel>
          <Select
            labelId="currency-label"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            label="Currency"
          >
            <MenuItem value="USD">$(USD)</MenuItem>
            <MenuItem value="EUR">€(EUR)</MenuItem>
            <MenuItem value="GBP">£(GBP)</MenuItem>
            <MenuItem value="ZAR">R(ZAR)</MenuItem>
          </Select>
        </FormControl>

        {/* Payment Method Heading */}
        <Typography variant="h6" align="center" style={{ marginTop: '30px', marginBottom: '10px' }}>Choose Payment Method</Typography>

        {/* Payment Method Buttons with Logos */}
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={6} sm={6} md={6}>
            <Button variant="outlined" color="secondary" fullWidth onClick={handleUnavailablePayment} style={{ padding: '10px', borderRadius: '10px' }}>
              <img src={mastercardLogo} alt="Mastercard" style={{ width: '30px', marginRight: '10px' }} />
              Mastercard
            </Button>
          </Grid>
          <Grid item xs={6} sm={6} md={6}>
            <Button variant="outlined" color="secondary" fullWidth onClick={handleUnavailablePayment} style={{ padding: '10px', borderRadius: '10px' }}>
              <img src={paypalLogo} alt="PayPal" style={{ width: '30px', marginRight: '10px' }} />
              PayPal
            </Button>
          </Grid>
          <Grid item xs={6} sm={6} md={6}>
            <Button variant="outlined" color="secondary" fullWidth onClick={handleUnavailablePayment} style={{ padding: '10px', borderRadius: '10px' }}>
              <img src={eftLogo} alt="EFT" style={{ width: '30px', marginRight: '10px' }} />
              EFT
            </Button>
          </Grid>
          <Grid item xs={6} sm={6} md={6}>
            <Button variant="outlined" color="secondary" fullWidth type="submit" style={{ padding: '10px', borderRadius: '10px' }}>
              <img src={swiftLogo} alt="SWIFT" style={{ width: '30px', marginRight: '10px' }} />
              SWIFT
            </Button>
          </Grid>
        </Grid>
      </form>

      {/* Snackbar for unavailable payment methods */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message="This payment method is currently unavailable"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Container>
  );
}

export default PaymentInfo;
