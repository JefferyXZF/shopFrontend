//PC端路由

const Index = resolve => require(['/views/pc/index'], resolve)
const Login = resolve => require(['/views/pc/login/Login'], resolve)
// 用户页面
const PCUser = resolve => require(['/views/pc/user/User'], resolve)
const orderList = resolve => require(['/views/pc/user/children/OrderList'], resolve)
const information = resolve => require(['/views/pc/user/children/Information'], resolve)
const addressList = resolve => require(['/views/pc/user/children/AddressList'], resolve)
const MyCollection = resolve => require(['/views/pc/user/children/MyCollection'], resolve)
const MyCart = resolve => require(['/views/pc/user/children/Cart'], resolve)
// 评论
const MyEvaluate = resolve => require(['/views/pc/user/children/MyEvaluate'], resolve)
// 商品
const GoodsList = resolve => require(['/views/pc/goods/GoodsHome'], resolve)
const GoodsDetail = resolve => require(['/views/pc/goods/GoodsDetail'], resolve)
const GoodsCategory = resolve => require(['/views/pc/goods/GoodsCategory'], resolve)
const PCSearchGoods = resolve => require(['/views/pc/search/Search'], resolve)
// 订单
const OrderCheckout = resolve => require(['/views/pc/order/CheckOut'], resolve)
const payment = resolve => require(['/views/pc/order/payment'], resolve)
const paySuccess = resolve => require(['/views/pc/order/paySuccess'], resolve)

export default {
  router: [{
    path: '/shop/home',
    name: 'PCHome',
    component: Index,
    redirect: '/shop/home/goods',
    children: [
      {
        path: '/shop/home/goods',
        name: 'PCGoods',
        component: GoodsList,
        meta: {
          title: '商品列表'
        }
      },
      {
        path: '/shop/detail',
        name: 'PCGoodsDetail',
        component: GoodsDetail,
        meta: {
          title: '商品详情'
        }
      },
      {
        path: '/shop/category/',
        name: 'PCGoodsCategory',
        component: GoodsCategory,
        meta: {
          title: '商品分类'
        }
      },
      {
        path: '/shop/search',
        name: 'PCSearchGoods',
        component: PCSearchGoods,
        meta: {
          title: '商品搜索'
        }
      },
    ]
  },
  {
    path: '/user/login',
    name: 'PCLogin',
    component: Login,
    meta: { title: '用户登录' }
  },
  {
    path: '/user',
    name: 'PCUser',
    component: PCUser,
    redirect: '/user/addressList',
    meta: { title: '用户登录' },
    children: [
      {path: 'orderList', name: '我的订单', component: orderList},
      {path: 'information', name: '账户资料', component: information},
      {path: 'addressList', name: '收货地址', component: addressList},
      {path: 'collection', name: '我的收藏', component: MyCollection},
      {path: 'cart', name: '我的购物车', component: MyCart},
      {
        path: 'evaluate',
        name: 'PCMyEvaluate',
        component: MyEvaluate
      }
      // {path: 'coupon', name: '我的优惠', component: coupon},
      // {path: 'support', name: '售后服务', component: support},
      // {path: 'aihuishou', name: '以旧换新', component: aihuishou}
    ]
  },
  {
    path: '/order/checkout',
    name: 'PCcheckout',
    component: OrderCheckout
  },
  {
    path: '/order/payment',
    name: 'PCPayment',
    component: payment
  },
  {
    path: '/order/paySuccess',
    name: 'PCPaysuccess',
    component: paySuccess
  }]
}
