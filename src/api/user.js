import request from '@/utils/request'

export function login (data) {
  return request({
    url: '/authorizations',
    method: 'post',
    // 接受传入的data axios中的参数放置在data 中
    data
  })
//   返回一个promise对象
}
