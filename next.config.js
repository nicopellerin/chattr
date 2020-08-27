const withPWA = require("next-pwa")
const withOptimizedImages = require("next-optimized-images")

const config = withOptimizedImages({
  pwa: {
    dest: "public",
    disable: process.env.NODE_ENV === "production" ? false : true,
  },
})

module.exports = withPWA(config)
