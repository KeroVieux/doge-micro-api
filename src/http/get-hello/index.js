const _ = require('lodash')

exports.handler = async function http (request) {
  _.templateSettings.interpolate = /{{([\s\S]+?)}}/g
  const compiled = _.template('hello {{ user }}!')
  const { user } = request.queryStringParameters || {}
  const html = compiled({ 'user': user || 'World' })
  return {
    headers: {
      'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0',
      'content-type': 'text/html; charset=utf8'
    },
    body: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>HTML showcase</title>
  <style></style>
</head>
<body class="padding-32">
  ${html}
</body>
</html>
`
  }
}
