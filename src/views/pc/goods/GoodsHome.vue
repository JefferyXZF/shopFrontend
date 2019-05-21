<template>
  <div>
    <div class="banner w">
      <!-- <div class="bg" ref="bg"
           @mouseover="bgOver($refs.bg)"
           @mousemove="bgMove($refs.bg,$event)"
           @mouseout="bgOut($refs.bg)">
        <span class="img a"></span>
        <span class="text b">以傲慢与偏执<br/>回敬傲慢与偏见</span>
        <span class="copyright c">code by qingjin.me | picture from t.tt</span>
      </div> -->
      <!-- Slider main container -->
      <swiper :options="swiperOption" style="height: 100%">
        <swiper-slide v-for="(slide, index) in swiperSlides" :key="index">
          <router-link target="_blank" :to="{name: 'PCGoodsDetail', query:{productId: slide.productId}}">
            <img :src="slide.productImage[0]" alt="" style="width: 100%">
          </router-link>
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
    </div>

    <section class="w mt30 clearfix" v-for="item in goodsList" :key="item.categoryId">
      <y-shelf :title="item.categoryName" v-if="item.status == 1">
        <div slot='right'>
          <router-link :to="{name: 'PCGoodsCategory', query: {categoryId: item._id}}">更多>></router-link>
        </div>
        <div slot="content" class="floors">
          <goods-card :goods="goodsItem" v-for="goodsItem in item.goodsData" :key="goodsItem.productId"></goods-card>
        </div>
      </y-shelf>
    </section>
  </div>
</template>
<script>
  import 'swiper/dist/css/swiper.css'
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  import { productHome, getSwiperGoods } from '/api/user'
  import YShelf from '/components/pc/user/Shelf'
  import GoodsCard from '/components/pc/goodsCard'
  import { mapMutations } from 'vuex';
  export default {
    data () {
      return {
        dataBase: dataBase,
        banner: {},
        bgOpt: {
          offsetLeft: 0,
          offsetTop: 0,
          offsetWidth: 0,
          offsetHeight: 0
        },
        goodsList: [],
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
          // mousewheel: true,
        }
      }
    },
    methods: {
      ...mapMutations(['addGoodsList']),
      category (item) {
        // location.href = '/shop/catetory?categoryId=' + item.categoryId
        this.$router.push({path: '/shop/category',query:{categoryId: item._id}})
      },
      // 鼠标移入
      bgOver (event) {
        // 获取移入时的位置
        const {offsetLeft, offsetTop, offsetWidth, offsetHeight} = event
        this.bgOpt.offsetLeft = offsetLeft
        this.bgOpt.offsetTop = offsetTop
        this.bgOpt.offsetWidth = offsetWidth
        this.bgOpt.offsetHeight = offsetHeight
      },
      // 鼠标移动
      bgMove (dom, eve) {
        const {offsetLeft, offsetTop, offsetWidth, offsetHeight} = this.bgOpt
        let X, Y
        let mouseX = eve.pageX - offsetLeft
        let mouseY = eve.pageY - offsetTop
        if (mouseX > offsetWidth / 2) {
          X = mouseX - (offsetWidth / 2)
        } else {
          X = mouseX - (offsetWidth / 2)
        }
        if (mouseY > offsetHeight / 2) {
          Y = offsetHeight / 2 - mouseY
        } else {
          Y = offsetHeight / 2 - mouseY
        }
        dom.style['-webkit-transform'] = `rotateY(${X / 50}deg) rotateX(${Y / 50}deg)`
        dom.style.transform = `rotateY(${X / 50}deg) rotateX(${Y / 50}deg)`
      },
      // 鼠标移除
      bgOut (dom) {
        dom.style.transform = 'rotateY(0deg) rotateX(0deg)'
        dom.style['-webkit-transform'] = 'rotateY(0deg) rotateX(0deg)'
      }
    },
    mounted () {
      getSwiperGoods().then(res => { // 轮播商品
        if (res.code === '0') {
          this.swiperSlides = res.data
        }
      })
      this.dataBase.loading = true
      productHome().then(res => {
        this.dataBase.loading = false
        if (res.code === '0') {
          this.addGoodsList(res.data)
          this.goodsList = res.data
        }
      })
    },
    components: {
      YShelf,
      GoodsCard,
      swiper,
      swiperSlide
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  .w {
    width: 1220px;
    margin: 0 auto;
  }
  .banner, .banner span, .banner div {
    font-family: "Microsoft YaHei";
    transition: all .3s;
    -webkit-transition: all .3s;
    transition-timing-function: linear;
    -webkit-transition-timing-function: linear;
  }

  .banner {
    perspective: 3000px;
    position: relative;
    z-index: 19;
    height: 600px;
    margin-top: 20px;
    cursor: pointer;
  }

  .bg {
    position: relative;
    width: 1220px;
    height: 500px;
    margin: 20px auto;
    background: url("/static/images/banner-3d-item.png") center no-repeat;
    background-size: 100% 100%;
    border-radius: 10px;
    transform-style: preserve-3d;
    -webkit-transform-origin: 50% 50%;
    -webkit-transform: rotateY(0deg) rotateX(0deg);
  }

  .img {
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    bottom: 5px;
    left: 0;
    background: url("/static/images/banner-3d.png") center no-repeat;
    background-size: 95% 100%;
  }

  .text {
    position: absolute;
    top: 20%;
    right: 10%;
    font-size: 30px;
    color: #fff;
    text-align: right;
    font-weight: lighter;
  }

  .copyright {
    position: absolute;
    bottom: 10%;
    right: 10%;
    font-size: 10px;
    color: #fff;
    text-align: right;
    font-weight: lighter;
  }

  .a {
    -webkit-transform: translateZ(40px);
  }

  .b {
    -webkit-transform: translateZ(20px);
  }

  .c {
    -webkit-transform: translateZ(0px);
  }

  .sk_item {
    width: 170px;
    height: 225px;
    padding: 0 14px 0 15px;
    > div {
      width: 100%;
    }
    a {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      transition: all .3s;
      &:hover {
        transform: translateY(-5px);
      }
    }
    img {
      width: 130px;
      height: 130px;
      margin: 17px 0;
    }
    .sk_item_name {
      color: #999;
      display: block;
      max-width: 100%;
      _width: 100%;
      overflow: hidden;
      font-size: 12px;
      text-align: left;
      height: 32px;
      line-height: 16px;
      word-wrap: break-word;
      word-break: break-all;
    }
    .sk_item_price {
      padding: 3px 0;
      height: 25px;
    }
    .price_new {
      font-size: 18px;
      font-weight: 700;
      margin-right: 8px;
      color: #f10214;
    }
    .price_origin {
      color: #999;
      font-size: 12px;
    }
  }

  .box {
    overflow: hidden;
    position: relative;
    z-index: 0;
    margin-top: 29px;
    box-sizing: border-box;
    border: 1px solid rgba(0, 0, 0, .14);
    border-radius: 8px;
    background: #fff;
    box-shadow: 0 3px 8px -6px rgba(0, 0, 0, .1);

  }

  ul.box {
    display: flex;
    li {
      flex: 1;
      img {
        display: block;
        width: 305px;
        height: 200px;
      }
    }
  }

  .mt30 {
    margin-top: 30px;
  }

  .hot {
    display: flex;
    > div {
      flex: 1;
      width: 25%;
    }
  }

  .floors {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    padding: 10px 0px;
    .imgbanner {
      width: 50%;
      height: 430px;
    }
    img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }

</style>
