/**
 * MUI Button Theme Generator
 * 
 * This script creates a theme.json file focused specifically on Button components
 * across all three themes (light, dark, and largescreen modes).
 * 
 * It reads design tokens from the tokens/ directory and creates a MUI-compatible
 * theme configuration focusing only on button styling.
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  // Input paths
  coreTokensPath: path.join(__dirname, '..', 'tokens', 'coreTokens.json'),
  modesCollectionPath: path.join(__dirname, '..', 'variables', 'figma-collections-modes.json'),
  
  // Output path
  outputPath: path.join(__dirname, '..', 'themes', 'theme.json'),
  
  // Token files naming convention
  tokenFilePattern: mode => path.join(__dirname, '..', 'tokens', `${mode.toLowerCase()}ModeTokens.json`),
};

/**
 * Analyzes available modes from the figma-collections-modes.json file
 * @returns {Object} Information about available modes, collections and their mappings
 */
function analyzeModes() {
  console.log('Analyzing available modes...');
  
  try {
    const modesCollection = JSON.parse(fs.readFileSync(CONFIG.modesCollectionPath, 'utf8'));
    
    // Get unique modes from the collections
    const modes = modesCollection.modes || [];
    
    // Format mode names to match token file naming convention
    // Converts "Light" -> "light", "Dark" -> "dark", "Large Screen" -> "largescreen"
    const formattedModes = modes.map(mode => ({
      originalName: mode,
      formattedName: mode.toLowerCase().replace(/\s+/g, '')
    }));
    
    console.log(`Found ${formattedModes.length} modes: ${formattedModes.map(m => m.originalName).join(', ')}`);
    
    return {
      modes: formattedModes,
      modeIds: modesCollection.modeIds || {},
      collections: modesCollection.collections || [],
      modesByCollection: modesCollection.modesByCollection || {}
    };
  } catch (error) {
    console.error('Error analyzing modes:', error);
    console.log('Falling back to default modes: light, dark');
    
    // Fallback to default modes if analysis fails
    return {
      modes: [
        { originalName: 'Light', formattedName: 'light' },
        { originalName: 'Dark', formattedName: 'dark' },
        { originalName: 'Large Screen', formattedName: 'largescreen' }
      ],
      modeIds: {},
      collections: [],
      modesByCollection: {}
    };
  }
}

/**
 * Loads token data from specified file paths
 * @param {Array} modes The list of modes to load tokens for
 * @returns {Object} Object containing all token sets
 */
function loadTokens(modes) {
  console.log('Loading tokens...');
  
  try {
    const tokens = {
      core: JSON.parse(fs.readFileSync(CONFIG.coreTokensPath, 'utf8'))
    };
    
    // Load mode-specific tokens
    for (const mode of modes) {
      const tokenFilePath = CONFIG.tokenFilePattern(mode.formattedName);
      
      if (fs.existsSync(tokenFilePath)) {
        tokens[mode.formattedName] = JSON.parse(fs.readFileSync(tokenFilePath, 'utf8'));
        console.log(`Loaded tokens for ${mode.originalName} mode`);
      } else {
        console.warn(`Warning: Token file not found for ${mode.originalName} mode at ${tokenFilePath}`);
      }
    }
    
    return tokens;
  } catch (error) {
    console.error('Error loading token files:', error);
    process.exit(1);
  }
}

/**
 * Extracts button-specific tokens from token sets
 * @param {Object} tokens The complete token set
 * @returns {Object} Button-specific tokens
 */
function extractButtonTokens(tokens) {
  console.log('Extracting button-specific tokens...');
  
  const buttonTokens = {};
  
  // Include core tokens for reference resolution
  if (tokens.core) {
    buttonTokens.core = tokens.core;
  }
  
  // Extract theme-specific button tokens from each mode
  for (const [themeName, themeTokens] of Object.entries(tokens)) {
    if (themeName === 'core') continue; // We've already added core tokens
    
    // Check for button tokens
    const hasButtonTokens = themeTokens.button || // Check if there's a button object
                         (themeTokens.component && themeTokens.component.button); // Or check inside component
    
    if (!hasButtonTokens) {
      console.log(`Skipping ${themeName} mode - no button tokens found`);
      continue;
    }
    
    console.log(`Found button tokens for ${themeName} mode`);
    buttonTokens[themeName] = {};
    
    // Extract button-specific tokens
    if (themeTokens.button) {
      buttonTokens[themeName].button = themeTokens.button;
    } else if (themeTokens.component && themeTokens.component.button) {
      buttonTokens[themeName].button = themeTokens.component.button;
    }
    
    // Extract relevant base tokens that might be referenced by button tokens
    if (themeTokens.Base) {
      buttonTokens[themeName].Base = themeTokens.Base;
    }
    
    // Extract other token categories that might be referenced by button tokens
    const relevantCategories = ['Lighthouse', 'spacing', 'typography', 'component'];
    relevantCategories.forEach(category => {
      if (themeTokens[category]) {
        buttonTokens[themeName][category] = themeTokens[category];
      }
    });
  }
  
  return buttonTokens;
}

/**
 * Resolves token references (e.g., {Base.primary.main}) to actual values
 * @param {Object} buttonTokens The extracted button tokens
 * @param {Object} allTokens All available tokens for reference resolution
 * @returns {Object} Resolved button tokens
 */
function resolveTokenReferences(buttonTokens, allTokens) {
  console.log('Resolving token references...');
  
  const resolvedTokens = JSON.parse(JSON.stringify(buttonTokens)); // Deep clone
  
  // Process each mode
  for (const [modeName, modeTokens] of Object.entries(buttonTokens)) {
    if (modeName === 'core') continue; // Skip core tokens, they're just for reference
    
    console.log(`Resolving references for ${modeName} mode...`);
    resolveReferencesInObject(resolvedTokens[modeName], modeName, allTokens);
  }
  
  return resolvedTokens;
}

/**
 * Helper function to recursively resolve references in an object
 * @param {Object} obj The object to resolve references in
 * @param {String} modeName The current mode name
 * @param {Object} allTokens All available tokens for reference resolution
 * @param {Number} depth Current recursion depth to prevent infinite loops
 */
function resolveReferencesInObject(obj, modeName, allTokens, depth = 0) {
  if (!obj || typeof obj !== 'object' || depth > 10) return; // Prevent infinite recursion
  
  // Process each property
  for (const [key, value] of Object.entries(obj)) {
    // If it's a token with a reference value
    if (value && typeof value === 'object' && value.$type && value.$value) {
      if (typeof value.$value === 'string' && value.$value.startsWith('{') && value.$value.endsWith('}')) {
        // It's a reference
        const refPath = value.$value.slice(1, -1); // Remove the braces
        const resolvedValue = resolveReference(refPath, modeName, allTokens);
        
        if (resolvedValue !== undefined) {
          // If resolvedValue is still a reference string, try to resolve it again
          if (typeof resolvedValue === 'string' && 
              resolvedValue.startsWith('{') && 
              resolvedValue.endsWith('}')) {
            // Try to resolve the nested reference
            const nestedRefPath = resolvedValue.slice(1, -1);
            const nestedResolvedValue = resolveReference(nestedRefPath, modeName, allTokens);
            
            if (nestedResolvedValue !== undefined) {
              obj[key] = {
                ...value,
                $value: nestedResolvedValue,
                // If there's a raw value in the reference, use it
                $rawValue: typeof nestedResolvedValue === 'object' && nestedResolvedValue.$rawValue !== undefined 
                  ? nestedResolvedValue.$rawValue 
                  : (typeof nestedResolvedValue === 'string' ? nestedResolvedValue : value.$rawValue),
                $originalRef: value.$value // Keep the original reference for debugging
              };
            }
          } else {
            // Update the value with the resolved reference
            obj[key] = {
              ...value,
              $value: resolvedValue,
              // If there's a raw value in the reference, use it
              $rawValue: typeof resolvedValue === 'object' && resolvedValue.$rawValue !== undefined 
                ? resolvedValue.$rawValue 
                : (typeof resolvedValue === 'string' ? resolvedValue : value.$rawValue),
              $originalRef: value.$value // Keep the original reference for debugging
            };
          }
        }
      }
    } 
    // If it's an object, recurse
    else if (value && typeof value === 'object') {
      resolveReferencesInObject(value, modeName, allTokens, depth + 1);
    }
  }
}

/**
 * Resolves a single reference path to its value
 * @param {String} refPath The reference path (e.g., "Base.primary.main")
 * @param {String} modeName The current mode name
 * @param {Object} allTokens All available tokens
 * @param {Number} depth Current recursion depth to prevent infinite loops
 * @returns {*} The resolved value, or undefined if not found
 */
function resolveReference(refPath, modeName, allTokens, depth = 0) {
  if (depth > 10) {
    console.warn(`Possible circular reference detected: ${refPath} in mode ${modeName}`);
    return undefined;
  }
  
  try {
    const parts = refPath.split('.');
    
    // First try to resolve from the current mode
    let resolvedValue = findValueByPath(allTokens[modeName], parts);
    
    // If not found in current mode, try core tokens
    if (resolvedValue === undefined && allTokens.core) {
      resolvedValue = findValueByPath(allTokens.core, parts);
    }
    
    // Check if we found a value
    if (resolvedValue !== undefined) {
      // If it's a reference itself, resolve it recursively
      if (typeof resolvedValue === 'string' && 
          resolvedValue.startsWith('{') && 
          resolvedValue.endsWith('}')) {
        return resolveReference(resolvedValue.slice(1, -1), modeName, allTokens, depth + 1);
      }
      
      // If it's an object with a $rawValue, prioritize that
      if (typeof resolvedValue === 'object' && resolvedValue.$rawValue !== undefined) {
        return resolvedValue.$rawValue;
      }
    }
    
    return resolvedValue;
  } catch (error) {
    console.warn(`Failed to resolve reference: ${refPath} in mode ${modeName}`);
    return undefined;
  }
}

/**
 * Helper function to find a value by path in an object
 * @param {Object} obj The object to search in
 * @param {Array} pathParts The path parts to navigate
 * @returns {*} The value if found, undefined otherwise
 */
function findValueByPath(obj, pathParts) {
  if (!obj || !pathParts.length) return undefined;
  
  let current = obj;
  
  for (const part of pathParts) {
    if (!current || typeof current !== 'object') return undefined;
    current = current[part];
  }
  
  // If we found a token object, prioritize $rawValue over $value
  if (current && typeof current === 'object') {
    // Prefer $rawValue if available, otherwise fall back to $value
    if (current.$rawValue !== undefined) {
      return current.$rawValue;
    } else if (current.$value !== undefined) {
      return current.$value;
    }
  }
  
  return current;
}

/**
 * Transforms the button tokens into MUI theme format
 * @param {Object} buttonTokens The extracted and resolved button tokens
 * @param {Object} allTokens All available tokens for reference resolution
 * @returns {Object} MUI-compatible theme object
 */
function transformToMUITheme(buttonTokens, allTokens) {
  console.log('Transforming to MUI theme format...');
  
  // Create the base theme structure 
  const theme = {
    colorSchemes: {},
    shadows: ["none"],  // Starting with just "none", can be expanded
    typography: {},     // Will be populated if needed
    spacing: [0],       // Base spacing unit, can be expanded
    breakpoints: {
      values: {}        // Will be populated if needed
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {}      // Common button styles across all variants
        }
      }
    }
  };
  
  // Set up the button component's basic structure
  const buttonStyleOverrides = theme.components.MuiButton.styleOverrides;
  
  // Process each mode (theme) dynamically
  for (const [modeName, modeTokens] of Object.entries(buttonTokens)) {
    if (modeName === 'core') continue; // Skip core tokens
    
    // Map our mode names to MUI color scheme keys
    // MUI expects "light" and "dark" as standard color scheme keys
    // But can also support custom scheme names
    let schemeKey = modeName;
    
    console.log(`Processing ${modeName} mode for MUI theme...`);
    
    // Initialize the color scheme with palette
    theme.colorSchemes[schemeKey] = {
      palette: {
        // Basic palette structure
        primary: {},
        secondary: {},
        error: {},
        warning: {},
        info: {},
        success: {},
        background: {},
        text: {}
      }
    };
    
    // Extract button colors from tokens and map to MUI palette
    if (modeTokens.button) {
      // Map primary button colors
      if (modeTokens.button.primary?.background?.default) {
        // Prefer $rawValue over $value
        theme.colorSchemes[schemeKey].palette.primary.main = 
          modeTokens.button.primary.background.default.$rawValue !== undefined
            ? modeTokens.button.primary.background.default.$rawValue
            : modeTokens.button.primary.background.default.$value;
        
        // If text color is specified
        if (modeTokens.button.primary?.text?.default) {
          theme.colorSchemes[schemeKey].palette.primary.contrastText = 
            modeTokens.button.primary.text.default.$rawValue !== undefined
              ? modeTokens.button.primary.text.default.$rawValue
              : modeTokens.button.primary.text.default.$value;
        }
        
        // If hover state is specified
        if (modeTokens.button.primary?.background?.hover) {
          theme.colorSchemes[schemeKey].palette.primary.dark = 
            modeTokens.button.primary.background.hover.$rawValue !== undefined
              ? modeTokens.button.primary.background.hover.$rawValue
              : modeTokens.button.primary.background.hover.$value;
        }
        
        // If disabled state is specified
        if (modeTokens.button.primary?.background?.disabled) {
          // MUI doesn't directly support disabled colors in palette
          // We'll add it to our custom properties for component styles
          theme.colorSchemes[schemeKey].palette.primary.disabled = 
            modeTokens.button.primary.background.disabled.$rawValue !== undefined
              ? modeTokens.button.primary.background.disabled.$rawValue
              : modeTokens.button.primary.background.disabled.$value;
        }
      }
      
      // Map secondary button colors
      if (modeTokens.button.secondary?.background?.default) {
        // Use raw value or fully resolved reference
        const secondaryMain = modeTokens.button.secondary.background.default.$rawValue !== undefined
          ? modeTokens.button.secondary.background.default.$rawValue
          : modeTokens.button.secondary.background.default.$value;

        theme.colorSchemes[schemeKey].palette.secondary.main = secondaryMain;
        
        // For text, ensure we resolve any remaining references
        if (modeTokens.button.secondary?.text?.default) {
          let contrastText = modeTokens.button.secondary.text.default.$rawValue !== undefined
            ? modeTokens.button.secondary.text.default.$rawValue
            : modeTokens.button.secondary.text.default.$value;
          
          // If it's still a reference string, try to resolve it manually
          if (typeof contrastText === 'string' && 
              contrastText.startsWith('{') && 
              contrastText.endsWith('}')) {
            const refPath = contrastText.slice(1, -1);
            
            // Special case handling for known references
            if (refPath === 'Base.secondary.on-main' && (modeName === 'dark' || modeName === 'mobile')) {
              contrastText = "rgba(255, 255, 255, 1)";
            } else {
              const resolved = resolveReference(refPath, modeName, allTokens);
              if (resolved !== undefined) {
                contrastText = resolved;
              }
            }
          }
          
          theme.colorSchemes[schemeKey].palette.secondary.contrastText = contrastText;
        }
        
        // For hover state
        if (modeTokens.button.secondary?.background?.hover) {
          const hoverColor = modeTokens.button.secondary.background.hover.$rawValue !== undefined
            ? modeTokens.button.secondary.background.hover.$rawValue
            : modeTokens.button.secondary.background.hover.$value;
          
          theme.colorSchemes[schemeKey].palette.secondary.dark = hoverColor;
        }
      }
      
      // Handle ghost button if available (this would map to MUI's outlined variant)
      if (modeTokens.button.ghost) {
        if (!theme.colorSchemes[schemeKey].components) {
          theme.colorSchemes[schemeKey].components = {};
        }
        
        if (!theme.colorSchemes[schemeKey].components.MuiButton) {
          theme.colorSchemes[schemeKey].components.MuiButton = { styleOverrides: {} };
        }
        
        // Add ghost button styles to the outlined variant
        theme.colorSchemes[schemeKey].components.MuiButton.styleOverrides.outlined = {
          backgroundColor: modeTokens.button.ghost.background?.default?.$rawValue !== undefined
            ? modeTokens.button.ghost.background.default.$rawValue
            : (modeTokens.button.ghost.background?.default?.$value || 'transparent'),
          borderColor: modeTokens.button.ghost.border?.default?.$rawValue !== undefined
            ? modeTokens.button.ghost.border.default.$rawValue
            : (modeTokens.button.ghost.border?.default?.$value || 'currentColor'),
          color: modeTokens.button.ghost.text?.default?.$rawValue !== undefined
            ? modeTokens.button.ghost.text.default.$rawValue
            : (modeTokens.button.ghost.text?.default?.$value || 'inherit')
        };
        
        // Add hover state if available
        if (modeTokens.button.ghost.background?.hover || modeTokens.button.ghost.text?.hover) {
          theme.colorSchemes[schemeKey].components.MuiButton.styleOverrides.outlined['&:hover'] = {
            backgroundColor: modeTokens.button.ghost.background?.hover?.$rawValue !== undefined
              ? modeTokens.button.ghost.background.hover.$rawValue
              : modeTokens.button.ghost.background?.hover?.$value,
            color: modeTokens.button.ghost.text?.hover?.$rawValue !== undefined
              ? modeTokens.button.ghost.text.hover.$rawValue
              : modeTokens.button.ghost.text?.hover?.$value
          };
        }
      }
      
      // Extract button sizes if available
      const paddingVertical = modeTokens.button['button-padding-vertical']?.$rawValue !== undefined
        ? modeTokens.button['button-padding-vertical'].$rawValue
        : modeTokens.button['button-padding-vertical']?.$value;
      const paddingHorizontal = modeTokens.button['button-padding-horizontal']?.$rawValue !== undefined
        ? modeTokens.button['button-padding-horizontal'].$rawValue
        : modeTokens.button['button-padding-horizontal']?.$value;
      
      if (paddingVertical && paddingHorizontal) {
        // Set the padding for this color scheme
        if (!theme.colorSchemes[schemeKey].components) {
          theme.colorSchemes[schemeKey].components = {};
        }
        
        if (!theme.colorSchemes[schemeKey].components.MuiButton) {
          theme.colorSchemes[schemeKey].components.MuiButton = { styleOverrides: {} };
        }
        
        if (!theme.colorSchemes[schemeKey].components.MuiButton.styleOverrides.sizeMedium) {
          theme.colorSchemes[schemeKey].components.MuiButton.styleOverrides.sizeMedium = {};
        }
        
        theme.colorSchemes[schemeKey].components.MuiButton.styleOverrides.sizeMedium.padding = 
          `${paddingVertical} ${paddingHorizontal}`;
      }
    }
  }
  
  // Setup general button style overrides that apply across all color schemes
  // These are shared properties that don't vary by theme
  
  // Define base styles for all buttons
  buttonStyleOverrides.root = {
    fontFeatureSettings: "'liga' off, 'clig' off",
    fontFamily: "Arial, Helvetica, Arial, sans-serif",
    textTransform: "none", // Most design systems prefer no text transform
    borderRadius: "var(--mui-shape-borderRadius)",
    boxShadow: "none"  // Flat design is common in modern UIs
  };
  
  // Define size variants - can be overridden by specific color schemes
  buttonStyleOverrides.sizeLarge = {
    fontSize: "1rem",
    lineHeight: "26px",
    letterSpacing: "0.46px",
    padding: "8px 20px",
  };
  
  buttonStyleOverrides.sizeMedium = {
    fontSize: "0.875rem",
    lineHeight: "24px",
    letterSpacing: "0.4px",
    padding: "6px 16px",
  };
  
  buttonStyleOverrides.sizeSmall = {
    fontSize: "0.75rem",
    lineHeight: "20px",
    letterSpacing: "0.4px",
    padding: "4px 10px",
  };
  
  // Define variant styles (these are the base styles that will be overridden by color schemes)
  buttonStyleOverrides.contained = {
    boxShadow: "none"
  };
  
  buttonStyleOverrides.outlined = {
    borderWidth: "1px",
    borderStyle: "solid",
    "&:hover": {
      borderWidth: "1px" // Maintain border width on hover
    }
  };
  
  buttonStyleOverrides.text = {
    padding: "6px 8px"
  };
  
  console.log(`Created theme with ${Object.keys(theme.colorSchemes).length} color schemes: ${Object.keys(theme.colorSchemes).join(', ')}`);
  
  return theme;
}

/**
 * Main function to orchestrate the theme generation process
 */
async function generateButtonTheme() {
  console.log('Starting MUI Button Theme generation...');
  
  // 1. Analyze available modes
  const modesInfo = analyzeModes();
  console.log(`Working with modes: ${modesInfo.modes.map(m => m.originalName).join(', ')}`);
  
  // 2. Load all tokens based on discovered modes
  const allTokens = loadTokens(modesInfo.modes);
  
  // 3. Extract button-specific tokens
  const buttonTokens = extractButtonTokens(allTokens);
  
  // 4. Resolve token references
  const resolvedTokens = resolveTokenReferences(buttonTokens, allTokens);
  
  // 5. Transform to MUI theme format
  const muiTheme = transformToMUITheme(resolvedTokens, allTokens);
  
  // 6. Save the theme.json file
  fs.writeFileSync(CONFIG.outputPath, JSON.stringify(muiTheme, null, 2));
  
  console.log(`Button theme successfully generated at: ${CONFIG.outputPath}`);
}

/**
 * Test function to check the analyzeModes function
 */
function testAnalyzeModes() {
  console.log('Testing analyzeModes() function...');
  
  try {
    // Call analyzeModes and get the result
    const modesInfo = analyzeModes();
    
    // Print detailed results
    console.log('\n=== Mode Analysis Results ===');
    console.log(`\nTotal modes found: ${modesInfo.modes.length}`);
    
    // Log each mode with its formatted name
    console.log('\nModes and their formatted names:');
    modesInfo.modes.forEach(mode => {
      console.log(`- ${mode.originalName} -> ${mode.formattedName}`);
    });
    
    // Log mode IDs
    console.log('\nMode IDs:');
    Object.entries(modesInfo.modeIds).forEach(([name, id]) => {
      console.log(`- ${name}: ${id}`);
    });
    
    // Log collections
    console.log('\nCollections:');
    modesInfo.collections.forEach(collection => {
      console.log(`- ${collection.name} (${collection.id})`);
    });
    
    // Log modes by collection
    console.log('\nModes by Collection:');
    Object.entries(modesInfo.modesByCollection).forEach(([collectionId, modes]) => {
      // Find collection name
      const collection = modesInfo.collections.find(c => c.id === collectionId);
      const collectionName = collection ? collection.name : 'Unknown Collection';
      console.log(`- ${collectionName} (${collectionId}): ${modes.join(', ')}`);
    });
    
    console.log('\n=== End of Mode Analysis ===\n');
    return modesInfo;
  } catch (error) {
    console.error('Error testing analyzeModes:', error);
    return null;
  }
}

// Choose which function to run based on command line arguments
if (process.argv.includes('--test-modes')) {
  testAnalyzeModes();
} else {
  // Run the full theme generator
  generateButtonTheme()
    .then(() => console.log('Button theme generation completed successfully'))
    .catch(error => {
      console.error('Error generating button theme:', error);
      process.exit(1);
    });
}
