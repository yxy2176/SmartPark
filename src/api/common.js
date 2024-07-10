import request from '@/utils/request'

/**
 * 上传文件
 *
 * @export
 * @param {*} form 参数
 * @return {*}
 */
export function uploadFile(form) {
  return request({
    url: '/upload',
    method: 'post',
    data: form
  })
}
