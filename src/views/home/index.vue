<template>
  <div class="container">
    <van-tabs>
      <!-- 内部放置子标签 title值为当前显示的内容 -->
      <van-tab :title="item.name" v-for="item in channels" :key="item.id">
        <!-- <div class='scroll-wrapper'>
          <van-cell-group>
            <van-cell title="标题" value="内容" :key="item" v-for="item in 20"></van-cell>
          </van-cell-group> -->

          <!-- 父组件监听自定义事件，并且弹出层 -->
         <ArticleList @showAction="openAction" :channel_id="item.id"></ArticleList>
        <!-- </div> -->
      </van-tab>
    </van-tabs>

    <span class="bar_btn">
      <van-icon name='wap-nav'></van-icon>
    </span>
    <van-popup v-model="showMoreAction" style="width: 80%">
      <MoreAction> </MoreAction>
    </van-popup>
    </div>
</template>

<script>
// @ is an alias to /src
import ArticleList from './components/article-list'
import MoreAction from './components/more-action'
import { getMyChannels } from '@/api/channels'
export default {
  name: 'Home',
  components: {
    ArticleList, MoreAction
  },
  data () {
    return {
      // 接受频道数据
      channels: [],
      // 是否显示弹层组件  默认不显示
      showMoreAction: false
    }
  },
  methods: {
    async getMyChannels () {
      const data = await getMyChannels()
      this.channels = data.channels
    },
    // 此方法会在article-list组件触发showAction的时候触发
    openAction () {
      this.showMoreAction = true
    }
  },
  created () {
    this.getMyChannels()
  }
}
</script>

<style lang="less" scoped>
.van-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
  /deep/ .van-tabs__wrap {
    height: 36px;
    padding-right: 36px;
    .van-tab {
      line-height: 36px;
    }
    .van-tabs__line {
      background-color: #3296fa;
      height: 2px;
    }
  }
  /deep/ .van-tabs__content {
    flex: 1;
    overflow: hidden;
  }
  /deep/ .van-tab__pane {
    height: 100%;
    .scroll-wrapper {
      height: 100%;
      overflow-y: auto;
    }
  }
}
.bar_btn {
  width: 36px;
  height: 35px;
  position: absolute;
  top: 0;
  right: 0;
  &::before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 999;
    box-shadow: 0 0 10px #999;
    transform: scale(1, 0.6);
  }
  .van-icon-wap-nav {
    width: 100%;
    height: 100%;
    background: #fff;
    text-align: center;
    line-height: 35px;
    position: relative;
    z-index: 1000;
    &::before {
      font-size: 20px;
    }
  }
}
</style>
