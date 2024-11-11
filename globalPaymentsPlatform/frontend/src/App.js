import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Login from './components/Login';
import Home from './components/Home'; // Importing Home component
import PaymentInfo from './components/PaymentInfo'; // Importing PaymentInfo component
import PaymentDetails from './components/PaymentDetails'; // Importing PaymentDetails component
import EmployeeDashboard from './components/EmployeeDashboard'; // Importing EmployeeDashboard component
import CustomerDashboard from './components/CustomerDashboard'; // Importing CustomerDashboard component

// Custom MUI theme with green and black color palette
const theme = createTheme({
  palette: {
    primary: { main: '#4caf50' },
    secondary: { main: '#000000' }, 
  },
  typography: {
    fontFamily: '"Roboto Mono", "Arial", sans-serif',
  },
});


// This section of code was adapted from Medium.com
// https://medium.com/@yogeshmulecraft/implementing-protected-routes-in-react-js-b39583be0740
// Helper functions for role-based authentication
const isAuthenticated = (role) => {
  const token = localStorage.getItem('token');
  return token && localStorage.getItem('role') === role;
};

// Role-specific route protection for customer
const PrivateRoute = ({ element }) => (
  isAuthenticated('customer') ? element : <Navigate to="/login" />
);

// Role-specific route protection for employee
const PrivateRouteEmployee = ({ element }) => (
  isAuthenticated('employee') ? element : <Navigate to="/login" />
);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div style={{ padding: '20px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />

            {/* Customer Protected Routes */}
            <Route path="/customer-dashboard" element={<PrivateRoute element={<CustomerDashboard />} />} />
            <Route path="/payment-info" element={<PrivateRoute element={<PaymentInfo />} />} />
            <Route path="/payment-details" element={<PrivateRoute element={<PaymentDetails />} />} />

            {/* Employee Protected Route */}
            <Route path="/employee-dashboard" element={<PrivateRouteEmployee element={<EmployeeDashboard />} />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
