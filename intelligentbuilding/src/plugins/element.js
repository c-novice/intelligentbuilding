import Vue from 'vue'
import {
  Message, MessageBox, Tree, Container, Main, Aside, Header
} from 'element-ui'

// 将组件全局挂在到VUe原形实例
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
Vue.use(Tree)
Vue.use(Container)
Vue.use(Main)
Vue.use(Aside)
Vue.use(Header)
