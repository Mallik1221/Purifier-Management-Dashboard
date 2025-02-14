import React, { useState, useEffect } from 'react';
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

  // Initialize state from localStorage or use default purifiers
  const [purifiers, setPurifiers] = useState(() => {
    const savedPurifiers = localStorage.getItem('purifiers');
    // If no saved purifiers, return the default purifiers
    return savedPurifiers ? JSON.parse(savedPurifiers) : [
      {
        id: '412753',
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
  });
  
  // Ensure localStorage is updated with default purifiers if empty
  useEffect(() => {
    localStorage.setItem('purifiers', JSON.stringify(purifiers));
  }, [purifiers]);

  const handleAddPurifier = (newPurifier) => {
    // Ensure the new purifier has a consistent timestamp
    const purifierWithTimestamp = {
      ...newPurifier,
      lastUpdated: generateTimestamp()
    };

    // Check if a purifier with the same ID already exists
    const existingPurifierIndex = purifiers.findIndex(p => p.id === purifierWithTimestamp.id);
    
    if (existingPurifierIndex !== -1) {
      // If purifier exists, update it
      const updatedPurifiers = [...purifiers];
      updatedPurifiers[existingPurifierIndex] = purifierWithTimestamp;
      setPurifiers(updatedPurifiers);
    } else {
      // If purifier is new, add it to the list
      setPurifiers([...purifiers, purifierWithTimestamp]);
    }
  };

  const handleTogglePurifierStatus = (id) => {
    setPurifiers(currentPurifiers => 
      currentPurifiers.map(purifier => 
        purifier.id === id 
          ? { 
              ...purifier, 
              status: !purifier.status,
              lastUpdated: generateTimestamp()
            }
          : purifier
      )
    );
  };

  const handleRemovePurifier = (id) => {
    setPurifiers(currentPurifiers => 
      currentPurifiers.filter(purifier => purifier.id !== id)
    );
  };

  const handleUpdatePurifier = (updatedPurifier) => {
    setPurifiers(currentPurifiers => 
      currentPurifiers.map(purifier => 
        purifier.id === updatedPurifier.id 
          ? { 
              ...updatedPurifier, 
              lastUpdated: generateTimestamp() 
            } 
          : purifier
      )
    );
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