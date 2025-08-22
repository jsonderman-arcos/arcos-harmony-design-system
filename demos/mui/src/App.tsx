import { useState } from 'react'
import { Card, CardContent, Typography, Button } from '@mui/material'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div style={{ padding: '2rem' }}>
    
          <Typography variant="h5" component="div" gutterBottom>
            MUI Card Demo
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            You clicked the button {count} times.
          </Typography>
          <Button variant="contained" onClick={() => setCount(count + 1)}>
            Click Me
          </Button>
       
    </div>
  )
}

export default App
