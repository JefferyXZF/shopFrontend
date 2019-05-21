import axios from './public'
import AxiosAPI from 'axios'
const userUrl = '/user'
const addressUrl = '/address'
const cart = '/cart'
const goods = '/goods'
const order = '/order'
const catrgory = '/category'

// 首页接口
export const productHome = (params) => {
  return axios.fetchPost(`${goods}/productHome`, params)
}
// 登陆
export const userLogin = (params) => {
  return axios.fetchPost(`${userUrl}/login`, params)
}
// 退出登陆
export const loginOut = (params) => {
  return axios.fetchPost(`${userUrl}/loginOut`, params)
}
// 注册账号
export const userRegister = (params) => {
  return axios.fetchPost(`${userUrl}/register`, params)
}
// 用户信息
export const userInfo = (params) => {
  return axios.fetchPost(`${userUrl}/userInfo`, params)
}
// 上传图片
export const upload = (params, config) => {
  return AxiosAPI.post(`${userUrl}/uploadHeadPic`, params, config)
}
// 修改头像
export const updateHeadImage = (params) => {
  return axios.fetchPost(`${userUrl}/updateHeadPic`, params)
}
// 我的收藏
export const collectionList = () => {
  return axios.fetchPost(`${userUrl}/collectList`)
}
// 收藏 取消收藏
export const handleCollection = (params) => {
  return axios.fetchPost(`${userUrl}/collection`, params)
}

// 获取用户收货地址
export const addressList = (params) => {
  return axios.fetchPost(`${addressUrl}/addressList`, params)
}
// 添加收货地址
export const addressAdd = (params) => {
  return axios.fetchPost(`${addressUrl}/addressAdd`, params)
}
// 修改收货地址
export const addressUpdate = (params) => {
  return axios.fetchPost(`${addressUrl}/addressUpdate`, params)
}
// 删除收货地址
export const addressDel = (params) => {
  return axios.fetchPost(`${addressUrl}/addressDel`, params)
}

// 获取购物车列表
export const getCartList = (params) => {
  return axios.fetchPost(`${cart}/cartList`, params)
}
// 加入购物车
export const addCart = (params) => {
  return axios.fetchPost(`${cart}/addCart`, {params})
}
// 批量加入购物车
export const addCartBatch = (params) => {
  return axios.fetchPost(`${cart}/addCartBatch`, params)
}
// 编辑购物车
export const editCartGoods = (params) => {
  return axios.fetchPost(`${cart}/editCart`, params)
}
// 全选
export const checkAllApi = (params) => {
  return axios.fetchPost(`${cart}/editCheckAll`, params)
}
// 删除购物车
export const delCart = (params) => {
  return axios.fetchPost(`${cart}/delCart`, params)
}
// 删除购物车
export const batchDelCart = (params) => {
  return axios.fetchPost(`${cart}/batchDeleteCart`, params)
}
// 批量删除购物车
export const delCartBarch = (params) => {
  return axios.fetchPost(`${cart}/delCartBarch`, params)
}

// 商品详情
export const productDetail = (params) => {
  return axios.fetchPost(`${goods}/find`, params)
}
// 获取商品列表
export const goodsList = (params) => {
  return axios.fetchPost(`${goods}/goodsList`, params)
}
// 获取轮播商品
export const getSwiperGoods = () => {
  return axios.fetchPost(`${goods}/swiper`)
}
// 根据商品分类获取商品列表
export const getGoodsByCategory = (params) => {
  return axios.fetchPost(`${goods}/category`, params)
}
// 根据商品名查询商品
export const getGoodsByProductName = (params) => {
  return axios.fetchPost(`${goods}/search`, params)
}
// 获取商品分类列表
export const getCategoryList = () => {
  return axios.fetchGet(`${catrgory}/list`, {type: 'public'})
}

// 订单 创建
export const createOrder = (params) => {
  return axios.fetchPost(`${order}/createOrder`, params)
}
// 取消订单
export const delOrder = (params) => {
  return axios.fetchPost(`${order}/delOrder`, params)
}
// 订单详情
export const getOrderDetail = (params) => {
  return axios.fetchPost(`${order}/orderDetail`, params)
}
// 获取订单列表
export const getOrderList = (params) => {
  return axios.fetchPost(`${order}/orderList`, params)
}
// 更改订单状态
export const updateOrderStatus = (params) => {
  return axios.fetchPost(`${order}/updateOrder`, params)
}
// 支付
// export const payMent = (params) => {
//   return axios.fetchPost(`pay/index`, params)
// }
// 支付
export const batchPay = (params) => {
  return axios.fetchPost(`order/batchPay`, params)
}
