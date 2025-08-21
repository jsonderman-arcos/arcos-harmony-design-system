module.exports = {
  source: ['src/tokens/transformed/**/*.json'],
  platforms: {
    js: {
      transformGroup: 'js',
      buildPath: 'dist/',
      files: [{
        destination: 'theme.js',
        format: 'javascript/es6'
      }]
    },
    mui: {
      transformGroup: 'js',
      buildPath: 'src/theme/',
      files: [{
        destination: 'muiTheme.ts',
        format: 'javascript/es6'
      }]
    },
    tailwind: {
      transformGroup: 'js',
      buildPath: 'dist/',
      files: [{
        destination: 'tailwind-theme.js',
        format: 'javascript/es6'
      }]
    }
  }
};
