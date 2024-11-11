import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Container, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MuiAlert from '@mui/lab/Alert';

// Custom alert component for feedback messages
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Login() {
  // State variables for user input and feedback
  const [username, setUsername] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (token) {
      // This code was inspired by the following YouTube tutorial:
      // User Role-Based Access Control & Permissions in React JS | MERN Stack
      // https://www.youtube.com/watch?v=UhrmPH3TLus
      // Navigate based on user role
      navigate(role === 'employee' ? '/employee-dashboard' : '/customer-dashboard');
    }
  }, [navigate]);

  // Handle form submission and login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://localhost:5000/api/user/login', { username, accountNumber, password });

      // Store authentication details in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.userId);
      localStorage.setItem('role', response.data.role);
      localStorage.setItem('name', response.data.fullName);

      // Provide feedback and redirect after short delay
      setMessage('Login successful! Redirecting to dashboard...');
      setOpen(true);
      setTimeout(() => {
        navigate(response.data.role === 'employee' ? '/employee-dashboard' : '/customer-dashboard');
      }, 2000);
      
    } catch (err) {
      setMessage('Invalid credentials. Please try again.');
      setOpen(true);
    }
  };

  // Close feedback snackbar
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Container 
      maxWidth="xs" 
      style={{
        backgroundColor: '#f1f1f1',
        borderRadius: '10px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
        padding: '20px'
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>Login</Typography>

      {/* Snackbar for feedback messages */}
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
          onChange={(e) => setUsername(e.target.value.replace(/\s/g, ''))} // Remove spaces
          required
        />
        <TextField
          label="Account Number"
          variant="outlined"
          fullWidth
          margin="normal"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))} // Allow only digits
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
        <Button 
          variant="contained" 
          color="primary" 
          fullWidth 
          type="submit" 
          style={{ marginTop: '20px' }}
        >
          Login
        </Button>
        <Typography variant="body2" align="center" style={{ marginTop: '20px' }}>
          Don't have an account?
          <Button onClick={() => navigate('')} color="primary">Contact Admin</Button>
        </Typography>
      </form>
    </Container>
  );
}

export default Login;
