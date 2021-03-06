<template>
  <div>
    <y-shelf title="收货地址">
      <span slot="right"><y-button text="添加收货地址" style="margin: 0" @btnClick="update()"></y-button></span>
      <div slot="content">
        <div v-if="addList.length">
          <div class="address-item" v-for="(item,i) in addList" :key="i">
            <div class="name">{{item.userName}}</div>
            <div class="address-msg">{{item.streetName}}</div>
            <div class="telephone">{{item.tel}}</div>
            <div class="defalut">
              <a @click="changeDef(item)"
                 href="javascript:;"
                 v-text="item.isDefault?'( 默认地址 )':'设为默认'"
                 :class="{'defalut-address':item.isDefault}"></a>
            </div>
            <div class="operation">
              <a href="javascript:;" @click="update(item)">修改</a>
              <a href="javascript:;" :data-id="item.addressId" @click="del(item.addressId,i)">删除</a>
            </div>
          </div>
        </div>
        <div v-else>
          <div style="padding: 80px 0;text-align: center">
            <div style="font-size: 20px">你还未添加收货地址</div>
            <div style="margin: 20px ">
              <y-button text="添加地址" @btnClick="update()"></y-button>
            </div>
          </div>
        </div>
      </div>
    </y-shelf>
    <y-popup :open="popupOpen" @close='popupOpen=false' :title="popupTitle">
      <div slot="content" class="md" :data-id="msg.addressId">
        <div>
          <input type="text" placeholder="收货人姓名" v-model="msg.userName">
        </div>
        <div>
          <input type="number" placeholder="手机号码" v-model="msg.tel">
        </div>
        <div>
          <input type="text" placeholder="收货地址" v-model="msg.streetName">
        </div>
        <div>
          <span><input type="checkbox" v-model="msg.isDefault" style="margin-right: 5px;">设为默认</span>
        </div>
        <y-button text='保存'
                  class="btn"
                  :classStyle="btnHighlight?'main-btn':'disabled-btn'"
                  @btnClick="save({addressId:msg.addressId,userName:msg.userName,tel:msg.tel,streetName:msg.streetName,isDefault:msg.isDefault})">
        </y-button>
      </div>
    </y-popup>
  </div>
</template>
<script>
  import { addressList, addressUpdate, addressAdd, addressDel } from '/api/user'
  import YButton from '/components/pc/YButton'
  import YPopup from '/components/pc/user/YPopup'
  import YShelf from '/components/pc/user/Shelf'
  export default {
    data () {
      return {
        dataBase,
        addList: [],
        popupOpen: false,
        popupTitle: '管理收货地址',
        msg: {
          addressId: '',
          userName: '',
          tel: '',
          streetName: '',
          isDefault: false
        }
      }
    },
    computed: {
      btnHighlight () {
        let msg = this.msg
        return msg.userName && msg.tel && msg.streetName
      }
    },
    methods: {
      $addressList () { // 获取地址列表
        this.dataBase.loading = true
        addressList().then(res => {
          this.dataBase.loading = false
          if (res.code === '0') {
            let data = res.data || []
            if (data.length > 0) {
              this.addList = data
              this.addressId = data[0].addressId || '1'
            } else {
              this.addList = []
            }
          } else {
            this.dataBase.top_alert(res.msg, false, 2000)
          }
        })
      },
      $addressUpdate (params) { // 修改收货地址
        this.dataBase.loading = true
        addressUpdate(params).then(res => {
          this.dataBase.loading = false
          if (res.code === '0') {
            this.$addressList()
          } else {
            this.dataBase.top_alert(res.msg, false, 2000)
          }
        })
      },
      $addressAdd (params) { // 添加收货地址
        this.dataBase.loading = true
        addressAdd(params).then(res => {
          this.dataBase.loading = false
          if (res.code === '0') {
            this.$addressList()
          } else {
            this.dataBase.top_alert(res.msg, false, 2000)
          }
        })
      },
      changeDef (item) { // 修改默认地址
        if (!item.isDefault) {
          item.isDefault = true
          this.$addressUpdate(item)
        }
        return false
      },
      // 保存
      save (item) {
        if (!(/^1[34578]\d{9}$/.test(this.msg.tel))) {
          this.dataBase.top_alert('手机号码格式不对，请输入11位手机号码', false, 2000)
          return
        }
        if (item.addressId) {
          this.$addressUpdate(item)
        } else {
          delete item.addressId
          this.$addressAdd(item)
        }
        this.popupOpen = false
      },
      // 删除
      del (addressId, i) {
        this.dataBase.alert('提示', '确定删除该收货地址么？',
          () => {
            this.dataBase.loading = true
            addressDel({addressId}).then(res => {
              this.dataBase.loading = false
              if (res.code === '0') {
                this.addList.splice(i, 1)
              } else {
                this.dataBase.top_alert('删除失败', false, 2000)
              }
            })
          }, '确定', true, '', '取消')
      },
      // 修改
      update (item) {
        this.popupOpen = true
        if (item) {
          this.popupTitle = '管理收货地址'
          this.msg.userName = item.userName
          this.msg.tel = item.tel
          this.msg.streetName = item.streetName
          this.msg.isDefault = item.isDefault
          this.msg.addressId = item.addressId
        } else {
          this.popupTitle = '新增收货地址'
          this.msg.userName = ''
          this.msg.tel = ''
          this.msg.streetName = ''
          this.msg.isDefault = false
          this.msg.addressId = ''
        }
      }
    },
    created () {
      this.$addressList()
    },
    components: {
      YButton,
      YPopup,
      YShelf
    }
  }
</script>
<style scoped lang="scss">
  .address-item {
    display: flex;
    align-items: center;
    height: 115px;
    text-align: center;
    .name {
      width: 106px;
    }
    .address-msg {
      flex: 1;
    }
    .telephone {
      width: 160px;
    }
    .defalut {
      width: 80px;
      > a {
        text-align: center;
        /*display: none;*/
      }
    }
    .operation {
      width: 135px;
      a {
        padding: 10px 5px;
      }
    }
    &:hover {
      .defalut > a {
        display: block;
      }
    }
  }

  .address-item + .address-item {
    border-top: 1px solid #CFCFCF;
  }

  .defalut-address {
    color: #626262;
    display: block;
    pointer-events: none;
    cursor: default;
  }

  .md {
    > div {
      text-align: left;
      margin-bottom: 15px;
      > input {
        width: 100%;
        height: 50px;
        font-size: 18px;
        padding: 10px 20px;
        border: 1px solid #ccc;
        border-radius: 6px;
        box-shadow: 0 3px 5px -4px rgba(0, 0, 0, .4) inset, -1px 0 3px -2px rgba(0, 0, 0, .1) inset;
        line-height: 46px;
      }
    }
  }

  .btn {
    margin: 0;
    width: 100%;
    height: 50px;
    font-size: 14px;
    line-height: 48px
  }
</style>
