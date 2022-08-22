const { defineConfig } = require('@vue/cli-service');
const path = require('path');

module.exports = defineConfig({
  transpileDependencies: ['vuetify'],
  pluginOptions: {
    electronBuilder: {
      preload: 'src/preload.js',
    },
  },
  chainWebpack(config) {
    config.resolve.alias.set('@', path.resolve(__dirname, 'src'));
  },
});
