<template>
  <div id="bottom">
    <ul class="bottom-ul">
      <router-link  :to="{name: 'MobileHome'}" tag="li">
        <div class="index">
          <i class="iconfont icon-shouye_xuanzhong" style="color:#179dfe" v-if="active ==='home'"></i>
          <i class="iconfont icon-shouye2" v-else></i>
        </div>
        <span>首页</span>
      </router-link>

      <router-link :to="{name: 'MobileCategory'}" tag="li">
        <div class="index">
          <i class="iconfont icon-fenleixuanzhong" style="color:#179dfe" v-if="active ==='category'"></i>
          <i class="iconfont icon-fenlei-copy" v-else></i>
        </div>
        <span>分类</span>
      </router-link>

      <li @click="classify('cart')" class="ui-cart">
        <div class="cartlength" v-if="login">{{cartlength}}</div>
        <div class="index">
          <i class="iconfont icon-gouwuche" style="color:#179dfe" v-if="active ==='cart'"></i>
          <i class="iconfont icon-gouwuche" v-else></i>
        </div>
        <span>购物车</span>
      </li>

       <li @click="classify('me')">
        <div class="index">
          <i class="iconfont icon-wode-" style="color:#179dfe" v-if="active ==='my'"></i>
          <i class="iconfont icon-wode"  v-else></i>
        </div>
        <span>我的</span>
      </li>
    </ul>
  </div>
</template>

<script>
  import { MessageBox } from 'mint-ui';
  import { mapState } from 'vuex'
  export default {
    data(){
      return {
        active:'home',
      }
    },
    watch: {
      '$route': function (value) {
        this.active = this.$route.path.slice(value.path.lastIndexOf('/') + 1)
      }
    },
    computed: {
      ...mapState(['login', 'cartList']),
      // 计算数量
      cartlength () {
        let totalNum = 0
        this.cartList.length && this.cartList.forEach(item => {
          totalNum += (item.productNum)
        })
        return totalNum
      }
    },
    mounted(){
      this.active = this.$route.path.slice(this.$route.path.lastIndexOf('/') + 1);
    },
    methods: {
      classify (value) {
        if (this.login) {
          if (value === 'cart') {
            this.$router.push({name: 'MobileCart'})
          } else {
            this.$router.push({name: 'MobileMy'})
          }
        } else {
          this.$router.push({name: 'MobileLogin'})
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
#bottom {
  position: fixed;
  width: 100%;
  bottom: 0;
  color: #666;
  background: #f4f4f4;
  padding-bottom: .16rem;
  .bottom-ul {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 1.45rem;
    li {
      width: 25%;
      display: flex;
      justify-content: center;
      flex-direction: column;
      text-align: center;
      cursor: pointer;
      span {
        font-size: .3rem
      }
      i {
        font-size: .55rem
      }
      .router-link:hover,.router-link-active {
        color: #25b5fe;
      }
    }
    .ui-cart {
      position: relative;
      .cartlength {
        width: 16px;
        height: 18px;
        position: absolute;
        top: 6px;
        right: 22px;
        background: #f81301;
        border-radius: 50%;
        text-align: center;
        line-height: 18px;
        color: white;
        font-size: .4rem;
      }
    }
  }

}
</style>
