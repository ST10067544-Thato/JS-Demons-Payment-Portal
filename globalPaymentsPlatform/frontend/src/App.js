import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Login from './components/Login';
import Home from './components/Home'; // Add this line to import Home
import PaymentInfo from './components/PaymentInfo'; // Import PaymentInfo component
import PaymentDetails from './components/PaymentDetails'; // Import PaymentDetails component
import EmployeeDashboard from './components/EmployeeDashboard'; // Import EmployeeDashboard component
import CustomerDashboard from './components/CustomerDashboard';


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

// Helper function to check if the user is logged in and has the correct role
const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');
  return token && userRole === 'customer'; // Check if user is signed in and has 'customer' role
};

const isAuthenticatedEmployee = () => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');
  return token && userRole === 'employee'; // Check if user is signed in and has 'employee' role
};

// PrivateRoute component to protect specific routes
const PrivateRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/" />; // Redirect to home if not authenticated
};

const PrivateRouteEmployee = ({ element }) => {
  return isAuthenticatedEmployee() ? element : <Navigate to="/" />; // Redirect to home if not authenticated
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div style={{ padding: '20px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />

            {/* Protect CustomerDashboard, PaymentInfo and PaymentDetails routes */}
            <Route path="/customer-dashboard" element={<PrivateRoute element={<CustomerDashboard />} />}/>
            <Route path="/payment-info" element={<PrivateRoute element={<PaymentInfo />} />} />
            <Route path="/payment-details" element={<PrivateRoute element={<PaymentDetails />} />} />

            {/* Protect EmployeeDashboard route */}
            <Route path="/employee-dashboard" element={<PrivateRouteEmployee element={<EmployeeDashboard />} />}/>
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
