<template>
  <div class="header-box">
    <div>
      <header>
        <div class="w-box">
          <div class="nav-logo">
            <h1>
              <router-link :to="{name: 'PCGoods'}" title="服饰电商网站">服饰电商网站</router-link>
            </h1>
          </div>
          <div class="right-box">
            <div class="nav-list">
              <input
                class="input-search"
                type="search"
                v-model="productName"
                placeholder="搜索商品"
                @keyup.enter="searchProduct">
            </div>
            <div class="nav-aside" ref="aside" :class="{fixed: (flag && showNav)}">
              <div class="user pr">
                <router-link :to="{name: 'PCUser'}">个人中心</router-link>
                <!--用户信息显示-->
                <div class="nav-user-wrapper pa" v-if="login">
                  <div class="nav-user-list">
                    <ul>
                      <!--头像-->
                      <li class="nav-user-avatar">
                        <div>
                          <span class="avatar" :style="{backgroundImage:'url('+(userInfo.headPic  ? userInfo.headPic : url)+')'}">
                          </span>
                        </div>
                        <p class="name">{{userInfo.name}}</p>
                      </li>
                      <li v-for="(item, i) in navList" :key="i">
                        <router-link :to="item.link">{{item.text}}</router-link>
                      </li>
                      <li>
                        <a href="javascript:;" @click="loginOut">退出</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="shop pr" @mouseover="cartShowState(true)" @mouseout="cartShowState(false)"
                   ref="positionMsg">
                <router-link to="/user/cart"></router-link>
                <span class="cart-num">
                  <i class="num" ref="num"
                     :class="{no:totalNum <= 0,move_in_cart:1}">{{totalNum}}</i></span>

                <!--购物车显示块-->
                <div class="nav-user-wrapper pa active" v-show="isShowCart">
                  <div class="nav-user-list">
                    <div class="full" v-show="totalNum">
                      <!--购物列表-->
                      <div class="nav-cart-items">
                        <ul>
                          <li class="clearfix" v-for="(item,i) in cartList" :key="i">
                            <div class="cart-item">
                              <div class="cart-item-inner">
                                <div
                                  class="detail-link"
                                  @click="goGoodsDetail(item.productId)">
                                    <div class="item-thumb">
                                      <img :src="item.bigImage">
                                    </div>
                                </div>
                                <div class="item-desc">
                                  <div class="cart-cell">
                                    <h4>
                                      <span
                                        class="detail-link"
                                        @click="goGoodsDetail(item.productId)"
                                        v-text="item.productName"></span>

                                    </h4>
                                    <p class="attrs" v-if="item.color"><span>颜色：</span><span>{{item.color}}</span></p>
                                    <p class="attrs" v-if="item.size"><span>尺寸：</span><span>{{item.size}}</span></p>
                                    <h6>
                                      <span class="price-icon">¥</span>
                                      <span class="price-num">{{item.salePrice}}</span>
                                      <span class="item-num">x {{item.productNum}}</span>
                                    </h6>
                                  </div>
                                </div>

                                <div class="del-btn del" @click="delGoods(item.productId)">删除</div>
                              </div>
                            </div>
                          </li>
                        </ul>
                      </div>
                      <!--总件数-->
                      <div class="nav-cart-total"><p>共 <strong>{{totalNum}}</strong> 件商品</p>
                      <h5>合计：<span class="price-icon">¥</span>
                      <span class="price-num">{{totalPrice}}</span></h5>
                        <h6>
                          <y-button classStyle="main-btn"
                                    style="height: 40px;width: 100%;margin: 0;color: #fff;font-size: 14px;line-height: 38px"
                                    text="去购物车" @btnClick="toCart"></y-button>
                        </h6>
                      </div>
                    </div>
                    <div v-show="!totalNum" style="height: 313px;text-align: center" class="cart-con">
                      <p>你的购物车竟然是空的!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  </div>
</template>

<script>
import YButton from "/components/pc/YButton"
import { mapState, mapMutations } from 'vuex'
import { setStore, removeStore } from '/utils/storage'
import { loginOut, getCartList, delCart } from '/api/user'
export default {
  name: 'Header',
  inject: ['reload'],
  props: {
    showNav: {
      default: true,
      type: Boolean
    }
  },
  components: {
    YButton
  },
  computed: {
    ...mapState(['cartList', 'login', 'receiveInCart', 'isShowCart', 'userInfo']),
    // 计算价格
    totalPrice () {
      let totalPrice = 0
      this.cartList.length && this.cartList.forEach(item => {
        totalPrice += (item.productNum * item.salePrice)
      })
      return totalPrice
    },
    // 计算数量
    totalNum () {
      let totalNum = 0
      this.cartList.length && this.cartList.forEach(item => {
        totalNum += (item.productNum)
      })
      return totalNum
    }
  },
  created () {
    if (this.login) {
      // 初始化购物车
      this.getCartList()
    } else {
      this.initCart()
    }
  },
  data () {
    return {
      user: {},
        // 列表
        navList: [{
          text: '我的订单',
          link: '/user/orderList'
        }, {
          text: '账号资料',
          link: '/user/information'
        }, {
          text: '收货地址',
          link: '/user/addressList'
        }, {
          text: '我的收藏',
          link: '/user/collection'
        }, {
          text: '我的购物车',
          link: '/user/cart'
        }],
        flag: false,
        cartShow: false,
        timerCartShow: null, // 定时隐藏购物车
        productName: '',
        url: '/static/images/person.jpg' // 图片默认地址
    }
  },
  methods: {
    ...mapMutations(['initCart', 'addCart', 'showCart', 'editCart']),
    searchProduct () {
      // this.reload();
      this.$router.push({name: 'PCSearchGoods', query: {productName: this.productName}})
    },
    // 商品详情
    goGoodsDetail (productId) {
      this.reload();
      this.$router.push({name: 'PCGoodsDetail', query: {productId}})
    },
    // 购物车显示
    cartShowState (state) {
      this.showCart({isShowCart: state})
    },
    // 登录时获取一次购物车商品
    getCartList () {

    },
    // 删除商品
    delGoods (productId) {
      if (this.login) { // 登陆了
        delCart({productId}).then(res => {
          if (res.code === '0') {
            this.editCart({productId})
          }
        })
      } else {
        this.editCart({productId})
      }
    },
    toCart () {
      this.$router.push({path: '/user/cart'})
    },
    // 控制顶部
    navFixed () {
      if (this.$route.path === '/shop/goods' ||
        this.$route.path === '/shop/home' ||
        this.$route.path === '/shop/goodsDetails') {
        // 计算是否吸顶
        if (this.showNav) {
          let st = document.documentElement.scrollTop || document.body.scrollTop
          st >= 100 ? this.st = true : this.st = false
        }
        // 计算小圆当前位置
        let num = this.$refs.num
        const {left, top} = num.getBoundingClientRect()
        this.ADD_ANIMATION({cartPositionL: left, cartPositionT: top})
      }
    },
    // 退出登陆
    loginOut () {
      loginOut().then(res => {
        if (res.code === '0') {
          removeStore('buyCart')
          removeStore('userInfo')
          location.reload()
        }

      })
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "./../../assets/pc/style/theme";
  @import "./../../assets/pc/style/mixin";
  @import "./../../assets/pc/style/common";

  .move_in_cart {
    animation: mymove .5s ease-in-out;
  }
  @keyframes mymove {
    0% {
      transform: scale(1)
    }
    25% {
      transform: scale(.8)
    }
    50% {
      transform: scale(1.2)
    }
    75% {
      transform: scale(.9)
    }
    100% {
      transform: scale(1)
    }
  }

  .header-box {
    background: $head-bgc;
    background-image: -webkit-linear-gradient(#000, #121212);
    background-image: linear-gradient(#000, #121212);
    width: 100%;

  }

  header {
    height: 100px;
    z-index: 30;
    position: relative;
  }
  .input-search {
    display: inline-block;
    width: 200px;
    border-radius: 5px;
    box-shadow: 0 0 5px #fff;
    padding: 4px 4px 4px 10px;
  }
  .w-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    position: relative;
    padding: 0 20px;
    h1 {
      height: 100%;
      display: flex;
      align-items: center;
      > a {
        background: url(/static/images/logo.png) no-repeat 50%;
        background-size: cover;
        display: block;
        border-radius: 50%;
        @include wh(50px, 50px);
        text-indent: -9999px;
        background-position: 0 0;
      }
    }
    .nav-list {
      display: flex;
      justify-content: center;
      align-items: center;
      a {
        color: #c8c8c8;
        display: block;
        font-size: 14px;
        padding: 0 25px;
        &:hover {
          color: #fff;
        }
      }
    }
    .nav-aside {
      position: relative;
      &.fixed {
        width: 262px;
        position: fixed;
        left: 50%;
        margin-left: 451px;
        margin-top: 0;
        z-index: 32;
        top: -40px;
        transform: translate3d(0, 59px, 0);
        transition: transform .3s cubic-bezier(.165, .84, .44, 1);
        .user {
          &:hover {
            a:before {
              background-position: -215px 0;
            }
          }
        }
        .shop {
          &:hover {
            a:before {
              background-position: -210px -22px;
            }
          }
        }
      }
    }

    .right-box {
      display: flex;
    }
    .nav-aside {
      display: flex;
    }
    // 用户
    .user {
      margin-left: 41px;
      width: 36px;
      &:hover {
        a:before {
          background-position: -5px 0;
        }
        .nav-user-wrapper {
          top: 18px;
          visibility: visible;
          opacity: 1;
          -webkit-transition: opacity .15s ease-out;
          transition: opacity .15s ease-out;
        }
      }
      > a {
        position: relative;
        @include wh(36px, 20px);
        display: block;
        text-indent: -9999px;
        &:before {
          content: " ";
          position: absolute;
          left: 8px;
          top: 0;
          @include wh(20px);
          background: url(/static/images/account-icon@2x.32d87deb02b3d1c3cc5bcff0c26314ac.png) -155px 0;
          background-size: 240px 107px;
          transition: none;
        }

      }
      li ~ li {
        text-align: center;
        position: relative;
        border-top: 1px solid #f5f5f5;
        line-height: 44px;
        height: 44px;
        color: #616161;
        font-size: 12px;
        &:hover {
          background: #fafafa;
        }
        a {
          display: block;
          color: #616161;
        }
      }
      .nav-user-avatar {
        > div {
          position: relative;
          margin: 0 auto 8px;
          @include wh(46px);
          text-align: center;
          &:before {
            content: "";
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            border-radius: 50%;
            box-shadow: inset 0 0 0 1px rgba(0, 0, 0, .06);
          }
          .avatar {
            border-radius: 50%;
            display: block;
            @include wh(100%);
            background-repeat: no-repeat;
            background-size: contain;
          }

        }
        .name {
          margin-bottom: 16px;
          font-size: 12px;
          line-height: 1.5;
          text-align: center;
          color: #757575;
        }
      }
      .nav-user-wrapper {
        width: 168px;
        transform: translate(-50%);
        left: 50%;
      }
      .nav-user-list {
        width: 168px;
        &:before {
          left: 50%;
        }

      }
    }
    .shop {
      position: relative;
      float: left;
      margin-left: 21px;
      width: 61px;
      z-index: 99;
      &:hover {
        a:before {
          content: " ";
          background-position: 0 -22px;
        }
      }
      .nav-user-wrapper.active {
        top: 18px;
        visibility: visible;
        opacity: 1;
        -webkit-transition: opacity .15s ease-out;
        transition: opacity .15s ease-out;
      }
      > a {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        display: block;
        right: 0;
        z-index: 1;
        &:before {
          display: block;
          @include wh(30px, 100%);
          content: " ";
          background: url(/static/images/account-icon@2x.32d87deb02b3d1c3cc5bcff0c26314ac.png) 0 -22px;
          background-size: 240px 107px;
          background-position: -150px -22px;
        }
      }
      .cart-num {
        position: relative;
        display: block;
        margin-left: 31px;
        margin-top: -1px;
        min-width: 30px;
        text-indent: 0;
        line-height: 20px;
        > i {
          background: #eb746b;
          background-image: -webkit-linear-gradient(#eb746b, #e25147);
          background-image: linear-gradient(#eb746b, #e25147);
          box-shadow: inset 0 0 1px hsla(0, 0%, 100%, .15), 0 1px 2px hsla(0, 0%, 100%, .15);
          text-align: center;
          font-style: normal;
          display: inline-block;
          @include wh(20px);
          line-height: 20px;
          border-radius: 10px;
          color: #fff;
          font-size: 12px;
          &.no {
            background: #969696;
            background-image: -webkit-linear-gradient(#A4A4A4, #909090);
            background-image: linear-gradient(#A4A4A4, #909090);
            box-shadow: inset 0 0 1px #838383, 0 1px 2px #838383;
          }
        }

      }
      .nav-user-wrapper {
        right: 0;
        width: 360px;
        .nav-user-list {
          &:before {
            right: 34px;
          }
        }
      }
      .nav-user-list {
        padding: 0;
        width: 100%;
        .full {
          border-radius: 8px;
          overflow: hidden;
        }
        .nav-cart-items {
          max-height: 363px;
          overflow-x: hidden;
          overflow-y: auto;
        }
        .cart-item {
          height: 120px;
          width: 100%;
          overflow: hidden;
          border-top: 1px solid #f0f0f0;
          &:hover {
            background: #fcfcfc;
            .del {
              display: block;
            }
          }

        }
        li:first-child .cart-item:first-child {
          border-top: none;
          border-radius: 8px 8px 0 0;
          overflow: hidden;
        }
        .cart-item-inner {
          padding: 20px;
          position: relative;
        }
        .item-thumb {
          position: relative;
          float: left;
          width: 80px;
          height: 80px;
          border-radius: 3px;
          &:before {
            content: "";
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            z-index: 2;
            border: 0 solid transparent;
            box-shadow: inset 0 0 0 1px rgba(0, 0, 0, .06);
            border-radius: 3px;
          }
          img {
            display: block;
            @include wh(80px, 80px);
            border-radius: 3px;
            overflow: hidden;
          }
        }
        .item-desc {
          margin-left: 98px;
          display: table;
          @include wh(205px, 80px);
          h4 {
            color: #000;
            width: 185px;
            overflow: hidden;
            word-break: keep-all;
            white-space: nowrap;
            text-overflow: ellipsis;
            font-size: 14px;
            line-height: 16px;
            margin-bottom: 10px;
          }
          .attrs span {
            position: relative;
            display: inline-block;
            margin-right: 20px;
            font-size: 14px;
            line-height: 14px;
            color: #999;
          }
          .attrs span:last-child {
            margin-right: 0;
          }
          h6 {
            color: #cacaca;
            font-size: 12px;
            line-height: 14px;
            margin-top: 10px;
            span {
              display: inline-block;
              font-weight: 700;
              color: #cacaca;
            }
            .price-icon, .price-num {
              color: #d44d44;
            }
            .price-num {
              margin-left: 5px;
              font-size: 14px;
            }
            .item-num {
              margin-left: 10px;
            }
          }

        }
        .cart-cell {
          display: table-cell;
          vertical-align: middle;
        }
        .detail-link {
          cursor: pointer;
          color: #e23f0d;
        }
        .del {
          display: none;
          overflow: hidden;
          position: absolute;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
        }
      }
      .nav-cart-total {
        box-sizing: content-box;
        position: relative;
        padding: 20px;
        height: 40px;
        background: #fafafa;
        border-top: 1px solid #f0f0f0;
        border-radius: 0 0 8px 8px;
        box-shadow: inset 0 -1px 0 hsla(0, 0%, 100%, .5), 0 -3px 8px rgba(0, 0, 0, .04);
        background: -webkit-linear-gradient(#fafafa, #f5f5f5);
        background: linear-gradient(#fafafa, #f5f5f5);
        p {
          margin-bottom: 4px;
          line-height: 16px;
          font-size: 12px;
          color: #c1c1c1;
        }
        h5 {
          line-height: 20px;
          font-size: 14px;
          color: #6f6f6f;
          span {
            font-size: 18px;
            color: #de4037;
            display: inline-block;
            font-weight: 700;
          }
          span:first-child {
            font-size: 12px;
            margin-right: 5px;
          }
        }
        h6 {
          position: absolute;
          right: 20px;
          top: 20px;
          width: 108px;
        }
      }
    }
  }

  @media (max-height: 780px) {
    .nav-cart-items {
      max-height: 423px !important;
    }
  }

  @media (max-height: 900px) {
    .nav-cart-items {
      max-height: 544px !important;
    }
  }

  @media (max-height: 1080px) {
    .nav-cart-items {
      max-height: 620px !important;
    }
  }

  // 用户信息弹出
  .nav-user-wrapper {
    position: absolute;
    z-index: 30;
    padding-top: 18px;
    opacity: 0;
    visibility: hidden;
    top: -3000px;
    .nav-user-list {
      position: relative;
      padding-top: 20px;
      background: #fff;
      border: 1px solid #d6d6d6;
      border-color: rgba(0, 0, 0, .08);
      border-radius: 8px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, .15);
      z-index: 10;
      &:before {
        position: absolute;
        content: " ";
        background: url(/static/images/account-icon@2x.32d87deb02b3d1c3cc5bcff0c26314ac.png) no-repeat -49px -43px;
        background-size: 240px 107px;
        @include wh(20px, 8px);
        top: -8px;
        margin-left: -10px;
      }
    }
  }

  @media (min-width: 1px) {
    .nav-sub .nav-sub-wrapper:after {
      display: block;
    }
  }

  .cart-con {
    /*display: flex;*/
    text-align: center;
    position: relative;
    p {
      padding-top: 185px;
      color: #333333;
      font-size: 16px;
    }
  }

  .cart-con:before {
    position: absolute;
    content: ' ';
    left: 50%;
    transform: translate(-50%, -70%);
    top: 50%;
    width: 76px;
    height: 62px;
    background: url("/static/images/cart-empty-new.png") no-repeat;
    background-size: cover;

  }
</style>
