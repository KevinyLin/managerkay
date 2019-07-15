//导入路由相关
import VueRouter from 'vue-router'
//导入vue
import Vue from 'vue'

//use一下
Vue.use(VueRouter)

//导入组件
import index from '../views/index.vue'
import login from '../views/login.vue'

//路由规则
const routes=[
  //重定向
  {
    path:'/',
    redirect:'/login'
  },
  {
    path:'/index',
    component:index
  },
  {
    path:'/login',
    component:login
  }
]

//实例化路由对象
const router = new VueRouter({
  routes
})

export default router