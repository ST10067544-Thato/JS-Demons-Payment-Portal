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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fab
} from '@mui/material';
import MuiAlert from '@mui/lab/Alert';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';

// Snackbar Alert component
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function CustomerDashboard() {
  // Component state variables
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const name = localStorage.getItem('name'); // Retrieve the name from localStorage
    if (name) {
      setUserName(name);  // Set the username state
    }
  }, []);
  
  // Fetch payments for the logged-in user on component mount
  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId'); // Fetch user ID from storage

        // Fetch payments data from API for the specific user
        const response = await axios.get(`https://localhost:5000/api/payment/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // This code was inspired by the following YouTube tutorial:
        // User Role-Based Access Control & Permissions in React JS | MERN Stack
        // https://www.youtube.com/watch?v=UhrmPH3TLus
        // Filter payments to only include those for the current user
        const transactions = Array.isArray(response.data.transactions) ? response.data.transactions : [response.data.transactions];
        setPayments(transactions.filter(payment => payment.userId === userId));
      } catch (error) {
        console.error("Error fetching payments:", error);
        setPayments([]); // Set to empty if an error occurs
      } finally {
        setLoading(false); // Stop loading indicator
      }
    };
    fetchPayments();
  }, []);
  
  // Handle payment deletion
  const handleDelete = async () => {
    try {
      await axios.delete(`https://localhost:5000/api/payment/${selectedPaymentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      // Update the payments state to remove the deleted payment
      setPayments(prevPayments => prevPayments.filter(payment => payment._id !== selectedPaymentId));
      
      setMessage("Payment deleted successfully!");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error deleting payment:", error);
      setMessage("Failed to delete payment.");
      setOpenSnackbar(true);
    } finally {
      setOpenDialog(false);
      setSelectedPaymentId(null);
    }
  };

  // Open delete confirmation dialog
  // This section of code was adapted from dev.to
  // https://dev.to/akshaysrepo/building-a-confirmation-dialog-component-with-react-and-material-ui-4468
  const openDeleteDialog = (paymentId) => {
    setSelectedPaymentId(paymentId);
    setOpenDialog(true);
  };

  // Close delete confirmation dialog
  const closeDeleteDialog = () => {
    setOpenDialog(false);
    setSelectedPaymentId(null);
  };

  // Close snackbar notification
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  // Redirect to add new payment page
  const handleAddPayment = () => {
    navigate('/payment-info');
  };

  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId'); // Clear user ID
    localStorage.removeItem('role'); // Clear role

    setMessage('Logout successful! Redirecting to homepage...');
    setOpenSnackbar(true);

    // Redirect to homepage after brief delay
    setTimeout(() => {
      setPayments([]); // Clear payments on logout
      navigate('/');
    }, 1200);
  };

  return (
    <>
      {/* Welcome Message */}
      <Box
        sx={{
          position: 'absolute',
          top: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#4caf50',
          color: '#fff',
          padding: '12px 24px',
          borderRadius: '50px', 
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
          fontFamily: '"Roboto Mono", "Arial", sans-serif',
          fontSize: '20px',
          textAlign: 'center',
          fontWeight: '500',
          zIndex: 1000, 
        }}
      >
        <Typography variant="h6">Hi {userName}, Welcome back to the JS Demons Portal!</Typography>
      </Box>
    <Container
      maxWidth="md"
      sx={{
        padding: '30px',
        backgroundColor: '#f1f1f1',
        borderRadius: '10px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
        marginTop: '70px',
        position: 'relative',
        '@media (max-width:600px)': { padding: '15px' },
      }}
    >
      {/* Floating Buttons */}
      <Box
        position="absolute"
        top={16}
        right={16}
        display="flex"
        gap={2}
        sx={{
          '@media (max-width:600px)': { top: '10px', right: '10px' },
        }}
      >
        <Fab color="primary" aria-label="add" onClick={handleAddPayment}>
          <AddIcon />
        </Fab>
        <Fab color="secondary" aria-label="logout" onClick={handleLogout}>
          <LogoutIcon />
        </Fab>
      </Box>

      {/* Dashboard Title */}
      <Typography variant="h4" align="center" gutterBottom>
        Your Dashboard:
      </Typography>

      {/* Payment Table */}
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
                <TableCell>Amount</TableCell>
                <TableCell>Currency</TableCell>
                <TableCell>Bank Name</TableCell>
                <TableCell>SWIFT Code</TableCell>
                <TableCell>Recipient</TableCell>
                <TableCell>Account Number</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment._id}>
                  <TableCell>{payment.amount}</TableCell>
                  <TableCell>{payment.currency}</TableCell>
                  <TableCell>{payment.bankName}</TableCell>
                  <TableCell>{payment.swiftCode}</TableCell>
                  <TableCell>{payment.recipientName}</TableCell>
                  <TableCell>{payment.accountNumber}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="error" onClick={() => openDeleteDialog(payment._id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDialog} onClose={closeDeleteDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this payment? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="primary">Cancel</Button>
          <Button onClick={handleDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Notification */}
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="info">{message}</Alert>
      </Snackbar>
    </Container>
    </>
  );
}

export default CustomerDashboard;
