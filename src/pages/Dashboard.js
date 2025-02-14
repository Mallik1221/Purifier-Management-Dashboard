import React, { useState, useMemo } from 'react';
import { 
  Container, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Switch,
  FormControlLabel
} from '@mui/material';
import { 
  PowerSettingsNew as PowerIcon, 
  Delete as DeleteIcon,
  Search as SearchIcon,
  Phone as PhoneIcon,
  Edit as EditIcon
} from '@mui/icons-material';

function Dashboard({ purifiers, onToggleStatus, onRemovePurifier,onUpdatePurifier}) {
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedPurifier, setSelectedPurifier] = useState(null);
  const [editedPurifier, setEditedPurifier] = useState(null);
  
  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterDate, setFilterDate] = useState('');

  // Get unique locations for filter dropdown
  const uniqueLocations = useMemo(() => {
    return [...new Set(purifiers.map(p => p.location.area))];
  }, [purifiers]);

  // Filtered and Searched Purifiers
  const filteredPurifiers = useMemo(() => {
    return purifiers.filter(purifier => {
      // Search filter
      const matchesSearch = 
        searchTerm === '' || 
        purifier.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        purifier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        purifier.location.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
        purifier.location.houseNoStreet.toLowerCase().includes(searchTerm.toLowerCase()) ||
        purifier.location.pincode.includes(searchTerm) ||
        purifier.location.phoneNumber.includes(searchTerm);

      // Status filter
      const matchesStatus = 
        filterStatus === 'all' || 
        (filterStatus === 'active' && purifier.status) || 
        (filterStatus === 'inactive' && !purifier.status);

      // Location filter
      const matchesLocation = 
        filterLocation === '' || 
        purifier.location.area === filterLocation;

      // Date filter - parse the lastUpdated string to a Date object
      const matchesDate = 
        !filterDate || 
        (purifier.lastUpdated && 
         new Date(purifier.lastUpdated).toISOString().split('T')[0] === filterDate);

      return matchesSearch && matchesStatus && matchesLocation && matchesDate;
    });
  }, [purifiers, searchTerm, filterStatus, filterLocation, filterDate]);

  const handlePowerIconClick = (purifier) => {
    setSelectedPurifier(purifier);
    setOpenConfirmModal(true);
  };

  const handleEditIconClick = (purifier) => {
    setSelectedPurifier(purifier);
    setEditedPurifier({ ...purifier });
    setOpenEditModal(true);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for specific fields
    if (name === 'pincode') {
      // Only allow numeric input for pincode
      const numericValue = value.replace(/\D/g, '').slice(0, 6);
      setEditedPurifier(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [name]: numericValue
        }
      }));
    } else if (name === 'phoneNumber') {
      // Only allow numeric input for phone number, limit to 10 digits
      const numericValue = value.replace(/\D/g, '').slice(0, 10);
      setEditedPurifier(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [name]: numericValue
        }
      }));
    } else if (name === 'name' || name === 'id') {
      setEditedPurifier(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      setEditedPurifier(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [name]: value
        }
      }));
    }
  };

  const handleEditStatusToggle = () => {
    setEditedPurifier(prev => ({
      ...prev,
      status: !prev.status
    }));
  };

  const handleUpdatePurifier = () => {
    // Validate inputs
    if (!editedPurifier.id.trim()) {
      alert('Purifier ID cannot be empty');
      return;
    }

    if (editedPurifier.location.pincode && editedPurifier.location.pincode.length !== 6) {
      alert('Pincode must be 6 digits');
      return;
    }

    if (editedPurifier.location.phoneNumber && editedPurifier.location.phoneNumber.length !== 10) {
      alert('Phone number must be 10 digits');
      return;
    }

    // Call update purifier function
    onUpdatePurifier(editedPurifier);
    
    // Close modal
    setOpenEditModal(false);
    setSelectedPurifier(null);
    setEditedPurifier(null);
  };

  const handleConfirmStatusChange = () => {
    if (selectedPurifier) {
      onToggleStatus(selectedPurifier.id);
      setOpenConfirmModal(false);
      setSelectedPurifier(null);
    }
  };

  const handleCloseConfirmModal = () => {
    setOpenConfirmModal(false);
    setSelectedPurifier(null);
  };

  // Safely get button color
  const getButtonColor = (purifier) => {
    if (!purifier) return 'primary';
    return purifier.status ? 'error' : 'primary';
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Purifier Management Dashboard
      </Typography>

      {/* Search and Filter Section */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              variant="outlined"
              label="Search Purifiers"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon />
              }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Status</InputLabel>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                label="Status"
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Location</InputLabel>
              <Select
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                label="Location"
              >
                <MenuItem value="">All Locations</MenuItem>
                {uniqueLocations.map((location) => (
                  <MenuItem key={location} value={location}>
                    {location}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Filter by Last Updated Date"
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              helperText="Show purifiers updated on this date"
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Button 
              fullWidth 
              variant="outlined" 
              color="secondary"
              onClick={() => {
                // Reset all filters
                setSearchTerm('');
                setFilterStatus('all');
                setFilterLocation('');
                setFilterDate('');
              }}
            >
              Reset Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Purifiers Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Purifier ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Last Updated</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPurifiers.map((purifier) => (
              <TableRow key={purifier.id}>
                <TableCell>{purifier.id}</TableCell>
                <TableCell>{purifier.name}</TableCell>
                <TableCell>
                  {purifier.location.houseNoStreet}, 
                  {purifier.location.area}, 
                  {purifier.location.pincode}
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <PhoneIcon fontSize="small" sx={{ mr: 1 }} />
                    {purifier.location.phoneNumber}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={purifier.status ? 'Active' : 'Inactive'}
                    color={purifier.status ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{purifier.lastUpdated}</TableCell>
                <TableCell align="right">
                  <IconButton 
                    onClick={() => handlePowerIconClick(purifier)}
                    color={purifier.status ? 'error' : 'success'}
                  >
                    <PowerIcon />
                  </IconButton>
                  <IconButton 
                onClick={() => handleEditIconClick(purifier)}
                color="primary"
              >
                <EditIcon />
              </IconButton>
              <IconButton 
                onClick={() => onRemovePurifier(purifier.id)}
                color="error"
              >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Existing Confirmation Modal */}
      <Dialog
        open={openConfirmModal}
        onClose={handleCloseConfirmModal}
        aria-labelledby="status-change-dialog-title"
        aria-describedby="status-change-dialog-description"
      >
        <DialogTitle id="status-change-dialog-title">
          {selectedPurifier && (selectedPurifier.status ? "Deactivate" : "Activate")} Purifier
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="status-change-dialog-description">
            Are you sure you want to {selectedPurifier && (selectedPurifier.status ? "deactivate" : "activate")} 
            {" "} the purifier "{selectedPurifier?.name}" (ID: {selectedPurifier?.id})?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmModal} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmStatusChange} 
            color={getButtonColor(selectedPurifier)}
            variant="contained"
          >
            {selectedPurifier && (selectedPurifier.status ? "Deactivate" : "Activate")}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Purifier Details</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ pt: 2 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Purifier ID"
                name="id"
                value={editedPurifier?.id || ''}
                onChange={handleEditInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Customer Name"
                name="name"
                value={editedPurifier?.name || ''}
                onChange={handleEditInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="House No. / Street"
                name="houseNoStreet"
                value={editedPurifier?.location?.houseNoStreet || ''}
                onChange={handleEditInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Area"
                name="area"
                value={editedPurifier?.location?.area || ''}
                onChange={handleEditInputChange}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Pincode"
                name="pincode"
                value={editedPurifier?.location?.pincode || ''}
                onChange={handleEditInputChange}
                required
                inputProps={{
                  maxLength: 6,
                  inputMode: 'numeric',
                  pattern: '[0-9]*'
                }}
                error={editedPurifier?.location?.pincode && editedPurifier.location.pincode.length !== 6}
                helperText={editedPurifier?.location?.pincode && editedPurifier.location.pincode.length !== 6 
                  ? 'Pincode must be 6 digits' 
                  : ''}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phoneNumber"
                value={editedPurifier?.location?.phoneNumber || ''}
                onChange={handleEditInputChange}
                required
                inputProps={{
                  maxLength: 10,
                  inputMode: 'tel',
                  pattern: '[0-9]*'
                }}
                error={editedPurifier?.location?.phoneNumber && editedPurifier.location.phoneNumber.length !== 10}
                helperText={editedPurifier?.location?.phoneNumber && editedPurifier.location.phoneNumber.length !== 10 
                  ? 'Phone number must be 10 digits' 
                  : ''}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={editedPurifier?.status || false}
                    onChange={handleEditStatusToggle}
                    color="primary"
                  />
                }
                label={`Status: ${editedPurifier?.status ? 'Active' : 'Inactive'}`}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditModal(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleUpdatePurifier} color="primary" variant="contained">
            Update Purifier
          </Button>
        </DialogActions>
      </Dialog>

      {/* No Results Handling */}
      {filteredPurifiers.length === 0 && (
        <Box textAlign="center" mt={4}>
          <Typography variant="h6" color="textSecondary">
            No purifiers found matching your search and filter criteria.
          </Typography>
        </Box>
      )}
    </Container>
  );
}

export default Dashboard;