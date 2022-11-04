const { defineConfig } = require('@vue/cli-service');
const path = require('path');

module.exports = defineConfig({
  transpileDependencies: ['vuetify'],
  pluginOptions: {
    electronBuilder: {
      preload: 'src/preload.js',
      builderOptions: {
        asar: false,
        nsis: {
          deleteAppDataOnUninstall: true,
        },
        productName: 'Phone Call App',
        appId: 'com.unixon.phoneCallApp',
        mac: {
          icon: 'public/app_icon.png',
        },
        dmg: {
          contents: [
            {
              x: 130,
              y: 220,
            },
            {
              x: 410,
              y: 220,
              type: 'link',
              path: '/Applications',
            },
          ],
        },
        win: {
          icon: 'public/app_icon.png',
        },
        linux: {
          icon: 'public/app_icon.png',
        },
      },
    },
  },
  chainWebpack(config) {
    config.resolve.alias.set('@', path.resolve(__dirname, 'src'));
  },
  devServer: {
    https: true,
    host: '0.0.0.0',
    allowedHosts: 'all',
  },
});
