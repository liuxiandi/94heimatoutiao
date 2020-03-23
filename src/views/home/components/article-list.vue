<template>
  <!-- 文章列表组件 放置列表 -->
  <!-- van-list 可以帮助我们实现上拉加载  需要一些变量 -->
  <!-- 这里放置div的目的是形成滚动条，后期我们要做阅读记忆 -->
  <div class="scroll-wrapper">
      <van-list finished-text='没有了' v-model="upLoading" :finished="finished" @load="onLoad">
          <van-cell-group>
              <van-cell v-for="item in articles" :key="item" title="美股又熔断了" :value="'天台排队' + item"></van-cell>
          </van-cell-group>
      </van-list>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 表示是否开启了上拉加载 默认值false
      upLoading: false,
      // 表示是否已经完成所有数据的加载
      finished: false,
      articles: []
    }
  },
  methods: {
    onLoad () {
      console.log('开始加载数据')
      if (this.articles.length > 50) {
        this.finished = true
      } else {
        const arr = Array.from(Array(15), (value, index) => this.articles.length + index + 1)
        //   上拉加载 不是覆盖之前的数据 应该把数据追加到数组的队尾
        this.articles.push(...arr)
        // 添加完数据 需要手动的关掉 loading
        this.upLoading = false
      }
      // 下面这么写 依然不能关掉加载状态  因为关掉之后 检测机制 高度还是不够 还是会开启
      // 有数据 应该把数据加到list中
    //   // 如果想关掉
    //   setTimeout(() => {
    //     // 表示数据已经全部加载完毕 没有数据了
    //     this.finished = true
    //   }, 1000)
    }
  }

}
</script>

<style>

</style>
