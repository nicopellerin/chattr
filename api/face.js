import * as faceapi from "face-api.js"

// Load models and weights
export async function loadModels() {
  await faceapi.loadTinyFaceDetectorModel("/models")
  await faceapi.loadFaceLandmarkTinyModel("/models")
  await faceapi.loadFaceRecognitionModel("/models")
}

export async function getFullFaceDescription(video, inputSize = 512) {
  // tiny_face_detector options
  let scoreThreshold = 0.5
  const OPTION = new faceapi.TinyFaceDetectorOptions({
    inputSize,
    scoreThreshold,
  })
  const useTinyModel = true

  // fetch image to api
  // let img = await faceapi.fetchImage(blob)

  // detect all faces and generate full description from image
  // including landmark and descriptor of each face
  let fullDesc = await faceapi
    .detectAllFaces(video, OPTION)
    .withFaceLandmarks(useTinyModel)
    .withFaceDescriptors()
  return fullDesc
}
