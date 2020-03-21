import router from '@/router'
import store from '@/store'

// 前置守卫 每当路由发生变化时 前置守卫就会执行
router.beforeEach(function (to, from, next) {
  // 需要判断你的请求地址和你的token 如果是/user为起始 说明需要进行token判断
  if (to.path.startsWith('/user') && !store.state.user.token) {
    next({
      path: '/login',
      query: {
        redirectUrl: to.fullPath
      }
    })
  } else {
    next()
  }
})
