# doge-micro-api
This a showcase of the 'arc.codes', also a startkit of a serverless proposal  
more [https://arc.codes](https://arc.codes)

## 概念
1. aws的serverless全家桶可以降低运维成本、降低开发成本、提升扩展能力。只是在大陆并不好用（没有大陆服务器），开发者举步维艰（只有英文文档），我们需要思考如何设计架构能够达到上述3个效果
2. 其中FaaS（Functions as a Service）概念，居功至伟，是达到上述效果的关键所在

### 如何降低运维成本
1. 将 构建服务器获取代码 -> 安装依赖 -> 编译 -> 打包 -> 上传 ->重启服务，这个流程简化为服务器获取代码 -> 安装依赖。
2. 能够单独部署子功能
3. 从运维工作中就能定位到报错的原因

### 如何降低开发成本
1. 使用FaaS的思路，每个服务对应一个函数，每一个函数使用自己的依赖
2. 将业务函数和功能函数彻底分离，减少代码中的交叉import，更容易定位报错
3. 将依赖分区管理，每个函数的文件夹内单独安装依赖
4. 不再出现开发人员a改了一个函数，开发人员b发现报错，定位错误的时间缩短

### 如何提升扩展能力
1. 依赖分区后，不再出现不敢动公共依赖导致不敢写公共类
2. 不再出现不敢写公共类，每个开发人员各自维护公共类

## 工具对比
### 腾讯出品 - Tars
1. [https://github.com/TarsCloud/Tars](https://github.com/TarsCloud/Tars)
2. 算了，不想说了，觉得反而增加了开发的负担

### zeit专用 - micro
1. [https://github.com/vercel/micro](https://github.com/vercel/micro)
2. 实现了FaaS的思路
3. 开发体验一般……

### aws专用 - arc
1. [https://github.com/architect/architect](https://github.com/architect/architect)
2. 实现了FaaS的思路
3. 一键安装/升级所有函数所需要的依赖
4. 自动编译修改后的文件
5. 这里就展示这个工具的使用例子

## Use it as a startkit
### Install
`npm install -g @architect/architect`

### Start
edit `/project/path/.arc`
```text
@app
your-app-name

@http
get /
```
execute the init command   `arc init`  , it will generate files like
```text
├── src/
├── http
│   └── get-index
│       ├── .arc-config
│       └── index.js
└── .arc
```
execute the sandbox bash  , `arc sandbox`  
Now your have got an api which `http://localhost:3333/` (get)
### Add an function
edit `/project/path/.arc`
```text
@app
your-app-name

@http
get /
get /add // what your needed
```
execute the init command, `arc init`, it will generate files like
```text
├── src/
├── http
│   └── get-index
│       ├── .arc-config
│       └── index.js
│   └── get-add
│       ├── .arc-config
│       └── index.js
└── .arc
```
now your have got one more api which `http://localhost:3333/add` (get)  
**No need restart service**

### Install dependencies for a new function
```bash
$ cd /function/path/
$ echo {} > package.json && yarn add @architect/functions aws-sdk
```

### Install new dependencies for a function which is exist
```bash
$ cd /function/path/
$ yarn add axios
```

### Install/update dependencies for a function which is exist from the package.json
```bash
$ arc hydrate
```

or

```bash
$ arc hydrate update
```
### Add some functions can be used for other function
```bash
$ cd /project/path/
$ mkidr shared
$ touch dataServerSDK.js
$ cd /project/path/shared
$ echo {} > package.json && yarn add @architect/functions aws-sdk
```
edit the file
```javascript
module.exports = function layout(body) {
  return `
  <html>
    <body>
      <h1>layout</h1>
      ${body}
    </body>
  </html>
  `
}
```

And then use it
```javascript
let layout = require('@architect/shared/layout')

exports.handler = async function http(req) {
  return {
    body: layout('hello world')
  }
}
```

### deploy
1. git push in your side
2. login your server and execute `git pull` in the path of project
3. execute `arc hydrate` to refresh dependencies
4. if something goes wrong, just restart the service

## 其他
1. **token授权在哪？** 可以写一个jwt的函数；也可以使用各大平台的oath2，在函数里面与授权服务通信来确定授权和身份；
2. **数据库在哪设置？** 可以写各种insert query的函数，在函数内单独设置与服务器的连接；也可以将数据服务独立，提供rest api，让函数与数据服务使用http通信；

## 开发建议
1. 建议必须的基础服务： 1. 授权服务； 2. 图片服务； 3. 用户资料服务； 4. 数据储存服务；等等，
2. 每个函数需要做好错误处理，拒绝500错误，返回正确的错误信息
3. 所有业务需求在前端处理

