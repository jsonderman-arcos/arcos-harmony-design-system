import { useState } from 'react'
import {
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
  Tab
} from '@mui/material'
// import Grid from '@mui/material/Grid' // No longer needed
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [tab, setTab] = useState(0)
  const label = { inputProps: { 'aria-label': 'Color switch demo' } };

  return (
    <div style={{ padding: '2rem' }}>
        <Card elevation={ 3 } >
          <CardContent>
            <Typography variant="h5" component="div" gutterBottom>
              MUI Card Demo
            </Typography>
            <Chip
              label="Success State"
              color="success"
              variant="filled"
              sx={{ mb: 2 }}
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
                <FormControlLabel control={<Switch defaultChecked color="warning"/>} label="Label" />
              </FormGroup>
              <FormControl>
                <RadioGroup defaultValue="a" name="demo-radio-group">
                  <FormControlLabel value="a" control={<Radio />} label="Option A" />
                  <FormControlLabel value="b" control={<Radio />} label="Option B" />
                </RadioGroup>
              </FormControl>
              </>
            )}
            {/* Buttons below Tabs */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <Button variant="contained" onClick={() => setCount(count + 1)}>
                Click Me
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => alert('Secondary button clicked')}
              >
                Secondary Action
              </Button>
            </div>
          </CardContent>
        </Card>
    </div>
  )
}

export default App
