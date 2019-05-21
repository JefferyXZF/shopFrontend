
import router from './router'
import { getToken } from '@/utils/auth' // getToken from cookie
// 不需要登陆的页面 => 白名单
const whiteList = ['/shop/home/goods', '/shop/category', '/user/login', '/shop/detail', '/shop/search', '/web',
'/web/home', '/web/category', '/web/cart', '/web/my', '/web/goodsDetail', '/web/login', '/web/search']
router.beforeEach((to, from, next) => {
  if (getToken()) {
     if (to.path === '/user/login') {
       next('/')
     } else {
       next()
     }
  } else {
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else { // 否则全部重定向到登录页
      if (dataBase.clientWidth < 760) {
        next('/web/login') // 移动端登录页
      } else {
        next('/user/login') // PC端登录页
      }
    }
  }
})

