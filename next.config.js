const withPWA = require("next-pwa")

module.exports = withPWA({
  pwa: {
    dest: "public",
    // disable: true,
    runtimeCaching: [
      {
        urlPattern: new RegExp("https://fonts.(?:googleapis|gstatic).com/(.*)"),
        handler: "CacheFirst",
        options: {
          cacheName: "google-fonts",
          expiration: {
            maxEntries: 30,
            maxAgeSeconds: 60 * 60 * 24 * 365,
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
    ],
  },
})
