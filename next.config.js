// const securityHeaders = [
//   {
//     key: "X-DNS-Prefetch-Control",
//     value: "on",
//   },
//   {
//     key: "X-XSS-Protection",
//     value: "1; mode=block",
//   },
//   {
//     key: "X-Frame-Options",
//     value: "SAMEORIGIN",
//   },
//   {
//     key: "Permissions-Policy",
//     value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
//   },
//   {
//     key: "X-Content-Type-Options",
//     value: "nosniff",
//   },
//   {
//     key: "Referrer-Policy",
//     value: "strict-origin-when-cross-origin",
//   },
//   {
//     key: "Content-Security-Policy",
//     value:
//       "default-src 'none'; script-src 'self'; connect-src 'self'; img-src 'self'; style-src 'self'; font-src 'self';", // Your CSP Policy
//   },
// ];
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
                // TODO generate hash for scripts or use https://www.npmjs.com/package/next-strict-csp
              ],
              frameSrc: [
                "'self'",
                "https://www.google.com",
                "wss://*.firebasedatabase.app",
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
