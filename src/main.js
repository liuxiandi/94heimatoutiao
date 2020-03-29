import Vue from 'vue'
import App from './App.vue'
import router from './router'
import '@/permisstion'
import store from './store'
import Vant, { Lazyload } from 'vant' // 引入vant组件库
import plugin from '@/utils/plugin'
import 'vant/lib/index.less' // 引入vant组件的样式
import '@/styles/index.less' // 引入自定义的全局样式  覆盖vant的样式
import 'amfe-flexible'
Vue.use(Vant) // 注册Vant的所有组件 一旦注册任意位置都可以使用vant的组件 相当于调用了vant的install方法吧
// 全局注册v-lazy指令
Vue.use(Lazyload)
Vue.use(plugin) // 注册组件 需要放置在Vant之后 因为我们要在plugin中用vant的内置函数
// 以上做法是完整导入的模式
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
