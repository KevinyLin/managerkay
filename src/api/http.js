//导入axios
import axios from 'axios'

//创建副本
const managerAxios = axios.create({
    //基地址设置
    baseURL: 'http://localhost:8888/api/private/v1/'
})

//暴露登录请求接口
export const login = ({username,password})=>{
    return managerAxios.post(`/login`,{
        username,
        password
    })
}

export const menus = ()=>{
    return managerAxios.get('/menus',{
        headers:{
            Authorization:window.sessionStorage.getItem('token')
        }
    })
}