<template>
  <div class="ui-pay-main">
    <pay-header title="支付"></pay-header>
    <!-- <canvas id="canvas"></canvas> -->
    <div class="ui-content" v-if="mobileOrder">
      <img src="/static/images/alipay.png" alt="" class="ui-pay-img">
      <p class="ui-text"><span>金额</span><span>￥{{salePrice}}</span></p>
      <p class="ui-text"><span>支付方式</span><span>支付宝</span></p>
      <button class="ui-pay-btn" @click="pay">支付</button>
    </div>
  </div>
</template>

<script>
import '@/assets/mobile/rem/rem.js'
import PayHeader from '/components/mobile/common/header'
import { payMent, batchPay, getOrderDetail } from '/api/user'
import { Toast, MessageBox } from 'mint-ui'
import { getSessionStore ,removeSessionStore } from '/utils/storage'
// import QRCode from 'qrcode'
export default {
  name: 'MobilePay',
  components: {
    PayHeader,
    MessageBox
  },
  data () {
    return {
      dataBase,
      mobileOrder: {},
      orderId: [],
      salePrice: 0
    }
  },
  created () {
    let orderId = this.$route.query.orderId
    if (!orderId) {
      this.mobileOrder = JSON.parse(getSessionStore('MobileOrder'))
      if (!this.mobileOrder) {
        this.dataBase.alert('提示', '缺少订单,请先下单')
      } else {
        this.orderId = this.mobileOrder.order.map(item => item.orderId)
        this.mobileOrder.order && this.mobileOrder.order.forEach(item => {
          this.salePrice += item.order.salePrice * item.order.productNum
        })
      }
    } else { // 立即支付
      this.orderId.push(orderId)
      this.dataBase.loading = true
      getOrderDetail({orderId}).then(res => {
        this.dataBase.loading = false
        if (res.code === '0') {
          this.salePrice = res.data.goods.salePrice
        } else {
          Toast(res.msg)
        }
      })
    }

    // let orderId = this.$route.query.orderId
    // if (orderId) {
    //   getOrderDetail({orderId: orderId}).then(res => {
    //     if (res.code === '0') {
    //       this.mobileOrder = res.data
          // if (this.mobileOrder.orderStatus == 1) {
          //   payMent(this.mobileOrder).then(result => {
          //     if (result.code === '0') {
                // 生成二维码
                // QRCode.toDataURL(result.data.qr_url)
                //   .then(url => {
                //     console.log(url)
                //   })
                //   .catch(err => {
                //     console.error(err)
                //   })
                // QRCode.toCanvas(document.getElementById('canvas'),
                //   result.data.info.alipay_trade_precreate_response.qr_code,
                //   { toSJISFunc: QRCode.toSJIS }, function (error) {
                //   if (error) console.error(error)
                //   console.log('success!')
                // })
          //     }
          //   })
          // } else {
          //   Toast('订单状态异常')
          // }
        // } else {
        //   Toast(res.msg)
        // }
      // })
    // }
  },
  methods: {
    pay () {
      MessageBox.prompt('请输入密码', {inputType: 'password'}).then(({ value, action }) => {
        this.dataBase.loading = true
        batchPay({
          password: value,
          status: 2,
          orderId: this.orderId
        }).then(res => {
          this.dataBase.loading = false
          if (res.code === '0') {
            removeSessionStore('MobileOrder')
            this.$router.push({name: 'MobilePaySuccess'})
          } else {
            Toast(res.msg)
          }
        })
      }).catch(function () {
        return;
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.ui-content {
  padding: 2.4rem .5rem 1rem .5rem;
  .ui-pay-img {
    width: 4rem;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 50%;
  }
  .ui-text {
    display: flex;
    font-size: .6rem;
    justify-content: space-between;
    margin: .5rem 0;
  }
  .ui-good-name {
    display: inline-block;
    width: 5rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: right;
  }
  .ui-pay-btn {
    display: block;
    width: 100%;
    text-align: center;
    line-height: 1.1rem;
    color: #fff;
    font-size: .6rem;
    letter-spacing: 5px;
    background-color: #179dfe;
    border-radius: 25px;
    position: relative;
    bottom: -5rem;
  }
}


</style>
