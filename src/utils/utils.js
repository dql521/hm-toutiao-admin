// 公共方法
import vue from 'vue'
import { Loading } from 'element-ui'

// 加载效果
let loadingCount = 0
let loading
// 显示加载
export const showLoading = () => {
  if (loadingCount === 0) {
    loading = Loading.service({ target: '.el-main', lock: true, text: '拼命加载中......' })
  }
  loadingCount++
}

// 隐藏加载
export const hideLoading = () => {
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
