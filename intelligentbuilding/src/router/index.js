import Vue from 'vue'
import VueRouter from 'vue-router'

// 路由懒加载
const Home = () => import('../components/home.vue')
const Normal = () => import('../components/normal.vue')
const Special = () => import('../components/special.vue')
const Xiangxi = () => import ('../components/xiangxi.vue')
const Zhengti = () => import ('../components/zhengti.vue')

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/home' },
  { path: '/home', component: Home, name: 'home' },
  { path: '/normal', component: Normal, name: 'normal' },
  { path: '/special', component: Special, name: 'special' },
  { path: '/xiangxi', component: Xiangxi, name: 'xiangxi' },
  { path: '/zhengti', component: Zhengti, name: 'zhengti' }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
