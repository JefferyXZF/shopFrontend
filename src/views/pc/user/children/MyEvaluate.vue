<template>
  <div class="ui-evaluate-app">
    <div class="ui-evaluate-main">
      <div class="ui-goods">
        <img v-lazy="goods.bigImage">
        <div class="ui-order-content">
          <p>订单ID: {{order.orderId}}</p>
          <p>商品名称：{{ goods.productName }}</p>
          <p>商品价格：￥{{ goods.salePrice }}</p>
          <p v-if="order.createDate">下单时间: {{order.createDate}}</p>
          <p v-if="order.payDate">支付时间: {{order.payDate}}</p>
          <p v-if="order.deliverDate">发货时间: {{order.deliverDate}}</p>
          <p v-if="order.completeDate">收货时间: {{order.completeDate}}</p>
        </div>
      </div>
      <div class="ui-collect">
        评价：<span
          v-for="n in num"
          :key="n"
          :title="evaText[n]"
          @mouseenter="enter(n)"
          @mouseleave="leave()"
          @click="Selected(n)"
          :class="{'icon-shoucangxuanzhong1':cur>=n}"
          class="iconfont icon-collection"></span>
      </div>
      <div class="ui-textarea">
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
import { getOrderDetail, updateOrderStatus } from '/api/user'
import { Toast, MessageBox } from "mint-ui"
export default {
  name: 'Evaluate',
  data () {
    return {
      dataBase,
      orderId: '',
      order: {},
      introduction: '',
      num: 5,
      cur: 3,
      chooseStar: 3,
      goods: {},
      isFlag: true, // 节流，防止重复点击
      evaText: ['', '差评', '差评', '中评', '好评', '好评']
    }
  },
  created () {
    this.orderId = this.$route.query.orderId
    if (this.orderId) {
      this.dataBase.loading = true
      getOrderDetail({orderId: this.orderId}).then(res => {
        this.dataBase.loading = false
        if (res.code === '0') {
          this.order = res.data
          this.goods = res.data.goods
        }
      })
    } else {
      this.dataBase.top_alert('缺少订单ID', false, 2000)
    }
  },
  methods: {
    enter(idx){
      this.cur = idx;
    },
    leave(){
      this.cur = this.chooseStar;
    },
    Selected(n){
      this.chooseStar = n;
    },
    evaluate () {
      let introduction = this.introduction;
      if (!introduction) {
        this.dataBase.top_alert('评论不能为空', false, 2000)
        return
      }
      if (this.isFlag) { // 节流, 防止多次点击
        this.isFlag = false
        updateOrderStatus({
        orderId: this.order.orderId,
        productId: this.goods.productId,
        status: 5,
        cur: this.chooseStar,
        introduction: this.introduction
        }).then(res => {
          this.isFlag = true
        if (res.code === '0') {
          this.dataBase.top_alert('评论成功', '缺少订单ID', 2000)
          this.$router.push({path: '/user/orderList'})
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
    padding: 20px;
    img {
      width: 200px;
      height: 250px;
      margin-right: 20px;
    }
    .ui-order-content {
      flex: 1;
      overflow: hidden;
      font-size: 16px;
    }
  }
  .ui-collect {
    padding: 15px 20px;
    span {
      margin-right: 5px;
    }
  }
  .ui-goods-eval {
    height: 30px;
    width: 160px;
    margin: 30px 0;
    line-height: 30px;
    text-align: center;
    font-size: 16px;
    background-color: red;
    color: #fff;
    border-radius: 5px;
    cursor: pointer;
  }
  .ui-textarea {
    width: 600px;
    border: 1px solid #ccc;
    /deep/ .mint-cell-wrapper {
      background: none;
    }
  }
  .icon-shoucangxuanzhong1 {
    color: red;
  }
}
</style>
