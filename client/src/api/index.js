import axios from 'axios'

const api = axios.create({
  baseURL: '/api' // express
})

export const createSubmit = payload => api.post(`/submit`, payload)
export const updateSubmit = (_id, payload) => api.put(`/submit/${_id}`, payload)
export const deleteSubmit = _id => api.delete(`/submit/${_id}`)
export const getSubmit = _id => api.get(`/submit/id/${_id}`)
export const getSubmits = () => api.get(`/submits`)
export const createUploadFile = payload => api.post(`/uploadfile`, payload)
export const createUploadResult = payload => api.post(`uploadresult`, payload)

const apis = {
  createSubmit,
  updateSubmit,
  deleteSubmit,
  getSubmit,
  getSubmits,

  createUploadFile,
  createUploadResult,
}

export default apis
