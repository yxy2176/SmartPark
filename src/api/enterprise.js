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

/**
 * 园区管理 - 查询可租赁楼宇
 * @returns
 */
export function getRentBuildingAPI() {
    return request({
        url: '/park/rent/building',
    })
}

/**
 * 添加租赁合同
 * @param {*} data
 * @returns
 */
export function addRentAPI(data) {
    return request({
        url: '/park/enterprise/rent',
        method: 'POST',
        data
    })
}

/**
 * 园区管理-企业租赁信息列表-展开查看
 * @param {*} id 企业id
 * @returns
 */
export function getExpandEnterpriseRentAPI(id) {
    return request({
        url: `/park/enterprise/rent/${id}`
    })
}

/**
 *删除租赁合同
 *
 * @export
 * @param {*} rentId 合同id
 * @return {*}
 */
export function delRentAPI(rentId) {
    return request({
        url: `/park/enterprise/rent/${rentId}`,
        method: 'DELETE'
    })
}

/**
     *
     * @param {*} id
     * @returns
     */
export function outRentAPI(id) {
    return request({
        url: `/park/enterprise/rent/${id}`,
        method:'PUT'
    })
}
