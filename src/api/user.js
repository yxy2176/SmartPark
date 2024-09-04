// request 就是axios.create创建出来的实例
import request from '@/utils/request'

// 登录函数
// export导出的目的 让组件使用
/**
 * @description: 登录函数
 * @param {*} data { mobile,password}
 * @return {*} promise
 */
export function loginAPI(data) {
  // return request.post('/park/login', data)
  // request返回的是 Promise结果
  const res = request({
    url: '/park/login',
    method: 'POST',
    data
  })
  return res
}

export function getIndustryAPI() {
    return request({
        url:'/park/industry'
    })
}

export function getProfileAPI() {
    return request({
        url: '/park/user/profile',
    })
}