const { defineConfig } = require('@vue/cli-service');

module.exports = {
  transpileDependencies: true,
  devServer: {
    // proxy: 'http://localhost:3000',
    proxy: {
      '^/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        pathRewrite: { '^/api': '/' },
      },
    },
  },
};
