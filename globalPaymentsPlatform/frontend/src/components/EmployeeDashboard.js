import React, { useState, useEffect } from 'react';
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
  Box
} from '@mui/material';
import MuiAlert from '@mui/lab/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function EmployeeDashboard() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Fetch all pending payments on component load
  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXJwZSIsImlhdCI6MTczMTA5NTUwNSwiZXhwIjoxNzMxMDk5MTA1fQ.w-RcysiZzkunUIrNbGvh-cRB5BMApFlPuv8O4Uj-_Lg';
        const response = await axios.get('https://localhost:5000/api/payment/pending', {
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
      
      // Update the payment status locally without removing the payment
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
      
      // Update the payment status locally without removing the payment
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

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth="md" style={{ padding: '30px', backgroundColor: '#f1f1f1', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)', marginTop: '30px' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Employee Dashboard
      </Typography>

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
              <TableCell>Status</TableCell>
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
                  {payment.status === 'verified' ? (
                    <Button 
                      variant="contained" 
                      style={{ backgroundColor: '#888', color: 'white' }} 
                      onClick={() => handleRevert(payment._id)}
                    >
                      Revert
                    </Button>
                  ) : (
                    <Button 
                      variant="contained" 
                      color="primary" 
                      onClick={() => handleVerify(payment._id)}
                    >
                      Verify
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="info">
          {message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default EmployeeDashboard;
