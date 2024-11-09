import React, { useState, useEffect } from 'react';
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

  // Check if the user is already logged in and redirect
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (token) {
      // If a user is logged in, navigate based on their role
      if (role === 'employee') {
        navigate('/employee-dashboard');
      } else {
        navigate('/customer-dashboard');
      }
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Sends a POST request to the login API with user details
      const response = await axios.post('https://localhost:5000/api/user/login', { username, accountNumber, password });
      
      // Store the token, userId, and role
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.userId);
      localStorage.setItem('role', response.data.role);
      
      // Check user role from response and redirect accordingly
      const role = response.data.role;
      setMessage('Login successful! Redirecting to dashboard...');
      setOpen(true);

      setTimeout(() => {
        if (role === 'employee') {
          navigate('/employee-dashboard');
        } else {
          // Redirect to customer dashboard
          navigate('/customer-dashboard');
        }
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
        Don't have an account?<Button onClick={() => navigate('')} color="primary">Contact Admin</Button>
        </Typography>
      </form>
    </Container>
  );
}

export default Login;
