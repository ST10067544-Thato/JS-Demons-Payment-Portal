import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Typography,
  Snackbar,
  CircularProgress,
  Box,
  Fab
} from '@mui/material';
import MuiAlert from '@mui/lab/Alert';
import LogoutIcon from '@mui/icons-material/Logout';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function EmployeeDashboard() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();

  // Fetch all pending payments on component load
  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://localhost:5000/api/payment/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log("API response:", response.data);
        setPayments(Array.isArray(response.data.transactions) ? response.data.transactions : []);
      } catch (error) {
        console.error("Error fetching payments:", error);
        setPayments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const handleVerify = async (paymentId) => {
    try {
      await axios.put(`https://localhost:5000/api/payment/verify/${paymentId}`);
      
      setPayments(prevPayments => 
        prevPayments.map(payment =>
          payment._id === paymentId ? { ...payment, status: 'verified' } : payment
        )
      );
      
      setMessage("Payment verified successfully!");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error verifying payment:", error);
      setMessage("Failed to verify payment.");
      setOpenSnackbar(true);
    }
  };

  const handleRevert = async (paymentId) => {
    try {
      await axios.put(`https://localhost:5000/api/payment/revert/${paymentId}`);
      
      setPayments(prevPayments => 
        prevPayments.map(payment =>
          payment._id === paymentId ? { ...payment, status: 'pending' } : payment
        )
      );
      
      setMessage("Payment reverted to pending!");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error reverting payment to pending:", error);
      setMessage("Failed to revert payment to pending.");
      setOpenSnackbar(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('role'); // Clear role
    setMessage('Logout successful! Redirecting to homepage...');
    setOpenSnackbar(true);

    // Redirect to the home page after showing the message
    setTimeout(() => {
      navigate('/');
    }, 1200); // Wait for 1.2 seconds before redirecting
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container
  maxWidth="md"
  sx={{
    padding: '30px',
    backgroundColor: '#f1f1f1',
    borderRadius: '10px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
    marginTop: '30px',
    position: 'relative',
    '@media (max-width:600px)': {
      padding: '15px',
    },
  }}
>
  {/* Logout Floating Button */}
  <Box position="absolute" top={16} right={16} sx={{ '@media (max-width:600px)': { top: '10px', right: '10px' } }}>
    <Fab color="secondary" aria-label="logout" onClick={handleLogout}>
      <LogoutIcon />
    </Fab>
  </Box>

  <Typography variant="h4" align="center" gutterBottom>
    Employee Dashboard
  </Typography>

  {/* Table (make it scrollable on small screens) */}
  <Box sx={{ overflowX: 'auto' }}>
    {loading ? (
      <Box display="flex" justifyContent="center" alignItems="center" style={{ height: '50vh' }}>
        <CircularProgress />
      </Box>
    ) : payments.length === 0 ? (
      <Box display="flex" justifyContent="center" alignItems="center" style={{ height: '50vh' }}>
        <Typography variant="h6" color="textSecondary">
          No payments available
        </Typography>
      </Box>
    ) : (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Payment Made By</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Currency</TableCell>
            <TableCell>Bank Name</TableCell>
            <TableCell>SWIFT Code</TableCell>
            <TableCell>Recipient</TableCell>
            <TableCell>Account Number</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment._id}>
              <TableCell>{payment.userId ? payment.userId.fullName : 'N/A'}</TableCell>
              <TableCell>{payment.amount}</TableCell>
              <TableCell>{payment.currency}</TableCell>
              <TableCell>{payment.bankName}</TableCell>
              <TableCell>{payment.swiftCode}</TableCell>
              <TableCell>{payment.recipientName}</TableCell>
              <TableCell>{payment.accountNumber}</TableCell>
              <TableCell>
                {payment.status === 'verified' ? (
                  <Button variant="contained" style={{ backgroundColor: '#888', color: 'white' }} onClick={() => handleRevert(payment._id)}>
                    Revert
                  </Button>
                ) : (
                  <Button variant="contained" color="primary" onClick={() => handleVerify(payment._id)}>
                    Verify
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )}
  </Box>
  
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="info">
          {message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default EmployeeDashboard;
