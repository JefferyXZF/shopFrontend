<template>
  <div class="ui-main-pc-pay" style="padding-bottom: 100px;">
    <y-shelf title="支付订单">
      <div slot="content">
        <div class="box-inner order-info">
          <h3>提交订单成功</h3>
          <p class="payment-detail">请在 <span>24 小时内</span>完成支付，超时订单将自动取消。</p>
          <p class="payment-detail">我们将在您完成支付后的 72 小时内发货</p></div>
        <!--支付方式-->
        <div class="pay-type">
          <div class="p-title">支付方式</div>
          <div class="pay-item">
            <div :class="{active:payType==1}" @click="payType=1"><img src="/static/images/alipay@2x.png" alt=""></div>
            <div :class="{active:payType==2}" @click="payType=2"><img src="/static/images/weixinpay@2x.png" alt="">
            </div>
          </div>
        </div>

        <div>
          <div class="box-inner">
            <div>
              <span>
                应付金额:
              </span>
              <em><span>¥</span>{{checkPrice}}</em>
              <y-button text="立刻支付"
                        classStyle="main-btn"
                        style="width: 120px;height: 40px;font-size: 16px;line-height: 38px"
                        @btnClick="paySuccess()"
              ></y-button>
            </div>
          </div>
        </div>

      </div>
    </y-shelf>
    <!--地址信息-->
    <div class="p-msg">
      <div class="confirm-detail">
        <div class="info-title">收货信息</div>
        <p class="info-detail">姓名：{{addrList.userName}}</p>
        <p class="info-detail">联系电话：{{addrList.tel}}</p>
        <p class="info-detail">详细地址：{{addrList.streetName}}</p></div>
    </div>
    <div class="confirm-table-title">
      <span class="name">商品图片</span>
      <span class="name">商品信息</span>
      <div>
        <span class="subtotal">小计</span>
        <span class="num">数量</span>
        <span class="price">单价</span>
      </div>
    </div>
    <!--商品-->
    <div class="confirm-goods-table">
      <div class="cart-items" v-for="(item,i) in goodsList" :key="i">
        <img  :src="item.order.bigImage" alt="商品图片">
        <div class="name">
          <div class="name-cell ellipsis">
            <a href="javascript:;" title=""
               target="_blank">{{item.order.productName}}</a></div>
        </div>
        <div class="n-b">
          <div class="subtotal ">
            <div class="subtotal-cell"> ¥ {{item.order.salePrice * item.order.productNum}}<br></div>
          </div>
          <div class="goods-num ">{{item.order.productNum}}</div>
          <div class="price ">¥ {{item.order.salePrice}}</div>
        </div>
      </div>
    </div>
    <!--合计-->
    <div class="order-discount-line"><p> 商品总计： <span>¥ {{checkPrice}}</span></p>
      <p> 运费： <span>+ ¥ 0.00</span></p></div>
  </div>
</template>
<script>
  import YShelf from '/components/pc/user/Shelf'
  import YButton from '/components/pc/YButton'
  import { batchPay } from '/api/user'
  import { MessageBox } from 'mint-ui'
  import { getSessionStore ,removeSessionStore } from '/utils/storage'
  export default {
    data () {
      return {
        dataBase,
        payType: 1,
        addrList: {},
        goodsList: [],
        order: null, // 订单数据
        orderId: []
      }
    },
    computed: {
      // 选中的总价格
      checkPrice () {
        let totalPrice = 0
        this.goodsList && this.goodsList.forEach(item => {
          totalPrice += (item.order.productNum * item.order.salePrice)
        })
        return totalPrice
      }
    },
    methods: {
      paySuccess () {
        MessageBox.prompt('请输入密码', {inputType: 'password'}).then(({ value, action }) => {
          this.dataBase.loading = true
          batchPay({
            password: value,
            status: 2,
            orderId: this.orderId,
          }).then(res => {
            this.dataBase.loading = false
            if (res.code === '0') {
              removeSessionStore('order')
              this.$router.push({name: 'PCPaysuccess', query: {price: this.checkPrice}})
            } else {
              this.dataBase.top_alert(res.msg, false, 2000)
            }
          })
        }).catch(function () {
          return;
        });
      }
    },
    created () {
      this.order = JSON.parse(getSessionStore('order'))
      if (!this.order) {
        this.dataBase.alert('提示', '缺少订单,请先下单')
      } else {
        this.addrList = this.order.address
        this.goodsList = this.order.order
        this.orderId = this.order.order.map(item => item.orderId)
      }
    },
    components: {
      YShelf,
      YButton
    }
  }
</script>
<style lang="scss">
  .ui-main-pc-pay {
    padding-top: 39px;
  }
  html /deep/ .mint-msgbox-wrapper .mint-msgbox {
    width: 300px !important;
  }

  .order-info {
    padding: 60px 0 55px;
    color: #333;
    background: #fff !important;
    h3 {
      padding-bottom: 14px;
      line-height: 36px;
      text-align: center;
      font-size: 36px;
      color: #212121;
    }
    .payment-detail {
      text-align: center;
      line-height: 24px;
      font-size: 14px;
      color: #999;
    }
  }

  /*支付类型*/
  .pay-type {
    margin: 0 auto;
    width: 90%;
    padding-bottom: 30px;
    .p-title {
      font-size: 18px;
      line-height: 40px;
      padding: 0 10px;
      position: relative;
      &:before {
        content: ' ';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        border-bottom: 1px solid #ccc;
      }
    }

  }

  .pay-type {
    .pay-item {
      display: flex;
      align-items: center;
      div {
        margin-top: 20px;
        width: 175px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #E5E5E5;
        cursor: pointer;
        border-radius: 6px;
        margin-right: 10px;
        background: #FAFAFA;
        &.active {
          border-color: #6A8FE5;
          background: #fff;
        }
        img {
          display: block;
          height: 34px;
          margin: 8px auto;
        }
      }
    }
  }

  .box-inner {
    line-height: 60px;
    background: #f9f9f9;
    border-top: 1px solid #e5e5e5;
    box-sizing: border-box;
    > div {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding: 0 20px;
    }
    em {
      margin-left: 5px;
      font-size: 24px;
      color: #d44d44;
      font-weight: 700;
      margin-right: 10px;
      span {
        margin-right: 4px;
        font-size: 16px;

      }
    }
  }

  .confirm-detail {
    padding: 0 30px 25px;
    border-top: 1px solid #d5d5d5;
    .info-title {
      height: 14px;
      margin: 30px 0 17px;
      line-height: 14px;
      font-weight: bolder;
      color: #333;
    }
    .info-detail {
      line-height: 24px;
      color: #666;
    }
  }

  .confirm-table-title {
    padding: 3px 0 0 30px;
    border-top: 1px solid #D5D5D5;
    line-height: 54px;
    font-weight: bolder;
    color: #000;
    display: flex;
    justify-content: space-between;
    span {
      display: inline-block;
      width: 175px;
      text-align: center;
    }
  }

  .confirm-goods-table {
    border-top: 1px solid #D5D5D5;
    .cart-items {
      height: 200px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #ccc;
      img {
        width: 100px;
        height: 150px;
        margin: 0 20px 0 70px;
      }
      a {
        color: #333;
      }
    }
    .n-b {
      display: flex;
      align-items: center;
      justify-content: center;
      > div {
        color: #626262;
        font-weight: 700;
        width: 175px;
        text-align: center;
      }
    }
  }

  .order-discount-line {
    padding: 22px 30px 53px;
    border-top: 1px solid #D5D5D5;
    line-height: 24px;
    text-align: right;
    font-size: 12px;
    &:first-child {
      line-height: 32px;
      text-align: right;
      font-size: 14px;
      font-weight: bolder;
    }
  }

  .name {
    width: 40%;
  }

  .name-cell {

  }
</style>
