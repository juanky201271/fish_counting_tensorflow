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

export const createUploadFileLocaly = (payload, dir) => api.post(`/uploadfilelocaly`, payload, { headers: { dir: dir } })
export const createUploadFileAwsS3 = (payload, dir) => api.post(`/uploadfileawss3`, payload, { headers: { dir: dir } })
export const createUploadResultLocaly = payload => api.post(`/uploadresultlocaly`, payload)
export const createUploadResultAwsS3 = payload => api.post(`/uploadresultawss3`, payload)
export const createDirLocaly = dir => api.post(`/createdirlocaly/`, { dir: dir })
export const createDirAwsS3 = dir => api.post(`/createdirawss3/`, { dir: dir })

export const getTime = () => flask_api.get(`/time`)

export const videoRoiCountFishLocaly = (url_input_video, dir, model, width_cms, width_pxs_x_cm) => flask_api.post(`/videoroicountfishlocaly`, { url_input_video, dir, model, width_cms, width_pxs_x_cm })
export const videoRoiCountFishAwsS3 = (url_input_video, dir, model, width_cms, width_pxs_x_cm) => flask_api.post(`/videoroicountfishawss3`, { url_input_video, dir, model, width_cms, width_pxs_x_cm })

export const videoCountFishLocaly = (url_input_video, dir, model, width_cms, width_pxs_x_cm) => flask_api.post(`/videocountfishlocaly`, { url_input_video, dir, model, width_cms, width_pxs_x_cm })
export const videoCountFishAwsS3 = (url_input_video, dir, model, width_cms, width_pxs_x_cm) => flask_api.post(`/videocountfishawss3`, { url_input_video, dir, model, width_cms, width_pxs_x_cm })

export const webcamCountFishLocaly = (url_input_video, dir, model, width_cms, width_pxs_x_cm) => flask_api.post(`/webcamcountfishlocaly`, { url_input_video, dir, model, width_cms, width_pxs_x_cm })
export const webcamCountFishAwsS3 = (url_input_video, dir, model, width_cms, width_pxs_x_cm) => flask_api.post(`/webcamcountfishawss3`, { url_input_video, dir, model, width_cms, width_pxs_x_cm })

export const pictureCountFishLocaly = (url_input_video, dir, model, width_cms, width_pxs_x_cm) => flask_api.post(`/picturecountfishlocaly`, { url_input_video, dir, model, width_cms, width_pxs_x_cm })
export const pictureCountFishAwsS3 = (url_input_video, dir, model, width_cms, width_pxs_x_cm) => flask_api.post(`/picturecountfishawss3`, { url_input_video, dir, model, width_cms, width_pxs_x_cm })

export const pictureCalibrationFishLocaly = (url_input_video, dir, model, cms) => flask_api.post(`/picturecalibrationfishlocaly`, { url_input_video, dir, model, cms })
export const pictureCalibrationFishAwsS3 = (url_input_video, model, cms) => flask_api.post(`/picturecalibrationfishawss3`, { url_input_video, model, cms })

export const imageVideoLocaly = (url_input_video, dir) => flask_api.post(`/imagevideolocaly`, { url_input_video, dir })
export const imageVideoAwsS3 = (url_input_video, dir) => flask_api.post(`/imagevideoawss3`, { url_input_video, dir })

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

  getTime,
  videoRoiCountFishAwsS3,
  videoCountFishAwsS3,
  webcamCountFishAwsS3,
  pictureCountFishAwsS3,
  pictureCalibrationFishAwsS3,
  imageVideoAwsS3,

  videoRoiCountFishLocaly,
  videoCountFishLocaly,
  webcamCountFishLocaly,
  pictureCountFishLocaly,
  pictureCalibrationFishLocaly,
  imageVideoLocaly,
}

export default apis
