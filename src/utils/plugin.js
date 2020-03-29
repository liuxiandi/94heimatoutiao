import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)
export default {
  // 导出一个默认对象
  install (Vue) {
    //   该方法会在Vue.use时调用
    // 执行此行代码时 Vue.prototype.$notify 应该已经挂载完成
    Vue.prototype.$gnotify = (params) => Vue.prototype.$notify({ duration: 800, ...params }) // 小伎俩
    // 给Vue的原型属性赋值一个函数 自定义一个函数名
    // 定义一个原型属性$sleep 所有组件都有了这个属性
    Vue.prototype.$sleep = sleep
    Vue.filter('relTime', relTime)
  }
}
function sleep (time = 500) {
  // 返回一个promise
  return new Promise(function (resolve, reject) {
    setTimeout(() => resolve(), time)
  })
}
function relTime (date) {
  return dayjs().locale('zh-cn').from(date)
}
