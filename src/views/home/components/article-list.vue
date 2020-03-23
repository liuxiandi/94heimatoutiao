<template>
  <!-- 文章列表组件 放置列表 -->
  <!-- van-list 可以帮助我们实现上拉加载  需要一些变量 -->
  <!-- 这里放置div的目的是形成滚动条，后期我们要做阅读记忆 -->
  <div class="scroll-wrapper">
      <van-list v-model="upLoading" :finished="finished" @load="onLoad"></van-list>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 表示是否开启了上拉加载 默认值false
      upLoading: false,
      // 表示是否已经完成所有数据的加载
      finished: false
    }
  },
  methods: {
    onLoad () {
      console.log('开始加载数据')
      // 下面这么写 依然不能关掉加载状态  因为关掉之后 检测机制 高度还是不够 还是会开启
      // 有数据 应该把数据加到list中
      // 如果想关掉
      setTimeout(() => {
        // 表示数据已经全部加载完毕 没有数据了
        this.finished = true
      }, 1000)
    }
  }

}
</script>

<style>

</style>
