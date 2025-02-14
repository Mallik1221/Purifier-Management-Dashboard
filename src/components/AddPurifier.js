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
  Alert
} from '@mui/material';

function AddPurifier({ onAddPurifier }) {
  const [purifierData, setPurifierData] = useState({
    id: '',
    name: '',
    houseNoStreet: '',
    area: '',
    pincode: '',
    phoneNumber: '',
    status: false
  });

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [addedPurifierId, setAddedPurifierId] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for specific fields
    if (name === 'pincode') {
      // Only allow numeric input for pincode
      const numericValue = value.replace(/\D/g, '').slice(0, 6);
      setPurifierData(prev => ({
        ...prev,
        [name]: numericValue
      }));
    } else if (name === 'phoneNumber') {
      // Only allow numeric input for phone number, limit to 10 digits
      const numericValue = value.replace(/\D/g, '').slice(0, 10);
      setPurifierData(prev => ({
        ...prev,
        [name]: numericValue
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

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    if (!purifierData.id.trim()) {
      alert('Please enter a Purifier ID');
      return;
    }

    if (purifierData.pincode && purifierData.pincode.length !== 6) {
      alert('Pincode must be 6 digits');
      return;
    }

    if (purifierData.phoneNumber && purifierData.phoneNumber.length !== 10) {
      alert('Phone number must be 10 digits');
      return;
    }

    // Prepare new purifier object
    const newPurifier = {
      id: purifierData.id,
      name: purifierData.name,
      location: {
        houseNoStreet: purifierData.houseNoStreet,
        area: purifierData.area,
        pincode: purifierData.pincode,
        phoneNumber: purifierData.phoneNumber
      },
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
      houseNoStreet: '',
      area: '',
      pincode: '',
      phoneNumber: '',
      status: false
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
                placeholder="Enter Purifier ID"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Customer Name"
                name="name"
                value={purifierData.name}
                onChange={handleInputChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="House No. / Street"
                name="houseNoStreet"
                value={purifierData.houseNoStreet}
                onChange={handleInputChange}
                required
                placeholder="Enter House Number and Street"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Area"
                name="area"
                value={purifierData.area}
                onChange={handleInputChange}
                required
                placeholder="Enter Area/Locality"
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Pincode"
                name="pincode"
                value={purifierData.pincode}
                onChange={handleInputChange}
                required
                placeholder="6-digit Pincode"
                inputProps={{
                  maxLength: 6,
                  inputMode: 'numeric',
                  pattern: '[0-9]*'
                }}
                helperText={purifierData.pincode.length > 0 && purifierData.pincode.length !== 6 
                  ? 'Pincode must be 6 digits' 
                  : ''}
                error={purifierData.pincode.length > 0 && purifierData.pincode.length !== 6}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phoneNumber"
                value={purifierData.phoneNumber}
                onChange={handleInputChange}
                required
                placeholder="10-digit Mobile Number"
                inputProps={{
                  maxLength: 10,
                  inputMode: 'tel',
                  pattern: '[0-9]*'
                }}
                helperText={purifierData.phoneNumber.length > 0 && purifierData.phoneNumber.length !== 10 
                  ? 'Phone number must be 10 digits' 
                  : ''}
                error={purifierData.phoneNumber.length > 0 && purifierData.phoneNumber.length !== 10}
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