import Vue from 'vue'
import VueRouter from 'vue-router'

// 路由懒加载
const Home = () => import('../components/Home.vue')

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/home' },
  { path: '/home', component: Home }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
