<template>
  <div id="app">
    <router-view v-if="isRouterAlive"/>
    <msg-box></msg-box>
    <top-alert></top-alert>
  </div>
</template>

<script>
import { userInfo } from '/api/user'
import { mapMutations } from 'vuex'
import msgBox from '/components/pc/msgBox'
import TopAlert from '/components/pc/TopAlert'
export default {
  name: 'App',
  provide () { // 多层父子组件通信，实现页面刷新
    return {
      reload: this.reload
    }
  },
  components: {
    msgBox,
    TopAlert
  },
  data () {
    return {
      isRouterAlive: true, // 控制PC端页面刷新
      dataBase: dataBase
    }
  },
  mounted () {
    // 可视宽带大于 640,并且是在移动端页面才转到PC端, 从移动端转到PC端逻辑一样
    let hashUrl = location.hash
    if (dataBase.clientWidth > 760 && hashUrl.indexOf('web') > -1) {
      this.$router.push({name: "PCGoods"})
    } else {
      if (dataBase.clientWidth <= 760 && (hashUrl.indexOf('shop') > -1 || hashUrl.indexOf('user') > -1)) {
        this.$router.push({name: "MobileHome"})
      }
    }
    // 判断用户是否登录
    userInfo().then(res => {
      if (res.code === '0') {
        // 登录
        this.recordUserInfo(res.data)
      }
    })
    },
    methods: {
      ...mapMutations(['recordUserInfo']),
      reload(){
        this.isRouterAlive = false;
        this.$nextTick(function(){
          this.isRouterAlive = true;
        })
      },
    }
}
</script>

<style lang="scss" scoped>
#app {
  height: 100%;
}
</style>
