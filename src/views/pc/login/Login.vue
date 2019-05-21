<template>
  <div class="login v2">
    <div class="wrapper">
      <div class="dialog dialog-shadow" style="display: block; margin-top: -362px;">
        <div class="title" v-if="loginPage">
          <div class="logo"></div>
          <h4>服饰商城登录官网</h4>
          </div>
        <div v-if="loginPage" class="content">
          <ul class="common-form">
            <li class="username border-1p">
              <div class="input">
                <input type="text" v-model.trim="ruleForm.userName" placeholder="账号">
              </div>
            </li>
            <li>
              <div class="input">
                <input type="password" v-model.trim="ruleForm.userPwd" @keyup.enter="login" placeholder="密码">
              </div>
            </li>
            <li style="text-align: right" class="pr">
              <a href="javascript:;" style="padding: 0 5px" @click="loginPage = false">注册帐号</a>
            </li>
          </ul>
          <!--登陆-->
          <div>
            <y-button text="登陆" :classStyle="isLoginOk" @btnClick="login" class="btn"></y-button>
          </div>
        </div>
        <div class="registered" v-else>
          <h4>注册帐号</h4>
          <div class="content" style="margin-top: 20px;">
            <ul class="common-form">
              <li class="username border-1p">
                <div class="input">
                  <input type="text"
                         v-model.trim="registered.userName" placeholder="账号">
                </div>
              </li>
              <li>
                <div class="input">
                  <input type="password"
                         v-model.trim="registered.userPwd"
                         placeholder="密码">
                </div>
              </li>
              <li>
                <div class="input">
                  <input type="password" v-model.trim="registered.userPwd2" placeholder="重复密码">
                </div>
              </li>
            </ul>
            <div>
              <y-button :classStyle="isRegOk" text="注册" class="btn" @btnClick="register"></y-button>
            </div>
            <ul class="common-form pr">
              <li style="text-align: center;line-height: 48px;margin-bottom: 0;">
                <span>如果您已拥有帐号，则可在此</span>
                <a href="javascript:;"
                   style="margin: 0 5px"
                   @click="loginPage = true">登陆</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import YFooter from '/components/pc/footer'
  import YButton from '/components/pc/YButton'
  import { userLogin, userRegister, userInfo } from '/api/user'
  import { addCartBatch } from '/api/user'
  import { getStore, removeStore } from '/utils/storage'
  import { mapMutations } from 'vuex';

  export default {
    data () {
      return {
        dataBase,
        cart: [],
        loginPage: true,
        ruleForm: {
          userName: '',
          userPwd: '',
          errMsg: ''
        },
        registered: {
          userName: '',
          userPwd: '',
          userPwd2: '',
          errMsg: ''
        }
      }
    },
    computed: {
      // 可点击注册
      isRegOk (rules) {
        const {userPwd, userPwd2, userName} = this.registered
        return userPwd && userPwd2 && userName ? 'main-btn' : 'disabled-btn'
      },
      isLoginOk () {
        const {userPwd, userName} = this.ruleForm
        return userPwd && userName ? 'main-btn' : 'disabled-btn'
      }
    },
    methods: {
      ...mapMutations(['recordUserInfo']),
      // 登陆时将本地的添加到用户购物车
      addCardFromStore () {
        // let cartArr = []
        let locaCart = JSON.parse(getStore('buyCart'))
        if (locaCart && locaCart.length > 0) {
          this.cart = locaCart
        }
      },
      login () {
        const {userName, userPwd} = this.ruleForm
        if (!userName || !userPwd) {
          this.dataBase.top_alert('账号或者密码不能为空', false, 2000)
        } else {
          let params = {userName, userPwd}
          this.dataBase.loading = true
          userLogin(params).then(res => {
            this.dataBase.loading = false
            if (res.code === '0') {
              if (this.cart.length > 0) {
                // 将本地的购物车批量添加到数据库
                addCartBatch({productMsg: this.cart}).then(response => {
                  if (response.code === '0') {
                    removeStore('buyCart')
                  }
                  // 保存用户信息
                  userInfo().then(result => {
                    if (result.code === '0') {
                      // 登录
                      this.recordUserInfo(result.data)
                    }
                    this.$router.push({name: 'PCHome'})
                  })
                })
              } else {
                userInfo().then(result2 => {
                  if (result2.code === '0') {
                    // 保存用户登录
                    this.recordUserInfo(result2.data)
                  }
                  this.$router.push({name: 'PCHome'})
                })
              }
            } else {
              this.dataBase.top_alert(res.msg, false, 2000)
            }
          })
        }
      },
      register () {
        const {userName, userPwd, userPwd2} = this.registered
        if (!userName || !userPwd || !userPwd2) {
          this.dataBase.top_alert('账号密码不能为空', false, 2000)
          return false
        }
        if (userPwd2 !== userPwd) {
          this.dataBase.top_alert('两次输入的密码不相同', false, 2000)
          return false
        }
        this.dataBase.loading = true
        userRegister({userName, userPwd}).then(res => {
          this.dataBase.loading = false
          if (res.code === '0') {
            this.dataBase.top_alert('恭喜你，注册成功', true, 2000)
            this.loginPage = true
          } else {
            this.dataBase.top_alert(res.msg, false, 2000)
          }
        })
      }
    },
    mounted () {
      this.addCardFromStore()
    },
    components: {
      YFooter,
      YButton
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  * {
    box-sizing: content-box;
  }

  .login {
    overflow-x: hidden;
    overflow-y: hidden;
    .input {
      height: 50px;
      display: flex;
      align-items: center;
      input {
        font-size: 16px;
        width: 100%;
        height: 100%;
        padding: 10px 15px;
        box-sizing: border-box;
        border: 1px solid #ccc;
        border-radius: 6px;
      }
    }
    .wrapper {
      background: url(/static/images/bg_9b9dcb65ff.png) repeat;
      background-size: 100px;
      min-height: 800px;
      min-width: 630px;
    }
    .btn {
      margin: 0;
      width: 100%;
      height: 48px;
      font-size: 18px;
      line-height: 48px
    }
  }

  .v2 .dialog {
    width: 450px;
    border: 1px solid #dadada;
    border-radius: 10px;
    top: 50%;
    left: 50%;
    margin-left: -225px;
    position: absolute;
    .title {
      background: linear-gradient(#fff, #f5f5f5);
      overflow: visible;
      position: relative;

      height: 92px;
      margin: 23px 0 50px;
      padding: 75px 0 0;
      box-shadow: none;
      .logo {
        position: absolute;
        width: 160px;
        height: 160px;
        top: -20px;
        left: 140px;
        border-radius: 50%;
        background-image: url(/static/images/logo.png);
        background-size: 160px;
        background-position: top center;
        background-repeat: no-repeat;
      }
      h4 {
        padding: 10px 0;
        text-align: center;
        border-bottom: 1px solid #dcdcdc;
        position: absolute;
        bottom: 0;
        width: 100%;
        margin: 0;
        border-bottom: 0;
        box-shadow: none;
        line-height: 1em;
        height: auto;
        color: #333;
        font-weight: 400;
      }
    }
    .content {
      padding: 0 40px 22px;
      height: auto;
      .common-form {
        li {
          clear: both;
          margin-bottom: 15px;
          position: relative;
        }
      }
    }
  }

  .dialog-shadow, .v2 .bbs .dialog-shadow, .v2 .dialog-shadow {
    -webkit-box-shadow: 0 9px 30px -6px rgba(0, 0, 0, .2), 0 18px 20px -10px rgba(0, 0, 0, .04), 0 18px 20px -10px rgba(0, 0, 0, .04), 0 10px 20px -10px rgba(0, 0, 0, .04);
    -moz-box-shadow: 0 9px 30px -6px rgba(0, 0, 0, .2), 0 18px 20px -10px rgba(0, 0, 0, .04), 0 18px 20px -10px rgba(0, 0, 0, .04), 0 10px 20px -10px rgba(0, 0, 0, .04);
    box-shadow: 0 9px 30px -6px rgba(0, 0, 0, .2), 0 18px 20px -10px rgba(0, 0, 0, .04), 0 18px 20px -10px rgba(0, 0, 0, .04), 0 10px 20px -10px rgba(0, 0, 0, .04);
  }

  @media screen and (min-width: 737px), screen and (-webkit-max-device-pixel-ratio: 1.9) and (max-width: 736px) and (min-device-width: 737px) {
    .wrapper {
      background: url(/static/images/con-bg_04f25dbf8e.jpg) repeat-x;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }
    .dialog {
      background: url(/static/images/dialog-gray-bg.png) #fff bottom repeat-x;
      border-radius: 12px;
      display: none;
      margin: -163px 0 0 -218px;
      width: 436px;
      position: fixed;
      left: 50%;
      top: 50%;
    }
    .dialog .title h4 {
      border-bottom: #d1d1d1 solid 1px;
      box-shadow: 0 2px 6px #d1d1d1;
      color: #666;
      font-size: 20px;
      height: 61px;
      line-height: 61px;
      padding: 0 0 0 35px;
    }
    .common-form li {
      clear: both;
      margin-bottom: 15px;
      position: relative;
    }
  }

  .registered {
    h4 {
      padding: 0;
      text-align: center;
      color: #666;
      border-bottom: 1px solid #dcdcdc;
      -webkit-box-shadow: none;
      -moz-box-shadow: none;
      box-shadow: none;
      font-weight: 700;
      font-size: 20px;
      height: 60px;
      line-height: 60px;
    }
  }

</style>
