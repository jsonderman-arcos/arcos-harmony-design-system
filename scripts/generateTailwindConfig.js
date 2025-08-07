/**
 * Generate Tailwind CSS Configuration from Design Tokens
 * 
 * This script transforms our design tokens into a Tailwind CSS configuration file
 * and CSS theme files. It reads token files and maps them to Tailwind's theme structure
 * and CSS custom properties.
 */

const fs = require('fs');
const path = require('path');

// Paths
const TOKENS_DIR = path.join(__dirname, '..', 'tokens');
const VARIABLES_DIR = path.join(__dirname, '..', 'variables');
const TAILWIND_CONFIG_PATH = path.join(__dirname, '..', 'tailwind.config.js');
const CSS_THEME_PATH = path.join(__dirname, '..', 'theme.css');

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
        
        // Check if the value is a reference (starts and ends with {})
        if (typeof value.$value === 'string' && value.$value.startsWith('{') && value.$value.endsWith('}')) {
          // This is a reference to another token - create a CSS variable reference
          const varName = value.$value.substring(1, value.$value.length - 1).replace(/\./g, '-').toLowerCase();
          colors[colorKey] = `var(--${varName})`;
        } else if (typeof value.$value === 'object' && value.$value !== null && value.$value.type === 'VARIABLE_ALIAS') {
          // This is a Figma variable alias - try to resolve it to a CSS variable
          colors[colorKey] = `var(--figma-alias-${value.$value.id.split('/')[0]})`;
        } else {
          // This is a direct color value (hex, rgba, etc.)
          if (typeof value.$value === 'string') {
            colors[colorKey] = value.$value; // Use hex or rgba directly
          } else if (value.$value && typeof value.$value === 'object') {
            // Handle object format colors (like {r: 0.1, g: 0.2, b: 0.3, a: 1})
            const colorObj = value.$value;
            if (colorObj.r !== undefined && colorObj.g !== undefined && colorObj.b !== undefined) {
              const alpha = colorObj.a !== undefined ? colorObj.a : 1;
              colors[colorKey] = `rgba(${Math.round(colorObj.r * 255)}, ${Math.round(colorObj.g * 255)}, ${Math.round(colorObj.b * 255)}, ${alpha})`;
            } else {
              // For objects like {type: "VARIABLE_ALIAS"}, create a placeholder CSS variable
              if (colorObj.type === 'VARIABLE_ALIAS' && colorObj.id) {
                colors[colorKey] = `var(--figma-alias-${colorObj.id.split('/')[0]})`;
              } else {
                // Skip JSON.stringify to avoid embedding raw JSON in the config
                colors[colorKey] = '#ccc'; // Fallback color instead of raw JSON
              }
            }
          } else {
            // Fallback
            colors[colorKey] = value.$value;
          }
        }
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

// Generate CSS variables for themes
function generateCSSTheme() {
  const themes = {
    ':root': extractThemeVariables(coreTokens),
    '.light-theme': extractThemeVariables(lightModeTokens),
    '.dark-theme': extractThemeVariables(darkModeTokens),
    '@media (max-width: 768px)': {
      ':root': extractThemeVariables(mobileModeTokens)
    }
  };
  
  // Convert the themes object to CSS
  let cssContent = `/**
 * Auto-generated theme variables
 * Generated on ${new Date().toLocaleDateString()}
 * DO NOT EDIT MANUALLY
 */

`;
  
  Object.entries(themes).forEach(([selector, variables]) => {
    if (selector.startsWith('@media')) {
      // Handle media queries
      cssContent += `${selector} {\n`;
      Object.entries(variables).forEach(([subSelector, vars]) => {
        cssContent += `  ${subSelector} {\n`;
        Object.entries(vars).forEach(([name, value]) => {
          cssContent += `    ${name}: ${value};\n`;
        });
        cssContent += '  }\n';
      });
      cssContent += '}\n\n';
    } else {
      // Handle regular selectors
      cssContent += `${selector} {\n`;
      Object.entries(variables).forEach(([name, value]) => {
        cssContent += `  ${name}: ${value};\n`;
      });
      cssContent += '}\n\n';
    }
  });
  
  return cssContent;
}

// Extract CSS variables from tokens
function extractThemeVariables(tokens) {
  const variables = {};
  
  // Helper function to resolve references within values
  function resolveReference(value) {
    if (typeof value === 'string' && value.includes('{') && value.includes('}')) {
      // Extract the reference pattern {name.path}
      const refRegex = /\{([^}]+)\}/g;
      return value.replace(refRegex, (match, refPath) => {
        return `var(--${refPath.replace(/\./g, '-').toLowerCase()})`;
      });
    }
    return value;
  }
  
  function processTokens(obj, prefix = '') {
    Object.entries(obj).forEach(([key, value]) => {
      // Skip metadata and non-token fields
      if (!value || key.startsWith('$') || key === 'metadata' || key === 'comments') {
        return;
      }
      
      const path = prefix ? `${prefix}-${key}` : key;
      const varName = `--${path.replace(/\./g, '-').toLowerCase()}`;
      
      if (value.$type === 'color') {
        // Handle color values
        if (typeof value.$value === 'string') {
          if (value.$value.startsWith('{') && value.$value.endsWith('}')) {
            // This is a reference to another token
            const referencePath = value.$value.substring(1, value.$value.length - 1).replace(/\./g, '-').toLowerCase();
            variables[varName] = `var(--${referencePath})`;
          } else {
            // This is a direct color value (hex, rgba)
            variables[varName] = value.$value;
          }
        } else if (value.$value && typeof value.$value === 'object') {
          // Handle object color format
          const colorObj = value.$value;
          if (colorObj.r !== undefined && colorObj.g !== undefined && colorObj.b !== undefined) {
            const alpha = colorObj.a !== undefined ? colorObj.a : 1;
            variables[varName] = `rgba(${Math.round(colorObj.r * 255)}, ${Math.round(colorObj.g * 255)}, ${Math.round(colorObj.b * 255)}, ${alpha})`;
          }
        }
      } else if (value.$type === 'dimension') {
        // Handle dimension values
        const processedValue = resolveReference(value.$value);
        
        // If the processed value already contains a CSS variable, don't add px
        if (typeof processedValue === 'string' && processedValue.includes('var(')) {
          variables[varName] = processedValue;
        } 
        // If it already ends with px, use as is
        else if (typeof processedValue === 'string' && processedValue.endsWith('px')) {
          variables[varName] = processedValue;
        } 
        // Otherwise add px
        else {
          variables[varName] = `${processedValue}px`;
        }
      } else if (value.$type) {
        // Handle other typed values
        if (typeof value.$value === 'string') {
          // Process potential references in the string value
          variables[varName] = resolveReference(value.$value);
        } else {
          // Non-string value
          variables[varName] = value.$value;
        }
      } else if (typeof value === 'object' && !Array.isArray(value)) {
        // Recurse into nested objects
        processTokens(value, path);
      }
    });
  }
  
  // Process all top-level categories
  Object.entries(tokens).forEach(([category, values]) => {
    if (typeof values === 'object' && !Array.isArray(values) && category !== 'metadata' && category !== 'comments') {
      processTokens(values, category);
    }
  });
  
  return variables;
}

// Generate Tailwind config
const tailwindConfig = {
  theme: {
    screens: mapBreakpoints(coreTokens),
    colors: {
      ...mapColors(coreTokens), // Core tokens
      light: mapColors(lightModeTokens),
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
  plugins: [
    // Optional: Add a plugin to use CSS variables
    function({ addBase }) {
      addBase({
        ':root': {
          // This will import the CSS variables from our theme.css
          '@import': 'theme.css',
        },
      });
    },
  ],
};

// Generate the CSS theme content
const cssThemeContent = generateCSSTheme();

// Generate the Tailwind config file content
const configFileContent = `/** 
 * Tailwind CSS configuration
 * Auto-generated from design tokens on ${new Date().toLocaleDateString()}
 * DO NOT EDIT MANUALLY
 */
 
module.exports = ${JSON.stringify(tailwindConfig, null, 2)};
`;

// Write the config and theme files
fs.writeFileSync(TAILWIND_CONFIG_PATH, configFileContent);
fs.writeFileSync(CSS_THEME_PATH, cssThemeContent);

console.log(`✅ Successfully generated Tailwind config at ${TAILWIND_CONFIG_PATH}`);
console.log(`✅ Successfully generated CSS theme at ${CSS_THEME_PATH}`);
