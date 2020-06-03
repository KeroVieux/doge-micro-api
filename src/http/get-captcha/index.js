const dataServerSDK = require('@architect/shared/dataServerSDK')

exports.handler = async function http(request) {
  let { id, text } = request.queryStringParameters
  const recordRes = await dataServerSDK({
    method: 'get',
    table: 'captchas',
    id,
  })
  return {
    body: JSON.stringify(text === recordRes.text)
  }
}
