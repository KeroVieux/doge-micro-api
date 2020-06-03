const arc = require('@architect/functions')
const dataServerSDK = require('@architect/shared/dataServerSDK')
const moment = require('moment')
const svgCaptcha = require('svg-captcha')
const shortid = require('shortid')

const route = async (request) => {
  request.body = arc.http.helpers.bodyParser(request)
  const { w, h } = request.body
  const id = shortid.generate()
  const captcha = svgCaptcha.create({
    ignoreChars: '0o1il',
    width: w || 120,
    height: h || 40,
  })
  await dataServerSDK({
    method: 'create',
    table: 'captchas',
    data: {
      id,
      text: captcha.text,
      createdAt: moment().valueOf(),
    },
  })
  return {
    body: JSON.stringify({
      id,
      svg: captcha.data,
    })
  }
}

exports.handler = arc.http.async(route)
