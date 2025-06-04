import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route,
  Navigate
} from 'react-router-dom';
import { 
  ThemeProvider, 
  createTheme, 
  CssBaseline 
} from '@mui/material';

import Dashboard from './pages/Dashboard';
import AddPurifier from './components/AddPurifier';
import Header from './components/Header';

// API Configuration
// const API_URL = 'https://purifier-management-backend.onrender.com/api/purifiers';
const API_URL = 'http://62.72.56.225:5000/api/purifiers';

// Create a custom theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2196f3', // Blue theme
    },
    secondary: {
      main: '#f50057', // Accent color
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

function App() {
  // Function to generate a consistent timestamp
  const generateTimestamp = () => {
    const now = new Date();
    return now.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  // State for purifiers
  const [purifiers, setPurifiers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch purifiers on component mount
  useEffect(() => {
    const fetchPurifiers = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(API_URL);
        setPurifiers(response.data);
        localStorage.setItem('purifiers', JSON.stringify(response.data));
        setIsLoading(false);
      } catch (err) {
        // Fallback to localStorage
        const savedPurifiers = localStorage.getItem('purifiers');
        if (savedPurifiers) {
          setPurifiers(JSON.parse(savedPurifiers));
        } else {
          // Default purifiers if no data available
          const defaultPurifiers = [
            {
              id: '412752',
              name: 'Prem',
              location: {
                houseNoStreet: '123 Main St',
                area: 'Vizag',
                pincode: '560001',
                phoneNumber: '9876543210'
              },
              status: true, 
              lastUpdated: generateTimestamp()
            },
            {
              id: 'PWR-002',
              name: 'Mallik',
              location: {
                houseNoStreet: '456 Elm Street',
                area: 'pendurthi',
                pincode: '560002',
                phoneNumber: '8765432109'
              },
              status: false, 
              lastUpdated: generateTimestamp()
            }
          ];
          setPurifiers(defaultPurifiers);
        }
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchPurifiers();
    // const intervalId = setInterval(fetchPurifiers, 1000); // poll every 1 second
    // return () => clearInterval(intervalId);
  }, []);

  // Add Purifier Handler
  const handleAddPurifier = async (newPurifier) => {
    try {
      // Add timestamp to the new purifier
      const purifierWithTimestamp = {
        ...newPurifier,
        lastUpdated: generateTimestamp()
      };

      // Send to backend
      const response = await axios.post(API_URL, purifierWithTimestamp);
      
      // Update local state
      setPurifiers(prevPurifiers => {
        // Check if purifier already exists
        const existingIndex = prevPurifiers.findIndex(p => p.id === response.data.id);
        
        if (existingIndex !== -1) {
          // Update existing purifier
          const updatedPurifiers = [...prevPurifiers];
          updatedPurifiers[existingIndex] = response.data;
          return updatedPurifiers;
        } else {
          // Add new purifier
          return [...prevPurifiers, response.data];
        }
      });
    } catch (err) {
      console.error('Error adding purifier:', err);
      // Optionally handle error (show notification, etc.)
    }
  };

  // Toggle Purifier Status Handler
  const handleTogglePurifierStatus = async (id) => {
    try {
      const response = await axios.patch(`${API_URL}/${id}/toggle-status`);
      
      setPurifiers(currentPurifiers => 
        currentPurifiers.map(purifier => 
          purifier.id === id ? response.data : purifier
        )
      );
    } catch (err) {
      console.error('Error toggling purifier status:', err);
    }
  };

  // Remove Purifier Handler
  const handleRemovePurifier = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      
      setPurifiers(currentPurifiers => 
        currentPurifiers.filter(purifier => purifier.id !== id)
      );
    } catch (err) {
      console.error('Error removing purifier:', err);
    }
  };

  // Update Purifier Handler
  const handleUpdatePurifier = async (updatedPurifier) => {
    try {
      // Add timestamp to the updated purifier
      const purifierWithTimestamp = {
        ...updatedPurifier,
        lastUpdated: generateTimestamp()
      };

      // Send update to backend
      const response = await axios.put(`${API_URL}/${updatedPurifier.id}`, purifierWithTimestamp);
      
      // Update local state
      setPurifiers(currentPurifiers => 
        currentPurifiers.map(purifier => 
          purifier.id === updatedPurifier.id ? response.data : purifier
        )
      );
    } catch (err) {
      console.error('Error updating purifier:', err);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Header />
        <Routes>
          <Route 
            path="/" 
            element={
              <Dashboard 
                purifiers={purifiers}
                onToggleStatus={handleTogglePurifierStatus}
                onRemovePurifier={handleRemovePurifier}
                onUpdatePurifier={handleUpdatePurifier}
                isLoading={isLoading}
                error={error}
              />
            } 
          />
          <Route 
            path="/add-purifier" 
            element={
              <AddPurifier 
                onAddPurifier={handleAddPurifier}
              />
            } 
          />
          {/* Redirect any unknown routes to dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;