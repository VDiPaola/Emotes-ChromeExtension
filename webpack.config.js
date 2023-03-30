const path = require('path');

module.exports = {
    entry: {
        'content/main': './src/content/main.js',

        'background': './src/background/main.js',

        'options/main': './src/options/main.js',

        'popup/main': './src/popup/main.js',
        
        
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    mode: 'production',
    module: {
        rules: [
          {
            test: /\.svg$/i,
            use: 'raw-loader',
          },
        ],
      },
};