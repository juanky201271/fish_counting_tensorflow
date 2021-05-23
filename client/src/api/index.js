// juanky201271 - AIPeces - 2021

import axios from 'axios'

const api = axios.create({
  baseURL: '/api' // express
})

const flask_api = axios.create({
  baseURL: process.env.REACT_APP_FLASK_API, // flask
  timeout: 29000,
})

const url_callback = process.env.REACT_APP_URL_CALLBACK

export const createSubmit = payload => api.post(`/submit`, payload)
export const updateSubmit = (_id, payload) => api.put(`/submit/${_id}`, payload)
export const deleteSubmit = _id => api.delete(`/submit/${_id}`)
export const getSubmit = _id => api.get(`/submit/${_id}`)
export const getSubmits = () => api.get(`/submits`)

export const getModelsLocaly = () => api.get(`/modelslocaly`)
export const getModelsAwsS3 = () => api.get(`/modelsawss3`)

export const createUploadFileLocaly = (payload, dir) => api.post(`/uploadfilelocaly`, payload, { headers: { dir: dir } })
export const createUploadFileAwsS3 = (payload, dir) => api.post(`/uploadfileawss3`, payload, { headers: { dir: dir } })
export const createUploadResultLocaly = payload => api.post(`/uploadresultlocaly`, payload)
export const createUploadResultAwsS3 = payload => api.post(`/uploadresultawss3`, payload)
export const createDirLocaly = dir => api.post(`/createdirlocaly`, { dir: dir })
export const createDirAwsS3 = dir => api.post(`/createdirawss3`, { dir: dir })
export const fileExitsAwsS3 = payload => api.post(`/fileexitsawss3`, payload)
export const fileExitsFilterAwsS3 = payload => api.post(`/fileexitsfilterawss3`, payload)

export const videoRoiCountFishAwsS3 = (url_input_video, model, width_cms, width_pxs_x_cm) => flask_api.post(`/videoroicountfishawss3`, { url_input_video, model, width_cms, width_pxs_x_cm, url_callback })

export const videoCountFishAwsS3 = (url_input_video, model, width_cms, width_pxs_x_cm) => flask_api.post(`/videocountfishawss3`, { url_input_video, model, width_cms, width_pxs_x_cm, url_callback })

export const webcamVideoRoiCountFishAwsS3 = (url_input_video, model, width_cms, width_pxs_x_cm, device, duration, width, height) => flask_api.post(`/webcamvideoroicountfishawss3`, { url_input_video, model, width_cms, width_pxs_x_cm, device, duration, width, height, url_callback })

export const webcamVideoCountFishAwsS3 = (url_input_video, model, width_cms, width_pxs_x_cm, device, duration, width, height) => flask_api.post(`/webcamvideocountfishawss3`, { url_input_video, model, width_cms, width_pxs_x_cm, device, duration, width, height, url_callback })

export const pictureCountFishAwsS3 = (url_input_video, model, width_cms, width_pxs_x_cm) => flask_api.post(`/picturecountfishawss3`, { url_input_video, model, width_cms, width_pxs_x_cm, url_callback })

export const pictureCalibrationFishAwsS3 = (url_input_video, model, cms) => flask_api.post(`/picturecalibrationfishawss3`, { url_input_video, model, cms, url_callback })

export const imageVideoAwsS3 = (url_input_video) => flask_api.post(`/imagevideoawss3`, { url_input_video, url_callback })

//export const sendWebcamFrameBuf = (name, image) => flask_api.post('/framesenderbuf', {name, image})
export const sendWebcamFrameB64 = (name, image) => flask_api.post('/framesenderb64', {name, image})

const apis = {
  createSubmit,
  updateSubmit,
  deleteSubmit,
  getSubmit,
  getSubmits,

  getModelsLocaly,
  getModelsAwsS3,

  createUploadFileLocaly,
  createUploadFileAwsS3,
  createUploadResultLocaly,
  createUploadResultAwsS3,
  createDirLocaly,
  createDirAwsS3,
  fileExitsAwsS3,
  fileExitsFilterAwsS3,

  videoRoiCountFishAwsS3,
  videoCountFishAwsS3,
  webcamVideoRoiCountFishAwsS3,
  webcamVideoCountFishAwsS3,
  pictureCountFishAwsS3,
  pictureCalibrationFishAwsS3,
  imageVideoAwsS3,
  //sendWebcamFrameBuf,
  sendWebcamFrameB64,
}

export default apis
