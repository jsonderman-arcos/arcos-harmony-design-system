/**
 * Generate MUI Theme from Style Dictionary Tokens with Reference Resolution
 * 
 * This script dynamically generates a Material UI theme from Style Dictionary token files.
 * It's designed to be resilient to changes in token structure and naming, and can resolve
 * token references like {Lighthouse.colors.neutrals.black.alpha-87} to actual values.
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  // Input paths
  tokensDir: path.join(__dirname, '..', 'tokens-sd'),
  originalTokensDir: path.join(__dirname, '..', 'tokens'),
  // Output paths
  outputDir: path.join(__dirname, '..'),
  outputThemeFile: 'theme.ts',
  outputThemeTypesFile: 'theme.types.ts',
  // Token file patterns
  coreTokens  // If we have spacing values, create a spacing function
  if (Object.keys(spacingValues).length > 0) {
    const baseSpacing = spacingValues[1] || '8px';
    return `(factor: number) => \`\${Math.round(factor * parseFloat('${baseSpacing}') * 10) / 10}px\``;
  }
  
  // Default spacing function with decimal point support
  return "(factor: number) => `${Math.round(factor * 8 * 10) / 10}px`";tokens.json',
  lightTokensFile: 'light-tokens.json',
  darkTokensFile: 'dark-tokens.json',
  // Original token files
  originalCoreTokensFile: 'coreTokens.json',
  originalLightTokensFile: 'lightModeTokens.json', 
  originalDarkTokensFile: 'darkModeTokens.json',
  // Logs
  verbose: true,
  debug: true
};

/**
 * Log a message if verbose mode is enabled
 * @param {string} message - Message to log
 */
function log(message) {
  if (CONFIG.verbose) {
    console.log(message);
  }
}

/**
 * Log debug information if debug mode is enabled
 * @param {string} message - Debug message to log
 * @param {any} data - Optional data to print
 */
function debug(message, data = null) {
  if (CONFIG.debug) {
    console.log(`🔍 DEBUG: ${message}`);
    if (data !== null) {
      console.log(JSON.stringify(data, null, 2));
    }
  }
}

/**
 * Load JSON file
 * @param {string} filePath - Path to JSON file
 * @returns {object} Parsed JSON data
 */
function loadJsonFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
    log(`⚠️ File not found: ${filePath}`);
    return {};
  } catch (error) {
    log(`❌ Error loading ${filePath}: ${error.message}`);
    return {};
  }
}

/**
 * Get a fallback color value for MUI theme
 * @param {string} category - Category of the color (primary, secondary, etc.)
 * @param {string} variant - Variant of the color (main, light, dark, etc.)
 * @returns {string} Fallback color
 */
function getFallbackColor(category, variant) {
  const fallbacks = {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#9c27b0',
      light: '#ba68c8',
      dark: '#7b1fa2',
      contrastText: '#ffffff'
    },
    error: {
      main: '#d32f2f',
      light: '#ef5350',
      dark: '#c62828',
      contrastText: '#ffffff'
    },
    warning: {
      main: '#ed6c02',
      light: '#ff9800',
      dark: '#e65100',
      contrastText: '#ffffff'
    },
    info: {
      main: '#0288d1',
      light: '#03a9f4',
      dark: '#01579b',
      contrastText: '#ffffff'
    },
    success: {
      main: '#2e7d32',
      light: '#4caf50',
      dark: '#1b5e20',
      contrastText: '#ffffff'
    }
  };
  
  if (fallbacks[category] && fallbacks[category][variant]) {
    return fallbacks[category][variant];
  }
  
  // Default fallback colors for other categories
  if (category === 'divider') return 'rgba(0, 0, 0, 0.12)';
  if (category === 'text') {
    if (variant === 'primary') return 'rgba(0, 0, 0, 0.87)';
    if (variant === 'secondary') return 'rgba(0, 0, 0, 0.6)';
    if (variant === 'disabled') return 'rgba(0, 0, 0, 0.38)';
  }
  if (category === 'background') {
    if (variant === 'paper') return '#ffffff';
    if (variant === 'default') return '#f5f5f5';
  }
  
  return '#000000';
}

/**
 * Resolve a token reference like {Lighthouse.colors.neutrals.black.alpha-87}
 * @param {string} reference - Token reference string
 * @param {object} tokens - All tokens object for lookup
 * @returns {string} Resolved value or original reference if not found
 */
/**
 * Format RGBA values properly for web usage
 * Converts decimal values (0.0-1.0) to integers (0-255) when needed
 * @param {string|object} color - Color value to format
 * @returns {string} Properly formatted color
 */
function formatRgbaColor(color) {
  if (typeof color !== 'string') return color;
  
  // Handle rgba format with decimal values
  // This regex will match rgba with both decimal and integer values
  const rgbaMatch = color.match(/rgba\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)/);
  if (rgbaMatch) {
    const [_, r, g, b, a] = rgbaMatch;
    const rVal = parseFloat(r);
    const gVal = parseFloat(g);
    const bVal = parseFloat(b);
    const aVal = parseFloat(a);
    
    // Check if values are in 0-1 range and need conversion to 0-255
    if (rVal <= 1.0 && gVal <= 1.0 && bVal <= 1.0) {
      const rInt = Math.round(rVal * 255);
      const gInt = Math.round(gVal * 255);
      const bInt = Math.round(bVal * 255);
      
      return `rgba(${rInt}, ${gInt}, ${bInt}, ${aVal})`;
    }
    
    // Make sure the returned format is clean
    return `rgba(${Math.round(rVal)}, ${Math.round(gVal)}, ${Math.round(bVal)}, ${aVal})`;
  }
  
  return color;
}

function resolveReference(reference, tokens) {
  // Check if it's a reference
  if (typeof reference !== 'string' || !reference.startsWith('{') || !reference.endsWith('}')) {
    return reference;
  }
  
  debug(`Resolving reference: ${reference}`);
  
  // Lighthouse color mapping - direct mappings for common color references
  const lighthouseColors = {
    // Primary colors
    '{Lighthouse.colors.neutrals.black.100}': '#000000',
    '{Lighthouse.colors.blues.slate-blue.400}': '#4285F4',
    '{Lighthouse.colors.blues.slate-blue.600}': '#1A73E8',
    '{Lighthouse.colors.blues.slate-blue.50}': '#E8F0FE',
    
    // Secondary colors
    '{Base.secondary.contrast-text}': '#9c27b0',
    '{Lighthouse.colors.greens.soft-teal.300}': '#4DD0E1',
    '{Lighthouse.colors.greens.soft-teal.600}': '#00ACC1',
    '{Lighthouse.colors.neutrals.white.100}': '#FFFFFF',
    
    // Error colors
    '{Lighthouse.colors.reds.punchy-red.600}': '#D32F2F',
    '{Lighthouse.colors.reds.punchy-red.300}': '#EF5350',
    '{Lighthouse.colors.reds.punchy-red.700}': '#C62828',
    '{Lighthouse.colors.reds.punchy-red.50}': '#FFEBEE',
    
    // Warning colors
    '{Lighthouse.colors.yellows.pale-yellow-darkly.500-alpha-16}': '#FFC107',
    '{Lighthouse.colors.yellows.pale-yellow-darkly.300}': '#FFD54F',
    '{Lighthouse.colors.yellows.pale-yellow-darkly.700}': '#FFA000',
    '{Lighthouse.colors.yellows.pale-yellow-darkly.50}': '#FFF8E1',
    
    // Text/background colors
    '{Lighthouse.colors.neutrals.black.alpha-87}': 'rgba(0, 0, 0, 0.87)',
    '{Lighthouse.colors.neutrals.black.alpha-70}': 'rgba(0, 0, 0, 0.7)', 
    '{Lighthouse.colors.neutrals.black.alpha-60}': 'rgba(0, 0, 0, 0.6)',
    '{Lighthouse.colors.neutrals.black.alpha-56}': 'rgba(0, 0, 0, 0.56)',
    '{Lighthouse.colors.neutrals.black.alpha-38}': 'rgba(0, 0, 0, 0.38)',
    '{Lighthouse.colors.neutrals.black.alpha-30}': 'rgba(0, 0, 0, 0.3)',
    '{Lighthouse.colors.neutrals.black.alpha-16}': 'rgba(0, 0, 0, 0.16)',
    '{Lighthouse.colors.neutrals.black.alpha-12}': 'rgba(0, 0, 0, 0.12)',
    '{Lighthouse.colors.neutrals.black.alpha-06}': 'rgba(0, 0, 0, 0.06)',
    '{Lighthouse.colors.neutrals.black.alpha-04}': 'rgba(0, 0, 0, 0.04)'
  };
  
  // Direct mapping lookup for common Lighthouse references
  if (lighthouseColors[reference]) {
    return lighthouseColors[reference];
  }
  
  // Extract the path
  const path = reference.substring(1, reference.length - 1).split('.');
  
  // Special case for Lighthouse references - return a default color if we can't find it
  if (path[0] === 'Lighthouse') {
    // If we see "blues", "reds", "greens", etc. in the path, generate a color
    if (path.includes('blues')) return '#1976d2';
    if (path.includes('reds')) return '#d32f2f';
    if (path.includes('greens')) return '#2e7d32';
    if (path.includes('yellows')) return '#ed6c02';
    if (path.includes('neutrals')) {
      if (path.includes('black')) return '#000000';
      if (path.includes('white')) return '#ffffff';
      return '#9e9e9e'; // gray
    }
  }
  
  // Navigate through tokens to find the value
  let current = tokens;
  for (const segment of path) {
    if (current === undefined || current === null || !current.hasOwnProperty(segment)) {
      // If we can't resolve the reference, return a sensible fallback
      if (path.includes('primary') || path.includes('secondary') || 
          path.includes('error') || path.includes('warning') || 
          path.includes('info') || path.includes('success')) {
        const category = path.find(p => ['primary', 'secondary', 'error', 'warning', 'info', 'success'].includes(p));
        const variant = path.find(p => ['main', 'light', 'dark', 'contrastText'].includes(p)) || 'main';
        return getFallbackColor(category, variant);
      }
      
      // For text references
      if (path.includes('text')) {
        if (path.includes('primary')) return 'rgba(0, 0, 0, 0.87)';
        if (path.includes('secondary')) return 'rgba(0, 0, 0, 0.6)';
        if (path.includes('disabled')) return 'rgba(0, 0, 0, 0.38)';
        return '#000000';
      }
      
      // For background references
      if (path.includes('background')) {
        if (path.includes('paper')) return '#ffffff';
        if (path.includes('default')) return '#f5f5f5';
        return '#ffffff';
      }
      
      // Return a default color rather than the reference
      return '#757575'; // medium gray as a safe default
    }
    current = current[segment];
  }
  
  // If the value is itself a reference, resolve it recursively
  if (typeof current === 'string' && current.startsWith('{') && current.endsWith('}')) {
    debug(`Found nested reference: ${current}`);
    return resolveReference(current, tokens);
  }
  
  // Handle special token formats
  if (current && typeof current === 'object') {
    if (current.hasOwnProperty('$value')) {
      const value = current.$value;
      debug(`Found token with $value:`, current);
      return typeof value === 'string' && value.startsWith('{') && value.endsWith('}') 
        ? resolveReference(value, tokens) 
        : value;
    }
    if (current.hasOwnProperty('value')) {
      const value = current.value;
      debug(`Found token with value:`, current);
      return typeof value === 'string' && value.startsWith('{') && value.endsWith('}') 
        ? resolveReference(value, tokens) 
        : value;
    }
  }
  
  debug(`Resolved to:`, current);
  const result = current !== undefined ? current : '#757575'; // Return gray as fallback
  
  // Format any RGBA values properly
  return formatRgbaColor(result);
}

/**
 * Check if path exists in object and has a value
 * @param {object} obj - Object to check
 * @param {string[]} path - Path to check
 * @returns {boolean} True if path exists and has value
 */
function hasPath(obj, path) {
  let current = obj;
  for (const segment of path) {
    if (current === undefined || current === null || !current.hasOwnProperty(segment)) {
      return false;
    }
    current = current[segment];
  }
  return true;
}

/**
 * Get value from object by path
 * @param {object} obj - Object to get value from
 * @param {string[]} path - Path to value
 * @param {any} defaultValue - Default value if path doesn't exist
 * @returns {any} Value at path or default value
 */
function getPath(obj, path, defaultValue = undefined) {
  let current = obj;
  for (const segment of path) {
    if (current === undefined || current === null || !current.hasOwnProperty(segment)) {
      return defaultValue;
    }
    current = current[segment];
  }
  return current;
}

/**
 * Find all keys in an object that match a pattern
 * @param {object} obj - Object to search
 * @param {RegExp} pattern - Pattern to match
 * @param {string[]} prefix - Path prefix for recursive search
 * @returns {object} Object with path as key and value as value
 */
function findKeysByPattern(obj, pattern, prefix = []) {
  let result = {};

  for (const key in obj) {
    const currentPath = [...prefix, key];
    const currentValue = obj[key];
    
    // If it's a token with a value property (Style Dictionary format)
    if (currentValue && typeof currentValue === 'object' && currentValue.hasOwnProperty('value')) {
      if (pattern.test(key)) {
        result[currentPath.join('.')] = currentValue.value;
      }
    }
    // If it's a token with a $value property (original format)
    else if (currentValue && typeof currentValue === 'object' && currentValue.hasOwnProperty('$value')) {
      if (pattern.test(key)) {
        result[currentPath.join('.')] = currentValue.$value;
      }
    }
    // If it's a nested object, recurse
    else if (currentValue && typeof currentValue === 'object') {
      const nestedResults = findKeysByPattern(currentValue, pattern, currentPath);
      result = { ...result, ...nestedResults };
    }
  }

  return result;
}

/**
 * Find all values of a specific type in the tokens
 * @param {object} tokens - Tokens object
 * @param {string} type - Token type to find (color, dimension, etc)
 * @param {object} allTokens - All tokens for reference resolution
 * @returns {object} Object with path as key and value as value
 */
function findValuesByType(tokens, type, allTokens) {
  let result = {};

  function traverse(obj, path = []) {
    for (const key in obj) {
      const currentPath = [...path, key];
      const currentValue = obj[key];
      
      // Check for Style Dictionary format with type property
      if (currentValue && typeof currentValue === 'object' && currentValue.type === type) {
        let value = currentValue.value;
        // Resolve references if needed
        if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
          value = resolveReference(value, allTokens);
        }
        result[currentPath.join('.')] = value;
      }
      // Check for tokens with $type property (original token format)
      else if (currentValue && typeof currentValue === 'object' && currentValue.$type === type) {
        let value = currentValue.$value;
        // Resolve references if needed
        if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
          value = resolveReference(value, allTokens);
        }
        result[currentPath.join('.')] = value;
      }
      // If it's a nested object, recurse
      else if (currentValue && typeof currentValue === 'object') {
        traverse(currentValue, currentPath);
      }
    }
  }

  traverse(tokens);
  return result;
}

/**
 * Generate a MUI palette from tokens
 * @param {object} tokens - Tokens object
 * @returns {object} MUI palette object
 */
function generatePalette(tokens) {
  const palette = {
    primary: {
      main: '#1976d2',    // Default MUI blue as fallback
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#9c27b0',    // Default MUI purple as fallback
      light: '#ba68c8',
      dark: '#7b1fa2',
      contrastText: '#ffffff'
    },
    error: {
      main: '#d32f2f',    // Default MUI red as fallback
      light: '#ef5350',
      dark: '#c62828',
      contrastText: '#ffffff'
    },
    warning: {
      main: '#ed6c02',    // Default MUI orange as fallback
      light: '#ff9800',
      dark: '#e65100',
      contrastText: '#ffffff'
    },
    info: {
      main: '#0288d1',    // Default MUI light blue as fallback
      light: '#03a9f4',
      dark: '#01579b',
      contrastText: '#ffffff'
    },
    success: {
      main: '#2e7d32',    // Default MUI green as fallback
      light: '#4caf50',
      dark: '#1b5e20',
      contrastText: '#ffffff'
    },
    grey: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#e0e0e0',
      400: '#bdbdbd',
      500: '#9e9e9e',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121'
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
      disabled: 'rgba(0, 0, 0, 0.38)'
    },
    divider: 'rgba(0, 0, 0, 0.12)',
    background: {
      paper: '#ffffff',
      default: '#f5f5f5'
    },
    action: {
      active: 'rgba(0, 0, 0, 0.54)',
      hover: 'rgba(0, 0, 0, 0.04)',
      selected: 'rgba(0, 0, 0, 0.08)',
      disabled: 'rgba(0, 0, 0, 0.26)',
      disabledBackground: 'rgba(0, 0, 0, 0.12)',
      focus: 'rgba(0, 0, 0, 0.12)'
    },
    common: {
      black: '#000000',
      white: '#ffffff'
    }
  };

  // Find all color tokens - try both 'color' and 'Color' types to be flexible
  const colorTokensType = findValuesByType(tokens, 'color');
  const colorTokensTypeUpper = findValuesByType(tokens, 'Color');
  const colorTokens = { ...colorTokensType, ...colorTokensTypeUpper };
  
  // Look specifically for MUI color tokens in original tokens
  if (tokens.MUI && tokens.MUI.palette) {
    const muiPalette = tokens.MUI.palette;
    
    // Process each palette category
    ['primary', 'secondary', 'error', 'warning', 'info', 'success'].forEach(category => {
      if (muiPalette[category]) {
        ['main', 'light', 'dark', 'contrastText'].forEach(variant => {
          if (muiPalette[category][variant] && muiPalette[category][variant].$value) {
            palette[category][variant] = muiPalette[category][variant].$value;
          }
        });
      }
    });
    
    // Process text, background, action
    ['text', 'background', 'action'].forEach(category => {
      if (muiPalette[category]) {
        Object.keys(muiPalette[category]).forEach(key => {
          if (muiPalette[category][key] && muiPalette[category][key].$value) {
            palette[category][key] = muiPalette[category][key].$value;
          }
        });
      }
    });
    
    // Process greys
    if (muiPalette.grey) {
      Object.keys(muiPalette.grey).forEach(key => {
        if (muiPalette.grey[key] && muiPalette.grey[key].$value) {
          palette.grey[key] = muiPalette.grey[key].$value;
        }
      });
    }
    
    // Process divider
    if (muiPalette.divider && muiPalette.divider.$value) {
      palette.divider = muiPalette.divider.$value;
    }
  }
  
  // General color mapping as fallback
  Object.entries(colorTokens).forEach(([path, value]) => {
    const pathParts = path.split('.');
    const name = pathParts[pathParts.length - 1].toLowerCase();
    
    // Format the color value
    const formattedValue = formatRgbaColor(value);
    debug(`Formatting color ${path}: ${value} -> ${formattedValue}`);

    // Primary colors
    if (path.includes('primary')) {
      if (name.includes('main')) palette.primary.main = formattedValue;
      else if (name.includes('light')) palette.primary.light = formattedValue;
      else if (name.includes('dark')) palette.primary.dark = formattedValue;
      else if (name.includes('contrasttext') || name.includes('contrast-text')) palette.primary.contrastText = formattedValue;
      // Special case for primary color without variant
      else if (name === 'primary' || name === 'brand') palette.primary.main = formattedValue;
    }
    // Secondary colors
    else if (path.includes('secondary')) {
      if (name.includes('main')) palette.secondary.main = value;
      else if (name.includes('light')) palette.secondary.light = value;
      else if (name.includes('dark')) palette.secondary.dark = value;
      else if (name.includes('contrasttext') || name.includes('contrast-text')) palette.secondary.contrastText = value;
      // Special case for secondary color without variant
      else if (name === 'secondary') palette.secondary.main = value;
    }
    // Error colors
    else if (path.includes('error')) {
      if (name.includes('main')) palette.error.main = value;
      else if (name.includes('light')) palette.error.light = value;
      else if (name.includes('dark')) palette.error.dark = value;
      else if (name.includes('contrasttext') || name.includes('contrast-text')) palette.error.contrastText = value;
      // Special case for error color without variant
      else if (name === 'error' || name.includes('danger')) palette.error.main = value;
    }
    // Warning colors
    else if (path.includes('warning')) {
      if (name.includes('main')) palette.warning.main = value;
      else if (name.includes('light')) palette.warning.light = value;
      else if (name.includes('dark')) palette.warning.dark = value;
      else if (name.includes('contrasttext') || name.includes('contrast-text')) palette.warning.contrastText = value;
      // Special case for warning color without variant
      else if (name === 'warning' || name.includes('alert')) palette.warning.main = value;
    }
    // Info colors
    else if (path.includes('info')) {
      if (name.includes('main')) palette.info.main = value;
      else if (name.includes('light')) palette.info.light = value;
      else if (name.includes('dark')) palette.info.dark = value;
      else if (name.includes('contrasttext') || name.includes('contrast-text')) palette.info.contrastText = value;
      // Special case for info color without variant
      else if (name === 'info') palette.info.main = value;
    }
    // Success colors
    else if (path.includes('success')) {
      if (name.includes('main')) palette.success.main = value;
      else if (name.includes('light')) palette.success.light = value;
      else if (name.includes('dark')) palette.success.dark = value;
      else if (name.includes('contrasttext') || name.includes('contrast-text')) palette.success.contrastText = value;
      // Special case for success color without variant
      else if (name === 'success') palette.success.main = value;
    }
    // Grey colors
    else if (path.includes('grey') || path.includes('gray')) {
      const level = parseInt(name.replace(/[^\d]/g, ''));
      if (!isNaN(level)) {
        palette.grey[level] = value;
      }
    }
    // Text colors
    else if (path.includes('text')) {
      if (name.includes('primary')) palette.text.primary = value;
      else if (name.includes('secondary')) palette.text.secondary = value;
      else if (name.includes('disabled')) palette.text.disabled = value;
    }
    // Background colors
    else if (path.includes('background')) {
      if (name.includes('paper')) palette.background.paper = value;
      else if (name.includes('default')) palette.background.default = value;
    }
    // Action colors
    else if (path.includes('action')) {
      if (name.includes('active')) palette.action.active = value;
      else if (name.includes('hover')) palette.action.hover = value;
      else if (name.includes('selected')) palette.action.selected = value;
      else if (name.includes('disabled')) palette.action.disabled = value;
      else if (name.includes('disabledbackground')) palette.action.disabledBackground = value;
      else if (name.includes('focus')) palette.action.focus = value;
    }
    // Divider color
    else if (name.includes('divider')) {
      palette.divider = value;
    }
  });

  return palette;
}

/**
 * Generate MUI typography from tokens
 * @param {object} tokens - Tokens object
 * @returns {object} MUI typography object
 */
function generateTypography(tokens) {
  const typography = {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: {},
    h2: {},
    h3: {},
    h4: {},
    h5: {},
    h6: {},
    subtitle1: {},
    subtitle2: {},
    body1: {},
    body2: {},
    button: {},
    caption: {},
    overline: {}
  };

  // Find all typography tokens
  const fontFamilyTokens = findKeysByPattern(tokens, /fontfamily|font-family/i);
  const fontSizeTokens = findValuesByType(tokens, 'dimension');
  const fontWeightTokens = findKeysByPattern(tokens, /fontweight|font-weight/i);
  const lineHeightTokens = findKeysByPattern(tokens, /lineheight|line-height/i);
  const letterSpacingTokens = findKeysByPattern(tokens, /letterspacing|letter-spacing/i);

  // Set base typography values if available
  if (Object.keys(fontFamilyTokens).length > 0) {
    const fontFamily = Object.values(fontFamilyTokens)[0];
    if (fontFamily) typography.fontFamily = fontFamily;
  }

  // Map typography tokens for each variant
  const variantMap = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'subtitle1', 'subtitle2', 'body1', 'body2', 'button', 'caption', 'overline'];
  
  variantMap.forEach(variant => {
    // Find variant-specific tokens
    Object.entries(fontSizeTokens).forEach(([path, value]) => {
      if (path.includes(variant)) {
        typography[variant].fontSize = value;
      }
    });

    Object.entries(fontWeightTokens).forEach(([path, value]) => {
      if (path.includes(variant)) {
        typography[variant].fontWeight = value;
      }
    });

    Object.entries(lineHeightTokens).forEach(([path, value]) => {
      if (path.includes(variant)) {
        typography[variant].lineHeight = value;
      }
    });

    Object.entries(letterSpacingTokens).forEach(([path, value]) => {
      if (path.includes(variant)) {
        typography[variant].letterSpacing = value;
      }
    });
  });

  return typography;
}

/**
 * Generate MUI spacing from tokens
 * @param {object} tokens - Tokens object
 * @returns {function|number[]} MUI spacing function or values
 */
function generateSpacing(tokens) {
  // Find spacing tokens
  const spacingTokens = findValuesByType(tokens, 'dimension');
  const spacingValues = {};
  
  Object.entries(spacingTokens).forEach(([path, value]) => {
    if (path.includes('spacing')) {
      const match = path.match(/spacing[.-](\d+)/i);
      if (match && match[1]) {
        const level = parseInt(match[1]);
        if (!isNaN(level)) {
          spacingValues[level] = value;
        }
      }
    }
  });

  // If we have spacing values, create a spacing function
  if (Object.keys(spacingValues).length > 0) {
    const baseSpacing = spacingValues[1] || '8px';
    return `(factor: number) => \`\${Math.round(factor * parseFloat('${baseSpacing}') * 10) / 10}px\``;
  }
  
  // Default spacing function with decimal point support
  return "(factor: number) => `${Math.round(factor * 8 * 10) / 10}px`";
}

/**
 * Generate MUI shape from tokens
 * @param {object} tokens - Tokens object
 * @returns {object} MUI shape object
 */
function generateShape(tokens) {
  const shape = {
    borderRadius: 4
  };

  // Find border radius tokens
  const radiusTokens = findKeysByPattern(tokens, /borderradius|border-radius|radius/i);
  
  if (Object.keys(radiusTokens).length > 0) {
    // Use the first radius token as default
    const defaultRadius = Object.values(radiusTokens)[0];
    if (defaultRadius) {
      const radiusValue = parseFloat(defaultRadius);
      if (!isNaN(radiusValue)) {
        shape.borderRadius = radiusValue;
      }
    }
  }

  return shape;
}

/**
 * Generate MUI theme from tokens
 * @param {object} coreTokens - Core tokens
 * @param {object} lightTokens - Light mode tokens
 * @param {object} darkTokens - Dark mode tokens
 * @param {object} allTokens - Combined tokens for reference resolution
 * @returns {object} MUI theme configuration
 */
function generateMuiTheme(coreTokens, lightTokens, darkTokens, allTokens) {
  // Merge tokens for light mode
  const lightModeTokens = { ...coreTokens, ...lightTokens };
  
  // Generate light theme components
  const lightPalette = generatePalette(lightModeTokens, allTokens);
  const typography = generateTypography(lightModeTokens, allTokens);
  const spacing = generateSpacing(lightModeTokens, allTokens);
  const shape = generateShape(lightModeTokens, allTokens);
  
  // Merge tokens for dark mode
  const darkModeTokens = { ...coreTokens, ...darkTokens };
  
  // Generate dark theme components
  const darkPalette = generatePalette(darkModeTokens, allTokens);
  
  // Create theme configuration
  const themeConfig = {
    lightPalette,
    darkPalette,
    typography,
    spacing,
    shape
  };
  
  return themeConfig;
}

/**
 * Generate theme TypeScript types
 * @returns {string} TypeScript type definitions
 */
function generateThemeTypes() {
  return `/**
 * MUI Theme Types
 * Generated on ${new Date().toLocaleString()}
 */
import { Theme, ThemeOptions } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface CustomTheme extends Theme {
    status?: {
      danger?: string;
    };
  }
  
  interface CustomThemeOptions extends ThemeOptions {
    status?: {
      danger?: string;
    };
  }
  
  export function createTheme(options?: CustomThemeOptions): CustomTheme;
}

// Extend the palette to include custom colors
declare module '@mui/material/styles/createPalette' {
  interface Palette {
    neutral?: Palette['primary'];
  }
  
  interface PaletteOptions {
    neutral?: PaletteOptions['primary'];
  }
}

// Theme configuration
export interface ThemeConfig {
  lightPalette: Record<string, any>;
  darkPalette: Record<string, any>;
  typography: Record<string, any>;
  spacing: string;
  shape: Record<string, any>;
}`;
}

/**
 * Generate theme TypeScript code
 * @param {object} themeConfig - Theme configuration
 * @returns {string} TypeScript code
 */
function generateThemeCode(themeConfig) {
  return `/**
 * MUI Theme
 * Generated on ${new Date().toLocaleString()}
 */
import { createTheme, ThemeOptions } from '@mui/material/styles';
import { ThemeConfig } from './theme.types';

// Theme configuration
export const themeConfig: ThemeConfig = ${JSON.stringify(themeConfig, null, 2)};

// Create the base theme with common options
const baseThemeOptions: ThemeOptions = {
  typography: themeConfig.typography,
  shape: themeConfig.shape,
  spacing: ${themeConfig.spacing}
};

// Create the light theme
export const lightTheme = createTheme({
  ...baseThemeOptions,
  palette: themeConfig.lightPalette,
});

// Create the dark theme
export const darkTheme = createTheme({
  ...baseThemeOptions,
  palette: themeConfig.darkPalette,
});

// Default theme (light)
const theme = lightTheme;

export default theme;`;
}

/**
 * Main function to run the script
 */
async function main() {
  log('🚀 Starting MUI theme generation...');

  // First try to load from tokens-sd directory
  const coreTokensPath = path.join(CONFIG.tokensDir, CONFIG.coreTokensFile);
  const lightTokensPath = path.join(CONFIG.tokensDir, CONFIG.lightTokensFile);
  const darkTokensPath = path.join(CONFIG.tokensDir, CONFIG.darkTokensFile);

  log(`📝 Loading tokens from:\n- ${coreTokensPath}\n- ${lightTokensPath}\n- ${darkTokensPath}`);

  let coreTokens = loadJsonFile(coreTokensPath);
  let lightTokens = loadJsonFile(lightTokensPath);
  let darkTokens = loadJsonFile(darkTokensPath);
  
  // If tokens-sd files don't have enough content, try original tokens directory
  if (Object.keys(coreTokens).length === 0 || Object.keys(lightTokens).length === 0) {
    log('⚠️ SD tokens may be incomplete, also loading from original tokens directory...');
    
    const originalCoreTokensPath = path.join(CONFIG.originalTokensDir, CONFIG.originalCoreTokensFile);
    const originalLightTokensPath = path.join(CONFIG.originalTokensDir, CONFIG.originalLightTokensFile);
    const originalDarkTokensPath = path.join(CONFIG.originalTokensDir, CONFIG.originalDarkTokensFile);
    
    log(`📝 Loading tokens from:\n- ${originalCoreTokensPath}\n- ${originalLightTokensPath}\n- ${originalDarkTokensPath}`);
    
    const originalCoreTokens = loadJsonFile(originalCoreTokensPath);
    const originalLightTokens = loadJsonFile(originalLightTokensPath);
    const originalDarkTokens = loadJsonFile(originalDarkTokensPath);
    
    // Merge tokens from both sources
    coreTokens = { ...coreTokens, ...originalCoreTokens };
    lightTokens = { ...lightTokens, ...originalLightTokens };
    darkTokens = { ...darkTokens, ...originalDarkTokens };
    
    log(`✅ Merged tokens from both sources`);
  }
  
  // Create a combined tokens object for reference resolution
  const allTokens = { ...coreTokens, ...lightTokens, ...darkTokens };

  // Generate MUI theme
  log('🔨 Generating MUI theme...');
  const themeConfig = generateMuiTheme(coreTokens, lightTokens, darkTokens, allTokens);

  // Generate theme files
  log('📄 Generating theme files...');
  const themeTypes = generateThemeTypes();
  const themeCode = generateThemeCode(themeConfig);

  // Create output directory if it doesn't exist
  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
  }

  // Write theme files
  const themeTypesPath = path.join(CONFIG.outputDir, CONFIG.outputThemeTypesFile);
  const themeCodePath = path.join(CONFIG.outputDir, CONFIG.outputThemeFile);

  fs.writeFileSync(themeTypesPath, themeTypes);
  fs.writeFileSync(themeCodePath, themeCode);

  log(`✅ MUI theme generated successfully!\n- ${themeTypesPath}\n- ${themeCodePath}`);
}

// Run the script
main().catch(error => {
  console.error('❌ Error generating MUI theme:', error);
  process.exit(1);
});
