<template>
  <div class="layout-container">
    <y-header></y-header>
    <div class="w">
      <div class="content">
        <div class="account-sidebar">
          <div class="avatar gray-box ">
            <div v-if="userInfo">
              <img :src="userInfo.headPic ? userInfo.headPic : url"> <h5>
              {{userInfo.userName}}</h5>
            </div>
            <div class="box-inner">
              <ul class="account-nav">
                <li v-for="(item,index) in nav" :key='index' :class="{current:item.name === title}"
                    @click="tab(item)">
                  <a href="javascript:;">{{item.name}}</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div class="account-content">
          <router-view></router-view>
        </div>
      </div>
    </div>
    <y-footer></y-footer>
  </div>

</template>
<script>
  import YHeader from '/components/pc/header'
  import YFooter from '/components/pc/footer'
  import { mapState } from 'vuex'
  export default {
    name: 'user',
    components: {
      YFooter,
      YHeader
    },
    data () {
      return {
        title: '我的订单',
        nav: [
          {name: '我的订单', path: 'orderList'},
          {name: '账户资料', path: 'information'},
          {name: '收货地址', path: 'addressList'},
          {name: '我的收藏', path: 'collection'},
          {name: '我的购物车', path: 'cart'}
        ],
        editAvatar: true,
        url: '/static/images/person.jpg'
      }
    },
    computed: {
      ...mapState(['userInfo'])
    },
    methods: {
      tab (e) {
        this.$router.push({path: '/user/' + e.path})
      }
    },
    created () {
      let path = this.$route.name
      this.nav.forEach(item => {
        if (item.name === path) {
          this.title = item.name
        }
      })
    },
    watch: {
      $route (to) {
        let path = to.path.split('/')[2]
        this.nav.forEach(item => {
          if (item.path === path) {
            this.title = item.name
          }
        })
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  @import "./../../../assets/pc/style/mixin";

  .w {
    padding-top: 40px;
    max-width: 1220px;
    margin: 0 auto;
  }

  .content {
    display: flex;
    height: 100%;
  }

  .account-sidebar {
    width: 210px;
    border-radius: 6px;
    .avatar {
      padding-top: 20px;
      border-radius: 10px;
      text-align: center;
      img {
        width: 168px;
        height: 168px;
      }
      h5 {
        font-size: 18px;
        line-height: 48px;
        font-weight: 700;
      }
    }
    .account-nav {
      padding-top: 15px;
      li {
        position: relative;
        height: 48px;
        border-top: 1px solid #EBEBEB;
        line-height: 48px;
        &:hover {
          a {
            position: relative;
            z-index: 1;
            height: 50px;
            background-color: #98AFEE;
            line-height: 50px;
            color: #FFF;
          }

        }
        a {
          display: block;
        }
        &.current {
          a {
            position: relative;
            z-index: 1;
            height: 50px;
            background-color: #98AFEE;
            line-height: 50px;
            color: #FFF;
          }
        }

      }
    }
  }
  .account-content {
    margin-left: 20px;
    flex: 1;
  }


</style>
