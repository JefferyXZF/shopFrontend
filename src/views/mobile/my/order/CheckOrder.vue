<template>
  <div>
    <pay-header title="结算"></pay-header>
    <div class="pay-address" >
      <template v-if="checkAddress && checkAddress.userName">
        <p class="address-box">
          <span class="name">收货人：{{ checkAddress.userName }}</span>
          <span class="phone">联系方式：{{ checkAddress.tel }}</span>
        </p>
        <p class="address-details">
            收货地址：{{ checkAddress.streetName}}
        </p>
      </template>
      <template v-else>
        <p class="ui-none-address">还没选择收货地址，请填写收货地址</p>
      </template>
      <span @click="editAddress" class="ui-addr-choose iconfont icon-youjiantou"></span>
    </div>

    <p class="pay-menu">商品清单</p>
    <div class="pay-shop" v-for="(list,index) in cartList" :key="index">
      <div class="pay-shop-list">
        <div class="pay-shop-2">
            <img :src="list.bigImage">
            <div class="pay-shop-2-box">
                <div class="name">{{list.productName}}<span class="ui-num">× {{list.productNum}}</span></div>
                <p class="ui-param" v-if="list.color">颜色：{{ list.color }}</p>
                <p class="ui-param" v-if="list.size">尺寸：{{ list.size }}</p>
                <p class="price"><span>¥ {{list.salePrice}}</span></p>
            </div>
        </div>
      </div>
    </div>

    <div class="pay-shop-footer">
        <p class="price">订单总金额：<span>¥{{ payMoney }}</span></p>
        <a class="order" @click="createOrder">立即结算</a>
    </div>

  </div>
</template>

<script>
import '@/assets/mobile/rem/rem.js'
import PayHeader from '/components/mobile/common/header'
import { mapState } from 'vuex'
import { Toast } from 'mint-ui'
import { createOrder } from '/api/user'
import { setSessionStore, getSessionStore, removeSessionStore } from '/utils/storage'
export default {
  name: 'CheckOrder',
  components: {
    PayHeader
  },
  data () {
    return {
      cartList: [], // 从购物车中加载订单
    }
  },
  computed: {
    ...mapState(['checkAddress', 'orderList']),
    payMoney () {
      // return this.cartList.reduce((pre, next) => {})
      return this.cartList && this.cartList.reduce((amount, item) => amount + (item.productNum * item.salePrice), 0)
    }
  },
  created () {
    let id = this.$route.query.id
    if (id) { // 立即支付
      let goods = JSON.parse(getSessionStore('goodsDetailMobilePay'))
      if (goods.productId && goods.productId.indexOf(id) > -1) {
        this.cartList.push(goods)
      } else {
        this.$router.go(-1)
      }
    } else {
      this.getCartList()
    }
  },
  methods: {
    getCartList () {
      this.cartList = this.$store.state.cartList.filter(item => item.checked == 1)
    },
    createOrder () {
      if (!this.checkAddress) {
        Toast('收货地址有误')
        return
      }
      let order = []
      if (this.cartList.length) {
        this.cartList.forEach(item => {
          let obj = {}
          obj.goods = item
          obj.address = this.checkAddress
          order.push(obj)
        })
      } else {
        Toast('请选择商品')
        return
      }
      createOrder({order}).then(res => {
        if (res.code === '0') {
          removeSessionStore('goodsDetailMobilePay')
          setSessionStore('MobileOrder', {address: this.checkAddress, order: res.data.orderList})
          // this.$store.commit('checkOrder', res.data)
          this.$router.push({name: 'MobilePay'})
        } else {
          Toast('创建订单失败')
        }
      })
    },
    editAddress () {
      this.$router.push({name: 'MobileAddressList', query: {type: '1'}})
    }
  }
}
</script>

<style lang='scss' scoped>
.active {
    border: 1px solid #444;
    color: red;
}

.pay-address {
    position: relative;
    width: 100%;
    height: 4.3rem;
    background: url('https://shopstatic.vivo.com.cn/vivoshop/wap/dist/images/prod/bg-addr-box-line_d380baa.png') #fff left bottom repeat-x; // shopstatic.vivo.com.cn/vivoshop/wap/dist/images/prod/bg-addr-box-line_d380baa.png) #fff left bottom repeat-x;
    background-size: 1.6rem;
    padding-top: 1.45rem;
    display: block;
    .address-box {
      width: 87%;
      margin: auto;
      font-size: 0.4rem;
      span {
      display: block;
      line-height: .7rem;
      }
    }
    .ui-none-address {
      font-size: .4rem;
      padding: .5rem 1.5rem 0 1rem;
    }
    .address-details {
      width: 87%;
      margin: auto;
      color: #666;
      font-size: 0.38rem;
    }
    .ui-addr-choose {
      position: absolute;
      top: 1.8rem;
      right: 0.4rem;
      z-index: 100;
      font-size: .8rem;
    }
}

.pay-menu {
  width: 100%;
  line-height: 1rem;
  border-bottom: 1px solid #eaeaea;
  font-size: 0.5rem;
  padding: .2em 0.3rem;
}

.pay-shop {
    width: 100%;
    margin-bottom: 0.5rem;

    .pay-shop-invoice {
        width: 100%;
        background: #fff;
        margin-bottom: 10px;
        margin-top: 10px;

        .pay-invoice-1 {
            width: 100%;
            height: 1.5rem;
            line-height: 1.5rem;
            border-bottom: 1px solid #eaeaea;
            font-size: 0.4rem;
            padding-left: 0.7rem;
        }

        .pay-invoice-2 {
            width: 100%;
            height: 4rem;

            .pay-invoice-2-1 {
                width: 100%;
                height: 30%;

                div {
                    display: block;
                    width: 2.88rem;
                    height: 0.9rem;
                    line-height: 0.9rem;
                    border: 1px solid #d1d1d1;
                    border-radius: 3px;
                    margin: 0.1rem 0.3rem;
                    float: left;
                    text-align: center;
                }
            }

            .pay-invoice-2-2 {
                width: 92%;
                height: 70%;
                margin: auto;
                font-size: 0.35rem;

                p {
                    margin-top: 10px;
                    margin-bottom: 10px;
                }

                input {
                    width: 100%;
                    height: 1.18rem;
                    border: 1px solid #d1d1d1;
                    border-radius: 3px;
                    padding-left: 0.2rem;
                }
            }
        }
    }
    .pay-shop-list {
        width: 100%;
        margin-top: 0.3rem;
        background: #fff;

        .pay-shop-2 {
          display: flex;
          img {
            width: 3.5rem;
            height: 3rem;
            margin: .1rem .3rem;
          }
        }

        .pay-shop-2-box {
            width: 70%;
            display: flex;
            flex-direction: column;

            .name {
                font-size: 0.4rem;
                margin-top: 0.3rem;
                height: 1rem;
                padding-right: 1rem;
                position: relative;
                overflow: hidden;
                .ui-num {
                    position: absolute;
                    top: .2rem;
                    right: .3rem;
                }
            }
            .ui-param {
              font-size: .3rem;
              height: .4rem;
              overflow: hidden;
              margin-top: .2rem;
            }

            .price {
                text-align: right;
                color: red;
                font-size: 0.35rem;
                font-weight: 500;
                height: 0.6rem;
                margin-top: .2rem;
                padding-right: .5rem
            }
        }
    }

    .pay-shop-fs {
        width: 100%;
        height: 5rem;
        background: #ffffff;

        .pay-fs-1 {
            width: 100%;
            height: 1.5rem;
            line-height: 1.5rem;
            border-bottom: 1px solid #eaeaea;
            font-size: 0.4rem;
            padding-left: 0.7rem;
        }

        .pay-fs-2 {
            width: 100%;
            height: 3.5rem;
            background: #ffffff;

            .pay-fs-2-1 {
                width: 100%;
                height: 40%;
                font-size: 0.35rem;
                // background yellow
                display: flex;
                justify-content: center;
                align-items: center;

                div {
                    display: block;
                    width: 2.88rem;
                    height: 0.9rem;
                    line-height: 0.9rem;
                    border: 1px solid #d1d1d1;
                    border-radius: 3px;
                    margin: 0.1rem;
                    float: left;
                    text-align: center;
                }
            }

            .pay-fs-2-2 {
                width: 100%;
                height: 60%;
                font-size: 0.35rem;

                // background red
                div {
                    width: 90%;
                    height: 1.3rem;
                    border-radius: 3px;
                    border: 1px solid #d1d1d1;
                    margin: auto;
                    padding: 0.3rem;
                }

                .pay-fs-2-2-2 {
                    height: 1.56rem;
                }
            }
        }
    }
}

.pay-shop-footer {
    width: 100%;
    height: 1.5rem;
    border-top: 1px solid #eaeaea;
    background: white;
    position: fixed;
    bottom: 0;

    .price {
        float: left;
        line-height: 1.5rem;
        font-size: 0.43rem;
        color: #666;
        padding-left: 0.3rem;

        span {
            color: red;
        }
    }

    .order {
        width: 3.3rem;
        height: 0.9rem;
        line-height: 0.9rem;
        font-size: 0.35rem;
        margin-top: 0.3rem;
        margin-right: 0.3rem;
        border-radius: 30px;
        text-align: center;
        color: #fff;
        background: #f81200;
        float: right;
    }
}
</style>
