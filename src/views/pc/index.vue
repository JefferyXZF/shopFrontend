<template>
  <div class="ui-app">
    <y-header></y-header>
    <nav-bar
      :goodsCategory="cateogry"
      @onCategoryList="chooseCategory"></nav-bar>
    <router-view v-if="isActive"></router-view>
    <y-footer></y-footer>
  </div>
</template>

<script>
import YHeader from "/components/pc/header";
import NavBar from "/components/pc/NavBar";
import YFooter from "/components/pc/footer";
import { mapState } from 'vuex'
import { userInfo, getCategoryList } from '/api/user'
export default {
  components: {
    YHeader,
    NavBar,
    YFooter
  },
  data() {
    return {
      cateogry: [{
        _id: 1,
        status: 1,
        categoryName: '全部'
      },{
        _id: 2,
        status: 1,
        categoryName: '首页'
      }],
      isActive: true
    }
  },
  computed: {
    ...mapState(['login'])
  },
  created() {
    getCategoryList().then(res => {
      if (res.code === '0') {
        this.cateogry.push(...res.data)
      } else {
        alert(res.msg)
      }
    })
  },
  methods: {
    chooseCategory (item) {
      if (item._id == 1) { // 全部
        this.$router.push({name: 'PCGoods'})
      }else if (item._id == 2) { // 首页
        setTimeout(() =>{
          this.isActive = true
          this.$router.push({
              name: 'PCGoodsCategory'
            })
        },1)
        this.isActive = false
      } else {
        setTimeout(() =>{
          this.isActive = true
          this.$router.push({
              name: 'PCGoodsCategory',
              query: {
                categoryId: item._id
              }
            })
        },1)
        this.isActive = false
      }
    }
  }
}
</script>

<style>
.ui-app {
  background-color: #E5E5E5;
}
</style>
