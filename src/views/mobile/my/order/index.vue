<template>
  <div class="order" id="transition">
    <order-header title="我的订单"></order-header>
    <div class="orderMain">
      <div  class="order-box">
        <p
        v-for="(item,index) in orderTitle"
        @click="changeOrder(item, index)"
        :key="index + '66g'"
        >
          <span :class="{active:index===nowIndex}">{{ item.name }}</span>
        </p>
      </div>
      <div class="order-box2" >
        <div
        v-for="(list,index) in orders"
        :key="index"
        class="orders"
        v-show="flag || orderStatus == list.orderStatus">
          <div class="_order">
            <p class="left">
              <i class="iconfont icon-qijiandian"></i>
              服饰商城旗舰店
            </p>
            <p class="right">{{ status[list.orderStatus] }}</p>
          </div>
          <div class="order" >
            <img :src="list.goods.bigImage">
            <div class="order-div">
              <p class="order-name">
                <router-link class="order-name-link" :to="{name: 'MobileGoodsDetail', query: {productId: list.goods.productId}}">{{list.goods.productName}}</router-link>
              </p>
              <p v-if="list.goods.color" class="order-params">颜色:{{ list.goods.color }}</p>
              <p v-if="list.goods.size" class="order-params">尺寸:{{ list.goods.size }}</p>
              <p class="order-div-price">￥{{list.goods.salePrice}}</p>
            </div>
            <div class="order-div-2">
              × {{list.goods.productNum}}
            </div>
          </div>
          <div class="order-2">
            <div class="order-2-box">
              <p class="order-2-zero">共计<span>{{ list.goods.productNum }}</span>件商品</p>
              <p class="order-2-one">总计：<span>￥{{ list.goods.productNum * list.goods.salePrice }}</span></p>
              <p class="order-2-two">(含运费：¥0.00优惠：¥0.00)</p>
            </div>
          </div>
          <div class="order-3">
            <span @click="orderDetails(list)">查看详情</span>
            <span class="ui-order-del" v-if="list.orderStatus == 1" @click="delOrder(list)">取消订单</span>
            <span class="ui-order-success" v-if="list.orderStatus == 1" @click="payOrder(list)">立即支付</span>
            <span class="ui-order-del" v-if="list.orderStatus == 2 || list.orderStatus == 3" @click="backOrder(list)">退货退款</span>
            <span class="ui-order-success" v-if="list.orderStatus == 3" @click="confirmOrder(list)">确认收货</span>
            <span class="ui-order-success" v-if="list.orderStatus == 4" @click="evaluateOrder(list)">评价</span>
          </div>
        </div>
      </div>
      <none-data v-show="showNoData"></none-data>
    </div>
  </div>
</template>

<script>
import '@/assets/mobile/rem/rem.js'
import { getOrderList, delOrder, updateOrderStatus } from '/api/user'
import { Toast, MessageBox } from "mint-ui"
import OrderHeader from '/components/mobile/common/header'
import NoneData from '/components/mobile/NoneData'
export default {
  name: 'OrderList',
  components: {
    OrderHeader,
    NoneData
  },
  data () {
    return {
      dataBase,
      nowIndex: 0,
      orderTitle: [
        {
          name: "全部",
          flag: true
        },
        {
          name: "待付款",
          status: 1,
          flag: false
        },
        {
          name: "待收货",
          status: 2,
          flag: false
        },
        {
          name: "待评价",
          status: 4,
          flag: false
        }
      ],
      status: ['等待退货退款', '未支付', '待发货', '已发货', '交易完成', '已评价', '已退货退款'], // 0'等待退货退款', 1'未支付', 2'已支付', 3'已发货', 4'交易完成，5'评价' 6'已退款'
      orders: [],
      orderStatus: '',
      flag: true,
      showNoData: false
    }
  },
  watch: {
    orderStatus (newValue, oldValue) { // 监听订单状态变化,判断是否显示无数据提示
      if (!newValue) {
        this.showNoData = this.orders.length == 0
      } else {
        if (this.orders.length) {
          this.showNoData = !this.orders.some(item => item.orderStatus == newValue)
        } else {
          this.showNoData = true
        }
      }
    },
    orders (value) { // 监听订单的变化
      if (!this.orderStatus) {
        this.showNoData = value.length == 0
      } else {
        if (value.length) {
          this.showNoData = !value.some(item => item.orderStatus == this.orderStatus)
        } else {
          this.showNoData = true
        }
      }
    }
  },
  created () {
    this.getOrder()
  },
  methods: {
    orderDetails (item) { // 查看详情
      this.$router.push({name: 'MobileOrderDetail', query: {orderId: item.orderId}})
    },
    delOrder (item) {
      MessageBox.confirm('确定取消该订单吗？').then(action => {
        this.dataBase.loading = true
        delOrder({orderId: item.orderId}).then(res => {
          this.dataBase.loading = false
          if (res.code === '0') {
            Toast('订单已取消')
            this.getOrder()
          }
        })
      }).catch(res => {return false});
    },
    payOrder (item) { // 支付订单
      this.$router.push({name: 'MobilePay', query: {orderId: item.orderId}})
    },
    backOrder (item) { // 退货退款
      MessageBox.confirm('确定退货退款吗？').then(action => {
        this.dataBase.loading = true
        updateOrderStatus({orderId: item.orderId, status: 0}).then(res => {
          this.dataBase.loading = false
        if (res.code === '0') {
          Toast('等待退货退款')
          this.getOrder()
        }
      })
      }).catch(res => {return false});
    },
    confirmOrder (item) { // 确认收货
      MessageBox.confirm('确定收货吗？').then(action => {
        this.dataBase.loading = true
        updateOrderStatus({orderId: item.orderId, status: 4}).then(res => {
        this.dataBase.loading = false
        if (res.code === '0') {
          Toast('订单完成')
          this.getOrder()
        }
      })
      }).catch(res => {return false});
    },
    evaluateOrder (item) { // 评价
      this.$router.push({name: 'MobileEvaluate', query: {orderId: item.orderId}})
    },
    // 切换订单状态导航栏
    changeOrder (item, index) {
      this.nowIndex = index; // 聚焦下表
      this.orderStatus = item.status
      this.flag = item.flag
    },
    getOrder () {
      this.dataBase.loading = true
      getOrderList().then(res => {
        this.dataBase.loading = false
      if (res.code === '0') {
        this.orders = res.data || []
      }
    })
    }
  }
}
</script>

<style lang='scss' scoped>
.orderMain {
  padding-top: 1.3rem;
  background-color: #F4F4F4;
}
.order-box {
  position: fixed;
  height: 1rem;
  background: white;
  width: 100%;
  border-bottom: 1px solid #f0f0f0;
  .active {
    color: #199cfe;
    border-bottom: 2px solid #199cfe;
  }
  p {
    width: 25%;
    height: 100%;
    line-height: 1rem;
    float: left;
    text-align: center;
    span {
      width: 50%;
      height: 100%;
      font-size: .36rem;
      display: block;
      margin: auto;
    }
  }
}
.order-box2 {
  width: 100%;
  margin-top: 1rem;
}
.orders {
  margin-top: 10px;
  ._order {
      width: 100%;
      height: 1.3rem;
      line-height: 1.3rem;
      background: #fff;
      .left {
        float: left;
        color: #666;
        margin-left: .5rem;
        font-size: .35rem;
        i {
          font-size: .4rem;
          color: #666;
        }
      }
      .right {
        float: right;
        color: rgb(0, 172, 255);
        margin-right: .3rem;
        font-size: .35rem;
      }
  }
  .order {
    position: relative;
    width: 100%;
    height: 3rem;
    background: white;
    border-bottom: 1px solid #f0f0f0;
    border-top: 1px solid #f0f0f0;
    img {
      float: left;
      margin: .3rem;
      height: 2.5rem;
    }
    .order-div {
      width: 4rem;
      margin: .3rem;
      float: left;
      .order-name {
        font-size: .4rem;
        height: 1rem;
        overflow: hidden;
        .order-name-link {
          color: black;
        }
      }
      .order-params {
        height: .5rem;
        font-size: .4rem;
        margin-top: .2rem;
        overflow: hidden;
      }
      .order-div-price {
        position: absolute;
        top: 1rem;
        right: .3rem;
        color: red;
        font-size: .4rem;
      }
    }
    .order-div-2 {
      display: inline-block;
      float: right;
      margin: .3rem .6rem;
      font-size: .4rem;
    }
  }
  .order-2 {
    width: 100%;
    height: 1.7rem;
    background: white;
    .order-2-box {
      width: 50%;
      float: right;
      text-align: right;
      margin: .2rem .4rem;
      .order-2-zero {
        float: left;
        font-size: .35rem;
        margin-left: .5rem;
        span {
            color: red;
        }
      }
      .order-2-one {
        font-size: .35rem;
        span {
          color: red;
        }
      }
      .order-2-two {
        color: #666;
        padding-top: .2rem;
        font-size: .35rem;
      }
    }
  }
  .order-3 {
    width: 100%;
    height: 1.1rem;
    background: white;
    span {
      width: 1.8rem;
      height: .7rem;
      line-height: .7rem;
      border: 1px solid red;
      border-radius: 3px;
      text-align: center;
      display: block;
      float: right;
      margin-right: .3rem;
      margin-top: .1rem;
      border: 1px solid #dcdcdc;
      font-size: .3rem;
    }
    .ui-order-success {
      color: #fff;
      background-color: #52b838;
    }
    .ui-order-del {
      color: #fff;
      background-color: red;
    }
  }
}
</style>

