module.exports = {
  pwa: {
    workboxPluginMode: "GenerateSW",
    workboxOptions: {
      // skipWaiting: true,
      swSrc: "./src/service-worker.js"
    }
  }
}