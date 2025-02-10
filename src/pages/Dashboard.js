import React from 'react';
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
  Chip
} from '@mui/material';
import { 
  PowerSettingsNew as PowerIcon, 
  Delete as DeleteIcon 
} from '@mui/icons-material';

function Dashboard({ purifiers, onToggleStatus, onRemovePurifier }) {
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
                    onClick={() => onToggleStatus(purifier.id)}
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
    </Container>
  );
}

export default Dashboard;