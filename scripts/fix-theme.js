/**
 * This script analyzes and fixes the theme.json file by removing
 * any nested colorSchemes objects within individual color modes.
 */

const fs = require('fs');
const path = require('path');

// Define path to theme.json
const themePath = path.join(__dirname, '../themes/theme.json');

// Read the theme file
console.log(`Reading theme file from: ${themePath}`);
const theme = JSON.parse(fs.readFileSync(themePath, 'utf8'));

// Check if there are nested colorSchemes
let nestedSchemesFound = false;

console.log('Analyzing theme structure...');
console.log(`Top level keys: ${Object.keys(theme).join(', ')}`);

if (theme.colorSchemes) {
  console.log(`Found color modes: ${Object.keys(theme.colorSchemes).join(', ')}`);
  
  // Check each color mode for nested colorSchemes
  for (const modeName in theme.colorSchemes) {
    const mode = theme.colorSchemes[modeName];
    
    // Convert to string to check if colorSchemes is present but not detected properly
    const modeString = JSON.stringify(mode);
    console.log(`Checking mode '${modeName}'... Keys: ${Object.keys(mode).join(', ')}`);
    
    if (modeString.includes('"colorSchemes":{}') || modeString.includes('"colorSchemes": {}')) {
      nestedSchemesFound = true;
      console.log(`- Found nested colorSchemes in ${modeName} mode. Removing it.`);
      
      // Create a new object without colorSchemes
      const newMode = {};
      for (const key in mode) {
        if (key !== 'colorSchemes') {
          newMode[key] = mode[key];
        }
      }
      
      // Replace the old mode with the new one
      theme.colorSchemes[modeName] = newMode;
    }
  }
} else {
  console.log('No colorSchemes found at top level. Nothing to fix.');
}

if (nestedSchemesFound) {
  console.log('Writing fixed theme back to file...');
  fs.writeFileSync(themePath, JSON.stringify(theme, null, 2), 'utf8');
  console.log('Theme.json fixed successfully!');
} else {
  console.log('No issues found. Theme.json is already correct.');
}
