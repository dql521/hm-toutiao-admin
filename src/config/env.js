// 根据不同环境更改不同baseUrl
let baseUrl = ''
if (process.env.NODE_ENV === 'development') {
  baseUrl = 'http://127.0.0.1:3000'
} else if (process.env.NODE_ENV === 'production') {
  // baseUrl = '灰度地址';
  baseUrl = 'http://192.168.3.1:3000'
}

export {
  baseUrl
}
