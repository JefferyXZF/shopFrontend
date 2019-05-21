import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutation'
import action from './action'
Vue.use(Vuex)

const state = {
  login: false,   // 是否登录
  userInfo: null, // 用户信息
  cartList: [],   // 加入购物车列表
  collection: [], // 我的收藏
  orderList: {},
  checkAddress: {},
  address: {
    addressId: '',
    userName: '',
    tel: '',
    streetName: '',
    isDefault: false
  }, // 保持要修改的地址
  addrList: [], //
  showMoveImg: false, // 显示飞入图片
  elLeft: 0,
  elTop: 0,
  moveImgUrl: null,
  cartPositionT: 0, // 购物车位置
  cartPositionL: 0,
  receiveInCart: false, // 是否进入购物车
  isShowCart: false, // 是否显示购物车
  goodsList: {}  // 商品列表
}

export default new Vuex.Store({
  state,
  mutations,
  action
})
