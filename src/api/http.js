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
    function (config) {
        //请求的各项设置
        //成功 时触发
        // config是请求的各种设置
        // 给请求头携带token令牌发送请求
        config.headers.Authorization = window.sessionStorage.getItem('token')
        return config
    },
    function (error) {
        //请求失败时触发
        return Promise.reject(error)
    }
)

//响应拦截器
managerAxios.interceptors.response.use(
    function (response) {
        //响应成功时触发
        //response是服务器返回的数据
        if (response.data.meta.status == 400 && response.data.meta.msg == '无效token') {
            //伪造了token  强制删除token 并且回到登录页
            window.sessionStorage.clear();
            new Vue().$message.error('像偷渡???爬')
            router.push('/login')
        }
        return response
    },
    function (error) {
        //响应失败时触发
        return Promise.reject(error)
    }
)

//暴露登录请求接口
export const login = ({
    username,
    password
}) => {
    return managerAxios.post(`/login`, {
        username,
        password
    })
}

//获取左侧导航菜单
export const menus = () => {
    return managerAxios.get('/menus')
}

//获取用户列表
export const users = ({
    query,
    pagenum,
    pagesize
}) => {
    return managerAxios.get('users', {
        params: {
            query,
            pagenum,
            pagesize
        }
    })
}

//添加用户
export const usersAdd = ({
    username,
    password,
    email,
    mobile
}) => {
    return managerAxios.post('users', {
        username,
        password,
        email,
        mobile
    })
}

//获取订单列表
export const orders = ({
    query,
    pagenum,
    pagesize
}) => {
    return managerAxios.get('orders', {
        params: {
            query,
            pagenum,
            pagesize
        }
    })
}

//获取权限管理->权限列表数据
export const rights = () => {
    return managerAxios.get(`rights/list`)
}

//修改用户状态
export const changeState = ({id,type})=>{
    return managerAxios.put(`users/${id}/state/${type}`)
}

//删除用户
export const deleteUser = ({id})=>{
    return managerAxios.delete(`users/${id}`)
}

//修改用户信息
export const putUser = ({id,email,mobile})=>{
    return managerAxios.put(`users/${id}`,{
        email,
        mobile
    })
}

//获取商品列表
export const goods = ({
    query,
    pagenum,
    pagesize
}) => {
    return managerAxios.get('goods', {
        params: {
            query,
            pagenum,
            pagesize
        }
    })
}

//删除商品
export const deleteGoods = ({id})=>{
    return managerAxios.delete(`goods/${id}`)
}

//暴露接口  -  角色列表
export const getRoles = ()=>{
    return managerAxios.get(`/roles`)
}  

//暴露接口  -  分配用户角色
export const disRoles = ({id,rid})=>{
    return managerAxios.put(`/users/${id}/role`,{
        rid
    })
}  

//暴露接口  -  删除角色指定权限
export const delRoleRights = (roleId,rightsId)=>{
    return managerAxios.delete(`/roles/${roleId}/rights/${rightsId}`)
}  

//暴露接口   -  权限列表树数据
export const rightsTree = () => {
    return managerAxios.get(`rights/tree`)
}

//暴露接口   -  角色授权
export const roleRights = ({roleId,rids}) => {
    return managerAxios.post(`roles/${roleId}/rights`,{
        rids
    })
}

//暴露接口   -  添加角色
export const addRole = ({roleName,roleDesc}) => {
    return managerAxios.post(`/roles`,{
        roleName,
        roleDesc
    })
}

//暴露接口   -  删除角色
export const removeRole = ({id}) => {
    return managerAxios.delete(`/roles/${id}`)
}

//暴露接口   -  编辑角色
export const editRole = ({id,roleName,roleDesc}) => {
    return managerAxios.put(`/roles/${id}`,{
        roleName,
        roleDesc
    })
}

//暴露接口   -  商品分类列表
export const categories = () => {
    return managerAxios.get(`/categories`,{
        params:{
            type:3
        }
    })
}

//暴露接口   -  数据报表
export const reports = () => {
    return managerAxios.get(`/reports/type/1`)
}