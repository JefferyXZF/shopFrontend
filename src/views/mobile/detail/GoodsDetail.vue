<template>
  <div class="ui-goods-detail">
    <detail-header title="商品详情"></detail-header>
    <div class="goodDetailList">
      <ul style="background: white;">
        <li>
          <div class="goodDetaiSwipe">
              <mt-swipe :auto="4000">
                  <mt-swipe-item v-for="(item, i) in goodDetail.productImage" :key="i+'dd'">
                      <img :src="item" alt="图片">
                  </mt-swipe-item>
              </mt-swipe>
          </div>
          <div class="goodDetailMain">
            <div class="goodDetailName">{{goodDetail.productName}}</div>
            <div class="gooDetailNumber">{{goodDetail.subTitle}}</div>
            <div class="goodDetailPaid">
              <p class="ui-post">邮费：{{goodDetail.postage || 0}}</p>
              <p class="ui-price">
                <s>￥{{goodDetail.price}}</s>
                <span>￥{{goodDetail.salePrice}}</span>
              </p>
            </div>
          </div>

          <div class="goodDetailValue">
            <div class="_Value">购买数量：</div>
            <div class="_cartNumber" style="margin-left: 2rem;">
              <a href="javascript:;" @click="updateNum(-1)" class="goodDetailReduce">-</a>
              <input type="text"   v-model="num" readonly="readonly"/>
              <a href="javascript:;" @click="updateNum(1)" class="goodDetailAdd">+</a>
            </div>
          </div>

          <div class="goodDetailBox">
            <mt-navbar v-model="selected" >
              <mt-tab-item id="tab-container1">图文详情</mt-tab-item>
              <mt-tab-item id="tab-container2">参数</mt-tab-item>
              <mt-tab-item id="tab-container3">评论</mt-tab-item>
            </mt-navbar>
              <mt-tab-container v-model="selected" swipeable>
                <mt-tab-container-item id="tab-container1">
                  <div class="goodDetailImg">
                    <div v-html="goodDetail.productMsg"></div>
                  </div>
                </mt-tab-container-item>
                <mt-tab-container-item id="tab-container2">
                  <div class="peizhi">
                    <p v-for="(item, index) in goodDetail.parameter" :key="index">
                      <span class="ui-peizhi-name">{{ item.name }}：</span>
                      <span>{{ item.value }}</span>
                    </p>
                  </div>
                </mt-tab-container-item>
                <mt-tab-container-item id="tab-container3">
                  <div class="ui-evaluate">
                    <div class="ui-evaluate-span">
                      <span
                        v-for="(item, index) in contentParam"
                        :key="index"
                        :class="{uiEvaluateActive: curIndex == item.type}"
                        @click="evaluate(item)">{{ item.name }}
                        <i v-if="item.type == 'all'">({{comment.length || 0}})</i>
                        <i v-if="item.type == 'bad'">({{ badNum }})</i>
                        <i v-if="item.type == 'medium'">({{ mediumNum }})</i>
                        <i v-if="item.type == 'good'">({{ goodNum }})</i>
                      </span>
                    </div>
                    <div class="ui-evaluate-content">
                      <div class="ui-content"
                        v-for="(item, index) in comment"
                        :key="index + 22"
                        v-show="isShowAllComment || item.type == curIndex"
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
                </mt-tab-container-item>
              </mt-tab-container>
          </div>

          <div class="goodDetailFooter">
            <div class="left">
              <div class="cart" @click="goCartPage">
                <div class="cartlength" v-if="login">{{cartlength}}</div>
                <i class="iconfont icon-gouwuche"></i>
                <span>购物车</span>
              </div>
                <div class="collection">
                  <div class="collection-box" @click="collectioning"  v-show="!isCollection">
                    <i class="iconfont icon-collection"></i>
                    <span>收藏</span>
                  </div>
                  <div class="collection-box" @click="collectioning"  v-show="isCollection">
                    <i class="iconfont icon-shoucangxuanzhong1" style="color:red"></i>
                    <span style="color:red">取消</span>
                  </div>
                </div>
                <div class="shop" @click="home">
                  <i class="iconfont icon-shouye_xuanzhong" ></i>
                  <span>首页</span>
                </div>
            </div>
            <div class="rigth">
              <div class="add">
                <a href="javascript:void(0);" @click="handleCart(goodDetail)">加入购物车</a>
              </div>
              <div class="purchase">
                <a href="javascript:void(0);" @click="pay">提交订单</a>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="ui-popup" v-show="isShowDetail">
      <span class="ui-close" @click="isShowDetail = false">x</span>
      <div class="ui-img">
        <div>
          <p
            class="ui-small-img"
            v-for="(item, index) in goodDetail.smallImage"
            :key="index + 'bbcs'"
            @click="big=bigImage[index];small=item">
            <img :class="{active:big===bigImage[index]}" v-lazy="item" alt="图片">
          </p>
        </div>
        <div class="ui-big-img">
          <img :src="big" alt="图片">
        </div>
        <div class="ui-choose">
          <p>选中：</p>
          <p class="ellipsis" v-if="goodDetail.color"><label>颜色：</label><span>{{ params.color }}</span></p>
          <p v-if="goodDetail.size"><label>尺寸：</label><span>{{ params.size }}</span></p>
        </div>
      </div>
      <div>
        <p v-if="goodDetail.color" class="ui-params">
          <label>颜色分类</label>
          <span
            v-for="(item, index) in goodDetail.color"
            :key="index + 'aabb'"
            class="ui-param-btn"
            :class="{active: col == index}"
            @click="checkParams('col', index, item)">{{ item.value }}</span>
        </p>
        <p v-if="goodDetail.size" class="ui-params">
          <label>尺寸</label>
          <span
            v-for="(item, index) in goodDetail.size"
            :key="index + 'abc'"
            class="ui-param-btn"
            :class="{active: size == index}"
            @click="checkParams('size', index, item)">{{ item.value }}</span>
        </p>
        <div class="ui-num">
          <div class="_Value">购买数量</div>
            <div class="_cartNumber" style="margin-left: 2rem;">
              <a href="javascript:;" @click="updateNum(-1)" class="goodDetailReduce">-</a>
              <input type="text"   v-model="num" readonly="readonly"/>
              <a href="javascript:;" @click="updateNum(1)" class="goodDetailAdd">+</a>
            </div>
        </div>
      </div>
      <button class="ui-primary-btn" @click="submit">确定</button>
    </div>
  </div>
</template>

<script>
import '@/assets/mobile/rem/rem.js'
import { Toast,MessageBox } from "mint-ui"
import { mapState, mapMutations } from "vuex"
import DetailHeader from '/components/mobile/common/header'
import { productDetail, addCart, handleCollection } from '/api/user'
import { setSessionStore } from '/utils/storage'
export default {
  name: 'GoodsDetail',
  components: {
    DetailHeader
  },
  data () {
    return {
      dataBase,
      active: "1",
      selected: "tab-container1",
      goodDetail: {},
      num: 1,
      imgIndex: 0,
      params: {},
      smallImage: [],
      bigImage: [],
      big: '',
      small: '',
      col: 0,  // 商品颜色
      size: 0,  // 商品尺寸
      isShowDetail: false,
      checkType: '', // 确定类型，判断是否添加购物车，还是立即购买
      isCollection: false,
      productId: '',
      curIndex: 'all', // 评论切换按钮聚焦
      contentParam: [
        {name: '全部', type: 'all'},
        {name: '好评', type: 'good'},
        {name: '中评', type: 'medium'},
        {name: '差评', type: 'bad'}
      ],
      comment: [], // 评论
      goodNum: 0, // 好评条数
      mediumNum: 0, // 中评条数
      badNum: 0, // 差评条数
      isShowAllComment: true
    }
  },
  computed: {
    ...mapState(['login', 'cartList', 'collection']),
      // 计算数量
    cartlength () {
      let totalNum = 0
      this.cartList.length && this.cartList.forEach(item => {
        totalNum += (item.productNum)
      })
      return totalNum
    }
  },
  watch: {
    collection (value) {
      this.isCollection = value.indexOf(this.productId) > -1
    },
    curIndex (value) {
      if (value == 'all') {
        this.isShowAllComment = true
      } else {
        this.isShowAllComment = false
      }
    }
  },
  created () {
    let productId = this.$route.query.productId
    this.productId = productId
    if (productId) {
      this.isCollection = this.collection.indexOf(productId) > -1 //判断是否收藏
      productDetail({productId}).then(res => {
        if (res.code === '0') {
          this.goodDetail = res.data
          this.smallImage = this.goodDetail.smallImage
          this.bigImage = this.goodDetail.productImage
          this.big = this.goodDetail.productImage[0]
          this.small = this.goodDetail.smallImage[0]
          // 添加购物车参数
          this.params.productId = this.goodDetail.productId
          this.params.productName = this.goodDetail.productName
          this.params.salePrice = this.goodDetail.salePrice
          this.params.color = this.goodDetail.color[0] ? this.goodDetail.color[0].value : ''
          this.params.size = this.goodDetail.size[0] ? this.goodDetail.size[0].value : ''
          // 评论
          this.comment = this.goodDetail.content.map(item => {
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
        } else {
          MessageBox('提示', res.data.msg);
        }
      })
    } else {
      MessageBox('提示', '缺少商品ID');
    }
  },
  methods: {
    ...mapMutations(['addCart', 'checkOrder', 'updateCollection']),
    updateNum (value) {
      if (value < 0) {
        if (this.num > 1) {
          this.num -= 1
        }
      } else {
        this.num += 1
      }
    },
    isLogin () {
      if (!this.login) {
        this.$router.push({name: 'MobileLogin'})
        return false
      }
      return true
    },
    home () {
      this.$router.push({name: 'MobileHome'})
    },
    collectioning () {
      if (this.isLogin()) {
        handleCollection({productId: this.productId}).then(res => {
          if (res.code === '0') {
            this.updateCollection(res.data)
          }
        })
      }
    },
    goCartPage () {
      if (this.isLogin()) {
        this.$router.push({name: 'MobileCart'})
      }
    },
    handleCart (value) { // 加入购物车
      if (this.isLogin()) {
        this.isShowDetail = true;
        this.checkType = 'cart'
      }
    },
    pay (value) {
      if (this.isLogin()) {
        this.isShowDetail = true;
        this.checkType = 'pay'
      }
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
    submit () {
      this.params.smallImage = this.small
      this.params.bigImage = this.big
      this.params.productNum = this.num
      this.params.checked = 1
      let self = this
      if (this.checkType === 'cart') {
        this.dataBase.loading = true
        addCart(this.params).then(res => {
          this.dataBase.loading = false
            // 并不重新请求数据
            if (res.code === '0') {
              this.$nextTick(res => {
                this.isShowDetail = false
              })
              self.addCart(self.params)
              Toast({
                message: '加入购物车成功',
                iconClass: 'icon icon-success'
              });
            } else {
              Toast({
                message: res.msg,
                duration: 2000
              })
            }
          })
      } else if (this.checkType === 'pay') {
        setSessionStore('goodsDetailMobilePay', this.params)
        this.$router.push({name: 'MobileCheckOrder', query: {id: this.params.productId}})
      }
    },
    evaluate (item) { // 切换评论  全部 好评 中评 差评
      this.curIndex = item.type
    }
  }
}
</script>

<style lang='scss' scoped>
.ui-goods-detail {
  position: relative;
  .ui-popup {
    position: fixed;
    bottom: 0;
    z-index: 200;
    background-color: #DEE1E6;
    padding: .3rem .5rem;
    width: 100%;
    border-radius: .3rem .3rem 0 0;
    &::before {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 100;
      background-color: rgba(0, 0, 0, .4);
    }
    .ui-close {
      width: .8rem;
      height: .8rem;
      border: 1px solid #ddd;
      border-radius: 50%;
      position: absolute;
      right: .3rem;
      top: .2rem;
      font-size: .6rem;
      background: rgba(0,0,0,.1);
      text-align: center;
    }
    .ui-params {
      font-size: .4rem;
      padding-bottom: .3rem;
      label {
        display: block;
        padding-bottom: .3rem;
      }
      .active {
        color: red;
        border: 1px solid red !important;
      }
      .ui-param-btn {
        padding: .1rem .2rem;
        margin-right: .3rem;
        border: 1px solid #ccc;
        border-radius: .1rem;
        display: inline-block;
        // width: 1.8rem;
        text-align: center;
        overflow: hidden;
        white-space: nowrap;
        background-color: #ccc;
      }
    }
    .ui-num {
      display: flex;
      justify-content: space-between;
    }
    .ui-img {
      display: flex;
      .ui-small-img {
        width: 2rem;
        img {
          width: 1.4rem;
        }
      }
      .ui-big-img {
        display: flex;
        align-items: flex-end;
        img {
          width: 4rem;
        }
      }
      .ui-choose {
        flex: 1;
        align-items: flex-end;
        margin-left: .2rem;
        font-size: .4rem;
        margin-top: auto;
        .ellipsis {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
      .active {
        color: orange;
        border: 1px solid orange;
      }
    }
    .ui-primary-btn {
      width: 100%;
      height: 1rem;
      background-color: #FF9800;
      color: #fff;
      border-radius: .8rem;
      letter-spacing: .1rem;
      font-weight: bold;
    }
  }
}
.peizhi {
    padding: 0.3rem .5rem 1.5rem;
    background-color: #f8f8f8;
    margin-top: .1rem;
    span {
      font-size: .4rem;
    }
    p {
      margin-bottom: .2rem;
    }
    .ui-peizhi-name {
      display: inline-block;
    }
}

.cartlength {
    width: 16px;
    height: 16px;
    position: absolute;
    top: 0px;
    left: 34px;
    background: #f81301;
    border-radius: 50%;
    text-align: center;
    line-height: 16px;
    color: white;
}

.goodDetailList {
    margin-bottom: 1rem;
    padding-top: 1.45rem;
}

.goodDetailHeader {
    width: 100%;
    z-index: 1;
    height: 1.3rem;
    line-height: 1.3rem;
    font-size: 12px;
    background: white;
    position: fixed;
    box-shadow: 0 0 10px #cecece;
    text-align: center;
    font-size: 0.41rem;
}

.goodDetailHeader i {
    display: block;
    float: left;
    height: 50px;
    padding-left: 0.3rem;
    font-size: 0.71rem;
    color: black;
}

.goodDetaiSwipe {
    height: 8rem;
    margin-top: 3px;
    background: white;
}

.goodDetaiSwipe img {
    width: 70%;
    height: 7rem;
    display: block;
    /* margin-top: 60px; */
    margin: auto;
}

.goodDetailMain {
    /* height: 1.8rem; */
    background: white;
    border-bottom: 1px solid #cecece;
    // border-top: 1px solid #cecece;
    padding: 0.4rem;
    margin-top: -15px;
}

// .goodDetailBox {
// height: 1px;
// }
.goodDetailName {
    color: black;
    font-weight: 400;
    font-size: 0.35rem;
    line-height: .5rem;
    overflow: hidden;
    height: 1rem;
    padding: 0 .4rem;
}

.goodDetailPaid {
    font-size: 0.5rem;
    margin-top: 0.1rem;
    display: flex;
    justify-content: space-between;
    padding: 0 .5rem;
    .ui-post {
      font-size: .3rem;
      padding-top: 6px;
    }
    .ui-price {
      color: red;
      s {
        font-size: .3rem
      }
    }
}

.goodDetailFooter {
    position: fixed;
    width: 100%;
    bottom: 0rem;
    height: 1.4rem;
    background: #F6F4F7;
    border-top: 1px solid #efefef;

    .left {
        width: 45%;
        float: left;
        position: relative;
        font-size: .35rem;
        .cart {
            width: 33%;
            display: flex;
            justify-content: center;
            flex-direction: column;
            float: right;
            text-align: center;
            position: relative;
            padding-top: 4px;

            img {
                width: 0.76rem;
                height: 0.7rem;
                display: block;
                margin: auto;
            }

            span {
                text-align: center;
                color: #767676;
            }
        }

        .shop {
            width: 33%;
            display: flex;
            justify-content: center;
            flex-direction: column;
            text-align: center;
            float: right;
            padding-top: 4px;

            img {
                width: 0.76rem;
                height: 0.7rem;
                display: block;
                margin: auto;
            }

            span {
                display: block;
                text-align: center;
                color: #767676;
            }
        }

        .collection {
            width: 33%;
            height: 100%;
            display: flex;
            justify-content: center;
            flex-direction: column;
            float: right;
            border-left: 1px solid #ccc;
            border-right: 1px solid #ccc;
            color: #767676;
            padding-top: 4px;

            .collection-box {
                text-align: center;
            }

            i {
                font-size: 0.4rem;
                display: block;
                text-align: center;
            }

            span {
                text-align: center;
            }
        }
    }

    .rigth {
        width: 55%;
        float: right;

        .add {
            a {
                display: block;
                width: 50%;
                height: 1.2rem;
                line-height: 1.2rem;
                text-align: center;
                background: #FF9800;
                color: white;
                font-size: 0.35rem;
                float: left;
            }
        }

        .purchase {
            a {
                float: left;
                display: block;
                width: 50%;
                height: 1.2rem;
                line-height: 1.2rem;
                text-align: center;
                color: white;
                font-size: 0.35rem;
                background: #E3211E;
            }
        }
    }
}

.gooDetailNumber {
    display: none;
}

.add a {
}

.purchase a {
}

.goodDetailImg {
    margin-top: 4px;
}

.goodDetailImg img {
    width: 100%;
    height: auto;
}
.ui-evaluate {
  padding: .5rem  .5rem 2rem .5rem;
  font-size: .4rem;
  background-color: #f8f8f8;
  margin-top: .1rem;
  .ui-evaluate-span span {
    display: inline-block;
    padding: .2rem .25rem;
    border: 1px solid #ddd;
    margin-right: .2rem;
    border-radius: .5rem;
  }
  .ui-evaluate-span .uiEvaluateActive {
    color: #FF9800;
    border-color: #FF9800
  }
  .ui-evaluate-content {
    padding: .5rem 0;
    .ui-content {
      display: flex;
      border-bottom: 1px solid #ccc;
      padding: 0.5rem 0 1rem;
    }
    .ui-evaluate-img {
      width: 1.3rem;
      height: 1.3rem;
      border-radius: 50%;
      margin-right: .3rem;
    }
    .ui-evaluate-name {
      margin-right: .2rem;
    }
    .ui-evaluate-time {
      color: #ccc;
      margin: .1rem 0 .3rem;
    }
  }
}

table td {
    font-size: 0.31rem;
    text-align: center;
    color: #000;
}

.goodDetailValue {
    height: 2rem;
    border-bottom: 1px solid #cecece;
    padding: 0.4rem;
}

.goodDetailAdd {
    width: 1rem;
    height: 0.8rem;
    line-height: 0.8rem;
    display: block;
    background: white;
    float: left;
    border: 1px solid #b2b2b2;
    border-left: none;
    text-align: center;
    font-size: 0.5rem;
    color: black;
}

.goodDetailReduce {
    width: 1rem;
    height: 0.8rem;
    line-height: 0.8rem;
    display: block;
    background: white;
    float: left;
    border: 1px solid #b2b2b2;
    border-right: none;
    text-align: center;
    font-size: 0.5rem;
    color: black;
}

._cartNumber input {
    width: 1rem;
    height: 0.8rem;
    line-height: 0.8rem;
    float: left;
    border: 1px solid #b2b2b2;
    text-align: center;
    color: black;
}

._Value {
    float: left;
    margin-top: 0.2rem;
    font-size: 0.35rem;
}

.goodDetailColor {
    // display: none;
    padding: 5px 0 0 20px;
    font-size: .5rem;
    .ui-btn {
      margin-right: 16px;
      padding: 4px 10px;
      border: 1px solid #ddd;
      border-radius: 5px;
    }
}
</style>
