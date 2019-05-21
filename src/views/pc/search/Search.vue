<template>
  <div class="w">
    <section v-if="goodsList.length" class="goods-box">
      <goods-card
        :goods="goodsItem"
        v-for="goodsItem in goodsList"
        :key="goodsItem.productId"
        class="ui-search-goods"
        ></goods-card>
    </section>
    <div v-else class="qwui-none_data">
      <div class="qwui-none_data_img"></div>
      <span class="qwui-none_data_text">暂无数据</span>
    </div>
  </div>
</template>
<script>
  import { getGoodsByProductName } from '/api/user'
  import GoodsCard from '/components/pc/goodsCard'
  export default {
    data () {
      return {
        goodsList: []
      }
    },
    methods: {

    },
    watch: {
      '$route': function (value) {
        this.getSearchGoods()
      }
    },
    mounted () {
      this.getSearchGoods()
    },
    methods: {
      getSearchGoods () {
        let productName = this.$route.query.productName
          getGoodsByProductName({productName}).then(res => {
            if (res.code === '0') {
              this.goodsList = res.data || []
            }
          })
      }
    },
    components: {
      GoodsCard
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  .w {
    width: 1220px;
    margin: 0 auto;
  }
  section {
    width: 100%;
  }
  .goods-box {
    display: flex;
    flex-wrap: wrap;
    background-color: #fff;
    .ui-search-goods {
      border: 1px solid #efefef;
    }
  }
//显示无数据样式
.qwui-none_data {
  position: relative;
  left: 50%;
  margin-top: 200px;
  transform: translate(-50%, -50%);
  text-align: center;
  .qwui-none_data_img {
    width: 200px;
    height: 150px;
    margin: 0 auto;
    background: url(/static/svg/icon_none_data.svg) no-repeat center;
  }
  .qwui-none_data_text {
    font-size: 16px;
    color: #a6a6a6;
  }
}
</style>
