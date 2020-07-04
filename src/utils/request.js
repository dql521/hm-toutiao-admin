import axios from 'axios'
// import vue from 'vue'
// import router from '../router/index'
// import { baseURL } from '../config/env'
import { Message } from 'element-ui'

const service = axios.create({
  // process.env.NODE_ENV === 'development' 来判断是否开发环境
  // easy-mock服务挂了，暂时不使用了
  baseURL: '',
  timeout: 10000,
  dataType: 'json',
  headers: {
    post: {
      'Content-Type': 'application/json;charset=utf-8'
      // 在开发中，一般还需要单点登录或者其他功能的通用请求头，可以一并配置进来
    },
    get: {
      'Content-Type': 'application/json;charset=utf-8'
      // 在开发中，一般还需要单点登录或者其他功能的通用请求头，可以一并配置进来
    }
  }
  // withCredentials: true // 跨域请求的全局凭证
})

// 公共请求头
// service.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

// 加载效果
// let loadingCount = 0
// let loading
// const showLoading = () => {
//   if (loadingCount === 0) {
//     loading = Loading.service({ target: '.el-main', lock: true, fullscreen: false, text: '拼命加载中......' })
//   }
//   loadingCount++
// }
// const hideLoading = () => {
//   if (loadingCount <= 0) {
//     return
//   }
//   loadingCount--
//   if (loadingCount === 0) {
//     vue.nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
//       loading.close()
//     })
//   }
// }
// 请求拦截器
service.interceptors.request.use(
  config => {
    config.headers.token = localStorage.getItem('token') || ''
    return config
  },
  error => {
    console.log(error)
    Message.error({ message: '请求超时!' })
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    // if (response.data.code === 200) {
    //   return response.data
    // }
    return response
  },
  error => {
    // if (error.response.data.code === 504 || error.response.data.code === 404) {
    //   Message.error({ message: '网络异常请稍后重试' })
    //   router.push({ name: '404' })
    // } else if (error.response.data.code === 403) {
    //   Message.error({ message: '暂无权限,请联系管理员!' })
    //   router.push({ name: '403' })
    // } else {
    //   Message.error({ message: '网络异常请稍后重试' })
    //   router.push({ name: '404' })
    // }
    console.log(error)
    return Promise.reject(error)
  }
)

// 封装不同环境请求
const base = process.env.VUE_APP_HOST === 'production' ? '' : '/api'

export const postRequest = (url, params) => {
  return service({
    method: 'post',
    url: base + url,
    data: params
  })
}

export const getRequest = (url, params) => {
  return service({
    method: 'get',
    url: base + url,
    params: params
  })
}

export default service
