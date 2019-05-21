<template>
  <div class="ui-search-app">
    <search-header title="搜索"></search-header>
    <div class="ui-search-header">
      <span class="iconfont icon-sousuo ui-search-icon"></span>
      <input
        type="search"
        placeholder="搜索"
        @keyup.enter="getSearchGoods"
        autofocus="true"
        v-model.trim="productName" class="ui-search-input">
      <span class="ui-search-btn" @click="getSearchGoods">搜索</span>
    </div>
    <div class="ui-search-goods">
      <goods-card :goods="goodsList" v-if="goodsList.length"></goods-card>
      <none-data v-else></none-data>
    </div>
  </div>
</template>

<script>
import '@/assets/mobile/rem/rem.js'
import { getGoodsByProductName } from '/api/user'
import GoodsCard from "/components/mobile/GoodsCard"
import SearchHeader from '/components/mobile/common/header'
import NoneData from '/components/mobile/NoneData'
export default {
  name: 'Search',
  components: {
    GoodsCard,
    SearchHeader,
    NoneData
  },
  data () {
    return {
      productName: '',
      goodsList: []
    }
  },
  methods: {
    getSearchGoods () {
      let productName = this.productName
      let param = {}
      if (productName) {
        param.productName = productName
      }
      getGoodsByProductName(param).then(res => {
          if (res.code === '0') {
            this.goodsList = res.data || []
          }
        })
    }
  }
}
</script>

<style lang='scss' scoped>
.ui-search-app /deep/ .mint-searchbar-cancel {
    font-size: .4rem;
  }
.ui-search-header {
  display: flex;
  padding-top: 1.45rem;
  width: 100%;
  line-height: 1rem;
  background: #ccc;
  padding-left: 1rem;
  position: fixed;
  .ui-search-icon {
    position: absolute;
    left: .3rem;
    color: #fff;
  }
  .ui-search-input {
    flex: 1;
    padding: 5px;
    border: 1px solid #ccc;
    margin-top: -2px;
  }
  .ui-search-btn {
    display: inline-block;
    width: 2rem;
    text-align: center;
    font-size: .4rem;
    background: #26a2ff;
    color: #fff;
        margin-top: -2px;
  }
}
.ui-search-goods {
  padding-top: 2.3rem;
}
</style>
