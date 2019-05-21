<template>
  <div class="" id="msgBoxs">
    <div class="_mask" v-show="dataBase.mask"></div>
    <transition name="loading_gd">
      <div class="_loading"  v-show="dataBase.loading"><div class="_loading_logo"></div></div>
    </transition>
    <div class="_alert_mask" v-if="alertShow">
      <div class="_alert_box">
        <div class="_alert_header">
          <h3 id="_alert_title">{{title}}</h3>
          <span class="_alert_del" @click='close'>×</span>
        </div>
        <div class="_alert_body" v-html="msg">

        </div>
        <div class="_alert_opt">
          <span v-if="!isShowCancelBtn" class="btn orangeBtn" @click="confirm">{{btnName}}</span>
          <span class="normal_btn" v-if="isShowCancelBtn" @click='close'>{{cancleName}}</span>
          <span v-if="isShowCancelBtn" class="btn orangeBtn ml10" @click="confirm">{{btnName}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'msgBoxs',
  created:function(){
    this.dataBase.alert=this.alert
  },
  data(){
    return {
      dataBase:dataBase,
      alertShow:false,
      title:'',
      msg:'',
      callback:'',
      btnName:'确定',
      isShowCancelBtn: false,
      cancleName: '取消',
      cancleCallback: ''
    }
  },
  computed:{

  },
  methods:{
    alert:function(title, msg, callback, btnName, isShowCancelBtn, cancleCallback, cancleName){
      // 弹框标题 、 弹框信息 、 确定按钮回调、确定按钮名称、是否需要显示按钮、取消按钮名称、取消按钮回调
      this.title = title;
      this.msg = msg;
      if(callback){
        this.callback = callback;
      }else{
        this.callback = '';
      }
      if(btnName){
        this.btnName = btnName;
      }else{
        this.btnName = '确定';
      }

      this.cancleName = cancleName? cancleName: '取消';
      this.cancleCallback = cancleCallback;

      this.isShowCancelBtn = isShowCancelBtn;

      this.alertShow=true;
    },
    close:function(){
      this.alertShow=false;
      this.cancleCallback && this.cancleCallback()

    },
    confirm:function(){
      this.alertShow=false;
      if(this.callback){
        this.callback();
      }
    }
  }
}

</script>

<style scoped>
.normal_btn, .btn {
  min-width: 46px;
  padding: 0 20px;
  margin-right: 15px;
  font-size: 14px;
  line-height: 30px;
  text-align: center;
  display: inline-block;
  border-radius: 4px;
  box-sizing: inherit;
  cursor: pointer;
  border: 1px solid #ccc;
}
.btn {
  color: #fff;
  background-color: #409eff;
  margin-right: 0px;
}
._mask{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,.3);
  z-index: 100;
}
._loading{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-position: center;
  background-repeat: no-repeat;
  background-color: rgba(246,244,245,.84);
  z-index: 100;
}
.loading_gd-enter-active {
  transition: all 1.5s ease;
}
.loading_gd-leave-active {
  transition: all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.loading_gd-enter, .loading_gd-leave-to {
  opacity: 0;
}
@keyframes loading{
  0%{
    transform:rotate(0deg);
    -ms-transform:rotate(0deg);   /* IE 9 */
    -moz-transform:rotate(0deg);  /* Firefox */
    -webkit-transform:rotate(0deg); /* Safari 和 Chrome */
    -o-transform:rotate(0deg);  /* Opera */
  }
  100%{
    transform:rotate(360deg);
    -ms-transform:rotate(360deg);   /* IE 9 */
    -moz-transform:rotate(360deg);  /* Firefox */
    -webkit-transform:rotate(360deg); /* Safari 和 Chrome */
    -o-transform:rotate(360deg);  /* Opera */
  }
}

@-o-keyframes loading{
  0%{
    transform:rotate(0deg);
    -ms-transform:rotate(0deg);   /* IE 9 */
    -moz-transform:rotate(0deg);  /* Firefox */
    -webkit-transform:rotate(0deg); /* Safari 和 Chrome */
    -o-transform:rotate(0deg);  /* Opera */
  }
  100%{
    transform:rotate(360deg);
    -ms-transform:rotate(360deg);   /* IE 9 */
    -moz-transform:rotate(360deg);  /* Firefox */
    -webkit-transform:rotate(360deg); /* Safari 和 Chrome */
    -o-transform:rotate(360deg);  /* Opera */
  }
}
@-moz-keyframes loading{
  0%{
    transform:rotate(0deg);
    -ms-transform:rotate(0deg);   /* IE 9 */
    -moz-transform:rotate(0deg);  /* Firefox */
    -webkit-transform:rotate(0deg); /* Safari 和 Chrome */
    -o-transform:rotate(0deg);  /* Opera */
  }
  100%{
    transform:rotate(360deg);
    -ms-transform:rotate(360deg);   /* IE 9 */
    -moz-transform:rotate(360deg);  /* Firefox */
    -webkit-transform:rotate(360deg); /* Safari 和 Chrome */
    -o-transform:rotate(360deg);  /* Opera */
  }
}

@-webkit-keyframes loading{
  0%{
    transform:rotate(0deg);
    -ms-transform:rotate(0deg);   /* IE 9 */
    -moz-transform:rotate(0deg);  /* Firefox */
    -webkit-transform:rotate(0deg); /* Safari 和 Chrome */
    -o-transform:rotate(0deg);  /* Opera */
  }
  100%{
    transform:rotate(360deg);
    -ms-transform:rotate(360deg);   /* IE 9 */
    -moz-transform:rotate(360deg);  /* Firefox */
    -webkit-transform:rotate(360deg); /* Safari 和 Chrome */
    -o-transform:rotate(360deg);  /* Opera */
  }
}
._loading_logo{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  width: 75px;
  height:75px;
  background: url(/static/images/loading.png) no-repeat;
  animation:loading 1.5s infinite linear ;
  -ms-animation:loading 1.5s infinite linear ;
  -moz-animation:loading 1.5s infinite linear ;
  -webkit-animation:loading 1.5s infinite linear ;
}
._alert_mask{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,.3);
  z-index: 100;
}
._alert_box{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 500px;
  height: auto;
  border-radius: 5px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.31);
  border: 1px solid #cccccc;
  z-index: 100;
  background-color: #FFF;
}
._alert_header{
  margin: 0 15px;
  padding: 0 15px;
  height: 60px;
  text-align: right;
  border-bottom: 1px solid #cccccc;
}
._alert_header h3 {
    float: left;
    margin-top: 15px;
    display: inline;
    line-height: 36px;
    font-size: 18px;
    font-weight: bold;
}
._alert_header ._alert_del {
    display: inline-block;
    margin-top: 15px;
    padding: 0 5px 4px;
    line-height: 30px;
    font-size: 30px;
    color: #999;
    cursor: pointer;
}
._alert_header ._alert_del:hover {
    background-color: whitesmoke;
    border-radius: 6px;
}
._alert_body{
  margin-top: 15px;
  padding: 0 15px;
  text-align: center;
}
._alert_body a{
  color:#f87b00;
}
._alert_opt{
  padding:20px 0 30px;
  text-align: center;
}
</style>
