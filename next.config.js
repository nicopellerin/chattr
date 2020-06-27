const withPWA = require("next-pwa")

module.exports = withPWA({
  pwa: {
    dest: "public",
  },
  // webpack(config, options) {
  //   config.module.rules.push({
  //     test: /\.worker\.js$/,
  //     loader: "worker-loader",
  //     // options: { inline: true }, // also works
  //     options: {
  //       name: "public/[hash].worker.js",
  //       publicPath: "/_next/",
  //     },
  //   })
  //   return config
  // },
})
