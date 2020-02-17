import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../pages/Home.vue'
import Login from '../pages/Login.vue'
import postList from '../pages/postList.vue'
import postPublish from '../pages/postPublish.vue'

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
    { path: '/login', component: Login, name: 'login' }
  ]
})

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (token || to.path === '/login') {
    next()
  } else {
    router.push('/login')
  }
})
export default router
