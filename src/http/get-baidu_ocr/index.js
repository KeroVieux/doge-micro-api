const arc = require('@architect/functions')
const dataServerSDK = require('@architect/shared/dataServerSDK')
const axios = require('axios')
const _ = require('lodash')
const shortid = require('shortid')
const moment = require('moment')
const queryString = require('query-string')

const route = async (request) => {
  const param = queryString.stringify({
    grant_type: 'client_credentials',
    client_id: '',
    client_secret: '',
  })
  const tokenRes = await axios.get(`https://aip.baidubce.com/oauth/2.0/token?${param}`)
  const access_token = tokenRes.data.access_token
  let { url } = request.queryStringParameters
  const res = await axios.post(
      `https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic?access_token=${access_token}`,
      queryString.stringify({
        url:
            url ||
            'http://dogeapp.cn:9070/images/2019/11/27/4b7ed21e850378fec9ef232b4850ed7f.jpg',
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
  )
  const recordId = shortid.generate()
  await dataServerSDK({
    method: 'create',
    table: 'orcRecords',
    data: {
      id: recordId,
      url,
      code: res.data.error_code || 0,
      result: res.data,
      createdAt: moment().valueOf()
    },
  })
  let text = ''
  if (!res.data.error_code) {
    _.forEach(res.data.words_result, (i) => {
      text += i.words
    })
  } else {
    text = data.error_msg
  }
  return {
    body:  JSON.stringify({
      recordId,
      text,
    })
  }
}

exports.handler = arc.http.async(route)
