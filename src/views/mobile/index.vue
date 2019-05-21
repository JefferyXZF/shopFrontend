<template>
  <div>
    <router-view></router-view>
    <home-footer></home-footer>
  </div>
</template>

<script>
import '@/assets/mobile/rem/rem.js'
import HomeFooter from '/components/mobile/footer'
export default {
  name: 'MobileIndex',
  components: {
    HomeFooter
  },

}
</script>

<style lang='scss' scoped>

</style>
