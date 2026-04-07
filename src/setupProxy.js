/**
 * Proxy Configuration for Development
 * This proxies API requests to the ERPNext backend during development
 * to avoid CORS issues with cookies
 */

const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  console.log('🔧 Setting up proxy middleware...');

  // Proxy /method with /api prefix
  app.use(
    '/method',
    createProxyMiddleware({
      target: 'https://hms.automedai.in',
      changeOrigin: true,
      secure: false,
      pathRewrite: {
        '^/method': '/api/method',
      },
      cookieDomainRewrite: {
        'hms.automedai.in': 'localhost',
        '.hms.automedai.in': 'localhost',
        '*': 'localhost'
      },
      cookiePathRewrite: {
        '*': '/'
      },
      onProxyReq: (proxyReq, req, res) => {
        console.log('📤 Proxying:', req.method, req.url, '→', 'https://hms.automedai.in/api/method' + req.url.replace('/method', ''));
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log('📥 Proxy response:', proxyRes.statusCode, req.url);
        // Log cookies being set
        const setCookie = proxyRes.headers['set-cookie'];
        if (setCookie) {
          console.log('🍪 Cookies received:', setCookie);
        }
      },
      onError: (err, req, res) => {
        console.error('❌ Proxy error:', err.message);
      },
    })
  );

  // Proxy /resource with /api prefix
  app.use(
    '/resource',
    createProxyMiddleware({
      target: 'https://hms.automedai.in',
      changeOrigin: true,
      secure: false,
      pathRewrite: {
        '^/resource': '/api/resource',
      },
      cookieDomainRewrite: {
        'hms.automedai.in': 'localhost',
        '.hms.automedai.in': 'localhost',
        '*': 'localhost'
      },
      cookiePathRewrite: {
        '*': '/'
      },
      onProxyReq: (proxyReq, req, res) => {
        console.log('📤 Proxying:', req.method, req.url, '→', 'https://hms.automedai.in/api/resource' + req.url.replace('/resource', ''));
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log('📥 Proxy response:', proxyRes.statusCode, req.url);
        const setCookie = proxyRes.headers['set-cookie'];
        if (setCookie) {
          console.log('🍪 Cookies received:', setCookie);
        }
      },
      onError: (err, req, res) => {
        console.error('❌ Proxy error:', err.message);
      },
    })
  );

  console.log('✅ Proxy middleware configured:');
  console.log('   - /method → https://hms.automedai.in/api/method');
  console.log('   - /resource → https://hms.automedai.in/api/resource');
};
