<template>
  <div class="mobile-home-app">
    <div class="ui-search-bg">
      <span class="ui-search" @click="inputSearch"><i class="iconfont icon-sousuo ui-search-icon">搜索</i></span>
      <router-link :to="{name: 'MobileLogin'}" class="ui-login" v-if="!login">登录</router-link>
    </div>
    <home-swiper class="ui-swiper"></home-swiper>
    <div class="mobile-content">
      <section v-for="(item, index) in goodsList" :key="item._id">
        <mobile-shelf :title="item.categoryName" v-if="item.status == 1">
          <div slot='right'>
            <router-link :to="{name: 'MobileCategory', query: {categoryId: item._id}}" class="ui-more">更多<i class="iconfont icon-youjiantou"></i></router-link>
          </div>
          <div slot="content" class="floors">
            <goods-card :goods="item.goodsData"></goods-card>
          </div>
        </mobile-shelf>
      </section>
    </div>
  </div>
</template>

<script>
import HomeSwiper from "/components/mobile/HomeSwiper"
import MobileShelf from "/components/mobile/MobileShelf"
import GoodsCard from "/components/mobile/GoodsCard"
import { productHome } from '/api/user'
export default {
  name: 'MobileHome',
  components: {
    HomeSwiper,
    MobileShelf,
    GoodsCard
  },
  data () {
    return {
      dataBase,
      goodsList: [],
      search: '',
      login: null
    }
  },
  mounted () {
    this.login = this.$store.state.userInfo
    this.dataBase.loading = true
    productHome().then(res => {
      this.dataBase.loading = false
      if (res.code === '0') {
        this.goodsList = res.data
      }
    })
  },
  methods: {
    inputSearch () {
      this.$router.push({name: 'MobileSearch'})
    }
  }
}
</script>

<style lang='scss' scoped>
.mobile-home-app {
  margin-bottom: 2rem;
}
.ui-search-bg {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 100;
  width: 100%;
  background-color: #efefef;
  height: 1rem;
  text-align: center;
  .ui-search {
    display: inline-block;
    width: 80%;
    background-color: #fff;
    height: .8rem;
    margin-top: .1rem;
    position: relative;
    .ui-search-icon {
      position: absolute;
      top: .1rem;
      right: 3.3rem;
      color: #ccc;
    }
  }
  .ui-login {
    position: absolute;
    right: .1rem;
    font-size: .4rem;
    line-height: 1rem;
  }
}
.ui-swiper {
  margin-top: 1rem;
}
.mobile-content {
  .ui-more {
    color: #666;
    font-size: .4rem;
  }
}
</style>
