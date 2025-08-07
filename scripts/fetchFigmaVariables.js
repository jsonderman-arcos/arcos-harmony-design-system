// fetchFigmaVariables.js
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const axios = require('axios');
const fs = require('fs');

// Get environment variables
const FIGMA_PERSONAL_ACCESS_TOKEN = process.env.FIGMA_PERSONAL_ACCESS_TOKEN;
const FIGMA_FILE_KEY = process.env.FIGMA_FILE_KEY;

// Define the API URL
const API_URL = `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}/variables/local`;

// Ensure we have the required environment variables
if (!FIGMA_PERSONAL_ACCESS_TOKEN || !FIGMA_FILE_KEY) {
  console.error('Missing required environment variables. Make sure FIGMA_PERSONAL_ACCESS_TOKEN and FIGMA_FILE_KEY are set in your .env file.');
  process.exit(1);
}

async function fetchFigmaVariables() {
  try {
    console.log('Fetching Figma variables...');
    
    // Make the API request
    const response = await axios.get(API_URL, {
      headers: {
        'X-Figma-Token': FIGMA_PERSONAL_ACCESS_TOKEN
      }
    });
    
    // Save the raw response - updated to use path from script directory
    const outputPath = path.join(__dirname, '..', 'variables', 'figma-variables-raw.json');
    fs.writeFileSync(outputPath, JSON.stringify(response.data, null, 2));
    
    console.log(`Successfully saved Figma variables to ${outputPath}`);
    
    // Print some stats about what we fetched
    const variablesCount = Object.keys(response.data.variables || {}).length;
    const collectionsCount = Object.keys(response.data.meta?.variableCollections || {}).length;
    
    console.log(`Retrieved ${variablesCount} variables across ${collectionsCount} collections.`);
    
    return response.data;
  } catch (error) {
    console.error('Error fetching Figma variables:');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error('Response:', error.response.data);
    } else {
      console.error(error.message);
    }
    process.exit(1);
  }
}

// Run the function
fetchFigmaVariables();
