<template>
  <div class="ui-order-main">
    <div class="ui-order-nav">
      <nav-list
        :tabList="orderType"
        :index="curIndex"
        @selectIndex="selectIndex"></nav-list>
    </div>
    <y-shelf title="我的订单">
      <div slot="content">
        <div v-if="orderList.length">
          <div
            v-for="(item,i) in orderList"
            :key="i" v-show=
            "flag || orderStatus == item.orderStatus">
            <div class="gray-sub-title">
              <div class="first">
                <div>
                  <span class="date" v-text="item.createDate"></span>
                  <span class="order-id"> 订单号： <a href="javascript:;">{{item.orderId}}</a> </span>
                </div>
                <div class="f-bc">
                  <span class="price">单价</span>
                  <span class="num">数量</span>
                  <span class="sub-total">实付金额</span>
                  <span class="sub-total">订单状态</span>
                </div>
              </div>
              <div class="last">
                <span class="operation">商品操作</span>
              </div>
            </div>
            <div class="pr">
              <div class="cart">
                <div class="cart-l">
                    <div class="img-box">
                      <router-link :to="{name: 'PCGoodsDetail', query:{productId: item.goods.productId}}">
                        <img
                        :src="item.goods.bigImage"
                        alt="">
                      </router-link>
                    </div>
                    <div class="ellipsis ui-product-name">
                      <router-link :to="{name: 'PCGoodsDetail', query:{productId: item.goods.productId}}">
                        {{item.goods.productName}}
                      </router-link>
                    </div>
                    <span>¥ {{item.goods.salePrice}}</span>
                    <span class="num">{{item.goods.productNum}}</span>
                    <span class="total">¥ {{item.goods.salePrice * item.goods.productNum}}</span>
                    <span
                      class="status"
                      :class="{colRed: item.orderStatus == 1}"
                      :title="status[item.orderStatus]">
                      {{status[item.orderStatus]}}</span>
                </div>
                <div class="cart-r">
                  <p @click="goDetail(item)">查看详情</p>
                  <p>
                    <span
                      class="ui-order-del"
                      v-if="item.orderStatus == 1"
                      @click="delOrder(item)">取消订单</span>
                  </p>
                  <p>
                    <span
                      class="ui-order-success"
                      v-if="item.orderStatus == 1"
                      @click="payOrder(item)">立即支付</span>
                  </p>
                  <p>
                    <span
                      class="ui-order-del"
                      v-if="item.orderStatus == 2 || item.orderStatus == 3"
                      @click="backOrder(item)">退货退款</span>
                  </p>
                  <p>
                    <span
                      class="ui-order-success"
                      v-if="item.orderStatus == 3"
                      @click="confirmOrder(item)">确认收货</span>
                  </p>
                  <p>
                    <span
                      class="ui-order-success"
                      v-if="item.orderStatus == 4"
                      @click="evaluateOrder(item)">评价</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="qwui-none_data" v-show="showNoData">
            <div class="qwui-none_data_img"></div>
            <span class="qwui-none_data_text">暂无数据</span>
          </div>
        </div>
        <div v-else>
          <div style="padding: 100px 0;text-align: center">
            你还未创建过订单
          </div>
        </div>
      </div>
    </y-shelf>
  </div>
</template>
<script>
  import { getOrderList, delOrder, updateOrderStatus } from '/api/user'
  import YShelf from '/components/pc/user/Shelf'
  import NavList from '/components/pc/NavList'
  import NoneData from '/components/mobile/NoneData'
  import { setSessionStore } from '/utils/storage'
  export default {
    data () {
      return {
        orderList: [],
        status: ['等待退货退款', '未支付', '待发货', '已发货', '交易完成', '已评价', '已退货退款'], // 0'等待退货退款', 1'未支付', 2'已支付', 3'已发货', 4'交易完成，5'评价' 6'已退款'
        dataBase: dataBase,
        curIndex: 0,
        orderType: [
          {text: '全部', status: 'all'},
          {text: '未支付', status: 1},
          {text: '待发货', status: 2},
          {text: '已发货', status: 3},
          {text: '交易完成', status: 4},
          {text: '已评论', status: 5},
          ],
        orderStatus: '',
        flag: true,
        showNoData: false
      }
    },
    watch: {
      orderStatus (newValue, oldValue) { // 监听订单状态变化,判断是否显示无数据提示
        if (!newValue) { // 由于进入页面时数值为空,监听需要做判断
          this.showNoData = this.orders.length == 0
        } else {
          if (this.orderList.length) {
            if (newValue === 'all') { // 选择全部时,因此提示
              this.showNoData = false
              return;
            }
            this.showNoData = !this.orderList.some(item => item.orderStatus == newValue)
          } else {
            this.showNoData = true
          }
        }
      },
      orderList (value) { // 监听订单的变化
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
    methods: {
      getOrderList () { // 获得订单列表
        this.dataBase.loading = true
        getOrderList().then(res => {
          this.dataBase.loading = false
          if (res.code === '0') {
            this.orderList = res.data || []
          }
        })
      },
      goDetail (item) { // 查看订单详情
        let top = (window.screen.height - 600) / 2
        let left = (window.screen.width - 350) / 2
        window.open(`/#/web/orderDetail?orderId=${item.orderId}`,
          'newwindow',
          `left=${left},
          top=${top},
          ,height=580, width=360, toolbar=no, menubar=no, resizable=yes,location=no, status=no,scrollbars=no,directories=no,menubar=no`)
      },
      delOrder (item) { // 取消订单
        this.dataBase.alert('提示', '取消订单后将无法恢复，确认要删除吗？',
        () => {
          delOrder({orderId: item.orderId}).then(res => {
          if (res.code === '0') {
            this.dataBase.top_alert('订单已取消', true, 2000)
            this.getOrderList()
          } else {
              this.dataBase.alert = ('错误提示', res.msg)
            }
        })
        }, '确定', true, '', '取消')
      },
      payOrder (item) { // 支付订单
        setSessionStore('order', {address: item.address, order: [{orderId: item.orderId, order: item.goods}]})
        this.$router.push({name: 'PCPayment'})
      },
      backOrder (item) { // 退货退款
        this.dataBase.alert('提示', '退货退款后订单将失效，确认要退货退款吗？',
        () => {
          this.dataBase.loading = true
          updateOrderStatus({orderId: item.orderId, status: 0}).then(res => {
            this.dataBase.loading = false
            if (res.code === '0') {
              this.dataBase.top_alert('等待退货退款', true, 2000)
              this.getOrderList()
            } else {
              this.dataBase.alert = ('错误提示', res.msg)
            }
        })
        }, '确定', true, '', '取消')
      },
      confirmOrder (item) { // 确认收货
        this.dataBase.alert('提示', '确定收货？',
          () => {
            this.dataBase.loading = true
            updateOrderStatus({orderId: item.orderId, status: 4}).then(res => {
              this.dataBase.loading = false
              if (res.code === '0') {
                this.dataBase.top_alert('恭喜你，交易完成', true, 2000)
                this.getOrderList()
              } else {
                this.dataBase.alert = ('错误提示', res.msg)
              }
          })
          }, '确定', true, '', '取消')
      },
      evaluateOrder (item) { // 评价
        this.$router.push({name: 'PCMyEvaluate', query: {orderId: item.orderId}})
      },
      selectIndex(value) { // 切换订单导航栏
        this.curIndex = value.index;
        value.item.status === 'all' ? this.flag = true : this.flag = false
        this.orderStatus = value.item.status
      }
    },
    created () {
      this.getOrderList()
    },
    components: {
      YShelf,
      NavList,
      NoneData
    }
  }
</script>
<style lang="scss" scoped>
  @import "./../../../../assets/pc/style/mixin";

  .ui-order-nav {
    margin-bottom: 20px;
  }
  .gray-sub-title {
    height: 38px;
    padding-left: 24px;
    background: #EEE;
    border-top: 1px solid #DBDBDB;
    border-bottom: 1px solid #DBDBDB;
    line-height: 38px;
    font-size: 12px;
    color: #666;
    display: flex;
    span {
      display: inline-block;
      height: 100%;
    }
    .first {
      display: flex;
      justify-content: space-between;
      flex: 1;
      .f-bc {
        width: 344px;
        > span {
          width: 80px;
          text-align: center;
        }
      }
    }
    .last {
      width: 120px;
      text-align: center;
      display: flex;
      border-left: 1px solid #ccc;
      span {
        flex: 1;
      }
    }
  }

  .bt {
    border-top: 1px solid #EFEFEF;
  }

  .date {
    padding-left: 6px;
  }

  .order-id {
    margin-left: 20px;
  }

  .cart {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 24px;
    &:hover {
      .del-order {
        display: block;
      }
    }
    .del-order {
      display: none;
    }
    .cart-l {
      display: flex;
      align-items: center;
      flex: 1;
      padding: 15px 0;
      position: relative;
      > span {
        width: 80px;
        text-align: center;
        margin-left: 8px;
      }
      .status {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      .ui-product-name {
        flex: 1;
      }
      &:before {
        position: absolute;
        content: ' ';
        right: -1px;
        top: 0;
        width: 1px;
        background-color: #EFEFEF;
        height: 100%;
      }
      .ellipsis {
        margin-left: 20px;
        width: 220px;
      }
      .img-box {
        border: 1px solid #EBEBEB;
      }
      img {
        display: block;
        @include wh(80px);
      }
    }
    .cart-r {
      width: 120px;
      p {
        text-align: center;
        line-height: 24px;
        letter-spacing: 2px;
        cursor: pointer;
        &:hover {
          color: dodgerblue;
        }
      }
    }
    .colRed {
      color: red;
    }
  }

//显示无数据样式
.qwui-none_data {
  position: relative;
  left: 50%;
  margin-top: 120px;
  transform: translate(-50%, -50%);
  text-align: center;
  .qwui-none_data_img {
    width: 200px;
    height: 150px;
    margin: 0 auto;
    background: url(/static/svg/icon_none_data.svg) no-repeat center;
  }
  .qwui-none_data_text {
    font-size: 16px;
    color: #a6a6a6;
  }
}
</style>
