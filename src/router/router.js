//导入路由相关
import VueRouter from 'vue-router'
//导入vue
import Vue from 'vue'

//use一下
Vue.use(VueRouter)

//导入组件
import index from '../views/index.vue'
import login from '../views/login.vue'
import error from '../views/error.vue'

//导入嵌套路由组件
import users from '../views/users.vue'
import roles from '../views/roles.vue'
import rights from '../views/rights.vue'
import goods from '../views/goods.vue'
import categories from '../views/categories.vue'
import orders from '../views/orders.vue'
import params from '../views/params.vue'
import reports from '../views/reports.vue'

//路由规则
const routes = [
  //重定向
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/index',
    component: index,
    children:[
      {
        path:'users',
        component:users
      },
      {
        path:'roles',
        component:roles
      },
      {
        path:'rights',
        component:rights
      },
      {
        path:'goods',
        component:goods
      },
      {
        path:'categories',
        component:categories
      },
      {
        path:'orders',
        component:orders
      },
      {
        path:'params',
        component:params
      },
      {
        path:'reports',
        component:reports
      }
    ]
  },
  {
    path: '/login',
    component: login,
    //添加路由元信息
    meta: {
      //是否需要登录状态验证的标记 为否代表不需要做登录验证
      needLogin: false
    }
  },
  //统一错误页
  {
    path:'/error',
    component:error
  },
  //重定向实现错误URL跳转统一错误页
  {
    path:'*',
    redirect:'/error'
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