import React from 'react';
import { Button, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import logo from './logos/logo.png'; // Adjust the path based on where you saved your logo

function Home() {
  const navigate = useNavigate();

  return (
    <Container 
      maxWidth="md" 
      style={{ 
        textAlign: 'center', 
        padding: '50px', 
        backgroundColor: '#f1f1f1', 
        borderRadius: '10px', 
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)', 
        marginTop: '50px', 
      }}
    >
      <img 
        src={logo} 
        alt="JS Demons Logo" 
        style={{ 
          width: '250px', 
          marginBottom: '20px',
          filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.3))', // shadow effect
        }} 
      />
      <Typography variant="h3" gutterBottom>
        Payments Portal
      </Typography>
      <Typography variant="h5" gutterBottom>
        Your gateway to secure international payments.
      </Typography>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => navigate('/login')} 
        style={{ margin: '10px' }}
      >
        Login
      </Button>
      <Button 
        variant="contained" 
        color="secondary" 
        onClick={() => navigate('/employee-dashboard')} 
        style={{ margin: '10px' }}
      >
        Employee Dashboard
      </Button>
      <Button 
        variant="contained" 
        color="secondary" 
        onClick={() => navigate('/register')} 
        style={{ margin: '10px' }}
      >
        Register
      </Button>
    </Container>
  );
}

export default Home;
