import request from '@/utils/request'


/**
 * 获取角色列表
 * @returns
 */
export function getRoleListAPI() {
    return request({
        url: '/park/sys/role',

    })
}

/**
 * 获取tree权限列表
 * @returns
 */
export function getTreeListAPI() {
    return request({
        url:'/park/sys/permision/all/tree'
    })
}

/**
 * 获取当前角色权限点列表
 * @returns
 */
export function getRoleListDetailAPI(roleId) {
    return request({
        url: `/park/sys/role/${roleId}`
    })
}


/**
 * 获取成员列表
 * @param {*} roleId
 * @param {*} params
 * @returns
 */
export function getRoleUserListAPI(roleId,params) {
    return request({
        url: `/park/sys/roleUser/${roleId}`,
        params,
    })
}

/**
 * 角色管理-添加角色
 * @param {*} data
 * @returns
 */
export function createRoleUserAPI(data) {
    return request({
        url: '/park/sys/role',
        method: 'POST',
        data
    })
}

/**
 * 用户管理-编辑用户
 * @returns
 */
export function updateRoleUserAPI(data) {
    return request({
        url: '/park/sys/role',
        method: 'PUT',
        data
    })
}

/**
 * 角色管理-删除角色
 * @returns
 */
export function delRoleUserAPI(roleId) {
    return request({
        url: `/park/sys/role/${roleId}`,
        method: 'DELETE'
    })
}