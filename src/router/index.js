import Vue from 'vue'
import Router from 'vue-router'

import MobileRouter from"./mobile/index"
import PCRouter  from"./pc/index"
import dataBase from '../dataBase';

Vue.use(Router)

// 由于进行移动端和PC端的路由跳转，所以结合dataBase.js文件在App.vue文件做判断
 const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/shop/home'
    },
    ...MobileRouter.router,
    ...PCRouter.router
  ]
})

export default router
