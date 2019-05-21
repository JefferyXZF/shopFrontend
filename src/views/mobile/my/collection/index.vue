<template>
  <div class="ui-collect-app">
    <collect-header title="我的收藏"></collect-header>
    <div class="ui-collect-content">
      <goods-card :goods="goods" v-if="goods.length"></goods-card>
      <div v-else class="qwui-none_data">
        <div class="qwui-none_data_img"></div>
        <span class="qwui-none_data_text">暂无数据</span>
      </div>
    </div>
  </div>
</template>

<script>
import '@/assets/mobile/rem/rem.js'
import CollectHeader from '/components/mobile/common/header'
import { collectionList } from '/api/user'
import GoodsCard from "/components/mobile/GoodsCard"
export default {
  name: 'Collection',
  components: {
    CollectHeader,
    GoodsCard
  },
  data () {
    return {
      goods: []
    }
  },
  created () {
    collectionList().then(res => {
      if (res.code === '0') {
        this.goods = res.data || []
      }
    })
  },
  methods: {

  }

}
</script>

<style lang='scss' scoped>
.ui-collect-content {
  padding-top: 1.45rem;
}
//显示无数据样式
.qwui-none_data {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  .qwui-none_data_img {
    width: 3rem;
    height: 3rem;
    background: url(/static/svg/icon_none_data.svg) no-repeat center;
  }
  .qwui-none_data_text {
    font-size: .8rem;
    color: #a6a6a6;
  }
}
</style>
