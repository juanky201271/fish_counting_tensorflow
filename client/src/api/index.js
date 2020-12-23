import axios from 'axios'

const api = axios.create({
  baseURL: '/api' // express
})

export const insertBar = payload => api.post(`/bar`, payload)
export const updateBarById = (_id, payload) => api.put(`/bar/${_id}`, payload)
export const deleteBarById = _id => api.delete(`/bar/${_id}`)
export const getBarById = _id => api.get(`/bar/id/${_id}`)
export const getBarsByIp = ip => api.get(`/bars/ip/${ip}`)
export const getBarsByTwitterId = twitterId => api.get(`/bars/twitterId/${twitterId}`)
export const getBarsByBusinessId = bars_business_id => api.get(`/bars/businessId/${bars_business_id}`)
export const getAllBars = () => api.get(`/bars`)

export const insertFind = payload => api.post(`/find`, payload)
export const updateFindById = (_id, payload) => api.put(`/find/${_id}`, payload)
export const deleteFindById = _id => api.delete(`/find/${_id}`)
export const getFindById = _id => api.get(`/find/id/${_id}`)
export const getFindsByIp = ip => api.get(`/finds/ip/${ip}`)
export const getFindsByTwitterId = twitterId => api.get(`/finds/twitterId/${twitterId}`)
export const getAllFinds = () => api.get(`/finds`)

export const insertUser = payload => api.post(`/user`, payload)
export const getAllUsers = () => api.get(`/users`)
export const updateUserById = (_id, payload) => api.put(`/user/id/${_id}`, payload)
export const updateUserByIp = (ip, payload) => api.put(`/user/ip/${ip}`, payload)
export const deleteUserById = _id => api.delete(`/user/id/${_id}`)
export const deleteUserByIp = ip => api.delete(`/user/ip/${ip}`)
export const getUserById = _id => api.get(`/user/id/${_id}`)
export const getUserByIp = ip => api.get(`/user/ip/${ip}`)

export const getAllUsersTwitter = () => api.get(`/userstwitter`)
export const updateUserByTwitterId = (twitterId, payload) => api.put(`/usertwitter/id/${twitterId}`, payload)
export const getUserByTwitterId = twitterId => api.get(`/usertwitter/id/${twitterId}`)

export const getYelpSearch = (categories, location, locale) => api.get(`/yelp/search/${categories}/${location}/${locale}`)

const apis = {
    insertBar,
    getAllBars,
    updateBarById,
    deleteBarById,
    getBarById,
    getBarsByIp,
    getBarsByTwitterId,
    getBarsByBusinessId,

    insertFind,
    getAllFinds,
    updateFindById,
    deleteFindById,
    getFindById,
    getFindsByIp,
    getFindsByTwitterId,

    insertUser,
    getAllUsers,
    updateUserById,
    updateUserByIp,
    deleteUserById,
    deleteUserByIp,
    getUserById,
    getUserByIp,

    getAllUsersTwitter,
    updateUserByTwitterId,
    getUserByTwitterId,

    getYelpSearch,
}

export default apis
