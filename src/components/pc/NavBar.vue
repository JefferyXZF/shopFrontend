<!--底部导航-->
<template>
  <div class="nav-sub">
    <div class="nav-sub-wrapper">
      <div class="w">
        <ul class="nav-list">
          <li
            v-for="(item, index) in goodsCategory"
            v-show="item.status == 1"
            :key="index + '24322'"
            class="ellipsis"
            @click="goCategoryGood(item)"
            :class="{active: isShowBottom == item._id}">
            <span>{{item.categoryName}}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NavBar',
  props: {
    goodsCategory: {
      type: [Array, Object],
      default () {
        return []
      }
    }
  },
  data () {
    return {
      isShowBottom: 1
    }
  },
  watch: {
    '$route': { // 监听路由变化，聚焦导航栏
      handler (route) {
        if (route.name === 'PCGoodsDetail' || route.name === 'PCSearchGoods') { // 商品详情,搜索不聚焦
          this.isShowBottom =  -1
        } else {
          if (route.name === 'PCGoodsCategory' && !route.query.categoryId) { // 首页聚焦
            this.isShowBottom = 2
          } else {
            this.isShowBottom = route.query.categoryId || 1 // 默认聚焦 全部 栏
          }
        }
      },
      immediate: true // 立即监听路由
    }
  },
  methods: {
    // 商品分类
    goCategoryGood (item) {
      this.isShowBottom = item._id
      this.$emit("onCategoryList", item)
    }
  }
}
</script>

<style lang='scss' scoped>
.nav-sub {
    position: relative;
    height: 60px;
    background: #f7f7f7;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .04);
    z-index: 1;
    .nav-sub-wrapper {
      height: 60px;
      position: relative;
      &:after {
        content: " ";
        position: absolute;
        top: 89px;
        left: 50%;
        margin-left: -610px;
        width: 1220px;
        background: #000;
        height: 1px;
        display: none;
        opacity: 0;
        -webkit-transition: opacity .3s ease-in;
        transition: opacity .3s ease-in;
      }
    }
    .w {
      display: flex;
      justify-content: space-between;
    }
    .nav-list {
      line-height: 28px;
      display: flex;
      align-items: center;
      height: 100%;
      // position: relative;
      li {
        display: inline-block;
        position: relative;
        float: left;
        width: 80px;
        padding-left: 2px;
        margin-right: 20px;
        line-height: 60px;
        text-align: center;
        cursor: pointer;
        transition: all 1s ease-out;
      }
      .active:after {
        content: '.';
        position: absolute;
        bottom: 0;
        left: 0;
        height: 5px;
        width: 100%;
        background-color: red;

      }
    }
  }
</style>




