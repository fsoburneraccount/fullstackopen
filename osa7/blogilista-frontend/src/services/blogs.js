import axios from 'axios'
const baseUrl = '/api/blogs'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async (newObject, token) => {
  const config = { headers: { Authorization: `bearer ${token}` } }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async (id, updatedObject, token) => {
  const config = { headers: { Authorization: `bearer ${token}`} }
  const response = await axios.put(`${baseUrl}/${id}`, updatedObject, config)
  return response.data
}

const remove = async (id, token) => {
  const config = { headers: { Authorization: `bearer ${token}` } }
  const response = await axios.delete(`${baseUrl}/${id}`, config)
  return response.data
}

const getComments = async id => {
  const response = await axios.get(`${baseUrl}/${id}/comments`)
  return response.data
}

const addComment = async (id, comment) => {
  const response = await axios.post(`${baseUrl}/${id}/comments`, { comment })
  return response.data
}

export default { getAll, create, remove, update, getComments, addComment }
