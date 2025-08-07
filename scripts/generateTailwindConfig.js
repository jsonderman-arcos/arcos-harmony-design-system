/**
 * Generate Tailwind CSS Configuration from Design Tokens
 * 
 * This script transforms our design tokens into a Tailwind CSS configuration file.
 * It reads token files and maps them to Tailwind's theme structure.
 */

const fs = require('fs');
const path = require('path');

// Paths
const TOKENS_DIR = path.join(__dirname, '..', 'tokens');
const TAILWIND_CONFIG_PATH = path.join(__dirname, '..', 'tailwind.config.js');

// Load token files
const coreTokens = require(path.join(TOKENS_DIR, 'coreTokens.json'));
const darkModeTokens = require(path.join(TOKENS_DIR, 'darkModeTokens.json'));
const lightModeTokens = require(path.join(TOKENS_DIR, 'lightModeTokens.json'));
const mobileModeTokens = require(path.join(TOKENS_DIR, 'mobileModeTokens.json'));

console.log('Starting Tailwind CSS configuration generation...');

// Mapping functions
function mapBreakpoints(coreTokens) {
  if (!coreTokens.breakpoints) return {};
  
  const breakpoints = {};
  Object.entries(coreTokens.breakpoints).forEach(([key, value]) => {
    breakpoints[key.replace('breakpoint-', '')] = `${value.$value}px`;
  });
  
  return breakpoints;
}

function mapSpacing(coreTokens) {
  if (!coreTokens.spacing) return {};
  
  const spacing = {};
  Object.entries(coreTokens.spacing).forEach(([key, value]) => {
    // Extract the size suffix (e.g., 'xs', 'sm', 'md')
    const match = key.match(/spacing-(.+)/);
    if (match) {
      spacing[match[1]] = `${value.$value}px`;
    } else {
      spacing[key] = `${value.$value}px`;
    }
  });
  
  return spacing;
}

function mapColors(tokens) {
  const colors = {};
  
  // Function to recursively extract colors
  function extractColors(obj, prefix = '') {
    Object.entries(obj).forEach(([key, value]) => {
      if (value && value.$type === 'color') {
        // Handle direct color values
        const colorKey = prefix ? `${prefix}-${key}` : key;
        colors[colorKey] = value.$value;
      } else if (value && typeof value === 'object' && !Array.isArray(value) && !key.startsWith('$')) {
        // Recurse into nested objects, but skip metadata fields
        extractColors(value, prefix ? `${prefix}-${key}` : key);
      }
    });
  }
  
  // Extract colors from tokens
  ['base', 'component'].forEach(category => {
    if (tokens[category]) {
      extractColors(tokens[category], category);
    }
  });
  
  return colors;
}

function mapBorderRadius(coreTokens) {
  if (!coreTokens.radii) return {};
  
  const borderRadius = {};
  Object.entries(coreTokens.radii).forEach(([key, value]) => {
    const name = key.replace('border-radius-', '');
    borderRadius[name === 'border-radius' ? 'DEFAULT' : name] = `${value.$value}px`;
  });
  
  return borderRadius;
}

function mapFontSizes(coreTokens) {
  if (!coreTokens.Lighthouse?.typography) return {};
  
  const fontSize = {};
  Object.entries(coreTokens.Lighthouse.typography).forEach(([key, value]) => {
    if (key.startsWith('fontSize-')) {
      const size = key.replace('fontSize-', '');
      fontSize[size] = `${value.$value}px`;
    }
  });
  
  return fontSize;
}

function mapFontWeights(coreTokens) {
  if (!coreTokens.Lighthouse?.typography) return {};
  
  const fontWeight = {};
  Object.entries(coreTokens.Lighthouse.typography).forEach(([key, value]) => {
    if (key.startsWith('fontWeight-')) {
      const weight = key.replace('fontWeight-', '');
      fontWeight[weight] = value.$value;
    }
  });
  
  return fontWeight;
}

function mapFontFamilies(coreTokens) {
  if (!coreTokens.Lighthouse?.typography) return {};
  
  const fontFamily = {};
  Object.entries(coreTokens.Lighthouse.typography).forEach(([key, value]) => {
    if (key.startsWith('fontFamily-')) {
      const family = key.replace('fontFamily-', '');
      // Split by comma and trim each value for proper array format
      fontFamily[family] = value.$value.split(',').map(font => font.trim());
    }
  });
  
  return fontFamily;
}

function mapShadows(coreTokens) {
  if (!coreTokens.Lighthouse?.effects) return {};
  
  const boxShadow = {};
  Object.entries(coreTokens.Lighthouse.effects).forEach(([key, value]) => {
    if (key.startsWith('shadow-')) {
      const level = key.replace('shadow-', '');
      boxShadow[level] = value.$value;
    }
  });
  
  return boxShadow;
}

// Generate Tailwind config
const tailwindConfig = {
  theme: {
    screens: mapBreakpoints(coreTokens),
    colors: {
      ...mapColors(lightModeTokens),
      dark: mapColors(darkModeTokens),
      mobile: mapColors(mobileModeTokens)
    },
    spacing: mapSpacing(coreTokens),
    borderRadius: mapBorderRadius(coreTokens),
    fontSize: mapFontSizes(coreTokens),
    fontWeight: mapFontWeights(coreTokens),
    fontFamily: mapFontFamilies(coreTokens),
    boxShadow: mapShadows(coreTokens),
    extend: {},
  },
  darkMode: 'class', // or 'media'
  variants: {
    extend: {},
  },
  plugins: [],
};

// Generate the file content
const configFileContent = `/** 
 * Tailwind CSS configuration
 * Auto-generated from design tokens on ${new Date().toLocaleDateString()}
 * DO NOT EDIT MANUALLY
 */
 
module.exports = ${JSON.stringify(tailwindConfig, null, 2)};
`;

// Write the config file
fs.writeFileSync(TAILWIND_CONFIG_PATH, configFileContent);
console.log(`✅ Successfully generated Tailwind config at ${TAILWIND_CONFIG_PATH}`);
