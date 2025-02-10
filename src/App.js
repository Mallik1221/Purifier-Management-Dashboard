import React, { useState } from 'react';
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
  const [purifiers, setPurifiers] = useState([
    { 
      id: 'PWR-001', 
      name: 'Office Purifier', 
      location: 'Main Office', 
      status: false, 
      lastUpdated: new Date().toLocaleString() 
    },
    { 
      id: 'PWR-002', 
      name: 'Warehouse Purifier', 
      location: 'Storage Facility', 
      status: true, 
      lastUpdated: new Date().toLocaleString() 
    }
  ]);

  const handleAddPurifier = (newPurifier) => {
    // Check if a purifier with the same ID already exists
    const existingPurifierIndex = purifiers.findIndex(p => p.id === newPurifier.id);
    
    if (existingPurifierIndex !== -1) {
      // If purifier exists, update it
      const updatedPurifiers = [...purifiers];
      updatedPurifiers[existingPurifierIndex] = newPurifier;
      setPurifiers(updatedPurifiers);
    } else {
      // If purifier is new, add it to the list
      setPurifiers([...purifiers, newPurifier]);
    }
  };

  const handleTogglePurifierStatus = (id) => {
    setPurifiers(currentPurifiers => 
      currentPurifiers.map(purifier => 
        purifier.id === id 
          ? { 
              ...purifier, 
              status: !purifier.status,
              lastUpdated: new Date().toLocaleString()
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