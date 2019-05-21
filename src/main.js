
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './storage'
import './permission';
import './assets/font/iconfont.css'
import VueLazyload from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'
import '/assets/common/style/reset.scss'
import dataBase from './dataBase'
window.dataBase = dataBase
Vue.config.productionTip = false
dataBase.clientWidth = document.documentElement.clientWidth || document.body.clientWidth;

Vue.use(infiniteScroll)
Vue.use(VueLazyload, {
  // preLoad: 1.3,
  // error: 'dist/error.png',
  loading: '/static/images/load.gif'
  // attempt: 1
})
//引入UI组件
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
Vue.use(MintUI)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  store,
  template: '<App/>'
})
