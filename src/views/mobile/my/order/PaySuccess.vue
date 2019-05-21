<template>
  <div class="ui-pay">
    <h1 class="ui-text-align ui-pay-text">支付成功</h1>
    <img class="ui-img" src="/static/images/pay_success.jpg" alt="">
    <p class="ui-text-align"><router-link :to="{name: 'MobileOrderList'}">查看详情</router-link></p>
  </div>
</template>

<script>
import '@/assets/mobile/rem/rem.js'
export default {

}
</script>

<style lang="scss" scoped>
.ui-pay {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding-top: 1rem;
  background-color: #f6f6f6;
  position: absolute;
  top: 0;
  bottom: 0;
  .ui-pay-text {
    color: #46B547;
  }
}
.ui-img {
  display: block;
  width: 4rem;
  height: 4rem;
  margin: 0 auto;
}
.ui-text-align {
  text-align: center;
  margin: 1rem 0;
}
</style>
