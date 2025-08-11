/**
 * Convert Figma Variables to Style Dictionary Format
 * 
 * This script takes Figma variables raw data and converts it to a format
 * that can be used with Style Dictionary to generate design tokens for
 * various platforms.
 */

const fs = require('fs');
const path = require('path');
const sdTransforms = require('@tokens-studio/sd-transforms');
const StyleDictionary = require('style-dictionary');

// Path configuration
const CONFIG = {
  // Input path for Figma variables
  inputPath: path.join(__dirname, '..', 'variables', 'figma-variables-raw.json'),
  // Output directory for Style Dictionary files
  outputDir: path.join(__dirname, '..', 'tokens-sd'),
  // Build directory for compiled tokens
  buildDir: path.join(__dirname, '..', 'build')
};

// Create output directories if they don't exist
[CONFIG.outputDir, CONFIG.buildDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

// Load Figma variables data
console.log(`Loading Figma variables from ${CONFIG.inputPath}`);
const figmaData = JSON.parse(fs.readFileSync(CONFIG.inputPath, 'utf8'));

/**
 * Convert Figma variable collections and variables to Style Dictionary tokens
 */
function convertFigmaToStyleDictionary(figmaData) {
  const tokens = {};
  const collections = {};
  const modes = {};
  
  // Process variable collections and create mode mappings
  if (figmaData.meta && figmaData.meta.variableCollections) {
    Object.values(figmaData.meta.variableCollections).forEach(collection => {
      collections[collection.id] = {
        name: collection.name,
        modes: collection.modes.reduce((acc, mode) => {
          acc[mode.modeId] = mode.name;
          
          // Track unique modes
          if (!modes[mode.name]) {
            modes[mode.name] = [];
          }
          modes[mode.name].push({
            collectionId: collection.id,
            collectionName: collection.name,
            modeId: mode.modeId
          });
          
          return acc;
        }, {})
      };
    });
  }
  
  // Process variables and organize them by mode
  if (figmaData.meta && figmaData.meta.variables) {
    // Create core tokens object (shared across modes)
    const coreTokens = {};
    
    // Create mode-specific token objects
    const modeTokens = {};
    Object.keys(modes).forEach(mode => {
      modeTokens[mode] = {};
    });
    
    // Process each variable
    Object.values(figmaData.meta.variables).forEach(variable => {
      const collectionId = variable.variableCollectionId;
      const collection = collections[collectionId];
      
      if (!collection) return;
      
      // Skip hidden variables if needed
      if (variable.hiddenFromPublishing) return;
      
      // Create token path based on variable name
      const tokenPath = variable.name.split('/');
      const tokenName = tokenPath.pop();
      
      // Process values for each mode
      Object.entries(variable.valuesByMode).forEach(([modeId, value]) => {
        const modeName = collection.modes[modeId];
        if (!modeName) return;
        
        // Determine if this should go into core tokens (if value is same across all modes)
        // For simplicity in this example, we'll put all tokens in mode-specific files
        let targetTokens = modeTokens[modeName];
        
        // Create nested structure
        let current = targetTokens;
        tokenPath.forEach(segment => {
          if (!current[segment]) {
            current[segment] = {};
          }
          current = current[segment];
        });
        
        // Set the token value
        // Process value based on variable type
        switch(variable.resolvedType) {
          case 'COLOR':
            // Format color values properly for Style Dictionary
            if (typeof value === 'string' && value.startsWith('#')) {
              current[tokenName] = { value: value };
            } else if (value && typeof value === 'object' && value.r !== undefined) {
              // Convert RGBA object to hex or rgba string
              const { r, g, b, a = 1 } = value;
              const rgba = `rgba(${r}, ${g}, ${b}, ${a})`;
              current[tokenName] = { value: rgba };
            }
            break;
          case 'FLOAT':
          case 'NUMBER':
            current[tokenName] = { value: Number(value) };
            break;
          default:
            // Handle other types (STRING, BOOLEAN, etc.)
            current[tokenName] = { value: value };
        }
        
        // Add metadata
        if (current[tokenName]) {
          current[tokenName].type = variable.resolvedType.toLowerCase();
          current[tokenName].description = variable.description || `${modeName} ${tokenName}`;
        }
      });
    });
    
    // Assign processed tokens to the main tokens object
    tokens.core = coreTokens;
    Object.keys(modeTokens).forEach(mode => {
      tokens[mode.toLowerCase().replace(/\s+/g, '-')] = modeTokens[mode];
    });
  }
  
  return tokens;
}

// Convert Figma variables to Style Dictionary tokens
const tokens = convertFigmaToStyleDictionary(figmaData);

// Write each mode's tokens to separate files
Object.entries(tokens).forEach(([mode, modeTokens]) => {
  const outputPath = path.join(CONFIG.outputDir, `${mode}-tokens.json`);
  fs.writeFileSync(outputPath, JSON.stringify(modeTokens, null, 2));
  console.log(`Generated ${mode} tokens: ${outputPath}`);
});

// Create Style Dictionary config
const styleDictionaryConfig = {
  source: [path.join(CONFIG.outputDir, '*.json')],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: path.join(CONFIG.buildDir, 'css/'),
      files: [{
        destination: 'variables.css',
        format: 'css/variables'
      }]
    },
    scss: {
      transformGroup: 'scss',
      buildPath: path.join(CONFIG.buildDir, 'scss/'),
      files: [{
        destination: '_variables.scss',
        format: 'scss/variables'
      }]
    },
    js: {
      transformGroup: 'js',
      buildPath: path.join(CONFIG.buildDir, 'js/'),
      files: [{
        destination: 'variables.js',
        format: 'javascript/es6'
      }]
    }
  }
};

// Write Style Dictionary config
const configPath = path.join(CONFIG.outputDir, 'config.json');
fs.writeFileSync(configPath, JSON.stringify(styleDictionaryConfig, null, 2));
console.log(`Generated Style Dictionary config: ${configPath}`);

// Register tokens-studio transforms (if needed)
if (typeof sdTransforms.registerTransforms === 'function') {
  console.log('Registering tokens-studio transforms');
  sdTransforms.registerTransforms(StyleDictionary);
}

// Build Style Dictionary
console.log('Building Style Dictionary...');
const styleDictionary = StyleDictionary.extend(styleDictionaryConfig);
styleDictionary.buildAllPlatforms();
console.log('Style Dictionary build complete!');

console.log(`\nOutput files can be found in:`);
console.log(`- Style Dictionary Tokens: ${CONFIG.outputDir}`);
console.log(`- Generated Files: ${CONFIG.buildDir}`);
