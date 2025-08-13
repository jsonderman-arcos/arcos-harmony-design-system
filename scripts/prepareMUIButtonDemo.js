/**
 * Script to copy theme.json from themes folder to demos/mui folder
 */

const fs = require('fs');
const path = require('path');

// Define source and destination paths
const rootDir = path.resolve(__dirname, '..');
const sourceFile = path.join(rootDir, 'themes', 'theme.json');
const destDir = path.join(rootDir, 'demos', 'mui');
const destFile = path.join(destDir, 'theme.json');

// Ensure the destination directory exists
try {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
    console.log(`Created directory: ${destDir}`);
  }
} catch (err) {
  console.error(`Error creating directory: ${err.message}`);
  process.exit(1);
}

// Copy the file
try {
  const fileContent = fs.readFileSync(sourceFile, 'utf8');
  fs.writeFileSync(destFile, fileContent, 'utf8');
  console.log(`Successfully copied ${sourceFile} to ${destFile}`);
} catch (err) {
  console.error(`Error copying file: ${err.message}`);
  process.exit(1);
}