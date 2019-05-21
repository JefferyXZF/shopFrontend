<template>
  <div class="ui-none-data">
    <div class="qwui-none_data">
      <div class="qwui-none_data_img"></div>
      <span class="qwui-none_data_text">暂无数据</span>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
//显示无数据样式
.qwui-none_data {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  .qwui-none_data_img {
    width: 3rem;
    height: 3rem;
    background: url(/static/svg/icon_none_data.svg) no-repeat center;
  }
  .qwui-none_data_text {
    font-size: .8rem;
    color: #a6a6a6;
  }
}
</style>
