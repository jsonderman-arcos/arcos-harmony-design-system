import * as React from "react";
import {
  createTheme,
  ThemeProvider,
  CssBaseline,
  Alert,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Checkbox,
  FormControlLabel,
  FormControl,
  FormGroup,
  Radio,
  RadioGroup,
  Select,
  Switch,
  TextField,
  Tabs,
  Tab,
  Snackbar,
  type SnackbarCloseReason,
} from "@mui/material";
// import Grid from '@mui/material/Grid' // No longer needed
import "./App.css";

function App() {
  // Mode Switching functions
  const [mode, setMode] = React.useState<"light" | "dark">("light");
  const theme = createTheme({
    palette: {
      mode,
    },
  });
  const [count, setCount] = React.useState(0);
  const [tab, setTab] = React.useState(0);
  const label = { inputProps: { "aria-label": "Color switch demo" } };

  // Chip Functions
  const handleDelete = () => {
    console.info("You clicked the delete icon.");
  };

  // Snack bar functions
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const handleSnackbarClose = (
    _event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };
React.useEffect(() => {
  setSnackbarOpen(true);
}, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ padding: "2rem" }}>
        <FormControlLabel
          control={
            <Switch
              checked={mode === "dark"}
              onChange={() => setMode(mode === "light" ? "dark" : "light")}
            />
          }
          label="Dark mode"
        />
        <Card elevation={3}>
          <CardContent>
            <Alert
              severity="success"
              variant="filled"
              sx={{ mb: 2 }}
              onClose={() => {}}
            >
              This is an info alert — check it out!
            </Alert>
            <Typography variant="h5" component="div" gutterBottom>
              MUI Card Demo
            </Typography>
            <Chip
              label="Success State"
              color="success"
              variant="filled"
              sx={{ mb: 2 }}
            />
            <Chip
              label="default State"
              color="default"
              variant="filled"
              sx={{ mb: 2 }}
              clickable
              onDelete={handleDelete}
            />
            <TextField
              label="Demo Input"
              variant="outlined"
              required
              fullWidth
              helperText="This is a helper message."
              error={false}
              disabled={false}
              margin="normal"
              placeholder="Enter text..."
              InputLabelProps={{ shrink: true }}
            />
            <Typography variant="body1" sx={{ mb: 2 }}>
              You clicked the button {count} times.
            </Typography>
            {/* Tabs for Checkboxes and Radios */}
            {/*<Paper elevation={5} square={true} sx={{ mb: 2, borderRadius: 0 }}>?*/}
            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
              <Tab label="Checkboxes" value={0} />
              <Tab label="Radios" value={1} />
            </Tabs>
            {/*</Paper>*/}
            {tab === 0 && (
              <>
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <Select defaultValue="" displayEmpty size="small">
                    <option value="" disabled>
                      Select an option
                    </option>
                    <option value="option1">Option 1</option>
                    <option value="option2">Option 2</option>
                    <option value="option3">Option 3</option>
                  </Select>
                </FormControl>
                <FormControlLabel
                  control={<Checkbox />}
                  label="Check me!"
                  sx={{ mt: 2 }}
                />
              </>
            )}
            {tab === 1 && (
              <>
                <Switch {...label} defaultChecked color="secondary" />
                <FormGroup>
                  <FormControlLabel
                    control={<Switch defaultChecked color="warning" />}
                    label="Label"
                  />
                </FormGroup>
                <FormControl>
                  <RadioGroup defaultValue="a" name="demo-radio-group">
                    <FormControlLabel
                      value="a"
                      control={<Radio />}
                      label="Option A"
                    />
                    <FormControlLabel
                      value="b"
                      control={<Radio />}
                      label="Option B"
                    />
                  </RadioGroup>
                </FormControl>
              </>
            )}
            {/* Buttons below Tabs */}
            <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
              <Button variant="contained" onClick={() => setCount(count + 1)}>
                Click Me
              </Button>
             <Button
                variant="contained"
                color="secondary"
                onClick={() => alert("Secondary button clicked")}
              >
                Secondary State
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => alert("Error button clicked")}
              >
                Error State
              </Button>
            </div>
          </CardContent>
        </Card>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        >
          <Alert
            severity="error"
            variant="filled"
            onClose={handleSnackbarClose}
            sx={{ width: "100%" }}
          >
            This is an error alert inside a snackbar!
          </Alert>
        </Snackbar>
      </div>
    </ThemeProvider>
  );
}

export default App;
