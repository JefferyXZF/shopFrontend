<template>
    <div class="ui-address-ui">
        <address-header :title="title"></address-header>
        <div class="Address-box">
            <div class="address-one">
                <p class="left">配送地址</p>
                <p class="right" @click="addAddress">+添加地址</p>
            </div>
            <div class="pay-address" v-for="(list,index) in addrList" :key="index">
                <!-- 购物车单选 -->
                <div class="select" @click="chooseAddress(list)" v-if="isShow">
                  <i
                    class="iconfont icon-xuanzekuangxuanzhong"
                    v-if="addressIndex == index"
                    style="color:#25b5fe"></i>
                  <i class="iconfont  icon-xuanzekuangmoren" v-else=""></i>
                </div>
                <p class="address-box">
                    <span class="name">收货人：{{list.userName}}</span>
                    <span class="phone">{{list.tel}}</span>
                </p>
                <p class="address-details"><span v-if="list.isDefault" class="ui-default">默认地址</span>{{list.streetName}}</p>
                <div class="address-operation">
                    <p class="address-operation-box">
                        <i class="iconfont icon-bianji" @click="update(list)"></i>
                        <i class="iconfont icon-lajitong" @click="delAddr(list.addressId)"></i>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import '@/assets/mobile/rem/rem.js'
import AddressHeader from '/components/mobile/common/header'
import { addressList, addressDel } from '/api/user'
import { Toast, MessageBox } from "mint-ui"
import { mapMutations } from "vuex"
export default {
  name: 'MobileAddress',
  components: {
    AddressHeader
  },
  data () {
    return {
      dataBase,
      addrList: [],
      addressIndex: '2333hh',
      isShow: 0,
      title: '管理收货地址'
    }
  },
  created () {
    this.isShow = this.$route.query.type
    this.isShow ? this.title = '选择收货地址' : ''
    this.getAddressList()
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    ...mapMutations(['updateAddress', 'updateCheckAddress']),
    addAddress () {
      this.$router.push({name: 'MobileAddressDetail'})
    },
    update (item) {
      this.updateAddress(item)
      this.$router.push({name: 'MobileAddressDetail', query: {addressId: item.addressId}})
    },
    delAddr (addressId) {
      MessageBox.confirm('确定删除该地址吗？').then(action => {
        this.dataBase.loading = true
        addressDel({addressId}).then(res => {
          this.dataBase.loading = false
        if (res.code === '0') {
          this.getAddressList()
        }
      })
      }).catch(res => {return false});
    },
    getAddressList () {
      this.dataBase.loading = true
      addressList().then(res => {
        this.dataBase.loading = false
        if (res.code === '0') {
          let data = res.data || []
          data.length > 0 ? this.addrList = data : this.addrList = []
        } else {
          Toast(res.msg)
        }
      })
    },
    chooseAddress (item) {
      this.updateCheckAddress(item)
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
  .ui-address-ui {
    background-color: #f4f4f4;
  }
  .Address-box {
    padding-top: 1.45rem;

    .address-one {
        width: 100%;
        height: 1.2rem;
        line-height: 1.6rem;
        background: #ffffff;
        margin-bottom: 0.2rem;
        border-top: 1px solid #eaeaea;

        .left {
            float: left;
            margin-left: 0.6rem;
            font-size: 0.37rem;
        }

        .right {
            float: right;
            margin-right: 0.6rem;
            font-size: 0.37rem;
            color: #00acff;
        }
    }

    .pay-address {
        position: relative;
        padding-left: .2rem;
        width: 100%;
        height: 3.5rem;
        background: #ffffff;
        background-size: 1.6rem;
        margin-top: 0.3rem;
        display: block;
        .select {
          position: absolute;
          left: .1rem;
          top: .6rem;
        }
        .address-box {
            width: 87%;
            margin: auto;
            font-size: 0.4rem;
            padding-top: 0.3rem;
            padding-bottom: 0.3rem;

            .phone {
                float: right;
            }
        }

        .address-details {
            width: 87%;
            height: 1rem;
            margin: auto;
            color: #666;
            font-size: 0.38rem;
            span {
              display: inline-block;
              padding: .1rem;
              border: 1px solid orange;
              color: orange;
              margin: 0 6px 4px 0;
            }
        }

        .address-operation {
            width: 100%;
            height: 1rem;
            line-height: 1rem;
            margin-top: 0.3rem;

            .address-operation-box {
                width: 100%;
                border-top: 1px solid #eaeaea;

                i {
                    float: right;
                    font-size: 0.5rem;
                    margin-right: 1.2rem;
                    color: #a3a3a3;
                }
            }
        }
    }
}
</style>
