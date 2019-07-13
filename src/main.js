import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

//导入路由相关
import VueRouter from 'vue-router'

//导入组件
import index from './components/index.vue'
import login from './components/login.vue'

//use一下
Vue.use(VueRouter)

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
new Vue({
  render: h => h(App),
  //挂载路由
  router
}).$mount('#app')
