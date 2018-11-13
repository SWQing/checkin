// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import $axios from '../static/util/request'
import 'lib-flexible'

Vue.config.productionTip = false

Vue.prototype.$axios = $axios;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
router.beforeEach((to, from, next) => {
  console.log(to);
  if(to.meta.title) {
    document.title = to.meta.title;
  }
  if(to.matched.some(record => record.meta.requiresAuto)) {
    let userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    if(userInfo) {
      next();
    } else {
      next({path: '/login'})
    }
  }
  next();
})
