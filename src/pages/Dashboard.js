import React, { useState } from 'react';
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
  Button
} from '@mui/material';
import { 
  PowerSettingsNew as PowerIcon, 
  Delete as DeleteIcon 
} from '@mui/icons-material';

function Dashboard({ purifiers, onToggleStatus, onRemovePurifier }) {
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [selectedPurifier, setSelectedPurifier] = useState(null);

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
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Purifier Management Dashboard
      </Typography>
      
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
            {purifiers.map((purifier) => (
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

      {/* Confirmation Modal */}
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
    </Container>
  );
}

export default Dashboard;