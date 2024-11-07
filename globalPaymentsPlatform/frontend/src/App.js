import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home'; // Add this line to import Home
import PaymentInfo from './components/PaymentInfo'; // Import PaymentInfo component
import PaymentDetails from './components/PaymentDetails'; // Import PaymentDetails component

// Define a custom theme with shades of green and black
const theme = createTheme({
  palette: {
    primary: {
      main: '#4caf50', // Green
    },
    secondary: {
      main: '#000000', // Black
    },
  },
  typography: {
    fontFamily: '"Roboto Mono", "Arial", sans-serif', // Updated to use Roboto Mono // Modern font
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div style={{ padding: '20px' }}>
          <Routes>
            <Route path="/" element={<Home />} />  {/* Home Route */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/payment-info" element={<PaymentInfo />} /> {/* Payment Info Route */}
            <Route path="/payment-details" element={<PaymentDetails />} /> {/* Payment Details Route */}
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
