#!/usr/bin/env node

/**
 * Token Completeness Analyzer
 * 
 * This script analyzes token files to identify missing or placeholder values.
 * It helps debug issues where tokens aren't correctly propagated across all modes.
 */

const fs = require('fs');
const path = require('path');

const TOKENS_DIR = path.join(__dirname, '..', 'tokens-sd');

// List all token files
const tokenFiles = fs.readdirSync(TOKENS_DIR)
  .filter(file => file.endsWith('-tokens.json'))
  .map(file => path.join(TOKENS_DIR, file));

// Store all found tokens by path
const allTokensByPath = {};
const tokensByFile = {};
let tokenCount = 0;

// Load all token files
tokenFiles.forEach(filePath => {
  try {
    const fileName = path.basename(filePath);
    const mode = fileName.replace('-tokens.json', '');
    const tokens = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    tokensByFile[mode] = { tokens };
    
    // Extract all token paths
    function extractTokenPaths(obj, currentPath = []) {
      if (!obj) return;
      
      Object.entries(obj).forEach(([key, value]) => {
        const newPath = [...currentPath, key];
        
        // If this is a token with a value property
        if (value && value.value !== undefined) {
          tokenCount++;
          const pathString = newPath.join('.');
          
          if (!allTokensByPath[pathString]) {
            allTokensByPath[pathString] = {
              modes: {},
              isPlaceholder: {},
              isNull: {}
            };
          }
          
          // Store the token value for this mode
          allTokensByPath[pathString].modes[mode] = value.value;
          
          // Check for placeholder/null values
          const isNull = value.value === null;
          const isPlaceholder = value.value === "rgba(1, 1, 1, 1)";
          
          allTokensByPath[pathString].isNull[mode] = isNull;
          allTokensByPath[pathString].isPlaceholder[mode] = isPlaceholder;
        } else if (typeof value === 'object' && !Array.isArray(value)) {
          // Continue traversing nested objects
          extractTokenPaths(value, newPath);
        }
      });
    }
    
    extractTokenPaths(tokens);
    
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
});

// Modes available
const modes = Object.keys(tokensByFile);
console.log(`\nAnalyzing ${tokenCount} tokens across ${modes.length} modes: ${modes.join(', ')}\n`);

// Analyze tokens
const stats = {
  unique: Object.keys(allTokensByPath).length,
  missing: 0,
  incomplete: 0,
  placeholder: 0,
  null: 0,
  complete: 0
};

// Tokens missing in specific modes
const missingInMode = {};
modes.forEach(mode => {
  missingInMode[mode] = 0;
});

// Analyze each token path
Object.entries(allTokensByPath).forEach(([path, data]) => {
  const { modes: tokenModes, isPlaceholder, isNull } = data;
  
  const isMissingInSomeModes = modes.some(mode => !tokenModes[mode]);
  const hasPlaceholders = Object.values(isPlaceholder).some(v => v);
  const hasNulls = Object.values(isNull).some(v => v);
  
  // Count tokens missing in specific modes
  modes.forEach(mode => {
    if (!tokenModes[mode]) {
      missingInMode[mode]++;
    }
  });
  
  if (isMissingInSomeModes) {
    stats.missing++;
  } else if (hasPlaceholders) {
    stats.placeholder++;
  } else if (hasNulls) {
    stats.null++;
  } else if (new Set(Object.values(tokenModes)).size !== 1) {
    // If all modes have values but they're different
    stats.incomplete++;
  } else {
    stats.complete++;
  }
});

// Print the results
console.log('Token Analysis Results:');
console.log('======================');
console.log(`Total unique token paths: ${stats.unique}`);
console.log(`Complete tokens (all modes, no placeholders): ${stats.complete}`);
console.log(`Incomplete tokens (different values in modes): ${stats.incomplete}`);
console.log(`Tokens with placeholder values: ${stats.placeholder}`);
console.log(`Tokens with null values: ${stats.null}`);
console.log(`Tokens missing in some modes: ${stats.missing}`);

console.log('\nMissing tokens by mode:');
Object.entries(missingInMode).forEach(([mode, count]) => {
  const percentage = Math.round((count / stats.unique) * 100);
  console.log(`  - ${mode}: ${count} (${percentage}% missing)`);
});

// Sample of tokens with issues (random selection for brevity)
function sampleTokens(condition, title, max = 10) {
  const matching = Object.entries(allTokensByPath)
    .filter(([_path, data]) => condition(data))
    .map(([path]) => path);
  
  if (matching.length === 0) return;
  
  console.log(`\n${title} (showing max ${max} of ${matching.length}):`);
  const sample = matching.slice(0, max);
  
  sample.forEach(path => {
    console.log(`  - ${path}`);
    modes.forEach(mode => {
      const value = allTokensByPath[path].modes[mode];
      console.log(`    - ${mode}: ${value === undefined ? 'missing' : value === null ? 'null' : JSON.stringify(value)}`);
    });
  });
}

// Show samples of issue tokens
sampleTokens(
  data => modes.some(mode => !data.modes[mode]),
  'Sample tokens missing in some modes'
);

sampleTokens(
  data => !modes.some(mode => !data.modes[mode]) && Object.values(data.isPlaceholder).some(v => v),
  'Sample tokens with placeholder values'
);

sampleTokens(
  data => !modes.some(mode => !data.modes[mode]) && Object.values(data.isNull).some(v => v),
  'Sample tokens with null values'
);

console.log('\nRecommendation:');
console.log('Run the updated figmaToStyleDictionary.js script which implements fallback values');
console.log('to ensure all tokens have proper values in all modes.');
