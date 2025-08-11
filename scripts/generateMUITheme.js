/**
 * generateMUITheme.js
 * 
 * This script generates a Material UI theme from design tokens.
 * It reads the token files, transforms them into the MUI theme format,
 * and outputs a theme.ts file that can be used in your React applications.
 */

const fs = require('fs');
const path = require('path');

/**
 * Configuration object - these are defaults that can be overridden via command line
 */
const config = {
  // Default paths
  modesConfigPath: '../variables/figma-collections-modes.json',
  tokensDir: '../tokens',
  outputPaths: {
    directory: '../',
    themeFile: 'theme.ts',
    typesFile: 'theme.types.ts'
  }
};

// Parse command line arguments to override defaults
function parseArgs() {
  const args = process.argv.slice(2);
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i];
    const value = args[i + 1];
    
    if (key === '--modesConfig') {
      config.modesConfigPath = value;
    } else if (key === '--tokensDir') {
      config.tokensDir = value;
    } else if (key === '--outputDir') {
      config.outputPaths.directory = value;
    } else if (key === '--themeFile') {
      config.outputPaths.themeFile = value;
    } else if (key === '--typesFile') {
      config.outputPaths.typesFile = value;
    }
  }
}

// Parse command line arguments
parseArgs();

// Load modes configuration from the Figma collections file
const MODES_CONFIG_PATH = path.resolve(__dirname, config.modesConfigPath);
let availableModes = [];
let tokenPaths = {};

try {
  console.log(`Loading modes configuration from: ${MODES_CONFIG_PATH}`);
  const modesConfig = JSON.parse(fs.readFileSync(MODES_CONFIG_PATH, 'utf8'));
  availableModes = modesConfig.modes || [];
  
  // Create token file paths based on available modes
  availableModes.forEach(mode => {
    // Convert mode name to filename-friendly format (lowercase, replace spaces with camel case)
    const filenameFriendlyMode = mode
      .toLowerCase()
      .replace(/\s+(.)/g, (match, group) => group.toUpperCase());
    
    tokenPaths[mode] = path.resolve(
      __dirname, 
      config.tokensDir, 
      `${filenameFriendlyMode}ModeTokens.json`
    );
  });
  
  console.log('Available modes detected:', availableModes);
} catch (error) {
  console.error(`Error loading modes configuration: ${error.message}`);
  console.warn('Falling back to default modes...');
  
  // Fallback to default modes if config file not found or invalid
  tokenPaths = {
    'Core': path.resolve(__dirname, config.tokensDir, 'coreTokens.json'),
    'Default': path.resolve(__dirname, config.tokensDir, 'defaultModeTokens.json'),
    'Light': path.resolve(__dirname, config.tokensDir, 'lightModeTokens.json'),
    'Dark': path.resolve(__dirname, config.tokensDir, 'darkModeTokens.json')
  };
  availableModes = ['Core', 'Default', 'Light', 'Dark'];
}

// Set output paths from config
const OUTPUT_DIR = path.resolve(__dirname, config.outputPaths.directory);
const THEME_OUTPUT_PATH = path.resolve(OUTPUT_DIR, config.outputPaths.themeFile);
const THEME_TYPES_OUTPUT_PATH = path.resolve(OUTPUT_DIR, config.outputPaths.typesFile);

/**
 * Loads and parses JSON from a file path
 */
function loadTokens(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error loading tokens from ${filePath}:`, error);
    return {};
  }
}

/**
 * Helper function to get a value from a nested object using a path string
 */
function getNestedValue(obj, path) {
  if (!obj || !path) return undefined;
  
  const parts = path.split('.');
  let current = obj;
  
  for (const part of parts) {
    if (!current || typeof current !== 'object') return undefined;
    current = current[part];
  }
  
  return current;
}

/**
 * Resolves a token reference like "{Base.text.primary}" to its actual value
 * by searching through the tokens object
 */
function resolveTokenReference(reference, allTokens, visited = new Set()) {
  // If it's not a reference or not a string, return as is
  if (typeof reference !== 'string' || !reference.startsWith('{') || !reference.endsWith('}')) {
    return reference;
  }

  // Extract the path from the reference: "{Base.text.primary}" -> "Base.text.primary"
  const path = reference.substring(1, reference.length - 1);
  
  // Detect circular references
  if (visited.has(path)) {
    console.warn(`Circular reference detected: ${reference}`);
    return reference;
  }
  
  visited.add(path);

  // Try multiple path patterns for the same reference to handle different reference formats
  let pathsToTry = [path];

  // Handle Lighthouse color references in different formats
  if (path.startsWith('Lighthouse.colors.')) {
    // Add additional paths to try
    pathsToTry = [
      // Original path
      path,
      // Remove Lighthouse prefix completely
      path.replace(/^Lighthouse\.colors\./, 'colors.'),
      // Try lowercase lighthouse
      path.replace(/^Lighthouse\./, 'lighthouse.'),
      // Try direct color path (most tokens seem to be at the top level)
      path.replace(/^Lighthouse\.colors\./, '')
    ];
    
    // For color references with alpha values, try without the alpha suffix
    if (path.includes('-alpha-')) {
      const baseColorPath = path.replace(/-alpha-\d+$/, '');
      pathsToTry.push(
        baseColorPath,
        baseColorPath.replace(/^Lighthouse\.colors\./, 'colors.'),
        baseColorPath.replace(/^Lighthouse\./, 'lighthouse.'),
        baseColorPath.replace(/^Lighthouse\.colors\./, '')
      );
    }
  } else if (path.startsWith('Base.')) {
    // Handle Base references in different formats
    pathsToTry = [
      path,
      path.replace(/^Base\./, 'base.'),
      path.replace(/^Base\./, '')
    ];
  } else if (path.startsWith('spacing.')) {
    // Handle spacing references
    pathsToTry = [
      path,
      path.replace(/^spacing\./, '')
    ];
  }

  // Try each path pattern until one works
  for (const pathToTry of pathsToTry) {
    const parts = pathToTry.split('.');
    let currentObj = allTokens;
    let pathFound = true;
    
    for (const part of parts) {
      if (!currentObj || typeof currentObj !== 'object') {
        pathFound = false;
        break;
      }
      
      // Try exact match first
      if (currentObj[part] !== undefined) {
        currentObj = currentObj[part];
      } 
      // Try case-insensitive match
      else {
        const caseInsensitiveKey = Object.keys(currentObj).find(
          key => key.toLowerCase() === part.toLowerCase()
        );
        
        if (caseInsensitiveKey) {
          currentObj = currentObj[caseInsensitiveKey];
        } else {
          pathFound = false;
          break;
        }
      }
    }

    // If we found a value, return it
    if (pathFound) {
      if (currentObj && '$value' in currentObj) {
        // Recursively resolve if the value is also a reference
        if (typeof currentObj.$value === 'string' && 
            currentObj.$value.startsWith('{') && 
            currentObj.$value.endsWith('}')) {
          return resolveTokenReference(currentObj.$value, allTokens, new Set([...visited]));
        }
        return currentObj.$value;
      } else if (currentObj !== undefined && typeof currentObj !== 'object') {
        // Direct value found
        return currentObj;
      }
    }
  }

  // Special handling for color references with alpha
  if (path.includes('-alpha-') && path.startsWith('Lighthouse.colors.')) {
    // Extract the color parts: category (yellows), name (yellow), shade (300), alpha (50)
    const colorMatch = path.match(/Lighthouse\.colors\.([^.]+)\.([^.]+)\.([^-]+)-alpha-(\d+)/);
    if (colorMatch) {
      const [_, category, name, shade, alpha] = colorMatch;
      
      // Try to find the base color
      const basePaths = [
        `colors.${category}.${name}.${shade}`,
        `lighthouse.colors.${category}.${name}.${shade}`,
        `${category}.${name}.${shade}`
      ];
      
      for (const basePath of basePaths) {
        const parts = basePath.split('.');
        let baseColor = allTokens;
        let baseColorFound = true;
        
        for (const part of parts) {
          if (!baseColor || typeof baseColor !== 'object') {
            baseColorFound = false;
            break;
          }
          
          if (baseColor[part] !== undefined) {
            baseColor = baseColor[part];
          } else {
            const caseInsensitiveKey = Object.keys(baseColor).find(
              key => key.toLowerCase() === part.toLowerCase()
            );
            
            if (caseInsensitiveKey) {
              baseColor = baseColor[caseInsensitiveKey];
            } else {
              baseColorFound = false;
              break;
            }
          }
        }
        
        if (baseColorFound && baseColor && baseColor.$value) {
          // If we found the base color, add the alpha
          const baseColorValue = baseColor.$value;
          // Handle hex colors
          if (baseColorValue.startsWith('#')) {
            // Convert hex to rgba
            const r = parseInt(baseColorValue.slice(1, 3), 16);
            const g = parseInt(baseColorValue.slice(3, 5), 16);
            const b = parseInt(baseColorValue.slice(5, 7), 16);
            const a = parseInt(alpha) / 100;
            return `rgba(${r}, ${g}, ${b}, ${a})`;
          }
          // Handle rgba colors
          else if (baseColorValue.startsWith('rgba')) {
            // Replace the alpha value
            return baseColorValue.replace(/rgba\((.+?), [\d.]+\)/, `rgba($1, ${parseInt(alpha) / 100})`);
          }
          // Handle rgb colors
          else if (baseColorValue.startsWith('rgb')) {
            // Convert to rgba
            return baseColorValue.replace(/rgb\((.+?)\)/, `rgba($1, ${parseInt(alpha) / 100})`);
          }
        }
      }
    }
  }
  }

  // If we found an object with $value, return its value
  if (currentObj && '$value' in currentObj) {
    // Recursively resolve if the value is also a reference
    const resolvedValue = resolveTokenReference(currentObj.$value, allTokens, visited);
    return resolvedValue;
  } else if (currentObj && typeof currentObj === 'object') {
    console.warn(`Token reference found but does not contain $value: ${reference}`);
    return reference;
  } else if (currentObj !== undefined) {
    // Direct value found
    return currentObj;
  }

  console.warn(`Token reference does not resolve to a value: ${reference}`);
  return reference;
}

/**
 * Recursively resolves all token references in an object
 */
function resolveAllReferences(obj, allTokens) {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => resolveAllReferences(item, allTokens));
  }

  // If it's a token object with $value
  if (obj.$value !== undefined) {
    const resolvedValue = resolveTokenReference(obj.$value, allTokens);
    return {
      ...obj,
      $value: resolvedValue,
      $resolvedValue: resolvedValue
    };
  }

  // For regular objects, process each property
  const result = {};
  for (const key in obj) {
    result[key] = resolveAllReferences(obj[key], allTokens);
  }
  return result;
}

/**
 * Helper function to get token value, handling various token formats
 */
function getTokenValue(token) {
  if (!token) return undefined;
  
  // Use $resolvedValue if available, otherwise use $value
  if (token.$resolvedValue !== undefined) {
    return token.$resolvedValue;
  }
  
  // Handle design token format with $value
  if (token.$value !== undefined) {
    return token.$value;
  }
  
  // Handle direct value
  return token;
}

/**
 * Helper function to recursively search for a value in an object
 */
function findValueInObject(obj, keyPattern, type = null) {
  if (!obj || typeof obj !== 'object') return undefined;
  
  // Create a regexp from the pattern
  const regex = new RegExp(keyPattern, 'i');
  
  // Direct search in current level
  for (const [key, value] of Object.entries(obj)) {
    if (regex.test(key)) {
      if (value && value.$value !== undefined) {
        if (!type || value.$type === type) {
          return value.$value;
        }
      } else if (value && typeof value !== 'object') {
        return value;
      }
    }
  }
  
  // Recursive search in nested objects
  for (const [key, value] of Object.entries(obj)) {
    if (value && typeof value === 'object' && value.$value === undefined) {
      const result = findValueInObject(value, keyPattern, type);
      if (result !== undefined) return result;
    }
  }
  
  return undefined;
}

/**
 * Extracts color values from tokens
 */
function extractColors(tokens) {
  const colors = {};
  
  // Helper function to find colors in the token structure
  function findColorToken(colorName, variant = null) {
    // Try multiple paths where colors might be stored
    const possiblePaths = [
      `colors.${colorName}${variant ? '.' + variant : ''}`,
      `colors.${colorName.toLowerCase()}${variant ? '.' + variant : ''}`,
      `Base.colors.${colorName}${variant ? '.' + variant : ''}`,
      `base.colors.${colorName}${variant ? '.' + variant : ''}`,
      `theme.colors.${colorName}${variant ? '.' + variant : ''}`,
      `color.${colorName}${variant ? '.' + variant : ''}`,
      `color.${colorName.toLowerCase()}${variant ? '.' + variant : ''}`
    ];
    
    for (const path of possiblePaths) {
      const token = getNestedValue(tokens, path);
      if (token && token.$value) {
        return token.$value;
      }
    }
    
    // If not found in direct paths, try a broader search
    return findValueInObject(tokens, `${colorName}${variant ? '\\.' + variant : ''}`, 'color');
  }
  
  // Process standard MUI palette colors
  const palettes = ['primary', 'secondary', 'error', 'warning', 'info', 'success'];
  palettes.forEach(palette => {
    const main = findColorToken(palette, 'main') || 
                findColorToken(palette) || 
                findColorToken(`${palette}-main`) || 
                findColorToken(`${palette}Main`);
                
    if (main) {
      colors[palette] = { main };
      
      // Try to find other variants
      const light = findColorToken(palette, 'light') || 
                  findColorToken(`${palette}-light`) || 
                  findColorToken(`${palette}Light`);
                  
      const dark = findColorToken(palette, 'dark') || 
                findColorToken(`${palette}-dark`) || 
                findColorToken(`${palette}Dark`);
                
      const contrastText = findColorToken(palette, 'contrastText') || 
                        findColorToken(`${palette}-contrast`) || 
                        findColorToken(`${palette}ContrastText`);
      
      if (light) colors[palette].light = light;
      if (dark) colors[palette].dark = dark;
      if (contrastText) colors[palette].contrastText = contrastText;
    }
  });
  
  // Extract text colors
  const textPrimary = findColorToken('text', 'primary') || 
                    findColorToken('textPrimary') || 
                    findColorToken('text-primary');
                    
  const textSecondary = findColorToken('text', 'secondary') || 
                      findColorToken('textSecondary') || 
                      findColorToken('text-secondary');
                      
  const textDisabled = findColorToken('text', 'disabled') || 
                    findColorToken('textDisabled') || 
                    findColorToken('text-disabled');
  
  if (textPrimary || textSecondary || textDisabled) {
    colors.text = {};
    if (textPrimary) colors.text.primary = textPrimary;
    if (textSecondary) colors.text.secondary = textSecondary;
    if (textDisabled) colors.text.disabled = textDisabled;
  }
  
  // Extract background colors
  const bgDefault = findColorToken('background', 'default') || 
                  findColorToken('backgroundColor') || 
                  findColorToken('background-default') ||
                  findColorToken('backgroundDefault');
                  
  const bgPaper = findColorToken('background', 'paper') || 
                findColorToken('backgroundPaper') || 
                findColorToken('background-paper');
  
  if (bgDefault || bgPaper) {
    colors.background = {};
    if (bgDefault) colors.background.default = bgDefault;
    if (bgPaper) colors.background.paper = bgPaper;
  }
  
  // Extract action colors
  const actionActive = findColorToken('action', 'active') || 
                    findColorToken('actionActive') || 
                    findColorToken('action-active');
                    
  const actionHover = findColorToken('action', 'hover') || 
                    findColorToken('actionHover') || 
                    findColorToken('action-hover');
                    
  const actionSelected = findColorToken('action', 'selected') || 
                      findColorToken('actionSelected') || 
                      findColorToken('action-selected');
                      
  const actionDisabled = findColorToken('action', 'disabled') || 
                      findColorToken('actionDisabled') || 
                      findColorToken('action-disabled');
                      
  const actionDisabledBg = findColorToken('action', 'disabledBackground') || 
                        findColorToken('actionDisabledBackground') || 
                        findColorToken('action-disabled-background');
  
  if (actionActive || actionHover || actionSelected || actionDisabled || actionDisabledBg) {
    colors.action = {};
    if (actionActive) colors.action.active = actionActive;
    if (actionHover) colors.action.hover = actionHover;
    if (actionSelected) colors.action.selected = actionSelected;
    if (actionDisabled) colors.action.disabled = actionDisabled;
    if (actionDisabledBg) colors.action.disabledBackground = actionDisabledBg;
  }
  
  // Find any other color tokens that could be useful
  function findCustomColors(obj, prefix = '') {
    if (!obj || typeof obj !== 'object') return;
    
    Object.entries(obj).forEach(([key, value]) => {
      // Skip already processed standard colors
      if (['primary', 'secondary', 'error', 'warning', 'info', 'success', 'text', 'background', 'action'].includes(key)) {
        return;
      }
      
      const fullPath = prefix ? `${prefix}.${key}` : key;
      
      // If it's a color token with a direct value
      if (value && value.$type === 'color' && value.$value) {
        // Extract parent key for grouping
        const parts = fullPath.split('.');
        const lastPart = parts.pop();
        const parentKey = parts.length > 0 ? parts[parts.length - 1] : key;
        
        // Skip metadata and system keys
        if (['metadata', 'description', 'type', '$type', '$value'].includes(parentKey)) {
          return;
        }
        
        // Check if we should create a new color category
        if (!colors[parentKey]) {
          colors[parentKey] = {};
        }
        
        colors[parentKey][lastPart] = value.$value;
      }
      // If it's an object that might contain colors
      else if (value && typeof value === 'object' && !value.$value) {
        findCustomColors(value, fullPath);
      }
    });
  }
  
  // Look for custom colors throughout the token structure
  findCustomColors(tokens);
  
  return colors;
}

/**
 * Extract typography values from tokens
 */
function extractTypography(tokens) {
  const typography = {};
  
  // Helper function to find typography tokens
  function findTypographyToken(property, variant = null) {
    // Try multiple paths where typography might be stored
    const possiblePaths = [
      `typography.${variant ? variant + '.' : ''}${property}`,
      `typography.${property}`,
      `Base.typography.${variant ? variant + '.' : ''}${property}`,
      `base.typography.${variant ? variant + '.' : ''}${property}`,
      `theme.typography.${variant ? variant + '.' : ''}${property}`,
      `font.${variant ? variant + '.' : ''}${property}`,
      `text.${variant ? variant + '.' : ''}${property}`
    ];
    
    for (const path of possiblePaths) {
      const token = getNestedValue(tokens, path);
      if (token && token.$value !== undefined) {
        return token.$value;
      }
    }
    
    // If not found in direct paths, try a broader search
    return findValueInObject(tokens, `${property}`, variant ? 'typography' : null);
  }
  
  // Extract base typography properties
  const fontFamily = findTypographyToken('fontFamily');
  if (fontFamily) typography.fontFamily = fontFamily;
  
  const fontSize = findTypographyToken('fontSize');
  if (fontSize) {
    // Convert to number if it's a string with px, rem, etc.
    if (typeof fontSize === 'string') {
      const numericValue = parseFloat(fontSize);
      if (!isNaN(numericValue)) {
        typography.fontSize = numericValue;
      }
    } else {
      typography.fontSize = fontSize;
    }
  }
  
  // Extract variants
  const variants = [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'subtitle1', 'subtitle2',
    'body1', 'body2',
    'button', 'caption', 'overline'
  ];
  
  variants.forEach(variant => {
    // Check if this variant exists in tokens
    const variantProps = {};
    
    // Check for variant-specific properties
    const variantFontSize = findTypographyToken('fontSize', variant);
    const variantFontWeight = findTypographyToken('fontWeight', variant);
    const variantLineHeight = findTypographyToken('lineHeight', variant);
    const variantLetterSpacing = findTypographyToken('letterSpacing', variant);
    const variantTextTransform = findTypographyToken('textTransform', variant);
    
    if (variantFontSize) variantProps.fontSize = variantFontSize;
    if (variantFontWeight) variantProps.fontWeight = variantFontWeight;
    if (variantLineHeight) variantProps.lineHeight = variantLineHeight;
    if (variantLetterSpacing) variantProps.letterSpacing = variantLetterSpacing;
    if (variantTextTransform) variantProps.textTransform = variantTextTransform;
    
    if (Object.keys(variantProps).length > 0) {
      typography[variant] = variantProps;
    }
  });
  
  return typography;
}

/**
 * Extract spacing values from tokens
 */
function extractSpacing(tokens) {
  // Helper function to find spacing tokens
  function findSpacingToken() {
    // Try multiple paths where spacing might be stored
    const possiblePaths = [
      'spacing.base',
      'spacing',
      'Base.spacing',
      'base.spacing',
      'theme.spacing',
      'spacing.default'
    ];
    
    for (const path of possiblePaths) {
      const token = getNestedValue(tokens, path);
      if (token && token.$value !== undefined) {
        const value = token.$value;
        // Try to parse to number if it's a string
        if (typeof value === 'string') {
          const numValue = parseFloat(value);
          if (!isNaN(numValue)) return numValue;
        }
        return value;
      }
    }
    
    // If not found in direct paths, try a broader search
    return findValueInObject(tokens, 'spacing', 'dimension');
  }
  
  const spacingValue = findSpacingToken();
  return spacingValue !== undefined ? spacingValue : null;
}

/**
 * Extract breakpoint values from tokens
 */
function extractBreakpoints(tokens) {
  const breakpoints = {
    values: {
      xs: 0 // xs is always 0 in MUI
    }
  };
  
  // Helper function to find breakpoint tokens
  function findBreakpointToken(size) {
    // Try multiple paths where breakpoints might be stored
    const possibleNames = [
      `breakpoint-${size}`, 
      `breakpoint${size.charAt(0).toUpperCase() + size.slice(1)}`,
      `breakpoints.${size}`,
      `breakpoints.breakpoint-${size}`,
      `breakpoints.${size.toUpperCase()}`,
      `Base.breakpoints.${size}`,
      `theme.breakpoints.${size}`,
      size // direct name
    ];
    
    for (const name of possibleNames) {
      const path = name.includes('.') ? name : `breakpoints.${name}`;
      const token = getNestedValue(tokens, path);
      if (token && token.$value !== undefined) {
        const value = token.$value;
        // Try to parse to number if it's a string
        if (typeof value === 'string') {
          const numValue = parseFloat(value);
          if (!isNaN(numValue)) return numValue;
        }
        return value;
      }
    }
    
    // If not found in direct paths, try a broader search
    return findValueInObject(tokens, `breakpoint.*${size}`, 'dimension');
  }
  
  // Find standard MUI breakpoints
  const sizes = ['sm', 'md', 'lg', 'xl'];
  sizes.forEach(size => {
    const value = findBreakpointToken(size);
    if (value !== undefined) {
      breakpoints.values[size] = typeof value === 'number' ? value : parseInt(value, 10);
    }
  });
  
  return breakpoints;
}

/**
 * Extract shadow values from tokens
 */
function extractShadows(tokens) {
  // MUI requires an array of 25 shadow values
  const shadows = Array(25).fill('none');
  
  // Helper function to find shadow tokens
  function findShadowsInTokens() {
    const foundShadows = {};
    
    // Try to find shadows under common paths
    const commonPaths = [
      'shadows',
      'elevation',
      'Base.shadows',
      'Base.elevation',
      'theme.shadows',
      'theme.elevation'
    ];
    
    // First check common paths
    for (const basePath of commonPaths) {
      const shadowsObj = getNestedValue(tokens, basePath);
      if (shadowsObj && typeof shadowsObj === 'object') {
        Object.entries(shadowsObj).forEach(([key, value]) => {
          // Try to extract index from key (e.g., shadow-1, elevation2, etc.)
          const match = key.match(/(?:shadow|elevation)[_\-]?(\d+)/i);
          if (match && match[1]) {
            const index = parseInt(match[1], 10);
            if (!isNaN(index) && index >= 0 && index < 25 && value.$value) {
              foundShadows[index] = value.$value;
            }
          }
        });
      }
    }
    
    // If we didn't find much, do a broader recursive search
    if (Object.keys(foundShadows).length < 3) {
      function recursiveSearch(obj, path = '') {
        if (!obj || typeof obj !== 'object') return;
        
        Object.entries(obj).forEach(([key, value]) => {
          const fullPath = path ? `${path}.${key}` : key;
          
          // Check if this is a shadow/elevation token
          if (
            (key.includes('shadow') || key.includes('elevation')) && 
            value && 
            value.$value && 
            typeof value.$value === 'string' &&
            (value.$value.includes('px') || value.$value.includes('em') || value.$value.includes('rem'))
          ) {
            // Try to extract index
            const match = key.match(/(?:shadow|elevation)[_\-]?(\d+)/i) || 
                        fullPath.match(/(?:shadow|elevation)[_\-]?(\d+)/i);
            
            if (match && match[1]) {
              const index = parseInt(match[1], 10);
              if (!isNaN(index) && index >= 0 && index < 25) {
                foundShadows[index] = value.$value;
              }
            }
          }
          
          // Recursively check nested objects
          if (value && typeof value === 'object' && !value.$value) {
            recursiveSearch(value, fullPath);
          }
        });
      }
      
      recursiveSearch(tokens);
    }
    
    return foundShadows;
  }
  
  // Find shadow values
  const foundShadows = findShadowsInTokens();
  
  // Populate the shadows array
  Object.entries(foundShadows).forEach(([index, value]) => {
    shadows[parseInt(index, 10)] = value;
  });
  
  return shadows;
}

/**
 * Extract component overrides from tokens
 */
function extractComponentOverrides(tokens) {
  const components = {};
  
  // Component mapping - maps common token names to MUI component names
  const componentMapping = {
    button: 'MuiButton',
    checkbox: 'MuiCheckbox',
    chip: 'MuiChip',
    dialog: 'MuiDialog',
    divider: 'MuiDivider',
    drawer: 'MuiDrawer',
    icon: 'MuiIcon',
    iconButton: 'MuiIconButton',
    menu: 'MuiMenu',
    paper: 'MuiPaper',
    switch: 'MuiSwitch',
    tab: 'MuiTab',
    tabs: 'MuiTabs',
    textField: 'MuiTextField',
    tooltip: 'MuiTooltip',
    typography: 'MuiTypography'
  };
  
  // Helper function to find components in tokens
  function findComponents() {
    // Try to find components under common paths
    const commonPaths = [
      'components',
      'Base.components',
      'theme.components'
    ];
    
    // Check common paths first
    for (const basePath of commonPaths) {
      const componentsObj = getNestedValue(tokens, basePath);
      if (componentsObj && typeof componentsObj === 'object') {
        processComponentsObject(componentsObj);
      }
    }
    
    // Do a broader search for component-like structures
    function recursiveSearch(obj, path = '') {
      if (!obj || typeof obj !== 'object') return;
      
      // If this looks like a components container
      if (path.endsWith('components')) {
        processComponentsObject(obj);
        return;
      }
      
      // Continue searching
      Object.entries(obj).forEach(([key, value]) => {
        if (value && typeof value === 'object' && !value.$value) {
          recursiveSearch(value, path ? `${path}.${key}` : key);
        }
      });
    }
    
    recursiveSearch(tokens);
  }
  
  // Process a components object
  function processComponentsObject(componentsObj) {
    Object.entries(componentsObj).forEach(([componentKey, componentValue]) => {
      // Skip if not an object
      if (!componentValue || typeof componentValue !== 'object') return;
      
      // Determine MUI component name
      let muiComponentName;
      
      if (componentMapping[componentKey.toLowerCase()]) {
        muiComponentName = componentMapping[componentKey.toLowerCase()];
      } else {
        const capitalizedKey = componentKey.charAt(0).toUpperCase() + componentKey.slice(1);
        muiComponentName = `Mui${capitalizedKey}`;
      }
      
      // Process component styles
      const styleOverrides = processComponentStyles(componentValue);
      
      if (Object.keys(styleOverrides).length > 0) {
        components[muiComponentName] = { styleOverrides };
      }
    });
  }
  
  // Process component styles for a specific component
  function processComponentStyles(stylesObj) {
    const styleOverrides = {};
    
    // Check if there are slot-specific styles (root, label, etc.)
    const hasExplicitSlots = Object.keys(stylesObj).some(key => 
      ['root', 'label', 'input', 'thumb', 'track', 'paper'].includes(key));
    
    if (hasExplicitSlots) {
      // Process each slot
      Object.entries(stylesObj).forEach(([slotName, slotValue]) => {
        if (slotValue && typeof slotValue === 'object') {
          const slotStyles = extractStyles(slotValue);
          if (Object.keys(slotStyles).length > 0) {
            styleOverrides[slotName] = slotStyles;
          }
        }
      });
    } else {
      // If no explicit slots, treat all styles as root styles
      const rootStyles = extractStyles(stylesObj);
      if (Object.keys(rootStyles).length > 0) {
        styleOverrides.root = rootStyles;
      }
    }
    
    return styleOverrides;
  }
  
  // Extract CSS properties from design tokens
  function extractStyles(styleObj) {
    const styles = {};
    
    Object.entries(styleObj).forEach(([propKey, propValue]) => {
      // If it's a design token with $resolvedValue or $value
      if (propValue && typeof propValue === 'object') {
        if (propValue.$resolvedValue !== undefined) {
          styles[propKey] = propValue.$resolvedValue;
        } else if (propValue.$value !== undefined) {
          styles[propKey] = propValue.$value;
        }
        // If it's a nested object of styles
        else if (!Array.isArray(propValue)) {
          const nestedStyles = extractStyles(propValue);
          if (Object.keys(nestedStyles).length > 0) {
            styles[propKey] = nestedStyles;
          }
        }
      }
      // If it's a direct value
      else {
        styles[propKey] = propValue;
      }
    });
    
    return styles;
  }
  
  // Find and process components
  findComponents();
  
  return components;
}

/**
 * Generate the MUI theme object from tokens
 */
function generateTheme() {
  console.log('Loading tokens...');
  
  // Load all token files
  const loadedTokens = {};
  const availableModesList = [];
  const allTokens = {}; // Combined object with all tokens for reference resolution
  
  // First, ensure core tokens are loaded first as they contain base definitions
  const modeOrder = ['Core', ...Object.keys(tokenPaths).filter(mode => mode !== 'Core')];
  
  // Load each token file
  modeOrder.forEach(mode => {
    if (!tokenPaths[mode]) return;
    
    const path = tokenPaths[mode];
    console.log(`Loading ${mode} tokens from ${path}`);
    try {
      loadedTokens[mode] = loadTokens(path);
      if (Object.keys(loadedTokens[mode]).length > 0) {
        availableModesList.push(mode);
        
        // Make a deep copy of the tokens
        const tokensCopy = JSON.parse(JSON.stringify(loadedTokens[mode]));
        
        // Special handling for token references
        if (mode === 'Core') {
          // Create convenient aliases that match the references pattern
          
          // Handle Lighthouse.colors references
          if (tokensCopy.colors) {
            if (!tokensCopy.Lighthouse) {
              tokensCopy.Lighthouse = { colors: tokensCopy.colors };
              console.log('Created Lighthouse.colors reference mapping');
            }
            
            if (!tokensCopy.lighthouse) {
              tokensCopy.lighthouse = { colors: tokensCopy.colors };
            }
            
            // For colors directly under colors (not prefixed with Lighthouse)
            // Copy them to allTokens to enable direct lookup
            Object.assign(allTokens, {
              colors: tokensCopy.colors
            });
          }
        }
        
        // Create case-insensitive aliases for all top-level properties
        Object.keys(tokensCopy).forEach(key => {
          if (key.toLowerCase() === key && key !== 'metadata') {
            const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
            if (!tokensCopy[capitalizedKey]) {
              tokensCopy[capitalizedKey] = tokensCopy[key];
            }
          } else if (key !== key.toLowerCase() && key !== 'metadata') {
            const lowercaseKey = key.toLowerCase();
            if (!tokensCopy[lowercaseKey]) {
              tokensCopy[lowercaseKey] = tokensCopy[key];
            }
          }
        });
        
        // Add to the combined tokens object for reference resolution
        Object.assign(allTokens, tokensCopy);
      }
    } catch (error) {
      console.warn(`Error loading ${mode} tokens: ${error.message}`);
      loadedTokens[mode] = {};
    }
  });
  
  console.log(`Successfully loaded tokens for modes: ${availableModesList.join(', ')}`);
  
  // Make sure we have at least one mode with tokens
  if (availableModesList.length === 0) {
    throw new Error('No valid token files could be loaded. Theme generation failed.');
  }
  
  // Resolve all token references
  console.log('Resolving token references...');
  Object.keys(loadedTokens).forEach(mode => {
    loadedTokens[mode] = resolveAllReferences(loadedTokens[mode], allTokens);
  });
  
  // Define base modes that should be included in all other modes
  const baseModes = ['Core', 'Default'].filter(mode => 
    availableModesList.includes(mode) && 
    loadedTokens[mode] && 
    Object.keys(loadedTokens[mode]).length > 0
  );
  
  console.log(`Using base modes: ${baseModes.join(', ')}`);
  console.log('Creating theme configurations for each mode...');
  
  // Create theme configurations for each non-base mode
  const themeConfigs = {};
  const processedModes = [];
  
  // Process standard modes first if available (Light, Dark)
  const standardModes = ['Light', 'Dark'].filter(mode => availableModesList.includes(mode));
  
  // Process standard modes first, then other modes
  const modesToProcess = [
    ...standardModes,
    ...availableModesList.filter(mode => 
      !standardModes.includes(mode) && !baseModes.includes(mode)
    )
  ];
  
  // Create merged token sets and extract theme values for each mode
  modesToProcess.forEach(mode => {
    console.log(`Processing ${mode} mode...`);
    
    // Merge base tokens with mode-specific tokens
    const mergedTokens = { 
      ...baseModes.reduce((acc, baseMode) => ({ ...acc, ...loadedTokens[baseMode] }), {}), 
      ...loadedTokens[mode] 
    };
    
    // Extract theme values for this mode
    console.log(`- Extracting colors for ${mode}`);
    const palette = extractColors(mergedTokens);
    
    console.log(`- Extracting typography for ${mode}`);
    const typography = extractTypography(mergedTokens);
    
    console.log(`- Extracting spacing for ${mode}`);
    const spacing = extractSpacing(mergedTokens);
    
    console.log(`- Extracting breakpoints for ${mode}`);
    const breakpoints = extractBreakpoints(mergedTokens);
    
    console.log(`- Extracting shadows for ${mode}`);
    const shadows = extractShadows(mergedTokens);
    
    console.log(`- Extracting component overrides for ${mode}`);
    const components = extractComponentOverrides(mergedTokens);
    
    // Store extracted theme values
    themeConfigs[mode] = {
      palette: mode === 'Dark' ? { ...palette, mode: 'dark' } : palette,
      typography,
      spacing,
      breakpoints,
      shadows,
      components
    };
    
    processedModes.push(mode);
  });
  
  console.log(`Processed themes for modes: ${processedModes.join(', ')}`);
  
  // Make sure we have at least light and dark themes (required for MUI)
  if (!themeConfigs['Light'] && processedModes.length > 0) {
    console.warn('No Light theme found. Creating one from available tokens.');
    const defaultMode = processedModes[0];
    themeConfigs['Light'] = JSON.parse(JSON.stringify(themeConfigs[defaultMode]));
    themeConfigs['Light'].palette.mode = 'light';
  }
  
  if (!themeConfigs['Dark'] && processedModes.length > 0) {
    console.warn('No Dark theme found. Creating one from Light theme with dark mode.');
    themeConfigs['Dark'] = JSON.parse(JSON.stringify(themeConfigs['Light'] || themeConfigs[processedModes[0]]));
    themeConfigs['Dark'].palette.mode = 'dark';
  }
  
  console.log('Generating type definitions...');
  
  // Create TypeScript type definitions for custom theme elements
  const customTypeDefinitions = [];
  
  // Get all palette keys across all themes
  const allPaletteKeys = new Set();
  Object.values(themeConfigs).forEach(config => {
    if (config.palette) {
      Object.keys(config.palette).forEach(key => allPaletteKeys.add(key));
    }
  });
  
  // Standard MUI palette keys to exclude from custom definitions
  const standardPaletteKeys = new Set([
    'primary', 'secondary', 'error', 'warning', 'info', 'success',
    'text', 'background', 'action', 'common', 'grey', 'contrastThreshold',
    'tonalOffset', 'mode', 'divider'
  ]);
  
  // Filter to get only custom color keys
  const customColorKeys = [...allPaletteKeys].filter(key => !standardPaletteKeys.has(key));
  
  if (customColorKeys.length > 0) {
    customTypeDefinitions.push(`
// Add custom colors to the palette type
declare module '@mui/material/styles' {
  interface Palette {
    ${customColorKeys.map(color => `${color}: PaletteColor;`).join('\n    ')}
  }
  
  interface PaletteOptions {
    ${customColorKeys.map(color => `${color}?: PaletteColorOptions;`).join('\n    ')}
  }
}

// Allow custom colors to be used with component props
declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    ${customColorKeys.map(color => `${color}: true;`).join('\n    ')}
  }
}

declare module '@mui/material/IconButton' {
  interface IconButtonPropsColorOverrides {
    ${customColorKeys.map(color => `${color}: true;`).join('\n    ')}
  }
}

declare module '@mui/material/Chip' {
  interface ChipPropsColorOverrides {
    ${customColorKeys.map(color => `${color}: true;`).join('\n    ')}
  }
}`);
  }
  
  // Write the type definitions file if we have custom types
  if (customTypeDefinitions.length > 0) {
    fs.writeFileSync(
      THEME_TYPES_OUTPUT_PATH,
      customTypeDefinitions.join('\n\n')
    );
    console.log(`Type definitions written to ${THEME_TYPES_OUTPUT_PATH}`);
  }
  
  console.log('Generating theme file...');
  
  // Define the available theme modes for TypeScript typing
  const modeNames = Object.keys(themeConfigs).map(mode => mode.toLowerCase());
  const colorModeType = modeNames.map(mode => `'${mode}'`).join(' | ');
  
  // Generate the theme file content
  const themeFileContent = `
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { PaletteMode } from '@mui/material';
import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';

// Import type definitions (if they exist)
try {
  require('./theme.types');
} catch (e) {
  // Types file might not exist if there are no custom types
}

// Cache for resolved token values
const resolvedTokenCache = {};

/**
 * Reset the token cache - call this when theme mode changes
 */
function resetTokenCache() {
  Object.keys(resolvedTokenCache).forEach(key => {
    delete resolvedTokenCache[key];
  });
}

/**
 * Recursively resolve {token.references} in values
 * This is a simplified version - in a real implementation, you'd
 * include the token data from your token files
 */
function resolveTokenValue(value, tokenData) {
  // If it's not a string or not a token reference, return as is
  if (typeof value !== 'string' || !value.startsWith('{') || !value.endsWith('}')) {
    return value;
  }
  
  // If we've already resolved this reference, return from cache
  if (resolvedTokenCache[value] !== undefined) {
    return resolvedTokenCache[value];
  }
  
  // In a real implementation, you'd resolve the token reference here
  // using the token data loaded from files
  
  // For now, we'll just return a placeholder for token references
  // console.log(\`Token reference found: \${value}\`);
  resolvedTokenCache[value] = value;
  return value;
}

/**
 * Process a theme object to resolve all token references
 */
function processThemeTokens(themeObj) {
  if (!themeObj || typeof themeObj !== 'object') return themeObj;
  
  if (Array.isArray(themeObj)) {
    return themeObj.map(item => processThemeTokens(item));
  }
  
  const result = {};
  for (const key in themeObj) {
    if (typeof themeObj[key] === 'string' && themeObj[key].startsWith('{') && themeObj[key].endsWith('}')) {
      result[key] = resolveTokenValue(themeObj[key]);
    } else if (typeof themeObj[key] === 'object' && themeObj[key] !== null) {
      result[key] = processThemeTokens(themeObj[key]);
    } else {
      result[key] = themeObj[key];
    }
  }
  return result;
}

// Theme configurations for each mode
${Object.entries(themeConfigs).map(([mode, config]) => {
  return `// ${mode} theme configuration
const ${mode.toLowerCase()}Theme = {
  palette: ${JSON.stringify(config.palette, null, 2)},
  typography: ${JSON.stringify(config.typography, null, 2)},
  spacing: ${config.spacing || 8},
  breakpoints: {
    values: ${JSON.stringify(config.breakpoints.values, null, 2)},
  },
  shadows: ${JSON.stringify(config.shadows, null, 2)},
  components: ${JSON.stringify(config.components, null, 2)},
};`;
}).join('\n\n')}

// All theme configurations object (for dynamic access)
const themeConfigs = {
  ${modeNames.map(mode => `${mode}: ${mode}Theme`).join(',\n  ')}
};

// Define available theme mode types
type ColorMode = ${colorModeType};

// Type for the theme mode context
type ColorModeContextType = {
  mode: ColorMode;
  setMode: (mode: ColorMode) => void;
  toggleColorMode: () => void;
  availableModes: ColorMode[];
};

// Default to light mode if available, otherwise the first available mode
const defaultColorMode: ColorMode = ${
  themeConfigs['Light'] ? "'light'" : `'${modeNames[0]}'`
};

// Create context for theme mode switching
const ColorModeContext = createContext<ColorModeContextType>({
  mode: defaultColorMode,
  setMode: () => {},
  toggleColorMode: () => {},
  availableModes: [${modeNames.map(mode => `'${mode}'`).join(', ')}],
});

// Hook to use the color mode context
export const useColorMode = () => useContext(ColorModeContext);

// Theme provider component
interface ThemeProviderProps {
  children: React.ReactNode;
  defaultMode?: ColorMode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  defaultMode = defaultColorMode
}) => {
  const [mode, setMode] = useState<ColorMode>(defaultMode);
  const availableModes: ColorMode[] = [${modeNames.map(mode => `'${mode}'`).join(', ')}];

  // Try to get saved mode from local storage on mount
  useEffect(() => {
    const savedMode = localStorage.getItem('themeMode');
    if (savedMode && availableModes.includes(savedMode as ColorMode)) {
      setMode(savedMode as ColorMode);
    }
  }, []);

  // Save mode to local storage when it changes
  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  // Create the context value
  const colorModeValue = useMemo(
    () => ({
      mode,
      setMode: (newMode: ColorMode) => setMode(newMode),
      toggleColorMode: () => {
        // Toggle between light and dark if both exist, otherwise cycle through available modes
        if (availableModes.includes('light') && availableModes.includes('dark')) {
          setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
        } else {
          const currentIndex = availableModes.indexOf(mode);
          const nextIndex = (currentIndex + 1) % availableModes.length;
          setMode(availableModes[nextIndex]);
        }
      },
      availableModes,
    }),
    [mode]
  );

  // Create the MUI theme based on the current mode
  const theme = useMemo(
    () => {
      // Reset token cache when mode changes
      resetTokenCache();
      
      // Deep clone the theme config to avoid mutating it
      const themeConfig = JSON.parse(JSON.stringify(themeConfigs[mode]));
      
      // Process theme to resolve token references
      const processedTheme = processThemeTokens(themeConfig);
      
      return createTheme(processedTheme);
    },
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorModeValue}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ColorModeContext.Provider>
  );
};

// Export pre-created themes for direct use
${modeNames.map(mode => `export const ${mode}MuiTheme = createTheme(processThemeTokens(${mode}Theme));`).join('\n')}

// Helper function to create a custom theme based on a mode
export function createCustomTheme(mode: ColorMode, customOptions = {}) {
  // First reset the token cache
  resetTokenCache();
  
  // Get the base theme and process it to resolve tokens
  const baseTheme = themeConfigs[mode];
  const processedBaseTheme = processThemeTokens(baseTheme);
  
  return createTheme({
    ...processedBaseTheme,
    ...customOptions,
    palette: {
      ...processedBaseTheme.palette,
      ...(customOptions.palette || {}),
    },
  });
}

// Export the default theme
export default ${
  themeConfigs['Light'] ? 'lightMuiTheme' : `${modeNames[0]}MuiTheme`
};
`;

  // Write the theme file
  fs.writeFileSync(THEME_OUTPUT_PATH, themeFileContent);
  console.log(`MUI theme generated successfully at ${THEME_OUTPUT_PATH}`);
}

// Execute the script
try {
  generateTheme();
} catch (error) {
  console.error('Error generating MUI theme:', error);
  process.exit(1);
}
