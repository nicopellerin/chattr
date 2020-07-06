export const youtubeReady = new Promise((resolve) => {
  // @ts-ignore
  window.onYouTubeIframeAPIReady = () => resolve(window.YT)
})
