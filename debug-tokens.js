/**
 * Script to debug token replacement in createMUIButtonTheme.js
 */

const fs = require('fs');
const path = require('path');
const coreTokensPath = path.join(__dirname, 'tokens/coreTokens.json');
const coreTokens = JSON.parse(fs.readFileSync(coreTokensPath, 'utf8'));

// Test token replacement for a specific token path
function getTokenValue(path, tokens) {
  console.log(`Looking for token: ${path}`);
  const parts = path.split('.');
  
  // Handle lighthouse paths
  if (path.startsWith('lighthouse.')) {
    console.log('Using lighthouse handler');
    
    // Try to follow the exact path in tokens
    let current = tokens;
    for (const part of parts) {
      console.log(`  Looking for part: ${part}`);
      if (!current || typeof current !== 'object') {
        console.log(`  Part ${part} not found, current is`, current);
        break;
      }
      current = current[part];
      console.log(`  Found part ${part}, current is now:`, current);
    }
    
    if (current && current.$value !== undefined) {
      console.log(`  Found $value: ${current.$value}`);
      return current.$value;
    }

    if (current && current.$rawValue !== undefined) {
      console.log(`  Found $rawValue: ${current.$rawValue}`);
      return current.$rawValue;
    }
    
    console.log('  No $value or $rawValue found');
  }
  
  return undefined;
}

// Test some lighthouse tokens
console.log('\nTesting lighthouse.typography.fontfamily-base:');
const fontFamilyValue = getTokenValue('lighthouse.typography.fontfamily-base', coreTokens);
console.log(`Result: ${fontFamilyValue}`);

console.log('\nTesting lighthouse.typography.fontsize-base:');
const fontSizeValue = getTokenValue('lighthouse.typography.fontsize-base', coreTokens);
console.log(`Result: ${fontSizeValue}`);

console.log('\nTesting lighthouse.effects.shadow-level-1:');
const shadowValue = getTokenValue('lighthouse.effects.shadow-level-1', coreTokens);
console.log(`Result: ${shadowValue}`);
