<template>
  <div class="good-item" v-if="goods.status == 1">
    <div>
      <div class="good-img">
        <router-link :to="{name: 'PCGoodsDetail', query:{productId: goods.productId}}">
          <img v-lazy="goods.productImage[0]" :alt="goods.productName">
        </router-link>
      </div>
      <h6 class="good-title">{{goods.productName}}</h6>
      <h3 class="sub-title ellipsis">{{goods.subTitle}}</h3>
      <div class="good-price pr">
        <div class="ds pa">
          <router-link :to="{name: 'PCGoodsDetail', query:{productId: goods.productId}}">
            <y-button text="查看详情" style="margin: 0 5px"/>
          </router-link>
          <y-button text="加入购物车"
                    style="margin: 0 5px"
                    @btnClick="addToCart()"
                    classStyle="main-btn"
          ></y-button>
        </div>
        <p><span style="font-size: 16px">￥</span>
          {{goods.salePrice}}</p>
      </div>
    </div>
  </div>
</template>
<script>
  import YButton from '/components/pc/YButton'
  import { addCart } from '/api/user'
  import { mapMutations, mapState } from 'vuex'
  export default {
    props: {
      goods: {type: Object}
    },
    data () {
      return {
        params: {}
      }
    },
    methods: {
      ...mapMutations(['addCart', 'addAnimation', 'showCart']),
      addToCart () {
        // 添加购物车参数
        this.params.productId = this.goods.productId
        this.params.productNum = 1
        this.params.checked = 1
        this.params.productName = this.goods.productName
        this.params.salePrice = this.goods.salePrice
        this.params.color = this.goods.color[0] ? this.goods.color[0].value : ''
        this.params.size = this.goods.size[0] ? this.goods.size[0].value : ''
        this.params.smallImage = this.goods.smallImage[0] ? this.goods.smallImage[0] : ''
        this.params.bigImage = this.goods.productImage[0] ? this.goods.productImage[0] : ''
        // if (!this.showMoveImg) {     // 动画是否在运动
        if (this.login) { // 登录了 直接存在用户名下
          addCart(this.params).then(res => {
            // 并不重新请求数据
            if (res.code === '0') {
              this.addCart(this.params)
            }
          })
        } else { // 未登录 vuex
          this.addCart(this.params)
        }
        // 加入购物车动画
        // let dom = event.target
        // 获取点击的坐标
        // let elLeft = dom.getBoundingClientRect().left + (dom.offsetWidth / 2)
        // let elTop = dom.getBoundingClientRect().top + (dom.offsetHeight / 2)
        // 需要触发
        // this.addAnimation({moveShow: true, elLeft: elLeft, elTop: elTop, img: img})
        if (!this.isSowCart) {
          this.showCart({isSowCart: true})
          }
        // }
      }
    },
    computed: {
      ...mapState(['login', 'showMoveImg', 'isSowCart'])
    },
    mounted () {
    },
    components: {
      YButton
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  @import "./../../assets/pc/style/mixin";
  @import "./../../assets/pc/style/theme";

  .good-item {
    width: 25%;
    transition: all .5s;
    height: 430px;
    box-shadow: 2px 2px 2px #ccc;
    &:hover {
      transform: translateY(-3px);
      box-shadow: 1px 1px 20px #999;
      .good-price p {
        display: none;
      }
      .ds {
        display: flex;
      }
    }
    .ds {
      @extend %block-center;
      width: 100%;
      display: none;
    }

    .good-img {
      img {
        margin: 50px auto 10px;
        @include wh(206px);
        display: block;
      }
    }
    .good-price {
      margin: 15px 0;
      height: 30px;
      text-align: center;
      line-height: 30px;
      color: #e4393c;
      font-size: 20px;
    }
    .good-title {
      line-height: 1.2;
      font-size: 16px;
      color: #424242;
      margin: 0 auto;
      padding: 0 14px;
      text-align: center;
      overflow: hidden;
    }
    h3 {
      text-align: center;
      line-height: 1.2;
      font-size: 12px;
      color: #d0d0d0;
      padding: 10px;
    }

  }
</style>
