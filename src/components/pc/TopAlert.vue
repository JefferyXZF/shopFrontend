<!--
    top_alert组件

    用法：
    <parent>
        <top_alert></top_alert>
    </parent>

    触发(提示文字,提示类型,消失时间):
    top_alert('文字',true,800)
 -->
<template>
    <div class="top_alert" v-if="isShow" :class="{error_alert:!alertType}" ref='topAlert'>{{alertText}}</div>
</template>
<script>
export default {
    data(){
        return {
            dataBase,
            alertType: true,  // 提示语类型，true:成功 false:失败
            alertText: '',  // 提示文字
            isShow: false,  //是否显示
            timer: 0
        }
    },
    created() {
        this.dataBase.top_alert = this.top_alert;
    },
    methods: {
        top_alert(tips, type, time){
            let t = time || 3000;
            this.alertType = type? true : false;
            this.alertText = tips;
            this.isShow = true;

            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.isShow = false;
            },time);
        }
    }
}
</script>
<style scoped>
.top_alert{
    position:fixed;
    top:15px;
    left:50%;
    z-index: 100;
    transform: translateX(-50%);
    padding:0 8px 0 55px;
    max-width: 1000px;
    min-width:300px;
    color: #fff;
    line-height: 48px;
    border-radius: 4px;
    background: #56b056 url(/static/images/ic_top_tips.png) 15px 11px no-repeat;
    box-sizing: border-box;
}
.error_alert{
    background: #e45151 url(/static/images/ic_top_tips.png) 15px -43px no-repeat;
}
</style>
