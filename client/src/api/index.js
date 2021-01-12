import axios from 'axios'

const api = axios.create({
  baseURL: '/api' // express
})

const flask_api = axios.create({
  baseURL: 'http://localhost:5000/flask_api' // flask
})

export const createSubmit = payload => api.post(`/submit`, payload)
export const updateSubmit = (_id, payload) => api.put(`/submit/${_id}`, payload)
export const deleteSubmit = _id => api.delete(`/submit/${_id}`)
export const getSubmit = _id => api.get(`/submit/${_id}`)
export const getSubmits = () => api.get(`/submits`)

export const createUploadFile = (payload, dir) => api.post(`/uploadfile`, payload, { headers: { dir: dir } })
export const createUploadResult = payload => api.post(`/uploadresult`, payload)
export const createDir = dir => api.post(`/createDir/`, { dir: dir })

export const getTime = () => flask_api.get(`/time`)
export const videoRoiCountFish = (url_input_video, dir, model) => flask_api.post(`/videoroicountfish`, { url_input_video, dir, model })
export const videoCountFish = (url_input_video, dir, model) => flask_api.post(`/videocountfish`, { url_input_video, dir, model })
export const webcamCountFish = (url_input_video, dir, model) => flask_api.post(`/webcamcountfish`, { url_input_video, dir, model })
export const pictureCountFish = (url_input_video, dir, model) => flask_api.post(`/picturecountfish`, { url_input_video, dir, model })

const apis = {
  createSubmit,
  updateSubmit,
  deleteSubmit,
  getSubmit,
  getSubmits,

  createUploadFile,
  createUploadResult,
  createDir,

  getTime,
  videoRoiCountFish,
  videoCountFish,
  webcamCountFish,
  pictureCountFish,
}

export default apis
