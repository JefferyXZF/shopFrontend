<template>
  <div class="gray-box">
    <div class="title">
      <p>{{title}}</p>
      <div class="more">
        <slot name="right"></slot>
      </div>
    </div>
    <!--内容-->
    <div>
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String
    }
  }
}
</script>

<style lang='scss' scoped>
.gray-box {
  padding: 10px 0;
  .title {
    position: relative;
    background-color: #ececec;
    line-height: .6rem;
    .more {
      position: absolute;
      top: 0;
      right: 4px;
    }
  }
  p {
    font-size: 0.4rem;
    padding: 6px;
    border-left: 3px solid rgb(23, 157, 254);
  }

}
</style>
