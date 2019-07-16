//导入axios
import axios from 'axios'
//导入路由
import router from '../router/router'
//导入vue
import Vue from 'vue'

//创建副本
const managerAxios = axios.create({
    //基地址设置
    baseURL: 'http://localhost:8888/api/private/v1/'
})

//axios拦截器
//请求拦截器
managerAxios.interceptors.request.use(
    function(config){
        //请求的各项设置
        //成功 时触发
        // config是请求的各种设置
        // 给请求头携带token令牌发送请求
        config.headers.Authorization = window.sessionStorage.getItem('token')
        return config
    },
    function(error){
        //请求失败时触发
        return Promise.reject(error)
    }
)

//响应拦截器
managerAxios.interceptors.response.use(
    function(response){
        //响应成功时触发
        //response是服务器返回的数据
        if(response.data.meta.status==400&&response.data.meta.msg=='无效token'){
            //伪造了token  强制删除token 并且回到登录页
            window.sessionStorage.clear();
            new Vue().$message.error('像偷渡???爬')
            router.push('/login')
        }
        return response
    },
    function(error){
        //响应失败时触发
        return Promise.reject(error)
    }
)

//暴露登录请求接口
export const login = ({username,password})=>{
    return managerAxios.post(`/login`,{
        username,
        password
    })
}

export const menus = ()=>{
    return managerAxios.get('/menus')
}