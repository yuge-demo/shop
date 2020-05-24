import Vue from 'vue'
import App from './App.vue'
import router from './router'
import "./assets/fonts/iconfont.css"
import './plugins/element.js'
import axios from 'axios'
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
Vue.prototype.$axios = axios


Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
