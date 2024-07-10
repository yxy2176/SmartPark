import request from '@/utils/request'

/**
 *获取企业列表
 *
 * @export
 * @param {*} params 参数
 * @return {*}
 */
export function getEnterpriseListAPI(params) {
  return request({
    url: '/park/enterprise',
    params
  })
}

/**
 * 获取所属行业
 *
 * @export
 * @return {*}
 */
export function getIndustryListAPI() {
  return request({
    url: '/park/industry'
  })
}

/**
 * 添加企业
 *
 * @export
 * @param {*} data 参数
 * @return {*}
 */
export function addEnterpriseAPI(data) {
  return request({
    url: '/park/enterprise',
    method: 'post',
    data
  })
}

/**
 * 获取合同详情
 * @param {*} id
 * @returns
 */
export function getEnterpriseDetailAPI(id) {
  return request({
    url: `/park/enterprise/${id}`
  })
}

/**
 * 更新企业
 * @param {*} data
 * @returns
 */
export function updateExterpriseAPI(data) {
  return request({
    url: '/park/enterprise',
    method: 'PUT',
    data
  })
}

/**
 *
 *删除企业
 * @export
 * @param {*} id 企业id
 * @return {*}
 */
export function deleteEnterpriseAPI(id) {
  return request({
    url: `/park/enterprise/${id}`,
    method: 'Delete'
  })
}

/**
 *获取可租赁的楼宇
 *
 * @export
 * @return {*}
 */
export function getRentBuildingAPI() {
  return request({
    url: '/park/rent/building'
  })
}

/**
 * 添加租赁合同
 *
 * @export
 * @param {*} data
 * @return {*}
 */
export function addRentAPI(data) {
  return request({
    url: '/park/enterprise/rent',
    method: 'post',
    data
  })
}

/**
 *获取展开的租赁合同
 *
 * @export
 * @param {*} id 企业id
 * @return {*}
 */
export function getEnterpriseRentBuildingAPI(id) {
  return request({
    url: `/park/enterprise/rent/${id}`
  })
}

/**
 *
 * 退租
 * @export
 * @param {*} id 租赁合同的id
 * @return {*}
 */
export function rentingOutAPI(id) {
  return request({
    url: `/park/enterprise/rent/${id}`,
    method: 'put'
  })
}
