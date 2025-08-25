import { useState } from 'react'
import { Typography, Button, Card, CardContent, Chip, Checkbox, FormControlLabel, Radio, RadioGroup, FormControl } from '@mui/material'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div style={{ padding: '2rem' }}>
        <Card elevation={ 0 } >
          <CardContent>
            <Typography variant="h5" component="div" gutterBottom>
              MUI Card Demo
            </Typography>
            <Chip
              label="Error State"
              color="error"
              variant="filled"
              sx={{ mb: 2 }}
            />
            <Typography variant="body1" sx={{ mb: 2 }}>
              You clicked the button {count} times.
            </Typography>
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
            <FormControlLabel
              control={<Checkbox color='warning'/>}
              label="Check me!"
              sx={{ mt: 2 }}
            />
            <FormControl sx={{ mt: 2 }}>
              <RadioGroup defaultValue="a" name="demo-radio-group">
                <FormControlLabel value="a" control={<Radio />} label="Option A" />
                <FormControlLabel value="b" control={<Radio />} label="Option B" />
              </RadioGroup>
            </FormControl>
          </CardContent>
        </Card>
    </div>
  )
}

export default App
