import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const TypographySection: React.FC = () => {
  return (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Typography
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="h1" gutterBottom>h1. Heading</Typography>
        <Typography variant="h2" gutterBottom>h2. Heading</Typography>
        <Typography variant="h3" gutterBottom>h3. Heading</Typography>
        <Typography variant="h4" gutterBottom>h4. Heading</Typography>
        <Typography variant="h5" gutterBottom>h5. Heading</Typography>
        <Typography variant="h6" gutterBottom>h6. Heading</Typography>
        <Typography variant="subtitle1" gutterBottom>subtitle1. Lorem ipsum dolor sit amet, consectetur adipisicing elit.</Typography>
        <Typography variant="subtitle2" gutterBottom>subtitle2. Lorem ipsum dolor sit amet, consectetur adipisicing elit.</Typography>
        <Typography variant="body1" gutterBottom>body1. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur unde suscipit, quam beatae rerum inventore consectetur.</Typography>
        <Typography variant="body2" gutterBottom>body2. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur unde suscipit, quam beatae rerum inventore consectetur.</Typography>
        <Typography variant="button" display="block" gutterBottom>button text</Typography>
        <Typography variant="caption" display="block" gutterBottom>caption text</Typography>
        <Typography variant="overline" display="block" gutterBottom>overline text</Typography>
      </Box>
    </Paper>
  );
};

export default TypographySection;
