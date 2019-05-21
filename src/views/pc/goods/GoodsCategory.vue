<template>
  <div class="goods">
    <div class="nav">
      <div class="w nav-banner">
        <a href="javascript:;" :class="{active:sortType===1}" @click="reset()">综合排序</a>
        <a href="javascript:;" @click="sort(1)" :class="{active:sortType===2}">价格从低到高</a>
        <a href="javascript:;" @click="sort(-1)" :class="{active:sortType===3}">价格从高到低</a>
        <div class="price-interval">
          <input type="number" class="input" placeholder="价格" v-model="minPrice">
          <span style="margin: 0 5px"> - </span>
          <input type="number" placeholder="价格" v-model="maxPrice">
          <y-button text="确定" classStyle="main-btn" @btnClick="filterPrice" style="margin-left: 10px;"></y-button>
        </div>
      </div>
    </div>

    <!--商品-->
    <div class="goods-box w">
      <div v-if="goods.length" class="ui-category-goods">
        <goods-card
        :goods="goodsItem"
        v-for="goodsItem in goods"
        :key="goodsItem.productId"
        class="ui-category-item"></goods-card>
      </div>
      <div v-else class="qwui-none_data">
        <div class="qwui-none_data_img"></div>
        <span class="qwui-none_data_text">暂无数据</span>
      </div>
    </div>
  </div>
</template>
<script>
  import { mapState } from 'vuex'
  import GoodsCard from '/components/pc/goodsCard'
  import YButton from '/components/pc/YButton'
  import { getGoodsByCategory } from '/api/user';
  export default {
    // inject: ['reload'],
    components: {
      GoodsCard,
      YButton
    },
    data () {
      return {
        dataBase: dataBase,
        goods: [],
        tempGoods: [],
        sortType: 1,
        windowHeight: null,
        windowWidth: null,
        categoryId: '',
        minPrice: '',
        maxPrice: ''
      }
    },
    computed: {
      ...mapState(['goodsList'])
    },
    mounted () {
      // 获得分类的商品
      this.categoryId = this.$route.query.categoryId
      this.getData({categoryId: this.categoryId})
      this.windowHeight = window.innerHeight
      this.windowWidth = window.innerWidth
    },
    methods: {
      // 默认排序
      reset () {
        this.getData({categoryId: this.categoryId})
      },
      // 价格排序
      sort (type) {
        // 从小到大排序
        let sort = 0
        type === 1 ? this.sortType = 2 : this.sortType = 3

        this.getData({categoryId: this.categoryId, sort: type})
      },
      getData (params) {
        this.dataBase.loading = true
        getGoodsByCategory(params).then(res => {
          this.dataBase.loading = false
          if (res.code === '0') {
            this.goods = res.data
          }
        })
      },
      filterPrice () {
        this.sortType = 1
        const params = {}
        params.categoryId = this.categoryId
        params.minPrice = this.minPrice
        params.maxPrice = this.maxPrice
        this.getData(params)
      }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
@import "./../../../assets/pc/style/common";
  @import "./../../../assets/pc/style/mixin";
  @import "./../../../assets/pc/style/theme";
  .nav {
    height: 60px;
    line-height: 60px;
    .nav-banner {
      background: #fff;
    }
    > div {
      display: flex;
      align-items: center;
      a {
        padding: 0 15px;
        height: 100%;
        @extend %block-center;
        font-size: 12px;
        color: #999;
        &.active {
          color: #5683EA;
        }
        &:hover {
          color: #5683EA;
        }
      }
      input {
        @include wh(80px, 30px);
        border: 1px solid #ccc;
      }
      input + input {
        margin-left: 10px;
      }
    }
    .price-interval {
      padding: 0 15px;
      margin-bottom: 10px;
      @extend %block-center;
      input[type=number] {
        border: 1px solid #ccc;
        text-align: center;
        background: none;
        border-radius: 5px;
      }
    }
  }
  .load-more {
    text-align: center;background: #fff
  }
  .goods-box {
    overflow: hidden;
    background-color: #fff;
    .ui-category-goods {
      display: flex;
      flex-wrap: wrap;
      border: 1px solid #efefef;
      .ui-category-item {
        border: 1px solid #efefef;
      }
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
