import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false



//导入饿了么ui模块
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);

//导入日期插件
import moment from 'moment'
//注册全局过滤器处理时间
Vue.filter('formatTime',(value,format)=>{
  return moment(value).format(format)
})

//导入抽取出去的router
import router from './router/router'

//导入全局css
import './assets/base.css'

//导入组件
import mybread from './components/mybread.vue'
//注册全局组件
Vue.component('mybread', mybread)

new Vue({
  render: h => h(App),
  //挂载路由
  router
}).$mount('#app')
