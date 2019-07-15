//导入axios
import axios from 'axios'

//创建副本
const managerAxios = axios.create({
    //基地址设置
    baseURL: 'http://localhost:8888/api/private/v1/'
})

export const login = ({username,password})=>{
    return managerAxios.post(`/login`,{
        username,
        password
    })
}