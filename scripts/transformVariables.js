/**
 * Figma variables to Design Tokens Transformation
 * 
 * This script transforms raw Figma variables into simplified token format
 * for use in design systems. It handles dynamic theme generation based on
 * collections and modes detected in Figma data.
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Configuration for the transformation process
const CONFIG = {
  // Input/Output paths - updated for script directory
  inputPath: path.join(__dirname, '..', 'variables', 'figma-variables-raw.json'),
  collectionsModesPath: path.join(__dirname, '..', 'variables', 'figma-collections-modes.json'),
  outputDir: path.join(__dirname, '..', 'tokens'),
  archiveDir: path.join(__dirname, '..', 'archive'),
  
  // Core token filename
  coreTokensFilename: 'coreTokens.json',
  
  // Mode-specific configurations - will be populated from figma-collections-modes.json
  // This is just a fallback if collections-modes.json doesn't exist or for manual overrides
  modeConfigs: {},
  
  // Token mapping - how Figma variable naming maps to token structure
  tokenMapping: {
    // Will be populated dynamically based on variable analysis
  },
  
  // Date format for file metadata
  dateFormat: { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  },
  
  // Collection mappings
  collectionMappings: {
    'Colors': null // Will be distributed to mode-specific files
  },

  // Deletion strategy: 'archive', 'delete', 'mark-deprecated', or 'report'
  deletionStrategy: 'archive',  // Metadata defaults
  metadataDefaults: {
    author: process.env.AUTHOR_NAME || 'Design System Team'
  },
  
  // Logging
  verbose: true
};

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
  dryRun: args.includes('--dry-run') || args.includes('-d'),
  verbose: args.includes('--verbose') || args.includes('-v'),
  deletion: args.find(arg => arg.startsWith('--deletion='))?.split('=')[1] || CONFIG.deletionStrategy,
};

// Override configuration based on command line options
if (options.deletion && ['archive', 'delete', 'mark-deprecated', 'report'].includes(options.deletion)) {
  CONFIG.deletionStrategy = options.deletion;
}

/**
 * Utility function to normalize a mode name and generate a filename
 * @param {string} modeName - Name of the mode from Figma
 * @returns {Object} Object with normalized mode name and filename
 */
function normalizeMode(modeName) {
  const normalized = modeName.trim();
  const fileName = normalized.toLowerCase().replace(/\s+/g, '') + 'ModeTokens.json';
  return { normalized, fileName };
}

// Load mode configurations from figma-collections-modes.json if it exists
try {
  console.log(`🔍 Loading mode configurations from ${CONFIG.collectionsModesPath}`);
  if (fs.existsSync(CONFIG.collectionsModesPath)) {
    const collectionsModesData = JSON.parse(fs.readFileSync(CONFIG.collectionsModesPath, 'utf8'));
    
    // Populate mode configs dynamically from the data
    if (collectionsModesData.modes && Array.isArray(collectionsModesData.modes)) {
      collectionsModesData.modes.forEach(mode => {
        const { normalized, fileName } = normalizeMode(mode);
        
        // Only add if not already defined (allows manual overrides)
        if (!CONFIG.modeConfigs[normalized]) {
          CONFIG.modeConfigs[normalized] = {
            filename: fileName,
            description: `${normalized} mode design tokens`
          };
          console.log(`📝 Loaded mode configuration for: ${normalized}`);
        }
      });
      console.log(`✅ Successfully loaded ${Object.keys(CONFIG.modeConfigs).length} mode configurations`);
    }
  } else {
    console.warn(`⚠️ No collections-modes file found at ${CONFIG.collectionsModesPath}, using default configurations`);
    // Set some reasonable defaults if the file doesn't exist
    CONFIG.modeConfigs = {
      'Light': { 
        filename: 'lightModeTokens.json', 
        description: 'Light mode design tokens'
      },
      'Dark': { 
        filename: 'darkModeTokens.json', 
        description: 'Dark mode design tokens'
      }
    };
  }
} catch (error) {
  console.error(`❌ Error loading mode configurations: ${error.message}`);
  console.warn('⚠️ Falling back to default configurations');
}

// Load the raw Figma variables data
console.log(`🔍 Loading raw Figma variables from ${CONFIG.inputPath}`);
const rawData = JSON.parse(fs.readFileSync(CONFIG.inputPath, 'utf8'));

// Load existing token files
console.log(`📂 Loading existing token files from ${CONFIG.outputDir}`);
const existingFiles = loadExistingTokenFiles();

// Create a map of collection IDs to their names for reference
function createCollectionMap() {
  console.log('🗺️ Creating collection and mode mapping');
  
  // Make sure we're using meta.variableCollections path
  if (!rawData.meta) {
    console.error('❌ Error: Raw data does not contain meta information');
    process.exit(1);
  }
  
  const collections = rawData.meta?.variableCollections || {};
  const collectionMap = {};
  const modesByCollection = {};
  const allModes = new Set();
  const modeIds = {};
  
  for (const [collectionId, collection] of Object.entries(collections)) {
    collectionMap[collectionId] = {
      id: collectionId,
      name: collection.name
    };
    
    modesByCollection[collectionId] = [];
    
    collection.modes.forEach(mode => {
      modesByCollection[collectionId].push(mode.name);
      allModes.add(mode.name);
      modeIds[mode.name] = mode.modeId;
    });
  }
  
  // Save collections and modes data for future reference
  const collectionsAndModes = {
    collections: Object.values(collectionMap),
    modes: Array.from(allModes),
    modesByCollection,
    modeIds
  };
  
  fs.writeFileSync(
    CONFIG.collectionsModesPath, 
    JSON.stringify(collectionsAndModes, null, 2), 
    'utf8'
  );
  console.log(`💾 Saved collections and modes data to ${CONFIG.collectionsModesPath}`);
  
  return { collectionMap, modesByCollection, modes: Array.from(allModes), modeIds };
}

/**
 * Load existing token files for reference and preservation
 * @returns {Object} Map of filename to file contents
 */
function loadExistingTokenFiles() {
  const existingFiles = {};
  
  // Ensure output directory exists
  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
    console.log(`📁 Created output directory: ${CONFIG.outputDir}`);
    return existingFiles;
  }
  
  // Read all JSON files in the output directory
  const files = fs.readdirSync(CONFIG.outputDir)
    .filter(file => file.endsWith('.json'));
  
  files.forEach(file => {
    try {
      const filePath = path.join(CONFIG.outputDir, file);
      const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      existingFiles[file] = content;
      console.log(`📄 Loaded existing file: ${file}`);
    } catch (error) {
      console.warn(`⚠️ Could not parse existing file ${file}:`, error.message);
    }
  });
  
  return existingFiles;
}

/**
 * Analyze the structure of the existing simplified tokens
 * @param {Object} existingFiles - Map of filename to file contents
 */
function analyzeSimplifiedTokens(existingFiles) {
  console.log('\n====== ANALYZING EXISTING SIMPLIFIED TOKENS ======\n');
  
  // Check each file
  Object.entries(existingFiles).forEach(([filename, content]) => {
    console.log(`File: ${filename}`);
    console.log('- Top-level categories:', Object.keys(content).filter(key => key !== 'metadata'));
    console.log('- Last updated:', content.metadata?.updated);
    
    // Sample a few tokens to understand structure
    const categories = Object.keys(content).filter(key => key !== 'metadata');
    if (categories.length > 0) {
      const firstCategory = categories[0];
      const tokens = content[firstCategory];
      const sampleToken = Object.keys(tokens)[0];
      
      if (sampleToken) {
        console.log('- Sample token structure:');
        console.log(JSON.stringify(tokens[sampleToken], null, 2));
      }
    }
    
    console.log('');
  });
}

/**
 * Create a mapping between Figma variable names and simplified token structure
 * @param {Object} collectionInfo - Collection mapping information
 * @returns {Object} Token mapping rules and patterns
 */
function createTokenMapping(collectionInfo) {
  console.log('\n====== CREATING TOKEN MAPPING PATTERNS ======\n');
  
  // Analyze variables to detect patterns
  const variables = rawData.meta?.variables || {};
  const patterns = analyzeVariableNamePatterns(variables, collectionInfo);
  
  // Helper function to determine if a value should have px units
  function isNonDimensionalValue(variableName) {
    variableName = variableName.toLowerCase();
    return variableName.includes('opacity') || 
           variableName.includes('z-index') ||
           variableName.includes('scale') || 
           variableName.includes('alpha') ||
           variableName.includes('weight') ||
           variableName.includes('fontweight');
  }
  
  // Define mapping rules based on detected patterns
  const tokenMap = {
    // Default patterns
    patterns: [
      // References (handled specially)
      { 
        type: 'VARIABLE_ALIAS',
        transform: (value, variable) => {
          // Convert Figma reference format to our token reference format
          if (value && value.id) {
            const refVariable = variables[value.id];
            if (refVariable) {
              return `{${refVariable.name.replace(/\//g, '.')}}`;
            }
          }
          return value;
        }
      },
      
      // Colors
      { 
        type: 'COLOR',
        transform: (value) => {
          // Ensure color is in correct format (hex or rgba)
          if (typeof value === 'object' && 'r' in value && 'g' in value && 'b' in value) {
            const { r, g, b, a = 1 } = value;
            const rInt = Math.round(r * 255);
            const gInt = Math.round(g * 255);
            const bInt = Math.round(b * 255);
            const aFloat = parseFloat(a.toFixed(2));
            
            // Convert to hex if no alpha or alpha is 1
            if (a === 1) {
              const hex = [rInt, gInt, bInt]
                .map(n => n.toString(16).padStart(2, '0'))
                .join('');
              return `#${hex}`;
            }
            
            // Use rgba for transparent colors
            return `rgba(${rInt}, ${gInt}, ${bInt}, ${aFloat})`;
          }
          return value;
        }
      },
      

      
      // Dimensions
      { 
        type: 'FLOAT',
        transform: (value, variable) => {
          // Add units based on variable name pattern and context
          if (typeof value === 'number') {
            // Use the helper function to determine if value should have px
            const isNonDimensional = isNonDimensionalValue(variable.name);
            return isNonDimensional ? value : `${value}px`;
          }
          return value;
        }
      },
      // Integer dimensions
      { 
        type: 'INTEGER',
        transform: (value, variable) => {
          // Add units based on variable name pattern and context - reuse the same logic
          if (typeof value === 'number') {
            // Use the helper function to determine if value should have px
            const isNonDimensional = isNonDimensionalValue(variable.name);
            return isNonDimensional ? value : `${value}px`;
          }
          return value;
        }
      },
    ],
    
    // Collection to file mappings
    collectionMappings: { ...CONFIG.collectionMappings },
    
    // Discovered patterns from analysis
    discoveredPatterns: patterns
  };
  
  console.log('✅ Token mapping created');
  return tokenMap;
}

/**
 * Analyze variable name patterns to identify structure
 * @param {Object} variables - variables from Figma
 * @param {Object} collectionInfo - Collection mapping information
 * @returns {Array} Discovered patterns
 */
function analyzeVariableNamePatterns(variables, collectionInfo) {
  console.log('🔍 Analyzing variable naming patterns');
  
  const patterns = [];
  const nameSegments = new Map();
  
  // Sample variables to identify patterns
  const sampleSize = Math.min(Object.keys(variables).length, 50);
  // Convert object to array for sampling
  const variablesArray = Object.values(variables);
  const samplevariables = variablesArray.slice(0, sampleSize);
  
  samplevariables.forEach(variable => {
    const segments = variable.name.split('/');
    const collectionId = variable.variableCollectionId;
    const collection = collectionInfo.collectionMap[collectionId];
    
    // Track segment patterns by collection
    if (collection) {
      const key = `${collection.name}:${segments.length}`;
      if (!nameSegments.has(key)) {
        nameSegments.set(key, []);
      }
      nameSegments.get(key).push(segments);
    }
    
    // Sample analysis
    if (CONFIG.verbose && patterns.length < 5) {
      console.log(`Variable: ${variable.name}`);
      console.log(`- Collection: ${collection?.name || 'Unknown'}`);
      console.log(`- Type: ${variable.resolvedType}`);
      
      // Log the values for different modes if available
      if (variable.valuesByMode) {
        console.log('- Values by mode:');
        for (const [modeId, value] of Object.entries(variable.valuesByMode)) {
          const modeName = Object.keys(collectionInfo.modeIds).find(
            mode => collectionInfo.modeIds[mode] === modeId
          );
          console.log(`  - ${modeName || modeId}: ${JSON.stringify(value)}`);
        }
      }
      console.log('');
    }
  });
  
  // Analyze common patterns by collection
  nameSegments.forEach((segments, key) => {
    const [collectionName, segmentCount] = key.split(':');
    
    // Find common pattern for this segment structure
    if (segments.length >= 3) {
      const firstSegs = segments.map(s => s[0]);
      const middleSegs = segments.map(s => s.slice(1, -1));
      const lastSegs = segments.map(s => s[s.length - 1]);
      
      // If we find consistent patterns, add them
      const pattern = {
        collection: collectionName,
        segmentCount: parseInt(segmentCount),
        examples: segments.slice(0, 3).map(s => s.join('/')),
      };
      
      patterns.push(pattern);
    }
  });
  
  console.log(`✅ Identified ${patterns.length} common naming patterns`);
  return patterns;
}

/**
 * Transform variables based on collections and modes
 * @param {Object} tokenMap - Token mapping rules
 * @param {Object} collectionInfo - Collection mapping information
 * @returns {Object} Transformed tokens organized by output file
 */
function transformvariablesByCollectionAndMode(tokenMap, collectionInfo) {
  console.log('\n====== TRANSFORMING variables ======\n');
  
  const transformedTokens = {
    core: { 
      metadata: generateMetadata('Core design tokens') 
    },
    modes: {}
  };
  
  // Initialize token structures for each mode
  collectionInfo.modes.forEach(mode => {
    if (!CONFIG.modeConfigs[mode]) {
      // Add newly discovered modes to the configuration - this shouldn't happen
      // since we already loaded them from figma-collections-modes.json, but just in case
      const { normalized, fileName } = normalizeMode(mode);
      
      CONFIG.modeConfigs[mode] = {
        filename: fileName,
        description: `${mode} mode design tokens`
      };
      console.log(`🆕 Discovered unexpected new mode: ${mode}`);
    }
    
    transformedTokens.modes[mode] = {
      metadata: generateMetadata(`${mode} mode tokens`)
    };
  });
  
  // Process variables from raw data - NOTE: variables are in meta.variables not at root level
  const variables = rawData.meta?.variables || {};
  const variableMap = createVariableMap(variables);
  
  // First pass: Process variables by collection
  console.log(`🔄 Processing ${Object.keys(variables).length} variables...`);
  
  Object.values(variables).forEach(variable => {
    const collectionId = variable.variableCollectionId;
    const collection = collectionInfo.collectionMap[collectionId];
    
    if (!collection) {
      console.warn(`⚠️ Unknown collection for variable ${variable.name}`);
      return;
    }
    
    // Process based on collection type
    if (collection.name === 'Core') {
      processCoreVariable(variable, transformedTokens.core, variableMap, tokenMap);
    } else {
      // Process variables for each mode they appear in
      Object.entries(variable.valuesByMode || {}).forEach(([modeId, value]) => {
        const mode = collectionInfo.modes.find(m => 
          collectionInfo.modesByCollection[collection.id]?.includes(m) && 
          collectionInfo.modeIds[m] === modeId
        );
        
        if (mode && transformedTokens.modes[mode]) {
          processModeVariable(
            variable, 
            mode, 
            collection.name, 
            transformedTokens.modes[mode], 
            variableMap,
            tokenMap,
            value
          );
        }
      });
    }
  });
  
  console.log('✅ Variable transformation complete');
  return transformedTokens;
}

/**
 * Create a map of variables by ID for reference resolution
 * @param {Object} variables - variables from Figma
 * @returns {Object} Map of variable IDs to variable data
 */
function createVariableMap(variables) {
  const map = {};
  
  Object.entries(variables).forEach(([id, variable]) => {
    map[id] = variable;
  });
  
  return map;
}

/**
 * Process a core variable into the core tokens structure
 * @param {Object} variable - Variable from Figma
 * @param {Object} coreTokens - Core tokens object to update
 * @param {Object} variableMap - Map of variable IDs to variables
 * @param {Object} tokenMap - Token mapping rules
 */
function processCoreVariable(variable, coreTokens, variableMap, tokenMap) {
  // Determine the path in the token structure
  const tokenPath = getTokenPath(variable, 'core', tokenMap);
  if (!tokenPath) return;
  
  // Get the first mode value (core variables should be mode-independent)
  const modeId = Object.keys(variable.valuesByMode || {})[0];
  if (!modeId) return;
  
  const value = variable.valuesByMode[modeId];
  const transformedValue = transformValue(value, variable, variableMap, tokenMap);
  
  // Set the value in the token structure
  setNestedValue(coreTokens, tokenPath, transformedValue);
}

/**
 * Process a mode-specific variable
 * @param {Object} variable - Variable from Figma
 * @param {string} mode - Mode name
 * @param {string} collection - Collection name
 * @param {Object} modeTokens - Mode tokens object to update
 * @param {Object} variableMap - Map of variable IDs to variables
 * @param {Object} tokenMap - Token mapping rules
 * @param {any} value - Variable value for this mode
 * @returns {boolean} Whether the variable was successfully processed
 */
function processModeVariable(variable, mode, collection, modeTokens, variableMap, tokenMap, value) {
  // Determine the path in the token structure
  const tokenPath = getTokenPath(variable, collection.toLowerCase(), tokenMap);
  if (!tokenPath) return false;
  
  // Special handling for Light/Dark mode
  if (mode === 'Light' || mode === 'Dark') {
    // Skip non-color variables for Light/Dark mode if they're already in Core
    // This prevents duplication of structural tokens that should be shared
    if (variable.resolvedType !== 'COLOR' && 
        collection !== 'Colors' && 
        tokenMap.collectionMappings[collection] === CONFIG.coreTokensFilename) {
      
      // Skip this token as it should be in Core
      return false;
    }
    
    // Special case: ensure certain tokens are always defined in both Light and Dark
    // even if they have the same value in both modes
    const forceDuplication = ['Colors', 'Themes'].some(prefix => 
      variable.name.toLowerCase().startsWith(prefix.toLowerCase())
    );
    
    if (forceDuplication) {
      // We want to ensure this token exists in both Light and Dark modes
      // so we process it normally
    }
  }
  
  // Process Mobile mode tokens normally, including all variables
  
  const transformedValue = transformValue(value, variable, variableMap, tokenMap);
  
  // Set the value in the token structure
  setNestedValue(modeTokens, tokenPath, transformedValue);
  return true;
}

/**
 * Get the path in the token structure for a variable
 * @param {Object} variable - Variable from Figma
 * @param {string} defaultCategory - Default category if none is found
 * @param {Object} tokenMap - Token mapping rules
 * @returns {Array} Path segments for the token
 */
function getTokenPath(variable, defaultCategory, tokenMap) {
  // Convert Figma path format (with /) to our path format
  const segments = variable.name.split('/');
  
  // Handle empty segments or invalid paths
  if (segments.length === 0) {
    return [defaultCategory, sanitizeName(variable.name)];
  }
  
  // Apply custom mapping rules if needed
  // For now, use a simple conversion
  return segments.map(sanitizeName);
}

/**
 * Sanitize a name segment for use in token paths
 * @param {string} name - Name segment to sanitize
 * @returns {string} Sanitized name
 */
function sanitizeName(name) {
  // Convert to kebab-case, remove invalid characters
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Recursively resolve a variable reference to find the actual raw value
 * @param {string|Object} value - The value or reference to resolve
 * @param {Object} variableMap - Map of variable IDs to variable objects
 * @param {Set} visitedRefs - Set of already visited references to avoid infinite loops
 * @returns {Object} The resolved raw value and formatted value
 */
function resolveReference(value, variableMap, visitedRefs = new Set()) {
  // Base case 1: Direct color object
  if (typeof value === 'object' && value !== null && 'r' in value && 'g' in value && 'b' in value) {
    const { r, g, b, a = 1 } = value;
    const rInt = Math.round(r * 255);
    const gInt = Math.round(g * 255);
    const bInt = Math.round(b * 255);
    const aFloat = typeof a === 'number' ? parseFloat(a.toFixed(2)) : 1;
    
    // Create raw RGBA value
    const rawValue = `rgba(${rInt}, ${gInt}, ${bInt}, ${aFloat})`;
    
    return { rawValue, formattedValue: null };  // formattedValue will be set by the color transform
  }
  
  // Base case 2: Direct number value (for dimensions)
  if (typeof value === 'number') {
    // Just return the direct value for dimensions
    return { rawValue: value, formattedValue: null }; // formattedValue will be set by dimension transform
  }
  
  // Recursive case: Variable alias
  if (typeof value === 'object' && value !== null && value.type === 'VARIABLE_ALIAS') {
    const refId = value.id;
    
    // Avoid circular references
    if (visitedRefs.has(refId)) {
      console.warn(`⚠️ Circular reference detected: ${refId}`);
      return { rawValue: null, formattedValue: null };
    }
    
    // Add to visited set
    visitedRefs.add(refId);
    
    // Look up the referenced variable
    const refVariable = variableMap[refId];
    if (!refVariable) {
      console.warn(`⚠️ Referenced variable not found: ${refId}`);
      return { rawValue: null, formattedValue: null };
    }
    
    // Get the first mode value (assuming all modes have same raw value)
    const modeId = Object.keys(refVariable.valuesByMode || {})[0];
    if (!modeId) {
      console.warn(`⚠️ No modes found for variable: ${refVariable.name}`);
      return { rawValue: null, formattedValue: null };
    }
    
    // Get the value for this mode and resolve it recursively
    const modeValue = refVariable.valuesByMode[modeId];
    return resolveReference(modeValue, variableMap, visitedRefs);
  }
  
  // Default case: Can't resolve further
  return { rawValue: null, formattedValue: null };
}

/**
 * Transform a value based on its type and the token mapping rules
 * @param {any} value - Value to transform
 * @param {Object} variable - Variable from Figma
 * @param {Object} variableMap - Map of variable IDs to variables
 * @param {Object} tokenMap - Token mapping rules
 * @returns {Object} Transformed token value
 */
function transformValue(value, variable, variableMap, tokenMap) {
  // Create token structure
  const token = {
    $type: mapFigmaTypeToTokenType(variable.resolvedType),
    $value: value
  };
  
  // Add description if available
  if (variable.description) {
    token.$description = variable.description;
  }
  
  // Apply type-specific transformations
  if (typeof value === 'object' && value !== null) {
    if (value.type === 'VARIABLE_ALIAS') {
      // Handle references
      const refRule = tokenMap.patterns.find(p => p.type === 'VARIABLE_ALIAS');
      if (refRule) {
        // Convert Figma reference to our token reference format
        token.$value = refRule.transform(value, variable);
        
        // If this is a color or dimension reference, try to resolve it to get the raw value
        if (variable.resolvedType === 'COLOR' || variable.resolvedType === 'FLOAT' || variable.resolvedType === 'INTEGER') {
          const resolved = resolveReference(value, variableMap);
          if (resolved.rawValue !== null && resolved.rawValue !== undefined) {
            token.$rawValue = resolved.rawValue;
            
            // For dimension values, check if we need to add 'px'
            if ((variable.resolvedType === 'FLOAT' || variable.resolvedType === 'INTEGER') && typeof resolved.rawValue === 'number') {
              // Check if we're dealing with a non-dimensional value (no px needed)
              const tokenName = variable.name.toLowerCase();
              const isNonDimensional = tokenName.includes('opacity') || 
                                       tokenName.includes('z-index') ||
                                       tokenName.includes('scale') || 
                                       tokenName.includes('alpha') ||
                                       tokenName.includes('weight') ||
                                       tokenName.includes('fontweight');
              
              // Add 'px' for dimensional values, leave others as is
              if (!isNonDimensional) {
                token.$rawValue = `${resolved.rawValue}px`;
              }
            }
          } else {
            // If we couldn't resolve it, keep the reference
            token.$rawValue = token.$value;
          }
        }
      }
    } else if (variable.resolvedType === 'COLOR') {
      // Handle colors
      const colorRule = tokenMap.patterns.find(p => p.type === 'COLOR');
      if (colorRule) {
        // Resolve the raw color value
        const resolved = resolveReference(value, variableMap);
        if (resolved.rawValue) {
          token.$rawValue = resolved.rawValue;
        }
        
        // Transform the display value
        token.$value = colorRule.transform(value, variable);
      }
    }
  } else if (typeof value === 'number') {
    // Handle dimensions
    // Find the appropriate rule based on the variable type (FLOAT or INTEGER)
    const dimensionRule = tokenMap.patterns.find(p => p.type === variable.resolvedType) || 
                         tokenMap.patterns.find(p => p.type === 'FLOAT');
    if (dimensionRule) {
      // Transform the value with the appropriate rule
      token.$value = dimensionRule.transform(value, variable);
      
      // For direct values (not references to other tokens), $rawValue should be the same as $value
      // This simplifies the logic and maintains consistency
      token.$rawValue = token.$value;
    }
  } else if (typeof value === 'string' && variable.resolvedType === 'COLOR') {
    // Handle direct hex or rgba values in strings
    if (value.startsWith('#')) {
      // For hex colors, we'll provide an rgba version in rawValue
      const r = parseInt(value.substring(1, 3), 16);
      const g = parseInt(value.substring(3, 5), 16);
      const b = parseInt(value.substring(5, 7), 16);
      token.$rawValue = `rgba(${r}, ${g}, ${b}, 1)`;
    } else if (value.startsWith('rgba')) {
      // For rgba strings, use as is
      token.$rawValue = value;
    }
  } else if (typeof value === 'string' && variable.resolvedType === 'STRING') {
    // For string type values, set $rawValue equal to $value
    token.$rawValue = value;
  }
  
  return token;
}

/**
 * Map Figma variable type to token type
 * @param {string} figmaType - Figma variable type
 * @returns {string} Token type
 */
function mapFigmaTypeToTokenType(figmaType) {
  switch (figmaType) {
    case 'COLOR':
      return 'color';
    case 'FLOAT':
    case 'INTEGER':
      return 'dimension';
    case 'STRING':
      return 'string';
    case 'BOOLEAN':
      return 'boolean';
    default:
      return 'string';
  }
}

/**
 * Set a nested value in an object based on a path
 * @param {Object} obj - Object to update
 * @param {Array|string} path - Path to set value at
 * @param {any} value - Value to set
 */
function setNestedValue(obj, path, value) {
  const segments = Array.isArray(path) ? path : path.split('.');
  let current = obj;
  
  // Navigate to the proper nesting level
  for (let i = 0; i < segments.length - 1; i++) {
    const segment = segments[i];
    if (!current[segment]) {
      current[segment] = {};
    }
    current = current[segment];
  }
  
  // Set the value at the final segment
  const lastSegment = segments[segments.length - 1];
  current[lastSegment] = value;
}

/**
 * Generate metadata for token files
 * @param {string} description - Description of the token file
 * @returns {Object} Metadata object
 */
function generateMetadata(description) {
  return {
    description,
    updated: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }),
    author: CONFIG.metadataDefaults.author
  };
}

/**
 * Resolve references to find actual raw values
 * @param {Object} tokenSet - The set of tokens to process
 * @returns {Object} Processed tokens with resolved raw values
 */
function resolveRawValueReferences(tokenSet) {
  console.log('🔍 Resolving raw value references...');
  
  // First flatten the token structure to make lookups easier
  const flatTokens = {};
  const directValues = {};
  
  // Helper function to determine if a value should have px units
  function isNonDimensionalValue(tokenPath) {
    tokenPath = tokenPath.toLowerCase();
    return tokenPath.includes('opacity') || 
           tokenPath.includes('z-index') ||
           tokenPath.includes('scale') || 
           tokenPath.includes('alpha') ||
           tokenPath.includes('weight') ||
           tokenPath.includes('fontweight');
  }
  
  // Function to flatten the nested structure
  function flattenTokens(obj, path = []) {
    Object.entries(obj).forEach(([key, value]) => {
      if (key === 'metadata') return;
      
      const currentPath = [...path, key];
      const dotPath = currentPath.join('.');
      
      if (value && typeof value === 'object') {
        // Check if it's a token (has $type and $value)
        if (value.$type && value.$value !== undefined) {
          flatTokens[dotPath] = value;
          
          // Cache direct values for quick lookup
          if (value.$type === 'color') {
            if (typeof value.$value === 'string') {
              if (value.$value.startsWith('#')) {
                // Convert hex to rgba for consistency
                const hex = value.$value.substring(1);
                const r = parseInt(hex.substring(0, 2), 16);
                const g = parseInt(hex.substring(2, 4), 16);
                const b = parseInt(hex.substring(4, 6), 16);
                directValues[dotPath] = `rgba(${r}, ${g}, ${b}, 1)`;
              } else if (value.$value.startsWith('rgba')) {
                directValues[dotPath] = value.$value;
              }
            }
          } else if (value.$type === 'dimension') {
            // Store dimension values too - check for direct values with $rawValue already set
            if (value.$rawValue) {
              directValues[dotPath] = value.$rawValue;
            }
          }
        } else {
          // It's a category or subcategory, recurse
          flattenTokens(value, currentPath);
        }
      }
    });
  }
  
  // Flatten the token structure
  flattenTokens(tokenSet);
  
  // Function to resolve reference to its raw value
  function resolveRawValue(refPath) {
    // Remove curly braces if present
    const cleanPath = refPath.replace(/^\{|\}$/g, '');
    
    // Direct lookup in our cache of raw values
    return directValues[cleanPath] || null;
  }
  
  // Process all tokens with direct values first
  Object.keys(flatTokens).forEach(tokenPath => {
    const token = flatTokens[tokenPath];
    
    // Process color tokens
    if (token.$type === 'color') {
      if (typeof token.$value === 'string') {
        // Direct color values
        if (token.$value.startsWith('#')) {
          const hex = token.$value.substring(1);
          const r = parseInt(hex.substring(0, 2), 16);
          const g = parseInt(hex.substring(2, 4), 16);
          const b = parseInt(hex.substring(4, 6), 16);
          token.$rawValue = `rgba(${r}, ${g}, ${b}, 1)`;
          directValues[tokenPath] = token.$rawValue;
        } else if (token.$value.startsWith('rgba')) {
          token.$rawValue = token.$value;
          directValues[tokenPath] = token.$rawValue;
        }
      }
    }
    // Process dimension tokens with direct values or numeric values
    else if (token.$type === 'dimension') {
      if (token.$rawValue) {
        // Direct raw value already set
        directValues[tokenPath] = token.$rawValue;
      } else if (typeof token.$value === 'string' && !token.$value.startsWith('{')) {
        // Direct string value like "16px" or "1.5"
        token.$rawValue = token.$value;
        directValues[tokenPath] = token.$rawValue;
      } else if (typeof token.$value === 'number') {
        // Direct numeric value needs to be converted to string with potential units
        // Use the same logic as in the transform function
        const isNonDimensional = isNonDimensionalValue(tokenPath);
        token.$rawValue = isNonDimensional ? token.$value : `${token.$value}px`;
        directValues[tokenPath] = token.$rawValue;
      }
    }
    // Process string tokens with direct values
    else if (token.$type === 'string') {
      if (typeof token.$value === 'string') {
        // For direct string values, ensure $rawValue is set
        if (!token.$value.startsWith('{')) {
          token.$rawValue = token.$value;
          directValues[tokenPath] = token.$rawValue;
        }
      }
    }
  });
  
  // Now do multiple passes to resolve references
  let resolutionCount = 0;
  let changed = true;
  let maxPasses = 10; // Limit to prevent infinite loops
  
  while (changed && maxPasses > 0) {
    changed = false;
    maxPasses--;
    
    Object.keys(flatTokens).forEach(tokenPath => {
      const token = flatTokens[tokenPath];
      
      // Process any token type with a reference in $value
      if (typeof token.$value === 'string' && 
          token.$value.startsWith('{') && token.$value.endsWith('}') &&
          (!token.$rawValue || token.$rawValue === token.$value)) {
        
        // Get the referenced path
        const referencedPath = token.$value.replace(/^\{|\}$/g, '');
        
        // Check if we have a resolved value for this reference
        if (directValues[referencedPath]) {
          // All token types with references (color, dimension, etc.) should have $rawValue
          // Use the direct value from our cache
          token.$rawValue = directValues[referencedPath];
          directValues[tokenPath] = token.$rawValue; // Add to our cache
          resolutionCount++;
          changed = true;
        }
      }
    });
    
    console.log(`Pass ${10-maxPasses}: Resolved ${resolutionCount} references so far, changed=${changed}`);
  }
  
  console.log(`✅ Resolved ${resolutionCount} reference raw values`);
  
  return tokenSet;
}

/**
 * Generate or update token files based on transformed data
 * @param {Object} transformedTokens - Transformed token data
 * @param {Object} existingFiles - Existing token files
 * @param {Object} collectionInfo - Collection mapping information
 */
function generateTokenFiles(transformedTokens, existingFiles, collectionInfo) {
  console.log('\n====== GENERATING TOKEN FILES ======\n');
  
  // Ensure directories exist
  ensureDirectoryExists(CONFIG.outputDir);
  ensureDirectoryExists(CONFIG.archiveDir);
  
  // Resolve references for all token sets to get proper raw values
  console.log('Resolving references in core tokens...');
  transformedTokens.core = resolveRawValueReferences(transformedTokens.core);
  
  console.log('Resolving references in mode tokens...');
  for (const [mode, tokens] of Object.entries(transformedTokens.modes)) {
    transformedTokens.modes[mode] = resolveRawValueReferences(tokens);
  }
  
  // Generate core tokens file
  const coreFilename = CONFIG.coreTokensFilename;
  const coreFilePath = path.join(CONFIG.outputDir, coreFilename);
  const coreContent = mergeWithExistingContent(
    transformedTokens.core, 
    existingFiles[coreFilename]
  );
  
  writeJsonFile(coreFilePath, coreContent);
  
  // Track which mode files are generated
  const generatedModeFiles = new Set();
  
  // Generate mode-specific token files
  Object.entries(transformedTokens.modes).forEach(([mode, tokens]) => {
    const config = CONFIG.modeConfigs[mode] || {
      filename: `${mode.toLowerCase()}ModeTokens.json`,
      description: `${mode} mode tokens`
    };
    
    const filename = config.filename;
    const filePath = path.join(CONFIG.outputDir, filename);
    
    // Log token stats before merging to help identify any issues
    const tokenStats = getTokenStats(tokens);
    console.log(`Mode: ${mode} (${filename})`);
    console.log(`- Categories: ${tokenStats.categories}`);
    console.log(`- Total tokens: ${tokenStats.totalTokens}`);
    
    const content = mergeWithExistingContent(
      tokens,
      existingFiles[filename]
    );
    
    writeJsonFile(filePath, content);
    generatedModeFiles.add(filename);
  });
  
  // Handle deleted modes
  handleDeletedModes(collectionInfo.modes, existingFiles, generatedModeFiles);
}

/**
 * Ensure a directory exists, creating it if necessary
 * @param {string} dirPath - Directory path to check/create
 */
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Created directory: ${dirPath}`);
  }
}

/**
 * Merge transformed content with existing content
 * @param {Object} newContent - New transformed content
 * @param {Object} existingContent - Existing file content
 * @returns {Object} Merged content
 */
function mergeWithExistingContent(newContent, existingContent) {
  if (!existingContent) return newContent;
  
  // Start with new content (including new metadata)
  const merged = JSON.parse(JSON.stringify(newContent));
  
  // Preserve author from existing content if available
  if (existingContent.metadata?.author) {
    merged.metadata.author = existingContent.metadata.author;
  }
  
  // Merge token categories
  Object.keys(existingContent).forEach(category => {
    if (category === 'metadata') return; // Already handled
    
    if (!merged[category]) {
      // Category exists in old but not in new, preserve it
      merged[category] = existingContent[category];
    } else {
      // Merge tokens within category
      Object.keys(existingContent[category]).forEach(token => {
        if (!merged[category][token]) {
          // Token exists in old but not in new, preserve it
          merged[category][token] = existingContent[category][token];
        }
        // Otherwise use the new token (already in merged)
      });
    }
  });
  
  return merged;
}

/**
 * Write a JSON file with pretty formatting
 * @param {string} filePath - Path to write file to
 * @param {Object} content - Content to write
 */
function writeJsonFile(filePath, content) {
  fs.writeFileSync(
    filePath,
    JSON.stringify(content, null, 2),
    'utf8'
  );
  console.log(`💾 Wrote file: ${path.basename(filePath)}`);
}

/**
 * Get statistics about tokens in a token object
 * @param {Object} tokens - Token object to analyze
 * @returns {Object} Statistics about the tokens
 */
function getTokenStats(tokens) {
  const stats = {
    categories: 0,
    totalTokens: 0,
    tokenTypes: {},
    categoryBreakdown: {},
    pathDepth: {
      max: 0,
      avg: 0
    },
    referencesCount: 0
  };
  
  // Count top-level categories
  const categories = Object.keys(tokens).filter(key => key !== 'metadata');
  stats.categories = categories.length;
  
  // Initialize category breakdown
  categories.forEach(category => {
    stats.categoryBreakdown[category] = 0;
  });
  
  // Track all paths for depth analysis
  const allPaths = [];
  
  // Count all tokens recursively
  function countTokens(obj, path = []) {
    let count = 0;
    
    Object.entries(obj).forEach(([key, value]) => {
      if (key === 'metadata') return;
      
      const currentPath = [...path, key];
      
      if (value && typeof value === 'object') {
        if (value.$type && value.$value !== undefined) {
          // This is a token
          count++;
          
          // Record the path
          allPaths.push(currentPath.length);
          
          // Track token types
          stats.tokenTypes[value.$type] = (stats.tokenTypes[value.$type] || 0) + 1;
          
          // Check if it's a reference
          if (typeof value.$value === 'string' && value.$value.match(/\{([^}]+)\}/)) {
            stats.referencesCount++;
          }
          
          // Update category breakdown
          if (path.length === 0) {
            stats.categoryBreakdown[key] = (stats.categoryBreakdown[key] || 0) + 1;
          } else {
            const topCategory = path[0];
            stats.categoryBreakdown[topCategory] = (stats.categoryBreakdown[topCategory] || 0) + 1;
          }
        } else {
          // This is a category or subcategory
          count += countTokens(value, currentPath);
        }
      }
    });
    
    return count;
  }
  
  stats.totalTokens = countTokens(tokens);
  
  // Calculate path depth statistics
  if (allPaths.length > 0) {
    stats.pathDepth.max = Math.max(...allPaths);
    stats.pathDepth.avg = allPaths.reduce((sum, depth) => sum + depth, 0) / allPaths.length;
  }
  
  return stats;
}

/**
 * Validate mode mappings and ensure Light/Dark modes are correctly processed
 * @param {Object} collectionInfo - Collection mapping information
 * @param {Object} transformedTokens - Tokens organized by mode
 * @returns {Object} Validation results
 */
function validateModeProcessing(collectionInfo, transformedTokens) {
  console.log('\n====== VALIDATING MODE PROCESSING ======\n');
  
  const results = {
    modesFound: [],
    modesMissing: [],
    modesEmpty: [],
    modeTokenCounts: {},
    tokenCategoryComparison: {},
    validationErrors: [],
    recommendations: []
  };
  
  // Check if all modes from Figma are accounted for
  collectionInfo.modes.forEach(mode => {
    if (transformedTokens.modes[mode]) {
      results.modesFound.push(mode);
      
      // Get token statistics for this mode
      const stats = getTokenStats(transformedTokens.modes[mode]);
      results.modeTokenCounts[mode] = stats.totalTokens;
      
      // Check if mode has tokens
      if (stats.totalTokens === 0) {
        results.modesEmpty.push(mode);
        results.validationErrors.push(`Mode ${mode} has 0 tokens!`);
      }
      
      // Store category breakdown for comparison
      results.tokenCategoryComparison[mode] = stats.categoryBreakdown;
      
    } else {
      results.modesMissing.push(mode);
      results.validationErrors.push(`Mode ${mode} from Figma is not processed!`);
    }
  });
  
  // Special handling for Light/Dark mode comparison
  if (transformedTokens.modes['Light'] && transformedTokens.modes['Dark']) {
    const lightStats = getTokenStats(transformedTokens.modes['Light']);
    const darkStats = getTokenStats(transformedTokens.modes['Dark']);
    
    // Compare token counts
    const lightTokens = lightStats.totalTokens;
    const darkTokens = darkStats.totalTokens;
    
    // Light and Dark should have similar token counts
    if (Math.abs(lightTokens - darkTokens) > Math.max(lightTokens, darkTokens) * 0.2) {
      const difference = Math.abs(lightTokens - darkTokens);
      const percentDiff = (difference / Math.max(lightTokens, darkTokens) * 100).toFixed(1);
      
      results.validationErrors.push(
        `Light and Dark mode token counts differ by ${difference} tokens (${percentDiff}%)!` +
        `\n  - Light: ${lightTokens} tokens` +
        `\n  - Dark: ${darkTokens} tokens`
      );
    }
    
    // Check category consistency
    const lightCategories = Object.keys(lightStats.categoryBreakdown);
    const darkCategories = Object.keys(darkStats.categoryBreakdown);
    
    // Find categories in Light but not in Dark
    lightCategories.forEach(category => {
      if (!darkCategories.includes(category)) {
        results.validationErrors.push(`Category "${category}" exists in Light mode but not in Dark mode!`);
      }
    });
    
    // Find categories in Dark but not in Light
    darkCategories.forEach(category => {
      if (!lightCategories.includes(category)) {
        results.validationErrors.push(`Category "${category}" exists in Dark mode but not in Light mode!`);
      }
    });
    
    // Compare token counts by category
    const commonCategories = lightCategories.filter(cat => darkCategories.includes(cat));
    commonCategories.forEach(category => {
      const lightCount = lightStats.categoryBreakdown[category] || 0;
      const darkCount = darkStats.categoryBreakdown[category] || 0;
      
      if (lightCount !== darkCount) {
        results.validationErrors.push(
          `Category "${category}" has ${lightCount} tokens in Light mode but ${darkCount} in Dark mode!`
        );
      }
    });
  }
  
  // Log validation results
  console.log(`✅ Found ${results.modesFound.length} processed modes: ${results.modesFound.join(', ')}`);
  
  if (results.modesMissing.length > 0) {
    console.warn(`⚠️ Missing ${results.modesMissing.length} modes: ${results.modesMissing.join(', ')}`);
  }
  
  if (results.modesEmpty.length > 0) {
    console.warn(`⚠️ Empty ${results.modesEmpty.length} modes: ${results.modesEmpty.join(', ')}`);
  }
  
  if (results.validationErrors.length > 0) {
    console.error('\n❌ Validation errors:');
    results.validationErrors.forEach(error => console.error(`- ${error}`));
  } else {
    console.log('\n✅ All mode validations passed!');
  }
  
  return results;
}

/**
 * Generate detailed token change report for modes
 * @param {Object} transformedTokens - Tokens organized by mode
 * @param {Object} existingFiles - Existing token files
 * @returns {Object} Change reports by mode
 */
function generateModeChangeReports(transformedTokens, existingFiles) {
  console.log('\n====== GENERATING MODE CHANGE REPORTS ======\n');
  
  const reports = {};
  
  // Process each transformed mode
  Object.entries(transformedTokens.modes).forEach(([mode, tokens]) => {
    const modeConfig = CONFIG.modeConfigs[mode] || {
      filename: `${mode.toLowerCase()}ModeTokens.json`,
      description: `${mode} mode tokens`
    };
    const filename = modeConfig.filename;
    
    // Check if we have an existing file for comparison
    if (existingFiles[filename]) {
      const existingTokens = existingFiles[filename];
      reports[mode] = compareTokenStructures(tokens, existingTokens, mode);
    } else {
      reports[mode] = {
        isNew: true,
        added: getTokenStats(tokens).totalTokens,
        removed: 0,
        changed: 0,
        unchanged: 0
      };
    }
    
    // Log summary
    if (reports[mode].isNew) {
      console.log(`📊 ${mode}: NEW mode with ${reports[mode].added} tokens`);
    } else {
      console.log(`📊 ${mode}: +${reports[mode].added} | -${reports[mode].removed} | ~${reports[mode].changed} | =${reports[mode].unchanged}`);
      
      if (reports[mode].warnings.length > 0) {
        console.warn(`  ⚠️ ${reports[mode].warnings.length} warnings for ${mode} mode`);
      }
    }
  });
  
  return reports;
}

/**
 * Compare token structures between old and new versions
 * @param {Object} newTokens - New token structure
 * @param {Object} oldTokens - Old token structure
 * @param {string} mode - Mode name
 * @returns {Object} Change report
 */
function compareTokenStructures(newTokens, oldTokens, mode) {
  const report = {
    mode,
    isNew: false,
    added: 0,
    removed: 0,
    changed: 0,
    unchanged: 0,
    warnings: [],
    details: {
      addedTokens: [],
      removedTokens: [],
      changedTokens: []
    }
  };
  
  // Flatten token structures for comparison
  const newFlat = flattenTokenStructure(newTokens);
  const oldFlat = flattenTokenStructure(oldTokens);
  
  // Find added tokens
  Object.keys(newFlat).forEach(path => {
    if (!oldFlat[path]) {
      report.added++;
      report.details.addedTokens.push(path);
    } else {
      // Check if value changed
      const newValue = JSON.stringify(newFlat[path].$value);
      const oldValue = JSON.stringify(oldFlat[path].$value);
      
      if (newValue !== oldValue) {
        report.changed++;
        report.details.changedTokens.push({
          path,
          old: oldFlat[path].$value,
          new: newFlat[path].$value
        });
      } else {
        report.unchanged++;
      }
    }
  });
  
  // Find removed tokens
  Object.keys(oldFlat).forEach(path => {
    if (!newFlat[path]) {
      report.removed++;
      report.details.removedTokens.push(path);
    }
  });
  
  // Generate warnings based on changes
  if (mode === 'Light' || mode === 'Dark') {
    const threshold = 0.25; // 25% change threshold for warnings
    const totalOld = Object.keys(oldFlat).length;
    const changeRatio = (report.added + report.removed) / (totalOld || 1);
    
    if (changeRatio > threshold) {
      report.warnings.push(
        `High change rate detected (${(changeRatio * 100).toFixed(1)}%) in ${mode} mode!`
      );
    }
    
    if (report.removed > report.added && report.removed > 5) {
      report.warnings.push(
        `More tokens removed (${report.removed}) than added (${report.added}) in ${mode} mode`
      );
    }
  }
  
  return report;
}

/**
 * Flatten a nested token structure into path:token pairs
 * @param {Object} tokens - Token structure to flatten
 * @returns {Object} Flattened structure
 */
function flattenTokenStructure(tokens) {
  const result = {};
  
  function traverse(obj, path = []) {
    Object.entries(obj).forEach(([key, value]) => {
      if (key === 'metadata') return;
      
      const currentPath = [...path, key];
      
      if (value && typeof value === 'object') {
        if (value.$type && value.$value !== undefined) {
          // This is a token
          result[currentPath.join('.')] = value;
        } else {
          // This is a category or subcategory
          traverse(value, currentPath);
        }
      }
    });
  }
  
  traverse(tokens);
  return result;
}

/**
 * Handle modes that exist in files but not in Figma
 * @param {Array} currentModes - Current modes from Figma
 * @param {Object} existingFiles - Existing token files
 * @param {Set} generatedFiles - Set of files that were generated
 */
function handleDeletedModes(currentModes, existingFiles, generatedFiles) {
  // Get all mode files from configuration
  const modeFilesPattern = /^(\w+)ModeTokens\.json$/;
  const modeFiles = Object.keys(existingFiles)
    .filter(filename => modeFilesPattern.test(filename) && filename !== CONFIG.coreTokensFilename);
  
  // Find files that weren't generated in this run
  const deletedFiles = modeFiles.filter(filename => !generatedFiles.has(filename));
  
  if (deletedFiles.length > 0) {
    console.log(`\n🔍 Found ${deletedFiles.length} files for modes that no longer exist in Figma`);
    
    deletedFiles.forEach(filename => {
      const filePath = path.join(CONFIG.outputDir, filename);
      
      switch (CONFIG.deletionStrategy) {
        case 'archive':
          // Move to archive directory with timestamp
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
          const archivePath = path.join(
            CONFIG.archiveDir, 
            `${path.basename(filename, '.json')}-${timestamp}.json`
          );
          
          // Copy to archive
          fs.copyFileSync(filePath, archivePath);
          
          // Remove original
          fs.unlinkSync(filePath);
          
          console.log(`📦 Archived deleted mode file: ${filename} to ${path.basename(archivePath)}`);
          break;
          
        case 'delete':
          // Delete the file
          fs.unlinkSync(filePath);
          console.log(`🗑️ Deleted mode file: ${filename}`);
          break;
          
        case 'mark-deprecated':
          // Mark as deprecated by updating metadata
          const content = existingFiles[filename];
          content.metadata.deprecated = true;
          content.metadata.deprecatedOn = new Date().toISOString();
          writeJsonFile(filePath, content);
          console.log(`⚠️ Marked as deprecated: ${filename}`);
          break;
          
        case 'report':
        default:
          // Just report, no action
          console.log(`⚠️ Mode file no longer in Figma (no action taken): ${filename}`);
          break;
      }
    });
  }
}

/**
 * Main transformation function
 */
function transformvariables() {
  try {
    console.log('🚀 Starting Figma variables transformation');
    
    // Create collection and mode mapping
    const collectionInfo = createCollectionMap();
    
    // Analyze existing token files if available
    if (Object.keys(existingFiles).length > 0) {
      analyzeSimplifiedTokens(existingFiles);
    } else {
      console.log('ℹ️ No existing token files found');
    }
    
    // Create token mapping based on variable analysis
    const tokenMap = createTokenMapping(collectionInfo);
    
    // Transform variables
    const transformedTokens = transformvariablesByCollectionAndMode(tokenMap, collectionInfo);
    
    // Generate token files
    generateTokenFiles(transformedTokens, existingFiles, collectionInfo);
    
    console.log('\n✅ Transformation completed successfully!');
    
  } catch (error) {
    console.error('❌ Error transforming variables:', error);
  }
}

// Execute transformation if this is the main module
if (require.main === module) {
  transformvariables();
}

module.exports = {
  transformvariables,
  CONFIG
};
