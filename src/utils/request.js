/*
 * @Author: JennyYao 344561707@qq.com
 * @Date: 2023-08-14 15:29:03
 * @LastEditors: JennyYao 344561707@qq.com
 * @LastEditTime: 2024-08-07 10:20:24
 * @FilePath: \SmartPark\src\utils\request.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import axios from 'axios'
import { Message } from "element-ui";

// axios.create  创建一个axios实例  可以通过实例来请求接口
const service = axios.create({
  // baseURL:基地址（每个接口都有的地址），作用：后面封装的接口，接口的地址都会和baseURL自动拼接到一起
  baseURL: 'https://api-hmzs.itheima.net/v1',
  // 超时时间
  timeout: 5000 // request timeout
})

// 请求拦截器
// 什么时候执行？ 发送请求的时候执行
service.interceptors.request.use(
  config => {
    // config 携带的就是请求信息，并且return不能省略
    // 这个函数通常 配置请求头 携带token
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
    return response.data
  },
    error => {
        if (error.response.status == 401) {
            //token过期
            //清空token + 跳转到登陆页面
            store.commit('/user/removeToken')
            router.push('/login')
      }
      Message.error(error.response.data.msg)
    // 响应失败 状态码4xx-5xx
    // error 错误信息
    // 可以做 统一的错误处理
    return Promise.reject(error)
  }
)

export default service
