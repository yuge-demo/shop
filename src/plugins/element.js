import Vue from 'vue'
import {
      Button,
      Form,
      FormItem,
      Input,
      Message,
      Container,
      Header,
      Aside,
      Main,
      Menu,
      Submenu,
      MenuItem
} from 'element-ui'

Vue.use(Form)
Vue.use(Button)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)

// 全局挂载
Vue.prototype.$message = Message;
