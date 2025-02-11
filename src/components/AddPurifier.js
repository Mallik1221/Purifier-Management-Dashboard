import React, { useState } from 'react';
import { 
  Container, 
  TextField, 
  Button, 
  Typography, 
  Grid, 
  Paper,
  FormControlLabel,
  Switch,
  Snackbar,
  Alert,
  Checkbox,
  FormGroup
} from '@mui/material';

function AddPurifier({ onAddPurifier }) {
  const [purifierData, setPurifierData] = useState({
    id: '',
    name: '',
    location: '',
    status: false,
    manualId: false
  });

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [addedPurifierId, setAddedPurifierId] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Ensure ID follows PWR-XXX format
    if (name === 'id') {
      // Remove any non-numeric characters and limit to 3 digits
      const numericValue = value.replace(/\D/g, '').slice(0, 3);
      setPurifierData(prev => ({
        ...prev,
        [name]: numericValue ? `PWR-${numericValue}` : ''
      }));
    } else {
      setPurifierData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleStatusToggle = (e) => {
    setPurifierData(prev => ({
      ...prev,
      status: e.target.checked
    }));
  };

  const handleManualIdToggle = (e) => {
    setPurifierData(prev => ({
      ...prev,
      manualId: e.target.checked,
      id: e.target.checked ? '' : `PWR-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate ID format
    if (!purifierData.id || !purifierData.id.match(/^PWR-\d{3}$/)) {
      alert('Please enter a valid Purifier ID (PWR-XXX format)');
      return;
    }

    // Prepare new purifier object
    const newPurifier = {
      id: purifierData.id,
      name: purifierData.name,
      location: purifierData.location,
      status: purifierData.status
    };
    
    // Call add purifier function
    onAddPurifier(newPurifier);

    // Show snackbar with added purifier ID
    setAddedPurifierId(purifierData.id);
    setOpenSnackbar(true);

    // Reset form
    setPurifierData({
      id: '',
      name: '',
      location: '',
      status: false,
      manualId: purifierData.manualId
    });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Register New Water Purifier
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Purifier ID"
                name="id"
                value={purifierData.id}
                onChange={handleInputChange}
                required
                variant="outlined"
                placeholder="Enter ID (e.g., PWR-001)"
                helperText="Format: PWR-XXX (3 digit number)"
                InputProps={{
                  startAdornment: purifierData.id.startsWith('PWR-') ? null : 'PWR-'
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Purifier Name"
                name="name"
                value={purifierData.name}
                onChange={handleInputChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={purifierData.location}
                onChange={handleInputChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={purifierData.status}
                    onChange={handleStatusToggle}
                    color="primary"
                  />
                }
                label={`Initial Status: ${purifierData.status ? 'Active' : 'Inactive'}`}
              />
            </Grid>

            <Grid item xs={12}>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                fullWidth
              >
                Register Purifier
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          New Purifier Added: {addedPurifierId}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default AddPurifier;