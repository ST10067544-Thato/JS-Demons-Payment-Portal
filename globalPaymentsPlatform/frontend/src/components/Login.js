import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Container, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MuiAlert from '@mui/lab/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Login() {
  const [username, setUsername] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Sends a POST request to the registration API with user details
      // This router was adapted from geeskforgeeks
      // https://www.geeksforgeeks.org/how-to-build-a-basic-crud-app-with-node-js-and-reactjs/
      // braktim99
      // https://www.geeksforgeeks.org/user/braktim99/contributions/?itm_source=geeksforgeeks&itm_medium=article_author&itm_campaign=auth_user
      const response = await axios.post('https://localhost:5000/api/user/login', { username, accountNumber, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.userId);
      // If successful, set a success message and open a notification dialog
      setMessage('Login successful! Redirecting to payment...');
      setOpen(true);
      setTimeout(() => {
        navigate('/payment-info');
      }, 2000);
    } catch (err) {
      setMessage('Invalid credentials. Please try again.');
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Container maxWidth="xs" style={{ backgroundColor: '#f1f1f1', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)', padding: '20px' }}>
      <Typography variant="h4" align="center" gutterBottom>Login</Typography>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="info">{message}</Alert>
      </Snackbar>
      <form onSubmit={handleLogin}>
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => {
            const value = e.target.value.replace(/\s/g, ''); // Remove spaces
            setUsername(value);
          }}
          required
        />
        <TextField
          label="Account Number"
          variant="outlined"
          fullWidth
          margin="normal"
          value={accountNumber}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, ''); // Allow only digits
            setAccountNumber(value);
          }}
          required
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button variant="contained" color="primary" fullWidth type="submit" style={{ marginTop: '20px' }}>Login</Button>
        <Typography variant="body2" align="center" style={{ marginTop: '20px' }}>
          Don't have an account? <Button onClick={() => navigate('/register')} color="primary">Register here</Button>
        </Typography>
      </form>
    </Container>
  );
}

export default Login;
