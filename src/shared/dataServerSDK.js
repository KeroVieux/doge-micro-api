const queryString = require('query-string')
const axios = require('axios')

module.exports = async function dataServerSDK(payload) {
  const dataServerUrl = 'http://localhost:3031'
  if (payload.method) {
    switch (payload.method) {
      case 'find':
        const findRes = await axios.get(`${dataServerUrl}/${payload.table}?${queryString.stringify(payload.query)}`)
        return findRes.data
      case 'get':
        const getRes = await axios.get(`${dataServerUrl}/${payload.table}/${payload.id}`)
        return getRes.data
      case 'remove':
        const removeRes = await axios.delete(`${dataServerUrl}/${payload.table}/${payload.id}`)
        return removeRes.data
      case 'create':
        const createRes = await axios.post(`${dataServerUrl}/${payload.table}`, payload.data)
        return createRes.data
      case 'update':
        const updateRes = await axios.put(`${dataServerUrl}/${payload.table}/${payload.id}`, payload.data)
        return updateRes.data
      default:
        return null
    }
  }
  return null
}
