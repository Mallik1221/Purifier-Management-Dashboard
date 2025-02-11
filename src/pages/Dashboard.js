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
  Box
} from '@mui/material';
import { 
  PowerSettingsNew as PowerIcon, 
  Delete as DeleteIcon,
  Search as SearchIcon
} from '@mui/icons-material';

function Dashboard({ purifiers, onToggleStatus, onRemovePurifier }) {
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [selectedPurifier, setSelectedPurifier] = useState(null);
  
  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterDate, setFilterDate] = useState('');

  // Get unique locations for filter dropdown
  const uniqueLocations = useMemo(() => {
    return [...new Set(purifiers.map(p => p.location))];
  }, [purifiers]);

  // Filtered and Searched Purifiers
  const filteredPurifiers = useMemo(() => {
    return purifiers.filter(purifier => {
      // Search filter
      const matchesSearch = 
        searchTerm === '' || 
        purifier.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        purifier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        purifier.location.toLowerCase().includes(searchTerm.toLowerCase());

      // Status filter
      const matchesStatus = 
        filterStatus === 'all' || 
        (filterStatus === 'active' && purifier.status) || 
        (filterStatus === 'inactive' && !purifier.status);

      // Location filter
      const matchesLocation = 
        filterLocation === '' || 
        purifier.location === filterLocation;

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
              <TableCell>Location</TableCell>
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
                <TableCell>{purifier.location}</TableCell>
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