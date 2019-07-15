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
const routes = [
  //重定向
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/index',
    component: index
  },
  {
    path: '/login',
    component: login,
    //添加路由元信息
    meta: {
      //是否需要登录状态验证的标记 为否代表不需要做登录验证
      needLogin: false
    }
  }
]

//实例化路由对象
const router = new VueRouter({
  routes
})

//添加导航守卫
router.beforeEach((to, from, next) => {
  if (to.meta.needLogin != false) {
    //需要做登录验证 获取token是否为undefined
    if (window.sessionStorage.getItem('token') != undefined) {
      next();
    } else {
      //没有token表示未登录
      new Vue().$message.error('想偷渡?爬!')
      //跳转为登录页
      router.push('/login')
    }
  } else {
    //不需要登录验证 直接放过去
    next();
  }
})

export default router