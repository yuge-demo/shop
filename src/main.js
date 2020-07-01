import Vue from 'vue'
import App from './App.vue'
import router from './router'
import "./assets/fonts/iconfont.css"
import './plugins/element.js'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'

//需要授权的api 必须在请求头只用Authorization字段提供令牌
// 通过axios请求在添加
axios.interceptors.request.use(config => {
  // console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$axios = axios

Vue.component('tree-table', TreeTable)
Vue.config.productionTip = false

Vue.filter('dataFormat', function (originVal) {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + "").padStart(2, '0')
  const d = (dt.getDate() + "").padStart(2, '0')

  const hh = (dt.getHours() + "").padStart(2, "0")
  const mm = (dt.getMinutes() + "").padStart(2, '0')
  const ss = (dt.getSeconds() + "").padStart(2, '0')

  // return`yyyy-mm-dd  hh:mm:ss`
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
