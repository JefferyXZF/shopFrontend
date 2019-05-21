import { setStore, getStore} from './../utils/storage';

export default {
  // 网页初始化时从本地缓存获取购物车数据
  initCart (state) {
    let cartData = getStore('buyCart')
    if (cartData && cartData.length > 0) {
      state.cartList = JSON.parse(cartData)
    }
  },
  // 加入购物车
  addCart (state, params) {
    let cart = state.cartList // 购物车
    let falg = true
    let goods = params
    if (cart.length) {        // 有内容
      cart.forEach(item => {
        if (item.productId === goods.productId) { // 如果是同一个商品这添加数量
          if (item.productNum >= 0) {
            falg = false
            item.productNum += goods.productNum
          }
        }
      })
    }
    if (!cart.length || falg) {
      goods.checked = 1
      cart.push(goods)
    }
    state.cartList = cart
    // 存入localStorage
    setStore('buyCart', cart)
  },
  // 加入购物车动画
  addAnimation (state, {moveShow, elLeft, elTop, img, cartPositionT, cartPositionL, receiveInCart}) {
    state.showMoveImg = moveShow
    if (elLeft) {
      state.elLeft = elLeft
      state.elTop = elTop
    }
    state.moveImgUrl = img
    state.receiveInCart = receiveInCart
    if (cartPositionT) {
      state.cartPositionT = cartPositionT
      state.cartPositionL = cartPositionL
    }
  },
  // 是否显示购物车
  showCart (state, {isShowCart}) {
    state.isShowCart = isShowCart
    // let timer = null
    // clearTimeout(timer)
    // if (isShowCart) {
    //   timer = setTimeout(() => {
    //     state.showCart = false
    //   }, 5000)
    // }
  },
  // 删除购物车
  reduceCart (state, {productId}) {
    let cart = state.cartList
    cart.forEach((item, i) => {
      if (item.productId === productId) {
        if (item.productNum > 1) {
          item.productNum--
        } else {
          cart.splice(i, 1)
        }
      }
    })
    state.cartList = cart
    // 存入localStorage
    setStore('buyCart', state.cartList)
  },
  // 修改购物车
  editCart (state, {productId, productNum, checked}) {
    let cart = state.cartList
    state.cartList = null
    if (productNum) {
      cart.forEach((item, i) => {
        if (item.productId === productId) {
          item.productNum = productNum
          item.checked = checked
        }
      })
    } else if (productId && checked === undefined) { // 删除购物车
      cart.forEach((item, i) => {
        if (item.productId === productId) {
          cart.splice(i, 1)
        }
      })
    } else {
      cart.forEach((item) => { // 修改选中状态
        if (item.productId === productId) {
          item.checked = checked
        }
      })
    }
    state.cartList = cart
    // 存入localStorage
    setStore('buyCart', state.cartList)
  },
  // 批量删除购物车
  batchEditCart (state, productId) {
    let cart = state.cartList
    if (Array.isArray(productId)) {
      productId.forEach(item => {
        cart.forEach((value, i) => {
          if (value.productId == item) {
            cart.splice(i, 1)
          }
        })
      });
      state.cartList = cart
      // 存入localStorage
      setStore('buyCart', state.cartList)
    }
  },
  // 选择所有购物车
  selectAllCart(state, {checked}) {
    let cart = state.cartList
     cart.forEach((item, i) => {
       item.checked = checked
     })
    state.cartList = cart
    // 存入localStorage
    setStore('buyCart', state.cartList)
  },
  // 记录用户信息
  recordUserInfo (state, info) {
    state.userInfo = info
    state.cartList = info.cartList || []
    state.addrList = info.addressList || []
    state.collection = info.collectGoods || []
    if (Array.isArray(info.addressList) && info.addressList.length) {
      let addrList = info.addressList.filter(item => item.isDefault)
      state.checkAddress = addrList[0]
    }
    state.login = true
    setStore('userInfo', info)
  },
  // 更新图片
  updateUserHeadPic (state, url) {
    state.userInfo.headPic = url
  },
  // 获取用户信息
  getUserInfo (state, info) {
    if (state.userInfo && (state.userInfo.username !== info.username)) {
      return
    }
    if (!state.login) {
      return
    }
    if (!info.message) {
      state.userInfo = {...info}
    } else {
      state.userInfo = null
    }
  },
  // 添加商品列表
  addGoodsList(state, info) {
    state.goodsList = []
    if (Array.isArray(info) && info.length > 0) {
      state.goodsList.push(...info)
    }
  },
  // 获取商品列表
  getGoodsList(state) {
    if (Array.isArray(state.goodsList) && state.goodsList.length > 0) {
      return state.goodsList
    }
  },
  checkOrder (state, order) { // 要结算的订单
    state.orderList = {}
    state.orderList = order
  },
  updateAddress (state, address) { // 修改地址
    state.address = address
  },
  updateCheckAddress(state, address) { // 修改地址
    state.checkAddress = address
  },
  resetInfo(state) { // 退出登录重置信息
    state.login = false
    state.userInfo =  null
    state.cartList = []
    state.addrList = []
    state.collection = []
    state.checkAddress = {}
  },
  updateCollection(state, collect) {
    state.collection = collect || []
  }
}
