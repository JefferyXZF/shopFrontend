<template>
  <div class="ui-login">
    <div class="ui-back iconfont icon-zuojiantou" @click="$router.go(-1)"></div>
    <div class="login" v-if="isLogin">
      <div class="welcome"><img src="/static/images/person.jpg"></div>
      <div class="login-form">
        <div class="login-inp"><label>用户名：</label><input type="text" placeholder="请输入用户名" v-model="form.userName" /></div>
        <div class="login-inp"><label>密码：</label><input type="password" placeholder="请输入密码" v-model="form.userPwd" /></div>
        <div class="login-inp"><a href="#" @click="login()">{{btnName}}</a></div>
      </div>
      <div class="login-txt"><a href="#" @click="check('register')">立即注册</a>|<a href="#" @click="tip()">忘记密码？</a></div>
    </div>
    <div class="login" v-else>
      <div class="welcome"><img src="/static/images/person.jpg"></div>
      <div class="login-form">
        <div class="login-inp"><label>用户名：</label><input type="text" placeholder="请输入用户名" v-model="form.userName" /></div>
        <div class="login-inp"><label>密码：</label><input type="password" placeholder="请输入密码" v-model="form.userPwd" /></div>
        <div class="login-inp"><label>确认密码：</label><input type="password" placeholder="请输入密码" v-model="checkPwd" /></div>
        <div class="login-inp"><a href="#" @click="register()">{{btnName}}</a></div>
      </div>
      <div class="login-txt"><a href="#" @click="check('login')">立即登录</a></div>
    </div>
  </div>
</template>

<script>
import '@/assets/mobile/rem/rem.js'
import { userLogin, userRegister, userInfo } from '/api/user'
import { Toast, MessageBox } from 'mint-ui'
import LoginHeader from '/components/mobile/common/header'
import { mapMutations } from 'vuex'
export default {
  name: 'Login',
  components: {
    LoginHeader
  },
  data () {
    return {
      form: {
        userName: '',
        userPwd: ''
      },
      checkPwd: '',
      btnName: '立即登录',
      isLogin: true
    }
  },
  methods: {
    ...mapMutations(['recordUserInfo']),
    //用户名和密码验证
    rules(){
      let userName = this.form.userName.trim();
      let userPwd = this.form.userPwd.trim();
      // let uPattern = /^[a-zA-Z0-9_]{2,12}$/g;
      //最少6位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符
      // let pPattern = /^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/;

      if (!userName) {
        Toast('用户名不能为空')
        return false
      }
      if (!userPwd) {
        Toast('密码不能为空')
        return false
      }
      if(userName.length < 2 || userName.length > 12) {
        Toast('用户名请输入2到12位')
        return false
      }
      // if(!pPattern.test(userPwd)) {
      //   Toast('密码强度较弱')
      // }else{
      //   Toast('密码强度 安全^_^')
      // }
      return true
    },
    login () {
      if(this.rules()) {
        userLogin(this.form).then(res => {
          if (res.code === '0') {
            // 获取用户信息
            userInfo().then(result => {
              if (result.code === '0') {
                // 登录
                this.recordUserInfo(result.data)
                this.$router.push({name: 'MobileHome'})
                // this.$router.go(-1)
              }
            })
          } else {
            Toast(res.msg)
          }
        })
      }
    },
    register () {
      if(this.rules()) {
        if (this.checkPwd !== this.form.userPwd) {
          Toast('两次输入密码不一致')
          return false
        }
        userRegister(this.form).then(res => {
          if (res.code === '0') {
            Toast('恭喜你，注册成功')
            this.check('login')
          } else {
            Toast(res.msg)
          }
        })
      }
    },
    check (value) {
      this.form = {
        userName: '',
        userPwd: ''
      }
      if (value == 'register') {
        this.btnName = '立即注册'
        this.isLogin = false
      } else {
        this.btnName = '立即登录'
        this.isLogin = true
      }
    },
    tip() {
      Toast('该功能正在维护 o(╥﹏╥)o');
    },
  }
}
</script>

<style lang='scss' scoped>
  .ui-login {
    position: relative;
    .ui-back {
      position: absolute;
      left: 10px;
      top: 8px;
      width: 30px;
      height: 30px;
      background: rgba(0,0,0,.3);
      border-radius: 50%;
      text-align: center;
      line-height: 30px;
      font-weight: bold;
      font-size: 18px;
      color: black;
    }
  }
  .login{width:100%;height:100%;background:url(/static/images/login-bg.png) no-repeat;background-size:cover;position:fixed;z-index:-10;}
  .welcome{
    width:100%;
    margin:25% 0 12%;
    text-align: center;
  }
  .welcome img{
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
  }
  .login-inp{
    margin:0 30px 30px;
    border:1px solid #fff;
    border-radius:25px;
    line-height: .6rem;
  }
  .login-inp label{
    width:6em;
    text-align:center;
    display:inline-block;
    color:#fff;
    font-size: .4rem;
  }
  .login-inp input{line-height:30px;color:#fff;background-color:transparent;border:none;outline: none;}
  .login-inp a{
    display:block;
    width:100%;
    text-align:center;
    line-height:30px;
    color:#fff;
    font-size:16px;
    letter-spacing:5px;
    background-color:  #179dfe;
    border-radius:25px;
  }
  .login-txt{text-align:center;color:#fff;font-size: 12px;}
  .login-txt a{color:#fff;padding:0 5px;}
</style>
