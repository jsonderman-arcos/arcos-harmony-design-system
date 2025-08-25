# UX Design System

This repository contains the UX Design System for our projects.

## Directory Structure

- `variables/`: Raw data from Figma Variables API
- `tokens/`: Processed design tokens
- `scripts/`: Scripts for fetching, processing, and updating design tokens
- `archive/`: Archived versions of tokens and variables

## Getting Started

1. Make sure you have Node.js installed
2. Create a `.env` file with your Figma API credentials
3. Run the scripts from the `scripts` directory to build tokens:
   ```
   cd scripts
   npm install
   npm run build-tokens
   ```

## Scripts

All scripts are now located in the `scripts/` directory. See the README there for more details.
