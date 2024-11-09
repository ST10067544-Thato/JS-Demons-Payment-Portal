import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Container, Snackbar, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MuiAlert from '@mui/lab/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Register() {
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer'); // Default role set to 'customer'
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://localhost:5000/api/user/register', { username, fullName, idNumber, accountNumber, password, role });
      
      setMessage('Registration successful! Redirecting to login...');
      setOpen(true);
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setMessage(`Registration failed. Please try again. ${err.message}`);
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Container maxWidth="xs" style={{ backgroundColor: '#f1f1f1', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)', padding: '20px' }}>
      <Typography variant="h4" align="center" gutterBottom>Register</Typography>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="info">{message}</Alert>
      </Snackbar>
      <form onSubmit={handleRegister}>
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => {
            const value = e.target.value.replace(/\s/g, ''); 
            setUsername(value);
          }}
          required
        />
        <TextField
          label="Full Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={fullName}
          onChange={(e) => {
            const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
            setFullName(value);
          }}
          required
        />
        <TextField
          label="ID Number"
          variant="outlined"
          fullWidth
          margin="normal"
          value={idNumber}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '');
            setIdNumber(value);
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
            const value = e.target.value.replace(/\D/g, '');
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
        
        {/* Role Dropdown */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Role</InputLabel>
          <Select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <MenuItem value="customer">Customer</MenuItem>
            <MenuItem value="employee">Employee</MenuItem>
          </Select>
        </FormControl>

        <Button variant="contained" color="primary" fullWidth type="submit" style={{ marginTop: '20px' }}>Register</Button>
        <Typography variant="body2" align="center" style={{ marginTop: '20px' }}>
          Already have an account? <Button onClick={() => navigate('/login')} color="primary">Log in</Button>
        </Typography>
      </form>
    </Container>
  );
}

export default Register;
