<template>
  <div class="ui-cart-main">
    <cart-header title="购物车"></cart-header>
    <div class="cartMain">
      <ul>
        <li v-for="(cart,index) in cartList" class="cartList" :key="cart._id">
          <!-- 购物车单选 -->
          <div class="select" @click="updateCart('check', cart)" >
            <i class="iconfont icon-xuanzekuangmoren"   v-show="cart.checked == 0"></i>
            <i class="iconfont icon-xuanzekuangxuanzhong" v-show="cart.checked == 1" style="color:#25b5fe"></i>
          </div>

          <!-- 购物车商品信息 -->
          <div class="cartImage">
            <img :src="cart.bigImage" alt="图片">
          </div>
          <div class="cartInformation">
            <div class="cartName">
              <p class="ui-name" @click="goDetail(cart.productId)">{{cart.productName}}</p>
              <a href="javascript:;" class="iconfont icon-huishouzhan7"  @click="cartdel(cart.productId)" ></a>
            </div>
            <p class="cartPrice">￥{{cart.salePrice}}</p>
          </div>

          <!-- 购物车商品数量 -->
          <div class="cartNumber">
            <a href="javascript:;" @click="updateNum(cart, -1)" class="add">-</a>
            <input type="text"   v-model="cart.productNum" readonly="readonly"/>
            <a href="javascript:;" @click="updateNum(cart, 1)" class="reduce">+</a>
          </div>
        </li>
      </ul>
    </div>

    <div class="cartImg" v-if="!cartList.length">
        <img src="/static/images/gouwuche.png" alt="购物车图片">
        <h1>购物车是空的哦，快去购物吧</h1>
        <router-link :to="{name:'MobileHome'}">逛一逛</router-link>
    </div>
    <div class="cartFooter"  v-if="cartList.length">
        <div class="checkAll" @click="checkAll" >
            <i class="iconfont icon-xuanzekuangmoren" v-show="!isCheckAll"></i>
            <i class="iconfont icon-xuanzekuangxuanzhong" v-show="isCheckAll" style="color:#25b5fe"></i>
            <span>全选</span>
        </div>

        <div class="Total">合计：<span style="font-size: 0.54rem;color:#E3211E">￥{{ checkPrice }}</span></div>

        <div class="Settlement">
            <a href="javascript:void(0);" @click="pay">结算&nbsp;({{ checkNum }})</a>
        </div>
    </div>
  </div>
</template>

<script>
import { Toast, MessageBox } from "mint-ui"
import { mapState, mapMutations } from "vuex"
import CartHeader from '/components/mobile/common/header'
import { editCartGoods, checkAllApi, delCart } from '/api/user'
import { setSessionStore } from '/utils/storage'
export default {
  name: 'MobileCart',
  data () {
    return {
      sum: 0,
      dataBase: dataBase
    }
  },
  components: {
    CartHeader
  },
  computed: {
    ...mapState(['cartList']),
    // 勾选的数量
    checkedCount () {
      return this.cartList.filter((item) => item.checked == 1).length
    },
    // 是否全选
    isCheckAll () {
      return this.checkedCount === this.cartList.length
    },
    // 选中的商品数量
    checkNum () {
      return this.cartList.reduce((accumulator, item) => item.checked == 1 ? accumulator + item.productNum : accumulator, 0)
    },
    // 选中的总价格
    checkPrice () {
      return this.cartList.reduce((a, item) => item.checked == 1 ? a + (item.productNum * item.salePrice) : a, 0)
    },
  },
  methods: {
    ...mapMutations([ 'editCart', 'selectAllCart' ]),
    updateCart (type, item) {
        if (type && item) {
          let {productId, productNum, checked} = item
          // 勾选
          if (type === 'check') {
            let newChecked = checked == 1 ? 0 : 1
            this._cartEdit(productId, productNum, newChecked)
          }
        } else {
          console.log('缺少所需参数')
        }
    },
    // 修改购物车
    _cartEdit (productId, productNum, checked) {
      this.dataBase.loading = true
      editCartGoods( // 从数据库中修改购物车
        {
          productId,
          productNum,
          checked
        }
      ).then(res => { // 同步状态
      this.dataBase.loading = false
        if (res.code === '0') {
          this.editCart(
            {
              productId,
              productNum,
              checked
            }
          )
        } else {
          Toast(res.msg)
        }
      })
    },
    // 全选
    checkAll () {
      this.dataBase.loading = true
      let check = this.isCheckAll ? 0 : 1
      checkAllApi({checkAll: check}).then(res => {
        this.dataBase.loading = false
        if (res.code === '0') {
          this.selectAllCart({checked: check})
        } else {
          Toast(res.msg)
        }
      })
    },
    // 删除整条购物车
    cartdel (productId) {
      MessageBox.confirm('确定从购物车删除此商品吗？').then(action => {
        this.dataBase.loading = true
        delCart({productId}).then(res => {
          this.dataBase.loading = false
        if (res.code === '0') {
          this.editCart({productId})
        }
      })
      }).catch(res => {return false});
    },
    updateNum (item, type) {
      let {productId, productNum, checked} = item
      if (type < 0 && productNum > 1) {
        productNum -= 1
      } else if (type > 0) {
        productNum += 1
      } else {
        return;
      }
      this._cartEdit(productId, productNum, checked)
    },
    pay (value) {
      if (this.checkNum == 0) {
        Toast('请选择要购买的商品')
      } else {
      this.$router.push({name: 'MobileCheckOrder'})
      }
    },
    goDetail (id) {
      this.$router.push({name: 'MobileGoodsDetail', query: {productId: id}})
    }
  }
}
</script>

<style lang='scss' scoped>
.select {
  float: left;
  margin-top: 1.5rem;
  padding-left: 0.5rem;
}
.select i {
  font-size: 0.53rem;
}
.checkAll {
  width: 24%;
  line-height: 1.18rem;
}
.checkAll i {
  font-size: 0.53rem;
  padding-left: .5rem;
}
.cart {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 999;
  top: 0;
  left: 0;
  background: #f4f4f4;
}
.cartheader {
  position: fixed;
  width: 100%;
  box-shadow: 0 0 10px #cecece;
  height: 1.3rem;
  line-height: 1.3rem;
  font-size: 0.35rem;
  padding-left: 0.3rem;
  background: white;
  top: 0;
  font-size: 0.41rem;
}
.cartheader i {
  display: block;
  float: left;
  height: 50px;
  font-size: 0.71rem;
  color: black;
  width: 0.9rem;
}
.cartList {
  width: 100%;
  height: 4rem;
  background: white;
  margin-top: 0.04rem;
  overflow: hidden;
}
.cartMain {
  /* margin-top: 1.3rem; */
  margin-bottom: 3.24rem;
  padding-top: 1.3rem;
}
.cartMain ul li {
  list-style: none;
}
.cartImage img {
  width: 2.6rem;
  height: 2.8rem;
}
.cartImage {
  float: left;
  padding: 0.5rem 0.3rem;
}
.cartInformation {
  width: 7.7rem;
  font-size: 0.35rem;
  padding-left: 0.3rem;
  padding-top: 0.6rem;
}
.cartPrice {
  color: red;
  margin-top: 0.2rem;
  font-size: 0.4rem;
}

.cartNumber {
  float: left;
  margin-top: 0.3rem;
}
.cartNumber .add,
.cartNumber .reduce {
  display: block;
  width: 0.75rem;
  height: 0.75rem;
  line-height: 0.75rem;
  border: 1px solid #dedede;
  float: left;
  color: #b2b2b2;
  text-align: center;
  font-size: 0.5rem;
}
.cartNumber input {
  width: 0.96rem;
  height: 0.76rem;
  float: left;
  text-align: center;
  border: 1px solid #dedede;
}
.cartNumber .add {
  border-right: none;
}
.cartNumber .reduce {
  border-left: none;
}
.cartFooter {
  position: fixed;
  width: 100%;
  font-size: 0.35rem;
  background: white;
  bottom: 1.6rem;
  display: flex;
  border-top: 1px solid #f4f4f4;
}
.cartImg img {
  width: 4.4rem;
  height: 5.2rem;
  display: block;
  margin: auto;
  padding-top: 1.5rem;
}
.cartImg a {
  display: block;
  text-align: center;
  margin: 0.8rem auto;
  width: 110px;
  height: 37px;
  line-height: 37px;
  border-radius: 4px;
  text-align: center;
  background: #e0524b;
  color: white;
  font-weight: 800;
  font-size: 0.5rem;
}
.cartName {
  width: 8rem;
  font-size: 0.36rem;
  position: relative;
  .ui-name {
    height: 1rem;
    overflow: hidden;
  }
}
.cartName a {
  position: absolute;
  right: -0.8rem;
  color: black;
  font-size: 0.57rem;
  top: 1rem;
}
.cartImg h1 {
  margin-top: 0.5rem;
  text-align: center;
  color: #959595;
  font-size: 0.6rem;
}
._box {
  width: 63%;
  height: 100%;
  float: left;
}
.Total {
    flex: 1;
    text-align: right;
    line-height: 1.18rem;
    font-size: 0.35rem;
    padding-right: .4rem;
}
.Settlement {
  width: 20%;
  height: 80%;
  background: #f81200;
  margin-top: .1rem;
  border-radius: 40px;
  margin-right: 0.3rem;
}
.Settlementtwo {
  width: 50%;
  height: 100%;
  background: #e3211e;
}
.Settlement a,
.Settlementtwo a {
  color: white;
  text-align: center;
  line-height: .98rem;
  display: block;
  font-size: 0.35rem;
}
</style>
