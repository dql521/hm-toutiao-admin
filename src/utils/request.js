import axios from 'axios'
import vue from 'vue'
import router from '../router/index'
// import { baseURL } from '../config/env'
import { Loading, Message } from 'element-ui'

const service = axios.create({
  // process.env.NODE_ENV === 'development' 来判断是否开发环境
  // easy-mock服务挂了，暂时不使用了
  // baseURL: baseURL,
  timeout: 10000
  // headers: {
  //   post: {
  //     'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
  //     // 在开发中，一般还需要单点登录或者其他功能的通用请求头，可以一并配置进来
  //   },
  //   get: {
  //     'Content-Type': 'application/json;charset=utf-8'
  //     // 在开发中，一般还需要单点登录或者其他功能的通用请求头，可以一并配置进来
  //   }
  // }
  // withCredentials: true // 跨域请求的全局凭证
})

// 公共请求头
// service.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

// 加载效果
let loadingCount = 0
let loading
const showLoading = () => {
  if (loadingCount === 0) {
    loading = Loading.service({ target: '.el-main', lock: true, fullscreen: false, text: '拼命加载中......' })
  }
  loadingCount++
}
const hideLoading = () => {
  if (loadingCount <= 0) {
    return
  }
  loadingCount--
  if (loadingCount === 0) {
    vue.nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
      loading.close()
    })
  }
}
// 请求拦截器
service.interceptors.request.use(
  config => {
    config.headers.token = localStorage.getItem('token') || ''
    showLoading()
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
    setTimeout(() => {
      hideLoading()
    }, 200)
    // if (response.status === 200) {
    //   return response.data
    // }
    return response
  },
  error => {
    setTimeout(() => {
      hideLoading()
    }, 200)
    if (error.response.status === 504 || error.response.status === 404) {
      Message.error({ message: '网络异常请稍后重试' })
      router.push({ name: '404' })
    } else if (error.response.status === 403) {
      Message.error({ message: '暂无权限,请联系管理员!' })
      router.push({ name: '403' })
    } else {
      Message.error({ message: '网络异常请稍后重试' })
      router.push({ name: '404' })
    }
    console.log(error)
    return Promise.reject(error)
  }
)

// 封装不同请求
// const base = 'http://localhost:3000'

export const postRequest = (url, params) => {
  return service({
    method: 'post',
    url: 'http://localhost:3000' + url,
    data: params
    // transformRequest: [function (data) {
    //   let ret = ''
    //   for (const it in data) {
    //     ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
    //   }
    //   return ret
    // }]
    // headers: {
    //   'Content-Type': 'application/x-www-form-urlencoded'
    // }
  })
}
// export const uploadFileRequest = (url, params) => {
//   return axios({
//     method: 'post',
//     url: url,
//     params: params,
//     headers: {
//       'Content-Type': 'multipart/form-data'
//     }
//   })
// }
// export const putRequest = (url, params) => {
//   return axios({
//     method: 'put',
//     url: url,
//     data: params,
//     transformRequest: [function (data) {
//       let ret = ''
//       for (const it in data) {
//         ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
//       }
//       return ret
//     }],
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded'
//     }
//   })
// }
// export const deleteRequest = (url) => {
//   return axios({
//     method: 'delete',
//     url: url
//   })
// }
export const getRequest = (url, params) => {
  return service({
    method: 'get',
    url: 'http://localhost:3000' + url,
    params: params
  })
}

export default service
