let arc = require('@architect/functions')
const axios = require('axios')
const _ = require('lodash')
const queryString = require('query-string')
const md5 = require('md5')

const route = async (request) => {
  let { q, from, to} = request.queryStringParameters
  const appid = ''
  const key = ''
  const salt = new Date().getTime()
  const str1 = appid + q + salt + key
  const sign = md5(str1)
  const payload = {
    q: q || 'unknown',
    from: from || 'en',
    to: to || 'zh',
    appid: appid,
    salt: salt,
    sign: sign,
  }
  const { data } = await axios.get(
      `http://api.fanyi.baidu.com/api/trans/vip/translate?${queryString.stringify(payload)}`
  )
  let text = ''
  if (!data.error_code) {
    _.forEach(data.trans_result, (i) => {
      text += i.dst + '\n'
    })
  } else {
    text = data.error_msg
  }
  return {
    body:  text
  }
}

exports.handler = arc.http.async(route)
