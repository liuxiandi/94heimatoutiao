<template>
  <!-- 文章列表组件 放置列表 -->
  <!-- van-list 可以帮助我们实现上拉加载  需要一些变量 -->
  <!-- 这里放置div的目的是形成滚动条，后期我们要做阅读记忆 -->
  <div class="scroll-wrapper">
    <van-pull-refresh v-model="downLoading" @refresh="onRefresh" :success-text="successText">
      <van-list finished-text="没有了" v-model="upLoading" :finished="finished" @load="onLoad">
        <!-- 循环内容 -->
        <van-cell-group>
          <!-- 此时的item.art_id是一个大数字对象 v-for 的key需要用字符串或者数字带理 -->
          <van-cell v-for="item in articles" :key="item.art_id.toString()">
            <div class="article_item">
              <h3 class="van-ellipsis">{{ item.title }}</h3>
              <div class="img_box" v-if="item.cover.type === 3">
                <van-image class="w33" fit="cover" :src="item.cover.images[0]" />
                <van-image class="w33" fit="cover" :src="item.cover.images[1]" />
                <van-image class="w33" fit="cover" :src="item.cover.images[2]" />
              </div>
               <div class="img_box" v-if="item.cover.type === 1">
                <van-image class="w100" fit="cover" :src="item.cover.images[0]" />
              </div>
              <div class="info_box">
                <span>{{ item.aut_name }}</span>
                <span>{{ item.comm_count }}评论</span>
                <span>{{ item.pubdate }}</span>
                <span class="close">
                  <van-icon name="cross"></van-icon>
                </span>
              </div>
            </div>

          </van-cell>
        </van-cell-group>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticle } from '@/api/article'
export default {
  data () {
    return {
      // 表示是否开启了上拉加载 默认值false
      upLoading: false,
      // 表示是否已经完成所有数据的加载
      finished: false,
      articles: [],
      successText: '',
      downLoading: false,
      timestamp: null
    }
  },
  // props传值 props:['属性名']来接受属性
  // props也可以跟一个对象
  // props 对象形式 可以约束传入的值 必填 传值类型
  props: {
    // key(props属性名)：value（对象 配置）
    channel_id: {
      // 必填项 此属性的含义 true要求该props必须传
      required: true,
      // 表示要传入的prop属性的类型
      type: Number,
      // 默认值的意思 假如你没传入prop属性 默认值就会被采用
      default: null
    }

  },
  methods: {
    async onLoad () {
      console.log('开始加载文章列表数据')
      // if (this.articles.length > 50) {
      //   this.finished = true
      // } else {
      //   const arr = Array.from(
      //     Array(15),
      //     (value, index) => this.articles.length + index + 1
      //   )
      //   //   上拉加载 不是覆盖之前的数据 应该把数据追加到数组的队尾
      //   this.articles.push(...arr)
      //   // 添加完数据 需要手动的关掉 loading
      //   this.upLoading = false
      // }
      // 下面这么写 依然不能关掉加载状态  因为关掉之后 检测机制 高度还是不够 还是会开启
      // 有数据 应该把数据加到list中
      //   // 如果想关掉
      //   setTimeout(() => {
      //     // 表示数据已经全部加载完毕 没有数据了
      //     this.finished = true
      //   }, 1000)

      // this.timestamp || Date.now() 如果有历史时间戳 用历史时间戳 否则用当前的时间戳
      // this.channel_id 指的是当前的频道id
      const data = await getArticle({ channel_id: this.channel_id, timestamp: this.timestamp || Date.now() })
      // 将数据追加到队尾
      this.articles.push(...data.results)
      // 关闭加载状态
      this.upLoading = false
      if (data.pre_timestamp) {
        this.timestamp = data.pre_timestamp
      } else {
        this.finished = true
      }
    },
    async onRefresh () {
      // 下拉刷新应该发送最新的时间戳
      const data = await getArticle({
        channel_id: this.channel_id,
        timestamp: Date.now()
      })
      // 手动关闭 下拉刷新的状态
      this.downLoading = false
      // 需要判断 最新的时间戳能否换来数据 如果能换来数据 把新数据整个替换旧数据 如果不能就告诉大家 暂时没有更新
      if (data.results.length) {
        // 如果又返回数据 需要将整个的article替换
        this.articles = data.results
        if (data.pre_timestamp) {
          // 下拉刷新 换来了一波新的数据 里面又有时间戳
          // 重新唤醒列表 继续上拉加载
          this.finished = false
          // 记录；历史时间戳给变量
          this.timestamp = data.pre_timestamp
        }
        this.successText = `更新了${data.results.length}条数据`
      } else {
        this.successText = '当前已经是最新了'
      }
      // setTimeout(() => {
      //   // 下拉刷新 表示要读取最新的数据 而且最新的数要添加到数据头部
      //   const arr = Array.from(
      //     Array(2),
      //     (value, index) => '追加' + (index + 1)
      //   )
      //   // 数组添加到头部
      //   this.articles.unshift(...arr)
      //   // 手动关闭正在加载的状态
      //   this.downLoading = false
      //   this.successText = `跟新了${arr.length}条数据`
      // }, 1000)
    }
  }
}
</script>

<style lang="less">
.article_item {
  h3 {
    font-weight: normal;
    line-height: 2;
  }
  .img_box {
    display: flex;
    justify-content: space-between;
    .w33 {
      width: 33%;
      height: 90px;
    }
    .w100 {
      width: 100%;
      height: 180px;
    }
  }
  .info_box {
    color: #999;
    line-height: 2;
    position: relative;
    font-size: 12px;
    span {
      padding-right: 10px;
      &.close {
        border: 1px solid #ddd;
        border-radius: 2px;
        line-height: 15px;
        height: 12px;
        width: 16px;
        text-align: center;
        padding-right: 0;
        font-size: 8px;
        position: absolute;
        right: 0;
        top: 7px;
      }
    }
  }
}
</style>
