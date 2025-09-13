const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure proper asset handling
config.resolver.assetExts.push('png', 'jpg', 'jpeg', 'gif', 'svg', 'ttf', 'otf', 'woff', 'woff2');

// Bundle optimization settings
config.transformer = {
  ...config.transformer,
  minifierConfig: {
    // Optimize JavaScript minification
    mangle: {
      keep_fnames: true,
    },
    output: {
      ascii_only: true,
      quote_keys: false,
      wrap_iife: false,
    },
    sourceMap: false,
    toplevel: false,
    warnings: false,
    parse: {
      ecma: 8,
    },
    compress: {
      ecma: 5,
      warnings: false,
      comparisons: false,
      inline: 2,
    },
  },
};

// Optimize imports with aliases
config.resolver = {
  ...config.resolver,
  alias: {
    '@components': './src/components',
    '@screens': './src/screens', 
    '@utils': './src/utils',
    '@theme': './src/theme',
  },
};

module.exports = config;