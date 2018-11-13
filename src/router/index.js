import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login'
import Home from '@/components/home'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        title: '登录'
      }
    }, {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        title: '电子签到',
        requiresAuto: true
      }
    }
  ]
})
