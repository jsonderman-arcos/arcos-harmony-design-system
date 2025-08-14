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
    
    // Check if the tokens file has only metadata and no actual tokens
    const hasOnlyMetadata = Object.keys(modeTokens).length === 1 && modeTokens.metadata;
    
    // Skip this mode if it only has metadata
    if (hasOnlyMetadata) {
      console.log(`Skipping empty color mode: ${modeName} (only contains metadata)`);
      return;
    }
    
    // Combine mode tokens with core tokens for a complete set
    const combinedTokens = { ...coreTokens, ...modeTokens };
    
    // Create a deep clone of the buttonThemeMapping template WITHOUT the colorSchemes property
    let baseTheme = JSON.parse(JSON.stringify(buttonThemeMapping));
    
    // Explicitly remove the colorSchemes property if it exists
    if (baseTheme.colorSchemes !== undefined) {
      delete baseTheme.colorSchemes;
    }
    
    // Process the theme with token replacements
    const modeTheme = processTheme(baseTheme, combinedTokens);
    
    // Double-check to make sure no colorSchemes made it through
    if (modeTheme.colorSchemes !== undefined) {
      delete modeTheme.colorSchemes;
      console.log(`Removed nested colorSchemes from ${modeName} mode`);
    }
    
    // Add to color schemes
    colorSchemes[modeName] = modeTheme;
  });

// Create the final theme.json with all color schemes
// We'll make a clean copy of buttonThemeMapping but exclude its empty colorSchemes
const { colorSchemes: _, ...themeBase } = buttonThemeMapping;
const finalTheme = { 
  ...themeBase,
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
  
  // Remove any colorSchemes property as it shouldn't be nested
  if (processedTheme.colorSchemes !== undefined) {
    delete processedTheme.colorSchemes;
  }
  
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
    let tokenValue = getTokenValue(tokenPath, tokens);
    
    if (tokenValue !== undefined) {
      result = result.replace(match[0], tokenValue);
    } else {
      // If the token is still not found, use the fallback value
      const fallbackValue = getFallbackValue(tokenPath);
      if (fallbackValue !== undefined) {
        result = result.replace(match[0], fallbackValue);
      } else {
        console.warn(`Warning: Token not found for ${match[0]}`);
      }
    }
  }
  
  return result;
}

/**
 * Provides fallback values for known token paths
 * @param {string} path - The token path
 * @returns {string|undefined} - The fallback value or undefined
 */
function getFallbackValue(path) {
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
    'radii.border-radius': '4px',
    'lighthouse.effects.shadow-level-1': 'rgba(0, 0, 0, 0.12)',
    'lighthouse.effects.shadow-level-2': 'rgba(0, 0, 0, 0.14)',
    'lighthouse.effects.shadow-level-3': 'rgba(0, 0, 0, 0.2)',
    'lighthouse.typography.fontfamily-base': 'Arial',
    'lighthouse.typography.fontsize-base': '16px',
    'lighthouse.typography.fontsize-4xl': '48px',
    'lighthouse.typography.fontsize-3xl': '36px',
    'lighthouse.typography.fontsize-2xl': '30px',
    'lighthouse.typography.fontsize-xl': '24px',
    'lighthouse.typography.fontsize-lg': '20px',
    'lighthouse.typography.fontsize-md': '16px',
    'lighthouse.typography.fontsize-sm': '14px',
    'lighthouse.typography.fontweight-light': '300',
    'lighthouse.typography.fontweight-regular': '400',
    'lighthouse.typography.fontweight-medium': '500',
    'lighthouse.typography.fontweight-bold': '700'
  };
  
  return fallbacks[path];
}

/**
 * Gets a token's raw value from a dot-notation path
 * @param {string} path - The dot notation path to the token
 * @param {Object} tokens - The tokens object
 * @returns {string|undefined} - The raw value or undefined if not found
 */
function getTokenValue(path, tokens) {
  const parts = path.split('.');
  
  // Generic function to get token value considering both $rawValue and $value
  function getValueFromToken(token) {
    if (!token || typeof token !== 'object') return undefined;
    
    // Prefer $rawValue if available, otherwise use $value
    if (token.$rawValue !== undefined) {
      return token.$rawValue;
    } else if (token.$value !== undefined) {
      return token.$value;
    }
    return undefined;
  }
  
  // Generic path traversal function
  function traversePath(obj, pathParts) {
    let current = obj;
    for (const part of pathParts) {
      if (!current || typeof current !== 'object') {
        return undefined;
      }
      current = current[part];
    }
    return current;
  }
  
  // Handle special case for Components.button path mapping
  if (path.startsWith('Components.button.')) {
    const buttonProperty = path.replace('Components.button.', '');
    
    // Try to find the token in components.button
    if (tokens.components && tokens.components.button) {
      const token = tokens.components.button[buttonProperty];
      const value = getValueFromToken(token);
      if (value !== undefined) return value;
    }
  }
  
  // Handle lighthouse paths
  if (path.startsWith('lighthouse.')) {
    const token = traversePath(tokens, parts);
    const value = getValueFromToken(token);
    if (value !== undefined) return value;
  }
  
  // Handle Base.primary and other Base paths
  if (path.startsWith('Base.')) {
    const basePath = path.replace('Base.', 'base.');
    const baseParts = basePath.split('.');
    
    // Try to follow the exact path in tokens with lowercase 'base'
    const token = traversePath(tokens, baseParts);
    const value = getValueFromToken(token);
    if (value !== undefined) return value;
    
    // Try to handle states and special cases
    if (baseParts[1] === 'primary' && baseParts[2] === 'states') {
      // Special handling for primary.states paths
      if (tokens.base && tokens.base.primary && tokens.base.primary._states) {
        const stateName = baseParts[3];
        const stateToken = tokens.base.primary._states[stateName];
        const value = getValueFromToken(stateToken);
        if (value !== undefined) return value;
      }
    }
    
    // Handle contrast-text case
    if (baseParts[2] === 'contrast-text') {
      const colorType = baseParts[1]; // primary, secondary, etc.
      if (tokens.base && tokens.base[colorType] && tokens.base[colorType]['on-main']) {
        const token = tokens.base[colorType]['on-main'];
        const value = getValueFromToken(token);
        if (value !== undefined) return value;
      }
    }
  }
  
  // Handle case-insensitive search through tokens
  let foundValue = searchTokensRecursively(tokens, parts);
  if (foundValue) return foundValue;
  
  return undefined;
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
  
  // Helper function to get value from token
  function getTokenValue(token) {
    if (!token) return undefined;
    return token.$rawValue !== undefined ? token.$rawValue : token.$value;
  }
  
  // First try exact match
  if (obj[currentPart]) {
    if (depth === parts.length - 1) {
      const value = getTokenValue(obj[currentPart]);
      if (value !== undefined) return value;
    }
    const result = searchTokensRecursively(obj[currentPart], parts, depth + 1);
    if (result) return result;
  }
  
  // Then try case-insensitive match
  for (const key in obj) {
    if (key.toLowerCase() === lowerCurrentPart) {
      if (depth === parts.length - 1) {
        const value = getTokenValue(obj[key]);
        if (value !== undefined) return value;
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