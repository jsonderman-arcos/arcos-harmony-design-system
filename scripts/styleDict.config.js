/**
 * Style Dictionary Configuration
 * 
 * This configuration uses Style Dictionary to transform our design tokens
 * into multiple platform formats including Tailwind CSS.
 */

const StyleDictionary = require('style-dictionary');
const path = require('path');
const fs = require('fs');

// Configure Style Dictionary
const styleDictionary = StyleDictionary.extend({
  source: [
    path.join(__dirname, '..', 'tokens', '**', '*.json')
  ],
  platforms: {
    tailwindcss: {
      transformGroup: 'js',
      buildPath: path.join(__dirname, '..', 'dist/'),
      files: [{
        destination: 'tailwind.config.js',
        format: 'javascript/tailwind',
      }]
    },
    css: {
      transformGroup: 'css',
      buildPath: path.join(__dirname, '..', 'dist/'),
      files: [{
        destination: 'variables.css',
        format: 'css/variables',
      }]
    },
    scss: {
      transformGroup: 'scss',
      buildPath: path.join(__dirname, '..', 'dist/'),
      files: [{
        destination: 'variables.scss',
        format: 'scss/variables',
      }]
    }
  }
});

// Custom format for Tailwind config
StyleDictionary.registerFormat({
  name: 'javascript/tailwind',
  formatter: function({ dictionary }) {
    // Map token structure to Tailwind config
    const themeConfig = {
      screens: {},
      colors: {},
      spacing: {},
      borderRadius: {},
      fontSize: {},
      fontWeight: {},
      fontFamily: {},
      boxShadow: {},
    };
    
    // Process tokens
    dictionary.allProperties.forEach(token => {
      const { attributes, value } = token;
      const { category, type } = attributes;
      
      if (category === 'breakpoints') {
        themeConfig.screens[type] = `${value}px`;
      } 
      else if (category === 'colors' || type === 'color') {
        // Nested path for colors
        const colorPath = token.path.slice(1).join('.');
        themeConfig.colors[colorPath] = value;
      }
      else if (category === 'spacing') {
        themeConfig.spacing[type] = `${value}px`;
      }
      else if (category === 'radii') {
        themeConfig.borderRadius[type] = `${value}px`;
      }
      else if (category === 'typography' && type.includes('fontSize')) {
        const size = type.replace('fontSize-', '');
        themeConfig.fontSize[size] = `${value}px`;
      }
      else if (category === 'typography' && type.includes('fontWeight')) {
        const weight = type.replace('fontWeight-', '');
        themeConfig.fontWeight[weight] = value;
      }
      else if (category === 'typography' && type.includes('fontFamily')) {
        const family = type.replace('fontFamily-', '');
        themeConfig.fontFamily[family] = value;
      }
      else if (category === 'effects' && type.includes('shadow')) {
        const level = type.replace('shadow-', '');
        themeConfig.boxShadow[level] = value;
      }
    });
    
    return `/** 
 * Tailwind CSS configuration
 * Auto-generated from design tokens on ${new Date().toLocaleDateString()}
 * DO NOT EDIT MANUALLY
 */
 
module.exports = {
  theme: ${JSON.stringify(themeConfig, null, 2)},
  darkMode: 'class',
  variants: {
    extend: {},
  },
  plugins: [],
};`;
  }
});

// Build all platforms
styleDictionary.buildAllPlatforms();
