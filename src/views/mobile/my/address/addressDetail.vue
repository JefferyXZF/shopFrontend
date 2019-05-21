<template>
    <div class="ui-address-detail">
      <address-header :title="name"></address-header>
        <div class="address">
            <div class="address-box">
                <label for="">收货人：</label>
                <input type="text" v-model="param.userName" placeholder="收货人姓名">
            </div>

             <div class="address-box">
                <label for="">手机号码：</label>
                <input type="number" v-model="param.tel" placeholder="收货人的手机号码">
            </div>

             <div class="address-box">
                <label for="">收货地址：</label>
                <input type="text" v-model="param.streetName" placeholder="收货地址">
            </div>
            <div class="address-box">
                <label for="">设为默认地址</label>
                <mt-switch v-model="param.isDefault" class="ui-switch"></mt-switch>
            </div>

        </div>

        <div class="footer">
            <a href="javascript:;" @click="save">保存地址</a>
        </div>
    </div>
</template>

<script>
import '@/assets/mobile/rem/rem.js'
import AddressHeader from '/components/mobile/common/header'
import { addressUpdate, addressAdd } from '/api/user'
import { mapState } from 'vuex'
import { Toast } from "mint-ui"
export default {
  name: 'AddressDetail',
  components: {
    AddressHeader
  },
  data () {
    return {
      dataBase,
      name: '新增地址',
      param: {
        userName: '',
        tel: '',
        streetName: '',
        isDefault: false
      },
      type: 'add'
    }
  },
  computed: {
    ...mapState(['address'])
  },
  created () {
    let addressId = this.$route.query.addressId || ''
    if (addressId && addressId.indexOf(this.address.addressId) > -1) { //
      this.param = this.address
      this.type = 'edit'
    }
  },
  methods: {
    save () {
      if (this.param.userName == "" || this.param.tel == "" || this.streetName == "" ) {
        Toast({
          message: "输入内容不能为空",
          duration: 950
        });
      } else {
        if (!(/^1[34578]\d{9}$/.test(this.param.tel))) {
          Toast('手机号码格式不对，请输入11位手机号码')
          return
        }
        if (this.type === 'add') {
          this.dataBase.loading = true
          addressAdd(this.param).then(res => {
            this.dataBase.loading = false
            if (res.code === '0') {
              Toast('添加地址成功')
              this.$router.back(-1);
            } else {
              Toast(res.msg)
            }
          })
        } else {
          this.dataBase.loading = true
          addressUpdate(this.param).then(res => {
            this.dataBase.loading = false
            if (res.code === '0') {
              Toast('地址修改成功')
              this.$router.back(-1);
            } else {
              Toast(res.msg)
            }
          })
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .ui-address-detail {
    height: 100%;
    background-color: #f4f4f4;
  }
  .address {
    padding-top: 1.45rem;
    .address-box {
        width: 100%;
        height: 1.5rem;
        line-height: 1.5rem;
        background: #fff;
        border-bottom: 1px solid #eee;

        label {
            width: 30%;
            height: 100%;
            padding-left: 0.58rem;
            font-size: 0.4rem;
            display: block;
            float: left;
        }

        input {
            width: 70%;
            font-size: 0.4rem;
        }
        .ui-switch {
          float: right;
          margin-top: .3rem;
        }
    }
}

.footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 1.3rem;
    border-top: 1px solid #e0e0e0;
    background: #ffffff;

    a {
        float: none;
        display: block;
        margin: 0.18rem auto;
        text-align: center;
        width: 95%;
        height: 0.9rem;
        line-height: 0.9rem;
        border-radius: 20px;
        font-size: 0.28rem;
        color: #fff;
        background-color: #00acff;
    }
}
</style>
