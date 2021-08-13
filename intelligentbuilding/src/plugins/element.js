import Vue from 'vue'
import {
  Message, MessageBox, Tree
} from 'element-ui'

// 将组件全局挂在到VUe原形实例
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
Vue.use(Tree)
