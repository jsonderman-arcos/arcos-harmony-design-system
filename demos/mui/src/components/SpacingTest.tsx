import React from 'react';
import { Box, Typography, useTheme, Paper } from '@mui/material';

/**
 * This component demonstrates various spacing values,
 * including those with decimal points, to verify the theme's
 * spacing function handles them correctly.
 */
const SpacingTest: React.FC = () => {
  const theme = useTheme();
  
  const spacingValues = [
    { label: '0.5 (Half spacing)', value: 0.5 },
    { label: '1 (Default spacing)', value: 1 },
    { label: '1.5 (One and half spacing)', value: 1.5 },
    { label: '2 (Double spacing)', value: 2 },
    { label: '2.25 (Complex decimal)', value: 2.25 },
    { label: '3 (Triple spacing)', value: 3 },
    { label: '4 (Quadruple spacing)', value: 4 },
  ];
  
  return (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        Spacing Test (including decimal points)
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        This test shows how the theme handles different spacing values, especially those with decimal points.
      </Typography>
      
      {spacingValues.map((item) => (
        <Box key={item.value} sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary">
            {item.label} → {theme.spacing(item.value)}
          </Typography>
          <Box 
            sx={{
              height: '24px',
              width: theme.spacing(item.value),
              bgcolor: 'primary.main',
              mt: 1,
            }}
          />
        </Box>
      ))}
    </Paper>
  );
};

export default SpacingTest;
