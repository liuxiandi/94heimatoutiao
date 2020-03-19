import axios from 'axios'
// axios.default 是对原有的默认值进行修改
// axios.create() 相当于new了一个新的axios实例
import JSONBig from 'json-bigint'
// 引入vuex中的store实例对象 相当于组件中的this.$store
import store from '@/store'
import router from '@/router'

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
}, async function (error) {
  if (error.response && error.response.status === 401) {
    const path = {
      path: '/login',
      query: {
        // 需要传递的query参数
        redirectUrl: router.currentRoute.fullpath
      }
    }
    // 如果状态码是401 就认为token失效了 就需要处理token失效问题
    if (store.state.user.refresh_token) {
      // 如果有refresh_token 我们用refresh 换取新的token 需要调用刷新token的接口
      // 在这里发请求必须要用axios 因为现在的token已经失效 instance的拦截器还是会将失效的token注入到headers中
      // 需要用没有拦截器的axios来发 刷新token的请求
      try {
        const result = await axios({
          method: 'put',
          url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
          headers: { authorization: `bearer ${store.state.user.refresh_token}` }
        })
        store.commit('updateUser', {
          // 载荷数据
          user: {
            // 最新的token
            token: result.data.data.token,
            // 还是原来的refresh_token 14天之后过期
            refresh_token: store.state.user.refresh_token

          }
        })
        // 提交mutations 更新vuex数据
        return instance(error.config)
      } catch (error) {
        store.commit('delUser')
        router.push(path)
      }
    } else {
      store.commit('delUser')
      router.push(path)
    }
  }
  return Promise.reject(error)
})

export default instance
