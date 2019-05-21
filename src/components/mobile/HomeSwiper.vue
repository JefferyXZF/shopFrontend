<template>
  <div class="ui-swiper-app">
    <swiper :options="swiperOption" style="height: 200px">
      <swiper-slide v-for="(slide, index) in swiperSlides" :key="index">
        <router-link :to="{name: 'MobileGoodsDetail', query: {productId: slide.productId}}">
          <img :src="slide.productImage[0]" alt="" style="width: 100%">
        </router-link>
      </swiper-slide>
      <div class="swiper-pagination" slot="pagination"></div>
    </swiper>
  </div>
</template>

<script>
  import 'swiper/dist/css/swiper.css'
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  import { getSwiperGoods } from '/api/user'
export default {
  name: 'HomeSwiper',
  components: {
    swiper,
    swiperSlide
  },
  data () {
    return {
      swiperSlides: [],
      swiperOption: {
        pagination: {
          el: '.swiper-pagination'
        },
        // some swiper options...
        autoplay: {
          delay: 3000,
          disableOnInteraction: false
        },
        effect : 'coverflow',
      }
    }
  },
  mounted () {
    getSwiperGoods().then(res => { // 轮播商品
      if (res.code === '0') {
        this.swiperSlides = res.data
      }
    })
  }
}
</script>

<style lang='scss' scoped>
.ui-swiper-app img {
  height: 6rem;
}
</style>
