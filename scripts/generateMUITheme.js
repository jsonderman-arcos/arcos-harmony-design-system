/**
 * generateMUITheme.js
 * 
 * This script generates Material UI theme JSON files from design tokens.
 * It reads the token files, transforms them into the MUI theme format,
 * and outputs JSON files that can be directly used with createTheme.
 * 
 * It properly handles token references and resolves them to actual values.
 * Creates separate light and dark theme files ready for use in MUI apps.
 */

const fs = require('fs');
const path = require('path');

/**
 * Configuration object - paths and settings
 */
const config = {
  // Paths
  tokensDir: '../tokens',
  outputPaths: {
    directory: '../demos/mui/src',
    lightThemeFile: 'lightTheme.json',
    darkThemeFile: 'darkTheme.json',
    themeFile: 'theme.ts',
    typesFile: 'theme.types.ts'
  },
  // Token files to use (core tokens are always loaded)
  tokenFiles: {
    core: 'coreTokens.json',
    light: 'lightModeTokens.json',
    dark: 'darkModeTokens.json'
  },
  // Modes to generate themes for
  modes: ['Light', 'Dark', 'Mobile', 'Large Screen'],
  baseMode: 'Light',
  // Debug options
  debug: {
    logResolvedReferences: false,
    logMissingReferences: true
  }
};

// Map of token paths to theme paths
const tokenToThemeMap = {
  // Palette mappings - Grey
  'colors.neutrals.neutral.50': 'palette.grey.50',
  'colors.neutrals.neutral.100': 'palette.grey.100',
  'colors.neutrals.neutral.200': 'palette.grey.200',
  'colors.neutrals.neutral.300': 'palette.grey.300',
  'colors.neutrals.neutral.400': 'palette.grey.400',
  'colors.neutrals.neutral.500': 'palette.grey.500',
  'colors.neutrals.neutral.600': 'palette.grey.600',
  'colors.neutrals.neutral.700': 'palette.grey.700',
  'colors.neutrals.neutral.800': 'palette.grey.800',
  'colors.neutrals.neutral.900': 'palette.grey.900',
  
  // Primary color mappings
  'colors.blues.slate-blue.500': 'palette.primary.main',
  'colors.blues.slate-blue.400': 'palette.primary.light',
  'colors.blues.slate-blue.600': 'palette.primary.dark',
  'colors.neutrals.white.100': 'palette.primary.contrastText',
  
  // Secondary color mappings
  'colors.blues.vivid-blue.600': 'palette.secondary.main',
  'colors.blues.vivid-blue.400': 'palette.secondary.light',
  'colors.blues.vivid-blue.800': 'palette.secondary.dark',
  'colors.neutrals.white.100': 'palette.secondary.contrastText',
  
  // Error color mappings
  'colors.reds.punchy-red.600': 'palette.error.main',
  'colors.reds.punchy-red.400': 'palette.error.light',
  'colors.reds.punchy-red.800': 'palette.error.dark',
  'colors.neutrals.white.100': 'palette.error.contrastText',
  
  // Warning color mappings
  'colors.yellows.yellow.600': 'palette.warning.main',
  'colors.yellows.yellow.400': 'palette.warning.light',
  'colors.yellows.yellow.800': 'palette.warning.dark',
  'colors.neutrals.black.alpha-87': 'palette.warning.contrastText',
  
  // Success color mappings
  'colors.greens.soft-teal.600': 'palette.success.main',
  'colors.greens.soft-teal.400': 'palette.success.light',
  'colors.greens.soft-teal.800': 'palette.success.dark',
  'colors.neutrals.white.100': 'palette.success.contrastText',
  
  // Info color mappings
  'colors.blues.slate-blue.400': 'palette.info.main',
  'colors.blues.slate-blue.300': 'palette.info.light',
  'colors.blues.slate-blue.600': 'palette.info.dark',
  'colors.neutrals.white.100': 'palette.info.contrastText',
  
  // Text color mappings
  'colors.neutrals.black.alpha-87': 'palette.text.primary',
  'colors.neutrals.black.alpha-60': 'palette.text.secondary',
  'colors.neutrals.black.alpha-56': 'palette.text.secondary',
  'colors.neutrals.black.alpha-38': 'palette.text.disabled',
  'colors.neutrals.black.alpha-12': 'palette.divider',
  
  // Background color mappings
  'colors.neutrals.white.100': 'palette.background.paper',
  'colors.neutrals.white.100': 'palette.background.default',
  
  // Action color mappings
  'colors.neutrals.black.alpha-54': 'palette.action.active',
  'colors.neutrals.black.alpha-04': 'palette.action.hover',
  'colors.neutrals.black.alpha-08': 'palette.action.selected',
  'colors.neutrals.black.alpha-26': 'palette.action.disabled',
  'colors.neutrals.black.alpha-12': 'palette.action.disabledBackground',
  'colors.neutrals.black.alpha-12': 'palette.action.focus',
  
  // Common colors
  'colors.neutrals.black.100': 'palette.common.black',
  'colors.neutrals.white.100': 'palette.common.white',
  
  // Typography mappings
  'lighthouse.typography.fontfamily-base': 'typography.fontFamily',
  'lighthouse.typography.fontweight-light': 'typography.fontWeightLight',
  'lighthouse.typography.fontweight-regular': 'typography.fontWeightRegular',
  'lighthouse.typography.fontweight-medium': 'typography.fontWeightMedium',
  'lighthouse.typography.fontweight-bold': 'typography.fontWeightBold',
  
  // Typography variants
  'lighthouse.typography.fontsize-5xl': 'typography.h1.fontSize',
  'lighthouse.typography.fontsize-4xl': 'typography.h2.fontSize',
  'lighthouse.typography.fontsize-3xl': 'typography.h3.fontSize',
  'lighthouse.typography.fontsize-2xl': 'typography.h4.fontSize',
  'lighthouse.typography.fontsize-xl': 'typography.h5.fontSize',
  'lighthouse.typography.fontsize-lg': 'typography.h6.fontSize',
  'lighthouse.typography.fontsize-base': 'typography.body1.fontSize',
  'lighthouse.typography.fontsize-sm': 'typography.body2.fontSize',
  'lighthouse.typography.fontsize-xs': 'typography.caption.fontSize',
  'lighthouse.typography.fontweight-light': 'typography.h1.fontWeight',
  'lighthouse.typography.fontweight-light': 'typography.h2.fontWeight',
  'lighthouse.typography.fontweight-regular': 'typography.h3.fontWeight',
  'lighthouse.typography.fontweight-regular': 'typography.h4.fontWeight',
  'lighthouse.typography.fontweight-regular': 'typography.h5.fontWeight',
  'lighthouse.typography.fontweight-medium': 'typography.h6.fontWeight',
  
  // Spacing mappings
  'spacing.spacing-3xs': 'spacing.unit',
  'spacing.spacing-none': 'spacing.0',
  'spacing.spacing-3xs': 'spacing.1',
  'spacing.spacing-2xs': 'spacing.2',
  'spacing.spacing-xs': 'spacing.3',
  'spacing.spacing-sm': 'spacing.4',
  'spacing.spacing-md': 'spacing.6',
  'spacing.spacing-lg': 'spacing.8',
  'spacing.spacing-xl': 'spacing.10',
  'spacing.spacing-2xl': 'spacing.12',
  
  // Breakpoints mappings
  'breakpoints.breakpoint-sm': 'breakpoints.values.sm',
  'breakpoints.breakpoint-md': 'breakpoints.values.md',
  'breakpoints.breakpoint-lg': 'breakpoints.values.lg',
  'breakpoints.breakpoint-xl': 'breakpoints.values.xl',
  
  // Shape mappings
  'radii.border-radius': 'shape.borderRadius',
  'radii.border-radius-none': 'shape.borderRadiusNone'
};

// Dark mode adjustments
const darkModeAdjustments = {
  'palette.text.primary': 'colors.neutrals.white.alpha-87',
  'palette.text.secondary': 'colors.neutrals.white.alpha-56',
  'palette.text.disabled': 'colors.neutrals.white.alpha-38',
  'palette.background.paper': 'colors.neutrals.neutral.900',
  'palette.background.default': 'colors.neutrals.black.100',
  'palette.action.active': 'colors.neutrals.white.alpha-54',
  'palette.action.hover': 'colors.neutrals.white.alpha-04',
  'palette.action.selected': 'colors.neutrals.white.alpha-08',
  'palette.action.disabled': 'colors.neutrals.white.alpha-26',
  'palette.action.disabledBackground': 'colors.neutrals.white.alpha-12',
  'palette.action.focus': 'colors.neutrals.white.alpha-12'
};

/**
 * Load and parse JSON from a file path
 * 
 * @param {string} filePath - Path to the token file
 * @returns {Object} - Parsed token data or empty object if file not found
 * @throws {Error} - If file exists but cannot be parsed
 */
function loadTokens(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.warn(`Token file not found: ${filePath}`);
      return {};
    }
    
    const data = fs.readFileSync(filePath, 'utf8');
    try {
      return JSON.parse(data);
    } catch (parseError) {
      console.error(`Error parsing token file ${filePath}: ${parseError.message}`);
      throw parseError; // Re-throw parse errors as they indicate corrupted data
    }
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.warn(`Token file not found: ${filePath}`);
      return {};
    }
    console.error(`Error loading tokens from ${filePath}: ${error.message}`);
    throw error; // Re-throw other errors
  }
}

/**
 * Get a value from an object using a path string (e.g., "colors.primary.main")
 */
function getValueByPath(obj, path) {
  const parts = path.split('.');
  let current = obj;
  
  for (const part of parts) {
    if (current === undefined || current === null) return undefined;
    
    // Try exact match first
    if (current[part] !== undefined) {
      current = current[part];
    } 
    // Then try case-insensitive match
    else {
      const caseInsensitiveKey = Object.keys(current).find(
        key => key.toLowerCase() === part.toLowerCase()
      );
      
      if (caseInsensitiveKey) {
        current = current[caseInsensitiveKey];
      } else {
        return undefined;
      }
    }
  }
  
  return current;
}

/**
 * Set a value in an object using a path string (e.g., "palette.primary.main")
 */
function setValueByPath(obj, path, value) {
  const parts = path.split('.');
  let current = obj;
  
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (current[part] === undefined) {
      current[part] = {};
    }
    current = current[part];
  }
  
  current[parts[parts.length - 1]] = value;
  return obj;
}

/**
 * Resolves a token reference like "{colors.primary.main}" to its actual value
 * Enhanced with better path resolution and detailed logging
 */
function resolveTokenReference(reference, allTokens, depth = 0) {
  // Prevent infinite recursion
  if (depth > 10) {
    console.error(`Maximum reference depth exceeded for: ${reference}`);
    return reference;
  }

  // If it's not a reference or not a string, return as is
  if (typeof reference !== 'string' || !reference.startsWith('{') || !reference.endsWith('}')) {
    return reference;
  }

  // Extract the path from the reference: "{colors.primary.main}" -> "colors.primary.main"
  const path = reference.substring(1, reference.length - 1);
  
  // Try different path variations
  const pathVariations = [
    path,
    path.replace(/^Lighthouse\.colors\./, 'colors.'),
    path.replace(/^Lighthouse\.colors\./, 'lighthouse.colors.'),
    path.replace(/^Lighthouse\./, 'lighthouse.'),
    path.replace(/^Base\./, ''),
    path.replace(/^Base\./, 'base.'),
    path.replace(/^base\./, ''),
    path.replace(/^spacing\./, ''),
    // Add more specific variations to handle your token structure
    `lighthouse.${path}`,
    `base.${path}`,
    path.toLowerCase()
  ];
  
  for (const pathVar of pathVariations) {
    const token = getValueByPath(allTokens, pathVar);
    
    if (token !== undefined) {
      if (token.$value !== undefined) {
        // Recursively resolve if the value is also a reference
        if (typeof token.$value === 'string' && 
            token.$value.startsWith('{') && 
            token.$value.endsWith('}')) {
          const resolvedValue = resolveTokenReference(token.$value, allTokens, depth + 1);
          if (config.debug.logResolvedReferences) {
            console.log(`Resolved nested reference: ${reference} -> ${token.$value} -> ${resolvedValue}`);
          }
          return resolvedValue;
        }
        
        if (config.debug.logResolvedReferences) {
          console.log(`Resolved reference: ${reference} -> ${token.$value}`);
        }
        return token.$value;
      } else if (typeof token !== 'object') {
        if (config.debug.logResolvedReferences) {
          console.log(`Resolved reference: ${reference} -> ${token}`);
        }
        return token;
      } else if (token.type === 'VARIABLE_ALIAS' && token.id) {
        // Handle Figma variable alias format
        return `ALIAS(${token.id})`;
      }
    }
  }

  // Enhanced alpha handling with better pattern matching
  const alphaPatterns = [
    /(.+?)-alpha-(\d+)/, // standard pattern: neutrals.black.alpha-87
    /(.+?)\.alpha-(\d+)/, // dot notation: neutrals.black.alpha-87
    /(.+?)\.alpha\.(\d+)/ // alternative dot notation: neutrals.black.alpha.87
  ];

  for (const pattern of alphaPatterns) {
    const match = path.match(pattern);
    if (match) {
      const basePath = match[1];
      const alpha = parseInt(match[2]) / 100;
      
      // More comprehensive path variations for alpha values
      const basePathVariations = [
        basePath,
        basePath.replace(/^Lighthouse\.colors\./, 'colors.'),
        basePath.replace(/^Lighthouse\.colors\./, 'lighthouse.colors.'),
        basePath.replace(/^Lighthouse\./, 'lighthouse.'),
        basePath.replace(/^colors\.neutrals\./, 'neutrals.'),
        basePath.replace(/^Base\./, 'base.'),
        basePath.replace(/^Base\./, ''),
        `lighthouse.${basePath}`,
        `lighthouse.colors.${basePath}`,
        `colors.${basePath}`
      ];
      
      for (const basePathVar of basePathVariations) {
        const baseToken = getValueByPath(allTokens, basePathVar);
        
        if (baseToken && baseToken.$value !== undefined) {
          const baseValue = baseToken.$value;
          // Handle hex colors
          if (typeof baseValue === 'string' && baseValue.startsWith('#')) {
            // Convert hex to rgba
            const r = parseInt(baseValue.slice(1, 3), 16);
            const g = parseInt(baseValue.slice(3, 5), 16);
            const b = parseInt(baseValue.slice(5, 7), 16);
            const rgba = `rgba(${r}, ${g}, ${b}, ${alpha})`;
            if (config.debug.logResolvedReferences) {
              console.log(`Resolved alpha reference: ${reference} -> ${rgba}`);
            }
            return rgba;
          } else if (typeof baseValue === 'string' && baseValue.startsWith('rgba')) {
            // Replace the alpha value in rgba
            const rgba = baseValue.replace(/rgba\((.+?), [\d.]+\)/, `rgba($1, ${alpha})`);
            if (config.debug.logResolvedReferences) {
              console.log(`Adjusted alpha in rgba: ${reference} -> ${rgba}`);
            }
            return rgba;
          } else if (typeof baseValue === 'string' && baseValue.startsWith('rgb')) {
            // Convert rgb to rgba
            const rgba = baseValue.replace(/rgb\((.+?)\)/, `rgba($1, ${alpha})`);
            if (config.debug.logResolvedReferences) {
              console.log(`Converted rgb to rgba: ${reference} -> ${rgba}`);
            }
            return rgba;
          }
        }
      }
      
      // Well-known color fallbacks
      if (path.includes('black')) {
        return `rgba(0, 0, 0, ${alpha})`;
      } else if (path.includes('white')) {
        return `rgba(255, 255, 255, ${alpha})`;
      }
    }
  }

  // Additional specific token handling
  if (path.includes('neutrals.black.alpha')) {
    const match = path.match(/neutrals\.black\.alpha-?(\d+)/);
    if (match) {
      const alpha = parseInt(match[1]) / 100;
      return `rgba(0, 0, 0, ${alpha})`;
    }
  } else if (path.includes('neutrals.white.alpha')) {
    const match = path.match(/neutrals\.white\.alpha-?(\d+)/);
    if (match) {
      const alpha = parseInt(match[1]) / 100;
      return `rgba(255, 255, 255, ${alpha})`;
    }
  }

  if (config.debug.logMissingReferences) {
    console.warn(`Token reference not resolved: ${reference}`);
  }
  return reference;
}

/**
 * Processes token objects to resolve all references and convert to usable values
 * Improved to better handle complex token structures and edge cases
 */
function processTokens(tokens) {
  // Create a copy of all tokens for reference resolution
  const allTokens = {...tokens};
  const processedTokens = {};
  const processedRefs = new Set(); // Track processed references to prevent circular resolution
  
  function processValue(obj, path = '') {
    if (obj === null || obj === undefined) return obj;
    
    // Handle primitive values directly
    if (typeof obj !== 'object') return obj;
    
    // Handle arrays
    if (Array.isArray(obj)) {
      return obj.map((item, index) => processValue(item, `${path}[${index}]`));
    }
    
    // Handle token object with $value
    if (obj.$value !== undefined) {
      // Track this reference to prevent circular resolution
      if (processedRefs.has(path)) {
        console.warn(`Circular reference detected at: ${path}`);
        return obj.$value;
      }
      
      processedRefs.add(path);
      
      // Resolve the value, which might be a reference
      const resolvedValue = resolveTokenReference(obj.$value, allTokens);
      
      // Convert numeric px values for better compatibility with MUI
      if (typeof resolvedValue === 'string' && resolvedValue.endsWith('px')) {
        const pxValue = parseFloat(resolvedValue);
        if (!isNaN(pxValue)) {
          return pxValue; // Return numeric value without 'px' suffix
        }
      }
      
      processedRefs.delete(path);
      return resolvedValue;
    }
    
    // Handle Figma variable alias format
    if (obj.type === 'VARIABLE_ALIAS' && obj.id) {
      // This might need special handling depending on your needs
      return `ALIAS(${obj.id})`;
    }
    
    // Process nested objects
    const result = {};
    for (const key in obj) {
      const childPath = path ? `${path}.${key}` : key;
      result[key] = processValue(obj[key], childPath);
    }
    return result;
  }
  
  // Process the entire token structure
  const processed = processValue(tokens);
  
  // Additional post-processing to normalize values
  function normalizeValues(obj) {
    if (obj === null || obj === undefined || typeof obj !== 'object') {
      return obj;
    }
    
    if (Array.isArray(obj)) {
      return obj.map(normalizeValues);
    }
    
    const result = {};
    for (const key in obj) {
      let value = obj[key];
      
      // Convert 'ALIAS(id)' to more usable values if needed
      if (typeof value === 'string' && value.startsWith('ALIAS(')) {
        // For now, we'll leave aliases as is or you could implement a lookup system here
        value = '#757575'; // Default fallback for unresolved aliases
      }
      
      result[key] = normalizeValues(value);
    }
    
    return result;
  }
  
  return normalizeValues(processed);
}

/**
 * Maps design tokens to MUI theme structure
 * Enhanced with better token mapping and validation
 */
function createThemeFromTokens(processedTokens, mode = 'light') {
  console.log(`Creating ${mode} theme from processed tokens...`);
  
  // Extract spacing base value from tokens (default to 8)
  let spacingBase = 8;
  const tokenSpacingBase = getValueByPath(processedTokens, 'spacing.spacing-3xs') || 
                          getValueByPath(processedTokens, 'spacing.spacing-2xs');
  
  if (typeof tokenSpacingBase === 'string' && tokenSpacingBase.endsWith('px')) {
    const match = tokenSpacingBase.match(/(\d+)px/);
    if (match) {
      spacingBase = parseInt(match[1]);
    }
  } else if (typeof tokenSpacingBase === 'number') {
    spacingBase = tokenSpacingBase;
  }

  // Create the base theme object with MUI defaults
  const theme = {
    palette: {
      mode,
      common: {
        black: '#000',
        white: '#fff'
      },
      primary: {
        main: '#1976d2',
        light: '#42a5f5',
        dark: '#1565c0',
        contrastText: '#fff'
      },
      secondary: {
        main: '#9c27b0',
        light: '#ba68c8',
        dark: '#7b1fa2',
        contrastText: '#fff'
      },
      error: {
        main: '#d32f2f',
        light: '#ef5350',
        dark: '#c62828',
        contrastText: '#fff'
      },
      warning: {
        main: '#ed6c02',
        light: '#ff9800',
        dark: '#e65100',
        contrastText: '#fff'
      },
      info: {
        main: '#0288d1',
        light: '#03a9f4',
        dark: '#01579b',
        contrastText: '#fff'
      },
      success: {
        main: '#2e7d32',
        light: '#4caf50',
        dark: '#1b5e20',
        contrastText: '#fff'
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
        900: '#212121',
        A100: '#f5f5f5',
        A200: '#eeeeee',
        A400: '#bdbdbd',
        A700: '#616161'
      },
      text: mode === 'light' 
        ? {
            primary: 'rgba(0, 0, 0, 0.87)',
            secondary: 'rgba(0, 0, 0, 0.6)',
            disabled: 'rgba(0, 0, 0, 0.38)'
          }
        : {
            primary: 'rgba(255, 255, 255, 0.87)',
            secondary: 'rgba(255, 255, 255, 0.6)',
            disabled: 'rgba(255, 255, 255, 0.38)'
          },
      divider: mode === 'light' ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.12)',
      background: mode === 'light'
        ? {
            paper: '#fff',
            default: '#fff'
          }
        : {
            paper: '#121212',
            default: '#121212'
          },
      action: mode === 'light'
        ? {
            active: 'rgba(0, 0, 0, 0.54)',
            hover: 'rgba(0, 0, 0, 0.04)',
            hoverOpacity: 0.04,
            selected: 'rgba(0, 0, 0, 0.08)',
            selectedOpacity: 0.08,
            disabled: 'rgba(0, 0, 0, 0.26)',
            disabledBackground: 'rgba(0, 0, 0, 0.12)',
            disabledOpacity: 0.38,
            focus: 'rgba(0, 0, 0, 0.12)',
            focusOpacity: 0.12,
            activatedOpacity: 0.12
          }
        : {
            active: 'rgba(255, 255, 255, 0.54)',
            hover: 'rgba(255, 255, 255, 0.04)',
            hoverOpacity: 0.04,
            selected: 'rgba(255, 255, 255, 0.08)',
            selectedOpacity: 0.08,
            disabled: 'rgba(255, 255, 255, 0.26)',
            disabledBackground: 'rgba(255, 255, 255, 0.12)',
            disabledOpacity: 0.38,
            focus: 'rgba(255, 255, 255, 0.12)',
            focusOpacity: 0.12,
            activatedOpacity: 0.12
          }
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 500,
      fontWeightBold: 700,
      h1: {
        fontWeight: 300,
        fontSize: '2.5rem',
        lineHeight: 1.167
      },
      h2: {
        fontWeight: 300,
        fontSize: '2rem',
        lineHeight: 1.2
      },
      h3: {
        fontWeight: 400,
        fontSize: '1.75rem',
        lineHeight: 1.167
      },
      h4: {
        fontWeight: 400,
        fontSize: '1.5rem',
        lineHeight: 1.235
      },
      h5: {
        fontWeight: 400,
        fontSize: '1.25rem',
        lineHeight: 1.334
      },
      h6: {
        fontWeight: 500,
        fontSize: '1.1rem',
        lineHeight: 1.6
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.5
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.43
      },
      button: {
        fontSize: '0.875rem',
        lineHeight: 1.75,
        textTransform: 'none', // Changed to match modern design trends
        fontWeight: 500
      },
      caption: {
        fontSize: '0.75rem',
        lineHeight: 1.66
      },
      overline: {
        fontSize: '0.75rem',
        lineHeight: 2.66,
        textTransform: 'uppercase',
        fontWeight: 500
      }
    },
    spacing: spacingBase,
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1536
      }
    },
    shape: {
      borderRadius: 8
    },
    shadows: [
      'none',
      '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
      '0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)',
      '0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)',
      '0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)',
      '0px 3px 5px -1px rgba(0,0,0,0.2),0px 5px 8px 0px rgba(0,0,0,0.14),0px 1px 14px 0px rgba(0,0,0,0.12)',
      '0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)',
      '0px 4px 5px -2px rgba(0,0,0,0.2),0px 7px 10px 1px rgba(0,0,0,0.14),0px 2px 16px 1px rgba(0,0,0,0.12)',
      '0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)',
      '0px 5px 6px -3px rgba(0,0,0,0.2),0px 9px 12px 1px rgba(0,0,0,0.14),0px 3px 16px 2px rgba(0,0,0,0.12)',
      '0px 6px 6px -3px rgba(0,0,0,0.2),0px 10px 14px 1px rgba(0,0,0,0.14),0px 4px 18px 3px rgba(0,0,0,0.12)',
      '0px 6px 7px -4px rgba(0,0,0,0.2),0px 11px 15px 1px rgba(0,0,0,0.14),0px 4px 20px 3px rgba(0,0,0,0.12)',
      '0px 7px 8px -4px rgba(0,0,0,0.2),0px 12px 17px 2px rgba(0,0,0,0.14),0px 5px 22px 4px rgba(0,0,0,0.12)',
      '0px 7px 8px -4px rgba(0,0,0,0.2),0px 13px 19px 2px rgba(0,0,0,0.14),0px 5px 24px 4px rgba(0,0,0,0.12)',
      '0px 7px 9px -4px rgba(0,0,0,0.2),0px 14px 21px 2px rgba(0,0,0,0.14),0px 5px 26px 4px rgba(0,0,0,0.12)',
      '0px 8px 9px -5px rgba(0,0,0,0.2),0px 15px 22px 2px rgba(0,0,0,0.14),0px 6px 28px 5px rgba(0,0,0,0.12)',
      '0px 8px 10px -5px rgba(0,0,0,0.2),0px 16px 24px 2px rgba(0,0,0,0.14),0px 6px 30px 5px rgba(0,0,0,0.12)',
      '0px 8px 11px -5px rgba(0,0,0,0.2),0px 17px 26px 2px rgba(0,0,0,0.14),0px 6px 32px 5px rgba(0,0,0,0.12)',
      '0px 9px 11px -5px rgba(0,0,0,0.2),0px 18px 28px 2px rgba(0,0,0,0.14),0px 7px 34px 6px rgba(0,0,0,0.12)',
      '0px 9px 12px -6px rgba(0,0,0,0.2),0px 19px 29px 2px rgba(0,0,0,0.14),0px 7px 36px 6px rgba(0,0,0,0.12)',
      '0px 10px 13px -6px rgba(0,0,0,0.2),0px 20px 31px 3px rgba(0,0,0,0.14),0px 8px 38px 7px rgba(0,0,0,0.12)',
      '0px 10px 13px -6px rgba(0,0,0,0.2),0px 21px 33px 3px rgba(0,0,0,0.14),0px 8px 40px 7px rgba(0,0,0,0.12)',
      '0px 10px 14px -6px rgba(0,0,0,0.2),0px 22px 35px 3px rgba(0,0,0,0.14),0px 8px 42px 7px rgba(0,0,0,0.12)',
      '0px 11px 14px -7px rgba(0,0,0,0.2),0px 23px 36px 3px rgba(0,0,0,0.14),0px 9px 44px 8px rgba(0,0,0,0.12)',
      '0px 11px 15px -7px rgba(0,0,0,0.2),0px 24px 38px 3px rgba(0,0,0,0.14),0px 9px 46px 8px rgba(0,0,0,0.12)'
    ],
    transitions: {
      easing: {
        easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
        easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
        easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
        sharp: 'cubic-bezier(0.4, 0, 0.6, 1)'
      },
      duration: {
        shortest: 150,
        shorter: 200,
        short: 250,
        standard: 300,
        complex: 375,
        enteringScreen: 225,
        leavingScreen: 195
      }
    },
    zIndex: {
      mobileStepper: 1000,
      fab: 1050,
      speedDial: 1050,
      appBar: 1100,
      drawer: 1200,
      modal: 1300,
      snackbar: 1400,
      tooltip: 1500
    }
  };

  // Apply token mappings
  for (const [tokenPath, themePath] of Object.entries(tokenToThemeMap)) {
    const tokenValue = getValueByPath(processedTokens, tokenPath);
    if (tokenValue !== undefined) {
      // Special handling for fontSize values (convert from number to string with rem)
      if (themePath.includes('typography') && themePath.includes('fontSize') && typeof tokenValue === 'number') {
        setValueByPath(theme, themePath, `${tokenValue/16}rem`);
      } 
      // Special handling for spacing values
      else if (themePath.startsWith('spacing.')) {
        // Spacing is handled specially, we don't set individual values
      }
      // Handle border radius values (convert from px to number)
      else if (themePath.includes('borderRadius') && typeof tokenValue === 'string') {
        const match = tokenValue.match(/(\d+)px/);
        if (match) {
          setValueByPath(theme, themePath, parseInt(match[1]));
        } else {
          setValueByPath(theme, themePath, tokenValue);
        }
      }
      else {
        setValueByPath(theme, themePath, tokenValue);
      }
    }
  }

  // Apply dark mode adjustments if needed
  if (mode === 'dark') {
    theme.palette.mode = 'dark';
    
    // Ensure dark mode background is set
    theme.palette.background = {
      paper: '#121212', // Dark mode default paper color
      default: '#121212' // Dark mode default background color
    };
    
    for (const [themePath, tokenPath] of Object.entries(darkModeAdjustments)) {
      const tokenValue = getValueByPath(processedTokens, tokenPath);
      if (tokenValue !== undefined) {
        setValueByPath(theme, themePath, tokenValue);
      }
    }
  }

  return theme;
}

/**
 * Extracts specific parts from the tokens for a theme
 */
function extractThemeSection(tokens, section) {
  console.log(`- Extracting ${section} for ${tokens.metadata?.name || 'unnamed'}`);
  
  switch (section) {
    case 'colors':
      // Extract color tokens
      return processTokens(tokens.colors || tokens.lighthouse?.colors || {});
      
    case 'typography':
      // Extract typography tokens
      return processTokens(tokens.typography || tokens.lighthouse?.typography || {});
      
    case 'spacing':
      // Extract spacing tokens
      return processTokens(tokens.spacing || {});
      
    case 'breakpoints':
      // Extract breakpoint tokens
      return processTokens(tokens.breakpoints || {});
      
    case 'shadows':
      // Extract shadow tokens
      return processTokens(tokens.effects || tokens.lighthouse?.effects || {});
      
    default:
      return {};
  }
}

/**
 * Enhances the MUI theme object with component customizations based on tokens
 */
function enhanceThemeWithComponents(theme, tokens) {
  // Add component customizations based on token values
  theme.components = {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: getValueByPath(tokens, 'radii.border-radius') || theme.shape.borderRadius,
          textTransform: 'none',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: theme.shadows[2]
          }
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: getValueByPath(tokens, 'radii.border-radius') || theme.shape.borderRadius
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: getValueByPath(tokens, 'radii.border-radius') || theme.shape.borderRadius,
          boxShadow: theme.shadows[1]
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: (getValueByPath(tokens, 'radii.border-radius') || theme.shape.borderRadius) / 2
        }
      }
    }
  };

  return theme;
}

/**
 * Generates TypeScript theme file content
 */
function generateThemeFile(themeConfigs) {
  // Start with imports
  let content = `/**
 * MUI Theme configuration generated from design tokens
 */
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Theme, PaletteMode } from '@mui/material';
import { CSSProperties } from 'react';

// Define light theme
export const lightTheme = ${JSON.stringify(themeConfigs.light || {}, null, 2)};

// Define dark theme  
export const darkTheme = ${JSON.stringify(themeConfigs.dark || {}, null, 2)};

// Define mobile theme
export const mobileTheme = ${JSON.stringify(themeConfigs.mobile || {}, null, 2)};

// Define large screen theme
export const largeScreenTheme = ${JSON.stringify(themeConfigs.largescreen || {}, null, 2)};

// Type for our available themes
export type ThemeMode = 'light' | 'dark' | 'mobile' | 'largescreen';

/**
 * Get theme configuration by mode
 */
export function getThemeByMode(mode: ThemeMode = 'light'): Theme {
  switch (mode) {
    case 'dark':
      return createTheme(darkTheme);
    case 'mobile':
      return createTheme(mobileTheme);
    case 'largescreen':
      return createTheme(largeScreenTheme);
    case 'light':
    default:
      return createTheme(lightTheme);
  }
}

// Export default theme
export default getThemeByMode('light');
`;

  return content;
}

/**
 * Generates TypeScript type definitions
 */
function generateTypeDefinitions() {
  return `/**
 * MUI Theme type definitions generated from design tokens
 */
import { Theme as MuiTheme } from '@mui/material/styles';

// Extend the Material-UI Theme interface
declare module '@mui/material/styles' {
  interface Theme {
    // Add any custom theme properties here
  }
  
  interface ThemeOptions {
    // Add any custom theme option properties here
  }
}

// Export the extended theme type
export type Theme = MuiTheme;
`;
}

/**
 * Main function that runs the theme generation process
 */
function generateMUITheme() {
  // 1. Load token files
  console.log('Loading token files...');
  
  // Update config to include additional modes
  config.modes = ['Light', 'Dark', 'Mobile', 'Large Screen'];
  config.baseMode = 'Light';
  config.outputPaths.themeFile = 'theme.ts';
  config.outputPaths.typesFile = 'theme.types.ts';
  
  // Load core tokens (base tokens)
  const coreTokensPath = path.resolve(__dirname, config.tokensDir, config.tokenFiles.core);
  console.log(`Loading core tokens from: ${coreTokensPath}`);
  const coreTokens = loadTokens(coreTokensPath);
  
  // Load all mode tokens
  const modeTokens = {};
  for (const mode of config.modes) {
    const modeFileName = mode.toLowerCase().replace(/\s+(.)/g, (match, group) => group.toUpperCase()) + 'ModeTokens.json';
    const filePath = path.resolve(__dirname, config.tokensDir, modeFileName);
    try {
      console.log(`Loading ${mode} mode tokens from: ${filePath}`);
      modeTokens[mode] = loadTokens(filePath);
      // Merge with core tokens
      modeTokens[mode] = { ...coreTokens, ...modeTokens[mode] };
    } catch (error) {
      console.warn(`Could not load ${mode} mode tokens: ${error.message}`);
      // Fall back to base mode or core tokens
      modeTokens[mode] = { ...coreTokens };
    }
  }

  // 2. Create theme configurations
  console.log('Creating theme configurations...');
  
  const themeConfigs = {};
  
  // Process each mode
  for (const mode of config.modes) {
    console.log(`Processing ${mode} mode...`);
    
    // Get tokens for this mode, falling back to base mode if needed
    const tokens = modeTokens[mode];
    const isDarkMode = mode === 'Dark';
    
    // Extract various sections
    const colors = extractThemeSection(tokens, 'colors');
    const typography = extractThemeSection(tokens, 'typography');
    const spacing = extractThemeSection(tokens, 'spacing');
    const breakpoints = extractThemeSection(tokens, 'breakpoints');
    const shadows = extractThemeSection(tokens, 'shadows');
    
    // Combine all token sections
    const combinedTokens = {
      ...colors,
      ...typography,
      ...spacing,
      ...breakpoints,
      ...shadows
    };
    
    // Create the theme configuration
    const themeKey = mode.toLowerCase().replace(/\s+(.)/g, (match, group) => group.toLowerCase());
    themeConfigs[themeKey] = createThemeFromTokens(combinedTokens, isDarkMode ? 'dark' : 'light');
  }

  // 3. Save theme JSON files
  console.log('Saving theme JSON files...');
  
  // Save light theme JSON
  const lightThemeOutputPath = path.resolve(__dirname, config.outputPaths.directory, config.outputPaths.lightThemeFile);
  fs.writeFileSync(lightThemeOutputPath, JSON.stringify(themeConfigs.light, null, 2), 'utf8');
  console.log(`Light theme saved to: ${lightThemeOutputPath}`);
  
  // Save dark theme JSON
  const darkThemeOutputPath = path.resolve(__dirname, config.outputPaths.directory, config.outputPaths.darkThemeFile);
  fs.writeFileSync(darkThemeOutputPath, JSON.stringify(themeConfigs.dark, null, 2), 'utf8');
  console.log(`Dark theme saved to: ${darkThemeOutputPath}`);
  
  // 4. Generate TypeScript theme file
  console.log('Generating TypeScript theme file...');
  const themeFileContent = generateThemeFile(themeConfigs);
  const themeFilePath = path.resolve(__dirname, config.outputPaths.directory, config.outputPaths.themeFile);
  fs.writeFileSync(themeFilePath, themeFileContent, 'utf8');
  console.log(`TypeScript theme file saved to: ${themeFilePath}`);
  
  // 5. Generate TypeScript type definitions
  console.log('Generating TypeScript type definitions...');
  const typesFileContent = generateTypeDefinitions();
  const typesFilePath = path.resolve(__dirname, config.outputPaths.directory, config.outputPaths.typesFile);
  fs.writeFileSync(typesFilePath, typesFileContent, 'utf8');
  console.log(`TypeScript type definitions saved to: ${typesFilePath}`);
  
  // 6. Save complete theme data JSON for reference
  const themeDataPath = path.resolve(__dirname, config.outputPaths.directory, 'themeData.json');
  fs.writeFileSync(themeDataPath, JSON.stringify(themeConfigs, null, 2), 'utf8');
  console.log(`Complete theme data saved to: ${themeDataPath}`);
  
  console.log('MUI theme generation complete!');
  
  return themeConfigs;
}

// Run the script
generateMUITheme();