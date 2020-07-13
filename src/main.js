import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { getRequest, postRequest } from '../src/utils/request'
// import axios from 'axios'
import moment from 'moment'
import ElementUi from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'lib-flexible'

Vue.config.productionTip = false

// axios.defaults.baseURL = 'http://localhost:3000'
// Vue.prototype.$axios = axios
Vue.prototype.$fixUrl = function (url) {
  if (url.startsWith('http')) {
    return url
  } else {
    // return axios.defaults.baseURL + url
    return 'http://localhost:3000' + url
  }
}

Vue.prototype.getRequest = getRequest
Vue.prototype.postRequest = postRequest
Vue.prototype.$store = store
Vue.prototype.$baseUrl = process.env.VUE_APP_HOST

Vue.use(ElementUi)
Vue.filter('time', function (input) {
  return moment(input).format('YYYY-MM-DD')
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
