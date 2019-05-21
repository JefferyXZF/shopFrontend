//手机端路由

const Index = resolve => require(['/views/mobile/index'], resolve)
const Home = resolve => require(['/views/mobile/home'], resolve)
const Category = resolve => require(['/views/mobile/category'], resolve)
const Cart = resolve => require(['/views/mobile/cart'], resolve)
const My = resolve => require(['/views/mobile/my'], resolve)
const GoodsDetail = resolve => require(['/views/mobile/detail/GoodsDetail'], resolve)
const Login = resolve => require(['/views/mobile/login/Login'], resolve)
// 地址
const AddressList = resolve => require(['/views/mobile/my/address'], resolve)
const AddressDetail = resolve => require(['/views/mobile/my/address/addressDetail'], resolve)
// 订单
const OrderList = resolve => require(['/views/mobile/my/order'], resolve)
const OrderDetail = resolve => require(['/views/mobile/my/order/OrderDetail'], resolve)
const CheckOrder = resolve => require(['/views/mobile/my/order/CheckOrder'], resolve)
// 搜索
const Search = resolve => require(['/views/mobile/search'], resolve)
// 我的收藏
const MyCollection = resolve => require(['/views/mobile/my/collection'], resolve)
// 我的收藏
const MyEvaluate = resolve => require(['/views/mobile/my/evaluate'], resolve)
// 支付
const Pay = resolve => require(['/views/mobile/my/order/Pay'], resolve)
// 支付成功
const PaySuccess = resolve => require(['/views/mobile/my/order/PaySuccess'], resolve)
export default {
  router: [
    {
      path: '/web',
      redirect: '/web/home',
      component: Index,
      children: [
        {
          path: 'home',
          name: 'MobileHome',
          component: Home,
        },
        {
          path: 'category',
          name: 'MobileCategory',
          component: Category,
        },
        {
          path: 'cart',
          name: 'MobileCart',
          component: Cart,
        },
        {
          path: 'my',
          name: 'MobileMy',
          component: My,
        }
      ]
    },
    {
      path: '/web/goodsDetail',
      name: 'MobileGoodsDetail',
      component: GoodsDetail,
    },
    {
      path: '/web/login',
      name: 'MobileLogin',
      component: Login,
    },
    {
      path: '/web/address',
      name: 'MobileAddressList',
      component: AddressList,
    },
    {
      path: '/web/addressDetail',
      name: 'MobileAddressDetail',
      component: AddressDetail,
    },
    {
      path: '/web/order',
      name: 'MobileOrderList',
      component: OrderList,
    },
    {
      path: '/web/pay',
      name: 'MobileCheckOrder',
      component: CheckOrder,
    },
    {
      path: '/web/orderDetail',
      name: 'MobileOrderDetail',
      component: OrderDetail,
    },
    {
      path: '/web/search',
      name: 'MobileSearch',
      component: Search,
    },
    {
      path: '/web/collect',
      name: 'MobileCollection',
      component: MyCollection,
    },
    {
      path: '/web/evaluate',
      name: 'MobileEvaluate',
      component: MyEvaluate
    },
    {
      path: '/web/payOrder',
      name: 'MobilePay',
      component: Pay
    },
    {
      path: '/web/paySucess',
      name: 'MobilePaySuccess',
      component: PaySuccess
    }
  ]
}

