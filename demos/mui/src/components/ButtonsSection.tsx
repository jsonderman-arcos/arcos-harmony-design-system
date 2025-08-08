import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  IconButton, 
  ButtonGroup, 
  Stack 
} from '@mui/material';
import { Add as AddIcon, Delete, Edit, Save } from '@mui/icons-material';

const ButtonsSection: React.FC = () => {
  return (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Buttons
      </Typography>

      {/* Standard Buttons */}
      <Typography variant="h6" gutterBottom>Standard Buttons</Typography>
      <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
        <Button variant="contained">Contained</Button>
        <Button variant="outlined">Outlined</Button>
        <Button variant="text">Text</Button>
      </Stack>

      {/* Button Colors */}
      <Typography variant="h6" gutterBottom>Button Colors</Typography>
      <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
        <Button variant="contained" color="primary">Primary</Button>
        <Button variant="contained" color="secondary">Secondary</Button>
        <Button variant="contained" color="success">Success</Button>
        <Button variant="contained" color="error">Error</Button>
        <Button variant="contained" color="warning">Warning</Button>
        <Button variant="contained" color="info">Info</Button>
      </Stack>

      {/* Button Sizes */}
      <Typography variant="h6" gutterBottom>Button Sizes</Typography>
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Button variant="contained" size="small">Small</Button>
          <Button variant="contained" size="medium">Medium</Button>
          <Button variant="contained" size="large">Large</Button>
        </Stack>
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" size="small">Small</Button>
          <Button variant="outlined" size="medium">Medium</Button>
          <Button variant="outlined" size="large">Large</Button>
        </Stack>
      </Box>

      {/* Button with Icons */}
      <Typography variant="h6" gutterBottom>Buttons with Icons</Typography>
      <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
        <Button variant="contained" startIcon={<AddIcon />}>Add</Button>
        <Button variant="contained" endIcon={<Save />}>Save</Button>
        <Button variant="outlined" startIcon={<Delete />}>Delete</Button>
        <Button variant="outlined" endIcon={<Edit />}>Edit</Button>
      </Stack>

      {/* Icon Buttons */}
      <Typography variant="h6" gutterBottom>Icon Buttons</Typography>
      <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
        <IconButton color="primary" aria-label="add">
          <AddIcon />
        </IconButton>
        <IconButton color="secondary" aria-label="edit">
          <Edit />
        </IconButton>
        <IconButton color="error" aria-label="delete">
          <Delete />
        </IconButton>
      </Stack>

      {/* Button Groups */}
      <Typography variant="h6" gutterBottom>Button Groups</Typography>
      <Box sx={{ mb: 4 }}>
        <ButtonGroup variant="contained" sx={{ mb: 2 }}>
          <Button>One</Button>
          <Button>Two</Button>
          <Button>Three</Button>
        </ButtonGroup>
        <br />
        <ButtonGroup variant="outlined">
          <Button>One</Button>
          <Button>Two</Button>
          <Button>Three</Button>
        </ButtonGroup>
      </Box>

      {/* Disabled Buttons */}
      <Typography variant="h6" gutterBottom>Disabled Buttons</Typography>
      <Stack direction="row" spacing={2}>
        <Button variant="contained" disabled>Disabled</Button>
        <Button variant="outlined" disabled>Disabled</Button>
        <Button variant="text" disabled>Disabled</Button>
      </Stack>
    </Paper>
  );
};

export default ButtonsSection;
