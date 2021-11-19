import Vue from 'vue'
import VueRouter from 'vue-router'

// 路由懒加载
const Home = () => import('../components/home.vue')
const Normal = () => import('../components/normal.vue')
const Special = () => import('../components/special.vue')

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/special' },
  { path: '/home', component: Home },
  { path: '/normal', component: Normal },
  { path: '/special', component: Special }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
