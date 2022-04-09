const { defineConfig } = require('@vue/cli-service')
const path = require('path')

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: (config) => ({
    resolve: {
      alias: {
        ...config.resolve?.alias,
        "@engine": path.resolve(__dirname, '../engine/src'),
        "@assets": path.resolve(__dirname, '../assets'),
      },
    },
  }),
})
