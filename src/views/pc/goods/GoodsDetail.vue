<!--商品详情-->
<template>
  <div class="w store-content">
    <div class="ui-gray-box">
      <div class="gallery-wrapper">
        <div class="gallery">
          <div class="thumbnail">
            <ul>
              <li v-for="(item, index) in smallImage" :key="item" :class="{on:big===bigImage[index]}" @click="big=bigImage[index];small=item">
                <img v-lazy="item" :alt="product.productName">
              </li>
            </ul>
          </div>
          <div class="thumb">
            <div class="big">
              <img :src="big" :alt="product.productName">
            </div>
          </div>
        </div>
      </div>
      <!--右边-->
      <div class="banner">
        <div class="sku-custom-title">
          <h4>{{product.productName}}</h4>
          <h6>
            <span>{{product.subTitle}}</span>
            <span class="price">
            <del v-if="product.price"><em>¥</em>{{product.price}}</del>
              <em>¥</em><i>{{product.salePrice}}</i></span>
          </h6>
        </div>
        <div class="num" v-if="product.color">
          <span class="params-name">颜色</span>
          <span
            class="params-value"
            :class="{active: col == index}"
            v-for="(item, index) in product.color"
            :key="index + '222'"
            @click="checkParams('col', index, item)">
            {{item.value}}
          </span>
        </div>
        <div class="num" v-if="product.size">
          <span class="params-name">尺寸</span>
          <p>
            <span
              class="params-value params-size"
              :class="{active: size == index}"
              v-for="(item, index) in product.size"
              :key="index + '132'"
              @click="checkParams('size', index, item)">
              {{item.value}}
              </span>
          </p>
        </div>
        <div class="num">
          <span class="params-name">数量</span>
          <buy-num @edit-num="editNum" :id="params.productId" :num="productNum" :limit="Number(limitNum)"></buy-num>
        </div>
        <div class="buy">
          <y-button text="加入购物车"
                    @btnClick="addToCart"
                    classStyle="main-btn"
                    style="width: 145px;height: 50px;line-height: 48px"></y-button>
          <y-button text="现在购买"
                    @btnClick="checkout"
                    style="width: 145px;height: 50px;line-height: 48px"></y-button>
        </div>
      </div>
    </div>
    <div class="ui-goods-detail-nav">
      <nav-list
        :tabList="nav"
        :index="curIndex"
        @selectIndex="selectIndex"></nav-list>
    </div>
    <!--产品信息-->
    <div v-show="type == 1" class="item-info">
      <y-shelf title="产品信息">
        <div slot="content">
          <div class="img-item" v-if="productMsg">
            <div v-html="productMsg" class="img-detail"></div>
          </div>
          <div class="no-info" v-else>
            该产品暂无内容
          </div>
        </div>
      </y-shelf>
    </div>
    <!-- 产品参数 -->
    <div v-show="type == 2" class="goods-params">
      <y-shelf title="产品参数">
        <div slot="content">
          <div class="ui-peizhi">
            <p
            v-for="(item, index) in product.parameter"
            :key="index"
            class="ui-peizhi-info">
              <span class="ui-peizhi-name">{{ item.name }}：</span>
              <span>{{ item.value }}</span>
            </p>
          </div>
        </div>
      </y-shelf>
    </div>
    <!-- 顾客评价 -->
    <div v-show="type == 3" class="goods-params">
      <y-shelf title="顾客评价">
        <div slot="content">
          <div class="ui-evaluate">
            <div class="ui-evaluate-span">
              <span
                v-for="(item, index) in contentParam"
                :key="index"
                :class="{uiEvaluateActive: starIndex == item.type}"
                @click="evaluate(item)">{{ item.name }}
                <i v-if="item.type == 'all'">({{ comment.length || 0 }})</i>
                <i v-if="item.type == 'bad'">({{ badNum }})</i>
                <i v-if="item.type == 'medium'">({{ mediumNum }})</i>
                <i v-if="item.type == 'good'">({{ goodNum }})</i>
              </span>
            </div>
            <div class="ui-evaluate-content">
              <div class="ui-content"
                v-for="(item, index) in comment"
                :key="index + 22"
                v-show="isShowAllComment || item.type == starIndex"
              >
                  <img class="ui-evaluate-img" src="/static/images/person.jpg" alt="">
                <div>
                  <span class="ui-evaluate-name">{{ item.userName }}</span>
                  <span>
                    <i
                      v-for="i in item.curStart"
                      :key="i + '33'"
                    class="iconfont icon-shoucangxuanzhong1" style="color: red"></i>
                  </span>
                  <p class="ui-evaluate-time">{{ item.time }}</p>
                  <p>
                    {{ item.description }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </y-shelf>
    </div>
  </div>
</template>
<script>
  import { productDetail, addCart } from '/api/user'
  import { mapMutations, mapState } from 'vuex'
  import YShelf from '/components/pc/user/Shelf'
  import BuyNum from '/components/pc/BuyNumber'
  import YButton from '/components/pc/YButton'
  import { setSessionStore } from '/utils/storage'
  import NavList from '/components/pc/NavList'
  export default {
    data () {
      return {
        dataBase,
        productMsg: "",
        smallImage: [],
        bigImage: [],
        big: '',
        small: '',
        product: {},
        productNum: 1,
        col: 0,  // 商品颜色
        size: 0,  // 商品尺寸
        params: {},
        nav: [
          {text: '产品详情', type: 1},
          {text: '产品参数', type: 2},
          {text: '顾客评价', type: 3}
        ],
        curIndex: 0,
        type: 1,
        contentParam: [
          {name: '全部', type: 'all'},
          {name: '好评', type: 'good'},
          {name: '中评', type: 'medium'},
          {name: '差评', type: 'bad'}
        ],
        comment: [], // 评论
        starIndex: 'all', // 评论切换按钮聚焦
        isShowAllComment: true, // 是否显示所有评论
        goodNum: 0, // 好评条数
        mediumNum: 0, // 中评条数
        badNum: 0 // 差评条数
      }
    },
    watch: {
      starIndex (value) {
        if (value == 'all') {
          this.isShowAllComment = true
        } else {
          this.isShowAllComment = false
        }
      }
    },
    computed: {
      ...mapState(['login', 'showMoveImg', 'isSowCart']),
      limitNum () {
        return this.product.limitNum == 0 ? 5 : this.productNum.limitNum
      }
    },
    methods: {
      ...mapMutations(['addCart', 'addAnimation', 'showCart', 'checkOrder']),
      getProductDetail (productId) {
        this.dataBase.loading = true
        productDetail({productId}).then(res => {
          this.dataBase.loading = false
          if (res.code === '0') {
            let result = res.data
            this.product = result
            this.productMsg = result.productMsg || ''
            this.smallImage = result.smallImage
            this.bigImage = result.productImage
            this.big = result.productImage[0]
            this.small = result.smallImage[0]
            // 添加购物车参数
            this.params.productId = this.product.productId
            this.params.productName = this.product.productName
            this.params.salePrice = this.product.salePrice
            this.params.color = this.product.color[0] ? this.product.color[0].value : ''
            this.params.size = this.product.size[0] ? this.product.size[0].value : ''
            // 评论
            this.comment = this.product.content.length && this.product.content.map(item => {
              let firstChar = item.userName.charAt(0) // 名字首字母
              let lastChar = ''
              if (item.userName.length >= 3) {
                lastChar = item.userName.charAt(item.userName.length - 1) // 名字尾字母
              }
              item.userName = firstChar + '**' + lastChar
              if (item.curStart <= 2) {
                item.type = 'bad'
                this.badNum += 1
              } else if (item.curStart == 3) {
                item.type = 'medium'
                this.mediumNum += 1
              } else {
                item.type = 'good'
                this.goodNum += 1
              }
              return item
            })
          }
        })
      },
      checkParams (type, index, item) {
        if (type === 'col') {
          this.col = index
          this.params.color = item.value
        } else if (type === 'size') {
          this.size = index
          this.params.size = item.value
        }
      },
      addToCart (id) {
        this.params.smallImage = this.small
        this.params.bigImage = this.big
        this.params.productNum = this.productNum
        this.params.checked = 1
        // if (!this.showMoveImg) {     // 动画是否在运动
        if (this.login) { // 登录了 直接存在用户名下
          addCart(this.params).then(res => {
            // 并不重新请求数据
            this.addCart(this.params)
          })
        } else { // 未登录 vuex
          this.addCart(this.params)
        }
        // 加入购物车动画
        // var dom = event.target
        // 获取点击的坐标
        // let elLeft = dom.getBoundingClientRect().left + (dom.offsetWidth / 2)
        // let elTop = dom.getBoundingClientRect().top + (dom.offsetHeight / 2)
        // 需要触发
        // this.addAnimation({moveShow: true, elLeft: elLeft, elTop: elTop, img: img})
        if (!this.showCart) {
          this.showCart({showCart: true})
        }
        // }
      },
      checkout () {
        this.params.smallImage = this.small
        this.params.bigImage = this.big
        this.params.productNum = this.productNum
        this.params.checked = 1
        // this.checkOrder(this.params)
        setSessionStore('goodsDetailPay', this.params)
        this.$router.push({name: 'PCcheckout', query: {id: this.params.productId}})
      },
      editNum (num) {
        this.productNum = num
      },
      selectIndex(value) { // 切换订单导航栏
        this.curIndex = value.index
        this.type = value.item.type
      },
      evaluate (item) { // 切换评论  全部 好评 中评 差评
      this.starIndex = item.type
    }
    },
    components: {
      YShelf,
      BuyNum,
      YButton,
      NavList
    },
    created () {
      let id = this.$route.query.productId
      this.getProductDetail(id)
    }
  }
</script>
<style lang="scss" scoped>
  @import "./../../../assets/pc/style/mixin";

  .store-content {
    clear: both;
    width: 1220px;
    min-height: 600px;
    padding: 0 0 25px;
    margin: 0 auto;
  }

  .ui-gray-box {
    display: flex;
    padding: 60px;
    margin: 20px 0;
    .gallery-wrapper {
      .gallery {
        display: flex;
        width: 540px;
        .thumbnail {
          li:first-child {
            margin-top: 0px;
          }
          li {
            @include wh(80px);
            margin-top: 10px;
            padding: 12px;
            border: 1px solid rgba(0, 0, 0, .06);
            border-radius: 5px;
            cursor: pointer;
            &.on {
              padding: 10px;
              border: 3px solid rgba(0, 0, 0, .2);
            }
            img {
              display: block;
              @include wh(100%);
            }
          }
        }
        .thumb {
          .big {
            margin-left: 20px;
          }
          img {
            display: block;
            @include wh(440px)
          }
        }
      }
    }
    // 右边
    .banner {
      width: 600px;
      margin-left: 10px;
      h4 {
        font-size: 24px;
        line-height: 1.25;
        color: #000;
        margin-bottom: 13px;
      }
      h6 {
        font-size: 14px;
        line-height: 1.5;
        color: #bdbdbd;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .sku-custom-title {
        overflow: hidden;
        padding: 8px 8px 18px 10px;
        position: relative;
      }
      .params-name {
        padding-right: 10px;
        font-size: 14px;
        color: #8d8d8d;
        line-height: 36px;
        width: 60px;
      }
      .params-value {
        padding: 10px;
        font-size: 16px;
        margin-right: 5px;
        border: 1px solid #ccc;
        cursor: pointer;
      }
      .params-size {
        margin-bottom: 10px;
        display: inline-block;
      }
      .active {
        color: orange;
        border-color: orange;
      }
      .num {
        padding: 29px 0 8px 10px;
        border-top: 1px solid #ebebeb;
        display: flex;
        align-items: center;
      }
      .buy {
        position: relative;
        border-top: 1px solid #ebebeb;
        padding: 30px 0 0 10px;
      }
    }
  }

  .item-info {
    .ui-gray-box {
      padding: 0;
      display: block;
    }
    .img-item {
      width: 1220px;
      }
  }
  .img-detail {
    text-align: center;
  }

  .goods-params {
    width: 1220px;
  }
  .no-info {
    padding: 200px 0;
    text-align: center;
    font-size: 30px;
  }

  .price {
    display: block;
    color: #d44d44;
    font-weight: 700;
    font-size: 16px;
    line-height: 20px;
    text-align: right;
    i {
      padding-left: 2px;
      font-size: 24px;
    }
  }
  // 导航栏
  .ui-goods-detail-nav {
    margin-bottom: 15px;
  }
  // 产品参数
  .ui-peizhi {
    padding: 20px 0 20px 30px;
    .ui-peizhi-info {
      line-height: 36px;
      overflow: hidden;
    }
  }
  // 评价
  .ui-evaluate {
  padding: 20px;;
  font-size: 16px;
  background-color: #f8f8f8;
  margin-top: .4px;
  .ui-evaluate-span {
    padding: 10px;
    span {
      display: inline-block;
      padding: 10px 20px;
      border: 1px solid #ddd;
      margin-right: 20px;
      border-radius: 5px;
      cursor: pointer;
    }
  }
  .ui-evaluate-span .uiEvaluateActive {
    color: #FF9800;
    border-color: #FF9800
  }
  .ui-evaluate-content {
    padding: 30px 0;
    .ui-content {
      display: flex;
      border-bottom: 1px solid #ccc;
      padding: 10px 10px 20px 20px;
    }
    .ui-evaluate-img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      margin-right: 10px;
    }
    .ui-evaluate-name {
      margin-right: 10px;
    }
    .ui-evaluate-time {
      color: #ccc;
      margin: 10px 0 10px;
    }
  }
}
</style>
