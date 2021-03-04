import axios from 'axios'

const api = axios.create({
  baseURL: '/api' // express
})

const flask_api = axios.create({
  baseURL: process.env.REACT_APP_FLASK_API // flask
})

export const createSubmit = payload => api.post(`/submit`, payload)
export const updateSubmit = (_id, payload) => api.put(`/submit/${_id}`, payload)
export const deleteSubmit = _id => api.delete(`/submit/${_id}`)
export const getSubmit = _id => api.get(`/submit/${_id}`)
export const getSubmits = () => api.get(`/submits`)

export const getModelsLocaly = () => api.get(`/modelslocaly`)
export const getModelsAwsS3 = () => api.get(`/modelsawss3`)

export const createUploadFile = (payload, dir) => api.post(`/uploadfile`, payload, { headers: { dir: dir } })
export const createUploadResult = payload => api.post(`/uploadresult`, payload)
export const createDir = dir => api.post(`/createDir/`, { dir: dir })

export const getTime = () => flask_api.get(`/time`)
export const videoRoiCountFish = (url_input_video, dir, model, width_cms, width_pxs_x_cm) => flask_api.post(`/videoroicountfish`, { url_input_video, dir, model, width_cms, width_pxs_x_cm })
export const videoCountFish = (url_input_video, dir, model, width_cms, width_pxs_x_cm) => flask_api.post(`/videocountfish`, { url_input_video, dir, model, width_cms, width_pxs_x_cm })
export const webcamCountFish = (url_input_video, dir, model, width_cms, width_pxs_x_cm) => flask_api.post(`/webcamcountfish`, { url_input_video, dir, model, width_cms, width_pxs_x_cm })
export const pictureCountFish = (url_input_video, dir, model, width_cms, width_pxs_x_cm) => flask_api.post(`/picturecountfish`, { url_input_video, dir, model, width_cms, width_pxs_x_cm })
export const pictureCalibrationFish = (url_input_video, dir, model, cms) => flask_api.post(`/picturecalibrationfish`, { url_input_video, dir, model, cms })
export const imageVideo = (url_input_video, dir) => flask_api.post(`/imagevideo`, { url_input_video, dir })

const apis = {
  createSubmit,
  updateSubmit,
  deleteSubmit,
  getSubmit,
  getSubmits,

  getModelsLocaly,
  getModelsAwsS3,

  createUploadFile,
  createUploadResult,
  createDir,

  getTime,
  videoRoiCountFish,
  videoCountFish,
  webcamCountFish,
  pictureCountFish,
  pictureCalibrationFish,
  imageVideo,
}

export default apis
