import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false



//导入饿了么ui模块
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);

//导入抽取出去的router
import router from './router/router'

//导入全局css
import './assets/base.css'

new Vue({
  render: h => h(App),
  //挂载路由
  router
}).$mount('#app')
