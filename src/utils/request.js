import axios from 'axios'
// import vue from 'vue'
import router from '@/router/index'
// import { baseURL } from '../config/env'
import { Message } from 'element-ui'
import { showLoading, hideLoading } from '@/utils/utils.js'
const service = axios.create({
  // process.env.NODE_ENV === 'development' 来判断是否开发环境
  // easy-mock服务挂了，暂时不使用了
  baseURL: '',
  timeout: 30000,
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
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    return response
  },
  error => {
    hideLoading() // 取消加载框
    // 请求超时
    if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
      Message.error('网络请求超时，请稍后重试')
    }
    // 请求异常处理
    if (error.response.status) {
      switch (error.response.status) {
        case 400:
          Message.error('网络异常，请稍后重试')
          break
        case 401:
          Message.error('登录超时，请重新登录')
          router.push({ name: 'login' })
          break
        case 403:
          Message.error('您暂无权限访问，请联系管理员')
          router.push({ name: '403' })
          break
        case 404:
          Message.error('您访问的资源不存在')
          router.push({ name: '404' })
          break
        case 406:
          Message.error('请求数据失败，请稍后重试')
          break
        case 410:
          Message.error('您访问的资源不存在')
          router.push({ name: '404' })
          break
        case 422:
          Message.error('请求数据失败，请稍后重试')
          break
        case 500:
          Message.error('网络异常，请稍后重试')
          break
      }
    }
    return Promise.reject(error)
  }
)

// 封装不同环境请求
const base = process.env.NODE_ENV === 'production' ? '/advesy' : '/api'

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
