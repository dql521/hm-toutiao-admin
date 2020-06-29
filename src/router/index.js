import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../pages/Home.vue'
import Login from '../pages/Login.vue'
import postList from '../pages/postList.vue'
import postPublish from '../pages/postPublish.vue'
import Demo from '../pages/Demo.vue'

Vue.use(VueRouter)
const router = new VueRouter({
  routes: [
    {
      path: '/',
      component: Home,
      name: 'home',
      children: [
        { path: '/post-list', component: postList, name: 'post-list' },
        { path: '/post-publish', component: postPublish, name: 'post-publish' }
      ]
    },
    { path: '/login', component: Login, name: 'login' },
    { path: '/demo', component: Demo, name: 'demo' }
  ]
})

// 解决vue router连续点击多次路由报错
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

// 导航守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (token || to.path === '/login') {
    next()
  } else {
    // router.push('/login')
    router.replace({
      path: '/login',
      query: {
        redirect: router.currentRoute.fullPath
      }
    })
  }
})
export default router
