// analyzeVariables.js
const fs = require('fs');
const path = require('path');

// Load the raw Figma variables data
const rawDataPath = path.join(__dirname, 'variables', 'figma-variables-raw.json');
const rawData = JSON.parse(fs.readFileSync(rawDataPath, 'utf8'));

// Function to analyze and extract modes from collections
function analyzeModes() {
  const collections = rawData.meta?.variableCollections || {};
  const collectionsInfo = [];
  
  console.log('\n====== FIGMA VARIABLE COLLECTIONS AND MODES ======\n');
  
  // Loop through each collection
  for (const [collectionId, collection] of Object.entries(collections)) {
    const collectionInfo = {
      id: collectionId,
      name: collection.name,
      modes: collection.modes.map(mode => ({ id: mode.modeId, name: mode.name }))
    };
    
    collectionsInfo.push(collectionInfo);
    
    console.log(`Collection: ${collection.name}`);
    console.log('Modes:');
    collection.modes.forEach(mode => {
      console.log(`  - ${mode.name} (ID: ${mode.modeId})`);
    });
    console.log(''); // Empty line for readability
  }
  
  return collectionsInfo;
}

// Function to count variables by type
function analyzeVariableTypes() {
  const variables = rawData.variables || {};
  const typeCount = {};
  
  for (const [variableId, variable] of Object.entries(variables)) {
    const type = variable.resolvedType;
    typeCount[type] = (typeCount[type] || 0) + 1;
  }
  
  console.log('\n====== VARIABLE TYPES COUNT ======\n');
  for (const [type, count] of Object.entries(typeCount)) {
    console.log(`${type}: ${count} variables`);
  }
}

// Function to show some sample variable names (to understand the naming structure)
function analyzeSampleVariableNames() {
  const variables = rawData.variables || {};
  const variableIds = Object.keys(variables);
  
  // Get a sample of variables (first 10 or less)
  const sampleSize = Math.min(10, variableIds.length);
  const sampleIds = variableIds.slice(0, sampleSize);
  
  console.log('\n====== SAMPLE VARIABLE NAMES ======\n');
  sampleIds.forEach(id => {
    const variable = variables[id];
    console.log(`Name: ${variable.name} (Type: ${variable.resolvedType})`);
  });
}

// Run the analysis
const collections = analyzeModes();
analyzeVariableTypes();
analyzeSampleVariableNames();

// Save the collections info for future reference
const collectionsPath = path.join(__dirname, 'variables', 'figma-collections-modes.json');
fs.writeFileSync(collectionsPath, JSON.stringify(collections, null, 2));
console.log(`\nSaved collections and modes info to ${collectionsPath}`);
