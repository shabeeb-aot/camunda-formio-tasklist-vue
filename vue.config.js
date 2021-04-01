module.exports = {
    runtimeCompiler: true,
    devServer: {
      port: '4000',
      proxy: {
        '/engine-rest': {
          target: 'http://localhost:8080/',
          changeOrigin: true,
          pathRewrite: {
  
          }
        }
      }
    }
  }
  