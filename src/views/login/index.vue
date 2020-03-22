<template>
    <div class='container'>
    <!-- 导航 显示返回箭头-->
    <!-- click-left点击左侧事件 -->
    <!-- $router.go(-1) $router.back() -->
    <van-nav-bar title='登录'  left-arrow @click-left="$router.back()"></van-nav-bar>
    <van-cell-group>
      <!-- v-model 有一个修饰符 trim 可以帮助我们自动去除空格 -->
      <van-field @blur="checkMobile" :error-message="errorMessage.mobile" v-model.trim="loginForm.mobile" label="手机号" placeholder="请输入手机号"></van-field>
      <van-field @blur="checkCode" :error-message="errorMessage.code" v-model.trim="loginForm.code" label="验证码" placeholder="请输入验证码">
         <van-button slot="button" size="small" type="primary">发送验证码</van-button>
      </van-field>
    </van-cell-group>

    <div class="login-box">
      <van-button @click="login" type="info" round size="small" block>登录</van-button>
    </div>
  </div>
</template>

<script>
import { login } from '@/api/user'
import { mapMutations } from 'vuex'
export default {
  // 定义一个表单数据，和vant组件绑定
  data () {
    return {
      loginForm: {
        mobile: '13911111111',
        code: '246810'
      },
      errorMessage: {
        // 手机的错误信息
        mobile: '',
        // 验证码的错误信息
        code: ''
      }
    }
  },
  methods: {
    // 可以导入需要的方法  直接把updateUser方法映射到当前的methods方法中
    ...mapMutations(['updateUser']),
    checkMobile () {
      // 获取手机号 判断 是否为空 满足手机号码格式
      // !this.loginFrom.mobile表示为空
      if (!this.loginForm.mobile) {
        this.errorMessage.mobile = '手机号不能为空'
        // 此时表示没有必要在往下进行了  返回一个false 表示此轮校验没通过 如果通过了返回 true
        return false
      }

      if (!/^1[3-9]\d{9}$/.test(this.loginForm.mobile)) {
        this.errorMessage.mobile = '手机号码格式不对'
        return false
      }
      // 如果到了这里  表示校验通过
      this.errorMessage.mobile = ''
      return true
    },
    checkCode () {
      if (!this.loginForm.code) {
        this.errorMessage.code = '验证码不能为空'
        return false
      }

      if (!/^\d{6}$/.test(this.loginForm.code)) {
        this.errorMessage.code = '验证码必须为6位数字'
        return false
      }
      this.errorMessage.code = ''
      return true
    },
    async login () {
      //  校验手机号和验证码
      const validateMobile = this.checkMobile()
      const validateCode = this.checkCode()
      if (validateMobile && validateCode) {
        // 如果两个检查都是true 就表示通过 了校验
        // 校验通过之后 要去调接口 看看用户名和密码是否正确
        try {
          const result = await login(this.loginForm)
          // 拿到token之后 应该把token设置vuex中的state
          // 要去修改vuex中的state必须通过mutations
          this.updateUser({ user: result })

          const { redirectUrl } = this.$route.query
          // redirectUrl有值的话跳到该地址  没值的话跳到主页
          // 短路表达式
          this.$router.push(redirectUrl || '/')
        } catch (error) {
          // this.$notify({ message: '用户名或者密码错误', duration: 800 })
          this.$gnotify({ message: '用户名或者密码错误' })
        }
      }
    }
  }

}
</script>

<style>
.login-box {
  padding: 20px
}

</style>
