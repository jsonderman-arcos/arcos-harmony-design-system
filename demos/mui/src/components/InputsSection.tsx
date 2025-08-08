import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  TextField, 
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  FormControlLabel,
  Checkbox,
  Switch,
  Radio,
  RadioGroup,
  FormGroup,
  FormLabel,
  Stack,
  Slider,
  InputAdornment,
  Autocomplete
} from '@mui/material';
import { Search } from '@mui/icons-material';

const InputsSection: React.FC = () => {
  const [value, setValue] = useState('');
  const [selectValue, setSelectValue] = useState('');
  const [sliderValue, setSliderValue] = useState<number>(50);

  const top100Films = [
    { title: 'The Shawshank Redemption', year: 1994 },
    { title: 'The Godfather', year: 1972 },
    { title: 'The Godfather: Part II', year: 1974 },
    { title: 'The Dark Knight', year: 2008 },
    { title: '12 Angry Men', year: 1957 }
  ];
  
  return (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Form Controls
      </Typography>

      {/* Text Fields */}
      <Typography variant="h6" gutterBottom>Text Fields</Typography>
      <Box sx={{ mb: 4 }}>
        <Stack spacing={2}>
          <TextField label="Standard" variant="outlined" />
          <TextField label="With Helper Text" helperText="Helper text" variant="outlined" />
          <TextField label="Required" required variant="outlined" />
          <TextField label="Disabled" disabled variant="outlined" />
          <TextField label="Error" error helperText="Error message" variant="outlined" />
          <TextField label="With Default Value" defaultValue="Default Text" variant="outlined" />
          <TextField label="Password" type="password" variant="outlined" />
          <TextField
            label="With Icon"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            variant="outlined"
          />
          <TextField label="Multiline" multiline rows={4} variant="outlined" />
        </Stack>
      </Box>

      {/* Select Fields */}
      <Typography variant="h6" gutterBottom>Select</Typography>
      <Box sx={{ mb: 4 }}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Select Option</InputLabel>
          <Select
            value={selectValue}
            onChange={(e) => setSelectValue(e.target.value as string)}
            label="Select Option"
          >
            <MenuItem value=""><em>None</em></MenuItem>
            <MenuItem value="option1">Option 1</MenuItem>
            <MenuItem value="option2">Option 2</MenuItem>
            <MenuItem value="option3">Option 3</MenuItem>
          </Select>
          <FormHelperText>Helper text</FormHelperText>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }} disabled>
          <InputLabel>Disabled</InputLabel>
          <Select
            value=""
            label="Disabled"
          >
            <MenuItem value="option1">Option 1</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth error>
          <InputLabel>Error</InputLabel>
          <Select
            value=""
            label="Error"
          >
            <MenuItem value="option1">Option 1</MenuItem>
          </Select>
          <FormHelperText>Error message</FormHelperText>
        </FormControl>
      </Box>

      {/* Autocomplete */}
      <Typography variant="h6" gutterBottom>Autocomplete</Typography>
      <Box sx={{ mb: 4 }}>
        <Autocomplete
          options={top100Films}
          getOptionLabel={(option) => option.title}
          renderInput={(params) => <TextField {...params} label="Movie" />}
          sx={{ mb: 2 }}
        />
        <Autocomplete
          multiple
          options={top100Films}
          getOptionLabel={(option) => option.title}
          renderInput={(params) => <TextField {...params} label="Multiple Movies" />}
        />
      </Box>

      {/* Checkboxes */}
      <Typography variant="h6" gutterBottom>Checkboxes</Typography>
      <Box sx={{ mb: 4 }}>
        <FormGroup>
          <FormControlLabel control={<Checkbox />} label="Default" />
          <FormControlLabel control={<Checkbox defaultChecked />} label="Checked" />
          <FormControlLabel disabled control={<Checkbox />} label="Disabled" />
          <FormControlLabel disabled control={<Checkbox defaultChecked />} label="Disabled Checked" />
        </FormGroup>
      </Box>

      {/* Radio Buttons */}
      <Typography variant="h6" gutterBottom>Radio Buttons</Typography>
      <Box sx={{ mb: 4 }}>
        <FormControl component="fieldset">
          <FormLabel component="legend">Gender</FormLabel>
          <RadioGroup
            row
            name="gender"
            defaultValue="female"
            onChange={(e) => setValue(e.target.value)}
          >
            <FormControlLabel value="female" control={<Radio />} label="Female" />
            <FormControlLabel value="male" control={<Radio />} label="Male" />
            <FormControlLabel value="other" control={<Radio />} label="Other" />
            <FormControlLabel value="disabled" disabled control={<Radio />} label="Disabled" />
          </RadioGroup>
        </FormControl>
      </Box>

      {/* Switches */}
      <Typography variant="h6" gutterBottom>Switches</Typography>
      <Box sx={{ mb: 4 }}>
        <FormGroup>
          <FormControlLabel control={<Switch />} label="Default" />
          <FormControlLabel control={<Switch defaultChecked />} label="Checked" />
          <FormControlLabel disabled control={<Switch />} label="Disabled" />
          <FormControlLabel disabled control={<Switch defaultChecked />} label="Disabled Checked" />
        </FormGroup>
      </Box>

      {/* Sliders */}
      <Typography variant="h6" gutterBottom>Sliders</Typography>
      <Box sx={{ mb: 4, width: '100%', maxWidth: 500 }}>
        <Slider
          value={sliderValue}
          onChange={(e, newValue) => setSliderValue(newValue as number)}
          aria-labelledby="continuous-slider"
          valueLabelDisplay="auto"
          sx={{ mb: 2 }}
        />
        
        <Slider
          defaultValue={30}
          step={10}
          marks
          min={0}
          max={100}
          valueLabelDisplay="on"
          sx={{ mb: 2 }}
        />

        <Slider
          disabled
          defaultValue={30}
          sx={{ mb: 2 }}
        />
        
        <Typography gutterBottom>Temperature</Typography>
        <Slider
          defaultValue={20}
          getAriaValueText={(value) => `${value}°C`}
          valueLabelDisplay="auto"
          step={10}
          marks
          min={0}
          max={100}
        />
      </Box>
    </Paper>
  );
};

export default InputsSection;
