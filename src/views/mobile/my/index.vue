<template>
  <div class="ui-my-main">
    <my-header title="个人中心"></my-header>
    <div class="container">
      <div class="container-bj">
          <img :src="userInfo.headPic ? userInfo.headPic : url">
          <span>{{ userInfo.userName }}</span>
          <p>相信自己，你将是下一个奇迹</p>
      </div>

     <div class="container-order">
         <div class="container-order-1">
             <p class="left">我的订单</p>
             <p class="right" @click="order">全部订单 <i class="iconfont icon-youjiantou"></i></p>
         </div>
         <div class="container-order-2">
             <p class="ui-order" v-for="(list, index) in container" :key="index">
               <router-link :to="{name: 'MobileOrderList'}">
                <img :src="list.img">
               </router-link>
                <span>{{list.name}}</span>
             </p>
         </div>
     </div>

      <div class="container-con" id="transition">
          <router-link :to="{name: 'MobileCollection'}" class="con">
                 <div class="con-left">
                  <i class="iconfont icon-collection"></i>
                  <span>我的收藏</span>
              </div>
              <div class="con-rigth">
                  <i class="iconfont icon-youjiantou"></i>
              </div>
          </router-link>

            <router-link :to="{name: 'MobileAddressList'}" class="con" id="transition">
                 <div class="con-left">
                  <i class="iconfont icon-gouwuche"></i>
                  <span>我的收货地址</span>
              </div>
              <div class="con-rigth">
                  <i class="iconfont icon-youjiantou"></i>
              </div>
          </router-link>
      </div>
      <p @click="loginOut" class="ui-login-out">退出登录</p>
    </div>
  </div>
</template>

<script>
import MyHeader from '/components/mobile/common/header'
import { loginOut } from '/api/user'
import { removeStore } from '/utils/storage'
import { MessageBox } from "mint-ui"
import { mapState } from 'vuex'
export default {
  name: 'My',
  components: {
    MyHeader
  },
  data () {
    return {
      container:[
        {
            img:"/static/images/111.png",
            name:"待付款"
        },
          {
            img:"/static/images/222.png",
            name:"待收货"
        },
          {
            img:"/static/images/333.png",
            name:"待评价"
        }, {
            img:"/static/images/444.png",
            name:"退货/退款"
        },
      ],
      url: '/static/images/person.jpg'
    }
  },
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    order () {
      this.$router.push({name: 'MobileOrderList'})
    },
    // 退出登陆
    loginOut () {
      MessageBox.confirm('确定退出登录？').then(action => {
        loginOut().then(res => {
          if (res.code === '0') {
            removeStore('buyCart')
            removeStore('userInfo')
            this.$store.commit('resetInfo')
            this.$router.push({name: 'MobileHome'})
          }
        })
      }).catch(res => {return false});
    }
  }
}
</script>

<style lang='scss' scoped>
.container-order{
    width: 100%;
    height: 3.5rem;
    background: white;
    display: block;
    margin-bottom: .15rem;
    margin-top: .15rem;
    font-size: 0.35rem;
    .container-order-1 {
        width: 100%;
        height: 1.5rem;
        .left{
            float: left;
            display: block;
            line-height: 1.5rem;
            margin-left: .5rem;
            font-size: 0.4rem;
        }
        .right {
            float: right;
            line-height: 1.5rem;
            margin-right: .3rem;
            font-size: 0.4rem;
        }
    }
    .container-order-2{
      width: 100%;
      height: 1.5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      .ui-order {
        width: 25%;
        display: flex;
        flex-direction: column;
        margin-top: .3rem;
        text-align: center;
        img{
          width: .8rem;
          height: .8rem;
          margin: auto;
        }
        span{
          text-align: center;
          padding-top: .3rem;
        }
      }
    }
}
.t{
    background-image: url('/static/images/t.png');
}

.container {
    width: 100%;
    height: 5rem;
    position: absolute;
    top: 1.45rem;
    .container-bj {
      width: 100%;
      height: 100%;
      background: url('/static/images/bj.png') no-repeat;
      background-size: 100% 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;

      img {
        width: 2.3rem;
        height: 2.3rem;
        border-radius: 50%;
      }

      span {
        color: #ffffff;
        font-size: 0.5rem;
      }

      p {
        font-size: 0.35rem;
        color: #ffffff;
      }
    }
    .container-integral{
      width: 100%;
      height: 2rem;
      background: #ffffff;
      display: flex;
      justify-content: center
      p {
        width: 33%;
        height: 100%;
        font-size: .36rem;
        line-height: .6rem;
        font-weight: 500;
        float: left;
        display: flex;
        flex-direction: column;
        text-align: center;
        justify-content: center;
      }
    }

    .container-con {
      margin-bottom: 1.45rem;
      .con {
        display: flex;
        justify-content: space-between;
        width: 100%;
        height: 1.41rem;
        background: #ffffff;
        color: #666;
        border-bottom: 1px solid #f0f0f0;
        .con-left {
          line-height: 1.3rem;
          padding-left: 0.47rem;
          i {
            font-size: 0.5rem;
          }
          span {
            font-size: 0.37rem;
            padding-left: 0.1rem;
          }
        }
        .con-rigth {
          line-height: 1.3rem;
          padding-right: 0.4rem;
        }
      }
    }
}
.ui-login-out {
  font-size: .4rem;
  background-color: red;
  height: 1rem;
  line-height: 1rem;
  text-align: center;
  color: #fff;
  margin: 2rem;
}
</style>
