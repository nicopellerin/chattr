const withPWA = require("next-pwa")

const config = {
  pwa: {
    dest: "public",
    disable: process.env.NODE_ENV === "production" ? false : true,
  },
}

module.exports = withPWA(config)
