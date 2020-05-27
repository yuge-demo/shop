import Vue from 'vue'
import App from './App.vue'
import router from './router'
import "./assets/fonts/iconfont.css"
import './plugins/element.js'
import axios from 'axios'
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'

//需要授权的api 必须在请求头只用Authorization字段提供令牌
// 通过axios请求在添加
axios.interceptors.request.use(config => {
  // console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$axios = axios


Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
