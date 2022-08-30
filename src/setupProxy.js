const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://101.43.71.14:3600',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '' // 替换成target中的地址

      }
    })
  );
};