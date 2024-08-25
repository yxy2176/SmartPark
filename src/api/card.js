import request from "@/utils/request";


/**
 * 获取月卡列表
 * @param { page, pageSize } params
 * @returns
 */
export function getCardListAPI(params) {
  return request({
    url: "/parking/card/list",
    params,
  });
}

/**
 * 新增月卡
 * @params data
 * @return {*}
 */
export function addCardAPI(data) {
  return request({
    url: '/parking/card',
    method: 'POST',
    data
  })
}

/**
 * 获取月卡详情
 * @param {*} id
 * @return {*}
 */
export function getCardDetailAPI(id) {
  return request({
    url: `/parking/card/detail/${id}`
  })
}

/**
 *编辑月卡
 *
 * @export
 * @param {*} data 参数
 * @return {*}
 */
export function editCardAPI(data) {
  return request({
    url: '/parking/card/edit',
    method: 'put',
    data
  })
}

/**
 *
 *删除月卡
 * @export
 * @param {*} id 月卡id
 * @return {*}
 */
export function deleteCardAPI(id) {
  return request({
    url: `/parking/card/${id}`,
    method: 'delete'
  })
}
