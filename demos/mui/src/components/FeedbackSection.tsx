import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Alert,
  AlertTitle,
  Button,
  Snackbar,
  LinearProgress,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack
} from '@mui/material';

const FeedbackSection: React.FC = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Feedback Components
      </Typography>

      {/* Alerts */}
      <Typography variant="h6" gutterBottom>Alerts</Typography>
      <Box sx={{ mb: 4 }}>
        <Stack spacing={2}>
          <Alert severity="error">This is an error alert — check it out!</Alert>
          <Alert severity="warning">This is a warning alert — check it out!</Alert>
          <Alert severity="info">This is an info alert — check it out!</Alert>
          <Alert severity="success">This is a success alert — check it out!</Alert>
          
          <Alert severity="error" variant="filled">
            <AlertTitle>Error</AlertTitle>
            This is an error alert with title — check it out!
          </Alert>
          <Alert severity="warning" variant="filled">
            <AlertTitle>Warning</AlertTitle>
            This is a warning alert with title — check it out!
          </Alert>

          <Alert severity="success" variant="outlined">Outlined Alert</Alert>
          <Alert severity="info" variant="outlined">Outlined Alert</Alert>

          <Alert 
            severity="success" 
            action={
              <Button color="inherit" size="small">
                UNDO
              </Button>
            }
          >
            Action alert
          </Alert>
        </Stack>
      </Box>

      {/* Snackbars */}
      <Typography variant="h6" gutterBottom>Snackbars</Typography>
      <Box sx={{ mb: 4 }}>
        <Button 
          variant="outlined" 
          onClick={() => setSnackbarOpen(true)}
        >
          Open Snackbar
        </Button>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          message="Note archived"
          action={
            <Button color="inherit" size="small" onClick={() => setSnackbarOpen(false)}>
              UNDO
            </Button>
          }
        />
      </Box>

      {/* Progress Indicators */}
      <Typography variant="h6" gutterBottom>Progress Indicators</Typography>
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" gutterBottom>Linear Progress</Typography>
        <Box sx={{ mb: 2 }}>
          <LinearProgress sx={{ mb: 1 }} />
          <LinearProgress color="secondary" sx={{ mb: 1 }} />
          <LinearProgress color="success" sx={{ mb: 1 }} />
          <LinearProgress variant="determinate" value={75} sx={{ mb: 1 }} />
        </Box>

        <Typography variant="subtitle1" gutterBottom>Circular Progress</Typography>
        <Stack direction="row" spacing={2}>
          <CircularProgress />
          <CircularProgress color="secondary" />
          <CircularProgress color="success" />
          <CircularProgress color="inherit" />
          <CircularProgress variant="determinate" value={75} />
        </Stack>
      </Box>

      {/* Dialogs */}
      <Typography variant="h6" gutterBottom>Dialog</Typography>
      <Box sx={{ mb: 4 }}>
        <Button 
          variant="outlined" 
          onClick={() => setDialogOpen(true)}
        >
          Open Dialog
        </Button>
        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Use Google's location service?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Let Google help apps determine location. This means sending anonymous
              location data to Google, even when no apps are running.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Disagree</Button>
            <Button onClick={() => setDialogOpen(false)} autoFocus>
              Agree
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Paper>
  );
};

export default FeedbackSection;
