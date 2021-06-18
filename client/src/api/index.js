// juanky201271 - AIPeces - 2021

import axios from 'axios'

const api = axios.create({
  baseURL: '/api' // express
})

const flask_api = axios.create({
  baseURL: process.env.REACT_APP_FLASK_API, // flask
  timeout: 29000,
})

const url_callback = process.env.REACT_APP_URL_CALLBACK_LOG

export const createSubmit = payload => api.post(`/submit`, payload)
export const updateSubmit = (_id, payload) => api.put(`/submit/${_id}`, payload)
export const deleteSubmit = _id => api.delete(`/submit/${_id}`)
export const getSubmit = _id => api.get(`/submit/${_id}`)
export const getSubmits = () => api.get(`/submits`)

export const getModelsAwsS3 = () => api.get(`/modelsawss3`)

export const createUploadFileAwsS3 = (payload, dir) => api.post(`/uploadfileawss3`, payload, { headers: { dir: dir } })
export const createUploadResultAwsS3 = payload => api.post(`/uploadresultawss3`, payload)
export const createDirAwsS3 = dir => api.post(`/createdirawss3`, { dir: dir })
export const fileExitsAwsS3 = payload => api.post(`/fileexitsawss3`, payload)
export const fileExitsFilterAwsS3 = payload => api.post(`/fileexitsfilterawss3`, payload)

export const videoRoiHorCountFishAwsS3 = (url_input_video, model, width_cms, width_pxs_x_cm) => flask_api.post(`/videoroicountfishawss3`, { url_input_video, model, width_cms, width_pxs_x_cm, url_callback, x_axis: 1 })

export const videoRoiVerCountFishAwsS3 = (url_input_video, model, width_cms, width_pxs_x_cm) => flask_api.post(`/videoroicountfishawss3`, { url_input_video, model, width_cms, width_pxs_x_cm, url_callback, x_axis: 0 })

export const videoCountFishAwsS3 = (url_input_video, model, width_cms, width_pxs_x_cm) => flask_api.post(`/videocountfishawss3`, { url_input_video, model, width_cms, width_pxs_x_cm, url_callback })

export const webcamVideoRoiHorCountFishAwsS3 = (url_input_video, model, width_cms, width_pxs_x_cm, device, duration, width, height) => flask_api.post(`/webcamvideoroicountfishawss3react`, { url_input_video, model, width_cms, width_pxs_x_cm, device, duration, width, height, url_callback, x_axis: 1 })

export const webcamVideoRoiVerCountFishAwsS3 = (url_input_video, model, width_cms, width_pxs_x_cm, device, duration, width, height) => flask_api.post(`/webcamvideoroicountfishawss3react`, { url_input_video, model, width_cms, width_pxs_x_cm, device, duration, width, height, url_callback, x_axis: 0 })

export const webcamVideoCountFishAwsS3 = (url_input_video, model, width_cms, width_pxs_x_cm, device, duration, width, height) => flask_api.post(`/webcamvideocountfishawss3react`, { url_input_video, model, width_cms, width_pxs_x_cm, device, duration, width, height, url_callback })

export const pictureCountFishAwsS3 = (url_input_video, model, width_cms, width_pxs_x_cm) => flask_api.post(`/picturecountfishawss3`, { url_input_video, model, width_cms, width_pxs_x_cm, url_callback })

export const pictureCalibrationFishAwsS3 = (url_input_video, model, cms) => flask_api.post(`/picturecalibrationfishawss3`, { url_input_video, model, cms, url_callback })

export const imageVideoAwsS3 = (url_input_video) => flask_api.post(`/imagevideoawss3`, { url_input_video, url_callback })

const apis = {
  createSubmit,
  updateSubmit,
  deleteSubmit,
  getSubmit,
  getSubmits,

  getModelsAwsS3,

  createUploadFileAwsS3,
  createUploadResultAwsS3,
  createDirAwsS3,
  fileExitsAwsS3,
  fileExitsFilterAwsS3,

  videoRoiHorCountFishAwsS3,
  videoRoiVerCountFishAwsS3,
  videoCountFishAwsS3,
  webcamVideoRoiHorCountFishAwsS3,
  webcamVideoRoiVerCountFishAwsS3,
  webcamVideoCountFishAwsS3,
  pictureCountFishAwsS3,
  pictureCalibrationFishAwsS3,
  imageVideoAwsS3,
}

export default apis
