const { createSecureHeaders } = require("next-secure-headers");
const { remarkCodeHike } = require("@code-hike/mdx");
const theme = require("shiki/themes/one-dark-pro.json");
const withMDX = require("@next/mdx")({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  /* config options here */
  experimental: {
    esmExternals: true,
  },
  ...withMDX({
    pageExtensions: ["js", "jsx", "md", "mdx"],
  }),
  webpack(config, options) {
    config.module.rules.push({
      test: /\.mdx?$/,
      use: [
        // The default `babel-loader` used by Next:
        options.defaultLoaders.babel,
        {
          loader: "@mdx-js/loader",
          /** @type {import('@mdx-js/loader').Options} */
          options: {
            remarkPlugins: [[remarkCodeHike, { theme }]],
          },
        },
      ],
    });
    return config;
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
