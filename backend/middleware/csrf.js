const csrf = require('csurf');
const cookieParser = require('cookie-parser');

// CSRF koruma middleware'i
const csrfProtection = csrf({ cookie: true });

// Cookie parser middleware'i (CSRF için gerekli) Cookie’leri req.cookies olarak erişilebilir hale getirir (cookie-parser)
const cookieMiddleware = cookieParser();

module.exports = {
  csrfProtection,
  cookieMiddleware
};
