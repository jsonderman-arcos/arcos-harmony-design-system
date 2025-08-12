/**
 * prepareMUIDemo.js
 * 
 * This script copies theme files from the main project folder to the MUI demo folder,
 * making it easy to test the generated theme in the demo environment.
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  // Source paths
  sourceDir: path.join(__dirname, '..'),
  sourceThemeFile: 'theme.ts',
  sourceThemeTypesFile: 'theme.types.ts',
  
  // Destination paths
  demoDir: path.join(__dirname, '..', 'demos', 'mui', 'src'),
  
  // Backup existing files before overwriting
  createBackups: true,
  
  // Logs
  verbose: true
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
 * Copy a file with optional backup of the destination
 * @param {string} sourcePath - Source file path
 * @param {string} destPath - Destination file path
 * @returns {boolean} - Success status
 */
function copyFile(sourcePath, destPath) {
  try {
    // Check if source file exists
    if (!fs.existsSync(sourcePath)) {
      log(`❌ Source file not found: ${sourcePath}`);
      return false;
    }

    // Create backup if needed
    if (CONFIG.createBackups && fs.existsSync(destPath)) {
      const backupPath = `${destPath}.bak`;
      fs.copyFileSync(destPath, backupPath);
      log(`📦 Created backup: ${backupPath}`);
    }

    // Copy the file
    fs.copyFileSync(sourcePath, destPath);
    log(`✅ Copied: ${sourcePath} → ${destPath}`);
    return true;
  } catch (error) {
    log(`❌ Error copying ${sourcePath} to ${destPath}: ${error.message}`);
    return false;
  }
}

/**
 * Main function to run the script
 */
async function main() {
  log('🚀 Preparing MUI demo...');

  // Define source and destination paths
  const sourceThemePath = path.join(CONFIG.sourceDir, CONFIG.sourceThemeFile);
  const sourceThemeTypesPath = path.join(CONFIG.sourceDir, CONFIG.sourceThemeTypesFile);
  
  const destThemePath = path.join(CONFIG.demoDir, CONFIG.sourceThemeFile);
  const destThemeTypesPath = path.join(CONFIG.demoDir, CONFIG.sourceThemeTypesFile);

  // Copy theme files
  const themeSuccess = copyFile(sourceThemePath, destThemePath);
  const typesSuccess = copyFile(sourceThemeTypesPath, destThemeTypesPath);

  if (themeSuccess && typesSuccess) {
    log('✨ MUI demo preparation complete! You can now run the demo to see the theme in action.');
  } else {
    log('⚠️ MUI demo preparation completed with errors.');
  }
}

// Run the script
main().catch(error => {
  console.error('❌ Error preparing MUI demo:', error);
  process.exit(1);
});
