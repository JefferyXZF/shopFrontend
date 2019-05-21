<template>
  <div class="ui-evaluate-app">
    <evaluate-header title="我的评价"></evaluate-header>
    <div class="ui-evaluate-main">
      <div class="ui-goods">
        <img v-lazy="goods.bigImage">
        <p> {{ goods.productName }}</p>
      </div>
      <div class="ui-collect">
        <span
          v-for="n in num"
          :key="n"
          @mouseenter="enter(n)"
          @mouseleave="leave()"
          @click="Selected(n)"
          :class="{'icon-shoucangxuanzhong1':cur>=n}"
          class="iconfont icon-collection"></span>
      </div>
      <div>
        <mt-field
          label="我的评价"
          placeholder="亲，您的好评是我们的动力，字数不能超过200个"
          type="textarea"
          rows="4"
          :attr="{ maxlength: 200 }"
          v-model.trim="introduction"></mt-field>
      </div>
      <p class="ui-goods-eval" @click="evaluate">评价</p>
    </div>
  </div>
</template>

<script>
import '@/assets/mobile/rem/rem.js'
import EvaluateHeader from '/components/mobile/common/header'
import { getOrderDetail, updateOrderStatus } from '/api/user'
import { Toast, MessageBox } from "mint-ui"
export default {
  name: 'Evaluate',
  components: {
    EvaluateHeader
  },
  data () {
    return {
      orderId: '',
      order: {},
      introduction: '',
      num: 5,
      cur: 3,
      flag : false,
      goods: {},
      isFlag: true
    }
  },
  created () {
    this.orderId = this.$route.query.orderId
    if (this.orderId) {
      getOrderDetail({orderId: this.orderId}).then(res => {
        if (res.code === '0') {
          this.order = res.data
          this.goods = res.data.goods
        }
      })
    }
  },
  methods: {
    enter(idx){
      if(!this.flag){
        this.cur = idx;
      }
    },
    leave(){
      if(!this.flag){
        this.cur = -1;
      }
    },
    Selected(n){
      this.flag = true;
      this.cur = n;
    },
    evaluate () {
      let introduction = this.introduction;
      if (!introduction) {
        Toast('评论不能为空')
        return
      }
      if (this.isFlag) { // 节流, 防止多次点击
        this.isFlag = false
        updateOrderStatus({
        orderId: this.order.orderId,
        productId: this.goods.productId,
        status: 5,
        cur: this.cur,
        introduction: this.introduction
        }).then(res => {
          this.isFlag = true
        if (res.code === '0') {
          Toast('评价成功')
          this.$router.push({name: 'MobileOrderList'})
        }
      })
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.ui-evaluate-main {
  padding-top: 1.45rem;
  .ui-goods {
    display: flex;
    padding: .3rem;
    img {
      width: 4rem;
      height: 4.5rem;
      margin-right: .3rem;
    }
    p {
      flex: 1;
      height: 3rem;
      overflow: hidden;
      font-size: .5rem;
    }
  }
  .ui-collect {
    padding: .5rem .4rem;
    span {
      margin-right: .3rem;
    }
  }
  .ui-goods-eval {
    height: 1rem;
    width: 80%;
    margin: 2rem auto;
    line-height: 1rem;
    text-align: center;
    font-size: .4rem;
    background-color: red;
    color: #fff;
  }
  .icon-shoucangxuanzhong1 {
    color: red;
  }
}
</style>
