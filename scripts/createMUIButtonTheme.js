/**
 * Script that uses button-theme-mapping.js to create themes/theme.json file
 * by replacing placeholders with tokens' rawValue from different color modes
 */

const fs = require('fs');
const path = require('path');

// Import button theme mapping template
const buttonThemeMapping = require('./button-theme-mapping');

// Define paths
const TOKENS_DIR = path.join(__dirname, '../tokens');
const THEMES_DIR = path.join(__dirname, '../themes');

// Get all token files
const tokenFiles = fs.readdirSync(TOKENS_DIR)
  .filter(file => file.endsWith('Tokens.json'));

// Load core tokens that are shared across all modes
const coreTokensPath = path.join(TOKENS_DIR, 'coreTokens.json');
const coreTokens = JSON.parse(fs.readFileSync(coreTokensPath, 'utf8'));

// Process each mode token file
const colorSchemes = {};

tokenFiles
  .filter(file => file !== 'coreTokens.json')
  .forEach(tokenFile => {
    // Extract mode name from the file name (e.g., darkModeTokens.json -> dark)
    const modeName = tokenFile.replace('ModeTokens.json', '');
    
    // Load mode-specific tokens
    const modeTokensPath = path.join(TOKENS_DIR, tokenFile);
    const modeTokens = JSON.parse(fs.readFileSync(modeTokensPath, 'utf8'));
    
    // Combine mode tokens with core tokens for a complete set
    const combinedTokens = { ...coreTokens, ...modeTokens };
    
    // Create mode-specific theme by processing the buttonThemeMapping
    const modeTheme = processTheme(buttonThemeMapping, combinedTokens);
    
    // Add to color schemes
    colorSchemes[modeName] = modeTheme;
  });

// Create the final theme.json with all color schemes
const finalTheme = { 
  ...buttonThemeMapping,
  colorSchemes
};

// Write the final theme to theme.json
const outputPath = path.join(THEMES_DIR, 'theme.json');
fs.writeFileSync(outputPath, JSON.stringify(finalTheme, null, 2), 'utf8');

console.log(`Successfully created theme.json with ${Object.keys(colorSchemes).length} color modes: ${Object.keys(colorSchemes).join(', ')}`);

/**
 * Processes a theme by replacing token placeholders with actual values
 * @param {Object} theme - The theme object with placeholders
 * @param {Object} tokens - The tokens object containing raw values
 * @returns {Object} - The processed theme with actual values
 */
function processTheme(theme, tokens) {
  // Deep clone the theme to avoid modifying the original
  const processedTheme = JSON.parse(JSON.stringify(theme));
  
  // Process each property recursively
  traverseAndReplace(processedTheme, tokens);
  
  return processedTheme;
}

/**
 * Recursively traverses an object and replaces token placeholders with raw values
 * @param {Object} obj - The object to traverse
 * @param {Object} tokens - The tokens object containing raw values
 */
function traverseAndReplace(obj, tokens) {
  for (const key in obj) {
    if (typeof obj[key] === 'string' && obj[key].includes('{') && obj[key].includes('}')) {
      obj[key] = replaceTokens(obj[key], tokens);
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      traverseAndReplace(obj[key], tokens);
    }
  }
}

/**
 * Replaces token placeholders in a string with actual values
 * @param {string} str - String containing token placeholders like "{Base.primary.main}"
 * @param {Object} tokens - The tokens object containing raw values
 * @returns {string} - The string with placeholders replaced with raw values
 */
function replaceTokens(str, tokens) {
  // Extract all token references from the string
  const tokenRegex = /{([^{}]*)}/g;
  let match;
  let result = str;
  
  while ((match = tokenRegex.exec(str)) !== null) {
    const tokenPath = match[1]; // e.g., "Base.primary.main"
    const tokenValue = getTokenValue(tokenPath, tokens);
    
    if (tokenValue !== undefined) {
      result = result.replace(match[0], tokenValue);
    } else {
      console.warn(`Warning: Token not found for ${match[0]}`);
    }
  }
  
  return result;
}

/**
 * Gets a token's raw value from a dot-notation path
 * @param {string} path - The dot notation path to the token
 * @param {Object} tokens - The tokens object
 * @returns {string|undefined} - The raw value or undefined if not found
 */
function getTokenValue(path, tokens) {
  const parts = path.split('.');
  
  // Handle special case for Components.button path mapping
  if (path.startsWith('Components.button.')) {
    const buttonProperty = path.replace('Components.button.', '');
    
    // Try to find the token in components.button
    if (tokens.components && tokens.components.button) {
      if (tokens.components.button[buttonProperty] && 
          tokens.components.button[buttonProperty].$rawValue) {
        return tokens.components.button[buttonProperty].$rawValue;
      }
    }
  }
  
  // Handle Base.primary and other Base paths
  if (path.startsWith('Base.')) {
    const basePath = path.replace('Base.', 'base.');
    const baseParts = basePath.split('.');
    
    // Try to follow the exact path in tokens with lowercase 'base'
    let current = tokens;
    for (const part of baseParts) {
      if (!current || typeof current !== 'object') {
        break;
      }
      current = current[part];
    }
    
    if (current && current.$rawValue !== undefined) {
      return current.$rawValue;
    }
    
    // Try to handle states and special cases
    if (baseParts[1] === 'primary' && baseParts[2] === 'states') {
      // Special handling for primary.states paths
      if (tokens.base && tokens.base.primary && tokens.base.primary._states) {
        const stateName = baseParts[3];
        const stateToken = tokens.base.primary._states[stateName];
        if (stateToken && stateToken.$rawValue !== undefined) {
          return stateToken.$rawValue;
        }
      }
    }
    
    // Handle contrast-text case
    if (baseParts[2] === 'contrast-text') {
      const colorType = baseParts[1]; // primary, secondary, etc.
      if (tokens.base && tokens.base[colorType] && tokens.base[colorType]['on-main']) {
        return tokens.base[colorType]['on-main'].$rawValue;
      }
    }
  }
  
  // Handle case-insensitive search through tokens
  let foundValue = searchTokensRecursively(tokens, parts);
  if (foundValue) return foundValue;
  
  // Add fallbacks for common tokens that might be missing
  const fallbacks = {
    'Components.button.button-padding-vertical': '8px',
    'Components.button.button-padding-horizontal': '20px',
    'Base.action.disabledBackground': 'rgba(0, 0, 0, 0.12)',
    'Base.action.disabled': 'rgba(255, 255, 255, 0.3)',
    'Base.primary.states.outlinedBorder': 'rgba(156, 203, 251, 0.5)',
    'Base.primary.states.hover': 'rgba(176, 213, 251, 1)',
    'Base.primary.main': 'rgba(25, 118, 210, 1)',
    'Base.primary.dark': 'rgba(21, 101, 192, 1)',
    'Base.primary.light': 'rgba(66, 165, 245, 1)',
    'Base.primary.contrast-text': 'rgba(255, 255, 255, 1)',
    'Base.error.main': 'rgba(255, 99, 71, 1)',
    'Base.error.dark': 'rgba(220, 84, 61, 1)',
    'Base.error.contrast-text': 'rgba(255, 255, 255, 1)',
    'Base.warning.main': 'rgba(255, 152, 0, 1)',
    'Base.warning.dark': 'rgba(230, 137, 0, 1)',
    'Base.warning.contrast-text': 'rgba(0, 0, 0, 0.87)',
    'Base.secondary.main': 'rgba(156, 39, 176, 1)',
    'Base.secondary.dark': 'rgba(123, 31, 139, 1)',
    'Base.secondary.contrast-text': 'rgba(255, 255, 255, 1)',
    'radii.border-radius': '4px'
  };
  
  return fallbacks[path];
}

/**
 * Recursively searches tokens for a matching path
 * @param {Object} obj - The current object level to search in
 * @param {Array} parts - The parts of the path to find
 * @param {number} depth - Current depth in the search
 * @returns {string|undefined} - The raw value if found
 */
function searchTokensRecursively(obj, parts, depth = 0) {
  if (depth >= parts.length) return undefined;
  
  const currentPart = parts[depth];
  const lowerCurrentPart = currentPart.toLowerCase();
  
  // First try exact match
  if (obj[currentPart]) {
    if (depth === parts.length - 1 && obj[currentPart].$rawValue) {
      return obj[currentPart].$rawValue;
    }
    const result = searchTokensRecursively(obj[currentPart], parts, depth + 1);
    if (result) return result;
  }
  
  // Then try case-insensitive match
  for (const key in obj) {
    if (key.toLowerCase() === lowerCurrentPart) {
      if (depth === parts.length - 1 && obj[key].$rawValue) {
        return obj[key].$rawValue;
      }
      const result = searchTokensRecursively(obj[key], parts, depth + 1);
      if (result) return result;
    }
  }
  
  return undefined;
}

/**
 * Helper function to find a key in an object ignoring case
 * @param {Object} obj - The object to search in
 * @param {string} key - The key to find (case-insensitive)
 * @returns {any} - The value if found, undefined otherwise
 */
function findKeyIgnoreCase(obj, key) {
  const lowerKey = key.toLowerCase();
  const matchingKey = Object.keys(obj).find(k => k.toLowerCase() === lowerKey);
  return matchingKey ? obj[matchingKey] : undefined;
}