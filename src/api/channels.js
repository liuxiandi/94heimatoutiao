import request from '@/utils/request'
export function getMyChannels () {
  // 返回一个promise axios默认就是get类型
  return request({
    url: '/user/channels'
  })
}
