<template>
  <div class="uii-order-detail" v-if="order">
    <order-header title="订单详情"></order-header>
      <div class="details-box">
      <div class="details-success">
          <p>订单状态：{{ status[order.orderStatus]}}</p>
          <img src="https://shopstatic.vivo.com.cn/vivoshop/wap/dist/images/membercenter/order/no-pay_79c2dfe.png">
      </div>

        <div class="details-address">
        <p class="address-box">
            <span class="name">收货人：{{ order.address.userName}}</span>
            <span class="phone">{{ order.address.tel}}</span>
        </p>
        <p class="address-details">收货地址：{{ order.address.streetName}}</p>
      </div>
      <div class="details-list">
        <div class="ui-detail">
          <img :src="order.goods.bigImage">
          <div class="ui-detail-param">
            <p class="name">{{ order.goods.productName }}</p>
            <p v-if="order.goods.color">颜色：{{ order.goods.color }}</p>
            <p v-if="order.goods.size">尺寸：{{ order.goods.size }}</p>
            <p class="ui-detail-price">
              <span>× {{ order.goods.productNum }}</span>
              <span class="price">¥ {{ order.goods.salePrice }}</span>
            </p>
          </div>
        </div>

       <div class="details-list-2">

           <div class="details-list-2-2">
                 <p>
                     <span class="span-1">订单ID：</span>
                     <span class="span-2">{{ order.orderId }}</span>
                </p>
                <p v-if="order.createDate">
                     <span class="span-1">下单时间：</span>
                     <span class="span-2">{{ order.createDate }}</span>
                </p>
                <p v-if="order.payDate">
                     <span class="span-1">支付时间：</span>
                     <span class="span-2">{{ order.payDate }}</span>
                </p>
                <p v-if="order.deliverDate">
                     <span class="span-1">发货时间：</span>
                     <span class="span-2">{{ order.deliverDate }}</span>
                </p>
                <p v-if="order.completeDate">
                     <span class="span-1">收货时间：</span>
                     <span class="span-2">{{ order.completeDate }}</span>
                </p>
                <p v-if="order.evaluateDate">
                     <span class="span-1">评论时间：</span>
                     <span class="span-2">{{ order.evaluateDate }}</span>
                </p>
                <p>
                    <span class="span-1">总金额：</span>
                    <span class="span-2">¥ {{ order.goods.productNum * order.goods.salePrice }}</span>
                </p>
           </div>
       </div>
        <!-- <img :src="list.homeImg" /> -->

        <div class="order-footer">
            总计：
            <span>¥{{ order.goods.productNum * order.goods.salePrice }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import '@/assets/mobile/rem/rem.js'
import { getOrderDetail } from '/api/user'
import { Toast } from 'mint-ui'
import OrderHeader from '/components/mobile/common/header'
export default {
  name: 'OrderDetail',
  components: {
    OrderHeader
  },
  data () {
    return {
      dataBase,
      status: ['等待退货退款', '未支付', '待发货', '已发货', '交易完成', '已评价', '已退货退款'], // 0'等待退货退款', 1'未支付', 2'已支付', 3'已发货', 4'交易完成，5'评价' 6'已退款'
      order: null
    }
  },
  created () {
    let id = this.$route.query.orderId
    if (id) {
      this.dataBase.loading = true
      getOrderDetail({orderId: id}).then(res => {
        this.dataBase.loading = false
        if (res.code === '0') {
          this.order = Object.assign({}, res.data)
        } else {
          Toast(res.msg)
        }
      })
    }
  },
  methods: {

  }
}
</script>

<style lang='scss' scoped>
.details-box {
    position: absolute;
    top: 1.45rem;
}

.details-success {
    width: 100%;
    height: 2.4rem;
    background: #69c1ff;

    p {
        color: #fff;
        font-size: 0.46rem;
        line-height: 2.4rem;
        float: left;
        padding-left: 0.4rem;
    }

    img {
        width: 2.7rem;
        margin: 0.5rem;
        float: right;
    }
}

.details-address {
  width: 100%;
  height: 2rem;
  background: #fff;
  border-bottom: 1px solid #eee;

  .address-box {
    width: 87%;
    margin: auto;
    font-size: 0.4rem;
    padding-top: 0.3rem;
    padding-bottom: 0.3rem;

    .phone {
        float: right;
    }
  }

  .address-details {
      width: 87%;
      margin: auto;
      color: #666;
      font-size: 0.38rem;
      overflow: hidden;
      height: .6rem;
  }
}

.details-list {
    width: 100%;
    margin-bottom: 1.3rem;
    .ui-detail {
      display: flex;
    }
    img {
      width: 2.5rem;
      margin: 0.28rem;
      height: 3rem;
    }
    .ui-detail-param {
      position: relative;
      flex: 1;
      overflow: hidden;
      background: #ffffff;
      margin-top: 5px;
      font-size: .4rem;
      .name {
          font-size: 0.4rem;
          margin-top: 0.3rem;
          height: 1.6rem;
          overflow: hidden;
        }

      .price {
        color: red;
        font-size: 0.35rem;
        font-weight: 500;
        height: 0.6rem;
      }
      .ui-detail-price {
        position: absolute;
        bottom: .3rem;
        right: .6rem;
      }
    }

    .details-list-2 {
        width: 100%;
        height: 9rem;
        background: #ffffff;

        div {
            padding-top: 0.3rem;
            padding-bottom: 0.3rem;
            font-size: 0.36rem;
            border-top: 1px solid #e8e8e8;

            span {
                color: #888;
                float: left;
            }

            .span-1 {
                width: 2rem;
                display: block;
                text-align: right;
            }
        }

        .details-list-2-2 {
            height: 3.5rem;
            p {
                height: 0.76rem;
                line-height: 0.76rem;
                display: flex;
                overflow: hidden;
            }
            .red {
                color: red;
            }
        }

    }

    .order-footer {
        width: 100%;
        height: 1.3rem;
        background: #fff;
        position: fixed;
        bottom: 0;
        line-height: 1.3rem;
        padding-left: 0.5rem;
        font-size: 0.38rem;
        border-top: 1px solid #eaeaea;

        span {
            color: red;
        }
    }
}
</style>
