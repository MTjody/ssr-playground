const { createSecureHeaders } = require("next-secure-headers");

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  /* config options here */
  experimental: {
    esmExternals: true,
  },
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: createSecureHeaders({
          contentSecurityPolicy: {
            directives: {
              styleSrc: [
                "'self'",
                "'unsafe-inline'",
                // TODO generate hash for styles or use https://www.npmjs.com/package/next-strict-csp
              ],
              imgSrc: ["'self'", "https://www.transparenttextures.com"],
              fontSrc: ["'self'"],
              scriptSrc: [
                "'self'",
                "'unsafe-eval'",
                "https://www.google.com",
                "https://www.gstatic.com",
                "https://*.firebasedatabase.app/",
                "https://utteranc.es/client.js",
                // TODO generate hash for scripts or use https://www.npmjs.com/package/next-strict-csp
              ],
              frameSrc: [
                "'self'",
                "https://www.google.com",
                "wss://*.firebasedatabase.app",
                "https://utteranc.es",
              ],
              connectSrc: [
                "'self'",
                "https://content-firebaseappcheck.googleapis.com",
                "wss://*.firebasedatabase.app",
              ],
            },
          },
          referrerPolicy: "strict-origin-when-cross-origin",
        }),
      },
    ];
  },
};

module.exports = nextConfig;
