import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import router from '@/router'

// axios.create  创建一个axios实例  可以通过实例来请求接口
const service = axios.create({
  // baseURL:基地址（每个接口都有的地址），作用：后面封装的接口，接口的地址都会和baseURL自动拼接到一起
  baseURL: process.env.VUE_APP_BASE_API,
  // 超时时间
  timeout: 5000 // request timeout
})

// 请求拦截器
// 什么时候执行？ 发送请求的时候执行
service.interceptors.request.use(
  config => {
    // config 携带的就是请求信息，并且return不能省略
    // 这个函数通常 配置请求头 携带token
    const token = store.state.user.token
    if (token) {
      config.headers.Authorization = token
    }
    return config
  },
  error => {
    // 执行时机 请求发生错误的时候
    return Promise.reject(error)
  }
)

// 响应拦截器
// 执行时机：当服务端返回数据的时候。数据流转的第一站 就是响应拦截器
service.interceptors.response.use(
  response => {
    // 第一个函数的执行时机：响应成功 状态为2xx
    // return 也不能省略
    // response.data 后端返回的原始数据
    if (response.data.code !== 10000) {
      Message.error(response.data.msg)
      return Promise.reject(response.data)
    } else {
      return response.data
    }
  },
  error => {
    // 响应失败 状态码4xx-5xx
    // error 错误信息
    // 可以做 统一的错误处理
    // 在这里判断token是否过期
    if (error.response.status === 401) {
      // token过期
      // 清空token+ 跳转到登录页
      store.commit('user/removeToken')
      router.push('/login')
    }
    Message.error(error.response.data.msg)
    return Promise.reject(error)
  }
)

export default service
