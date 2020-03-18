import axios from 'axios'
// axios.default 是对原有的默认值进行修改
// axios.create() 相当于new了一个新的axios实例
import JSONBig from 'json-bigint'
// 引入vuex中的store实例对象 相当于组件中的this.$store
import store from '@/store'

const instance = axios.create({
//   构造函数 传入一些配置和defaults 一样
  baseURL: 'http://ttapi.research.itcast.cn/app/v1_0',
  transformResponse: [function (data) {
    return data ? JSONBig.parse(data) : {}
  }]
})
instance.interceptors.request.use(function (config) {
  // 成功的时候，读取配置信息，给配置信息注入token
  if (store.state.user.token) {
    //   将token统一注入到headers中
    config.headers.Authorization = `bearer ${store.state.user.token}`
  }
  return config
}, function (error) {
  return Promise.reject(error)
})
// 用响应拦截器 处理返回的数据 将多嵌套的结构 结构出来
instance.interceptors.response.use(function (response) {
  // response实际上已经被axios默认包了一层数据 data才是我们之前处理过的数据，几乎所有的返回数据都有一层data
  try {
    // 如果成功返回 如果两层可以解开 就返回两层
    return response.data.data
  } catch (error) {
    return response.data
  }
}, function (error) {
  return Promise.reject(error)
})

export default instance
