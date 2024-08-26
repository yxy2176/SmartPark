import request from "@/utils/request";

/**
 * 获取企业列表
 * @param { page, pageSize} params
 * @returns
 */
export function getEnterpriseListAPI(params) {
  return request({
    url: "/park/enterprise",
    params,
  });
}

export function getIndustryListAPI() {
    return request({
        url: "/park/industry",
    });
}


/**
 * 添加企业
 * @param {*} data
 * @returns
 */
export function addEnterpriseAPI(data) {
    return request({
      url: "/park/enterprise",
      method: "POST",
      data,
    });
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
export function updateEnterpriseAPI(data) {
  return request({
    url: '/park/enterprise',
    method: 'PUT',
    data
  })
}

/**
 * 删除企业
 * @param {*} id
 * @returns
 */
export function deleteEnterpriseAPI(id) {
  return request({
    url: `/park/enterprise/${id}`,
    method: 'DELETE'
  })
}