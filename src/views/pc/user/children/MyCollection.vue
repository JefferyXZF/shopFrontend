<template>
    <div class="ui-collection">
      <div v-if="goods.length">
        <goods-card
          :goods="goodsItem"
          v-for="goodsItem in goods"
          :key="goodsItem._id"></goods-card>
      </div>
      <div class="qwui-none_data" v-else>
        <div class="qwui-none_data_img"></div>
        <span class="qwui-none_data_text">暂无数据</span>
      </div>
    </div>
</template>

<script>
import { collectionList } from '/api/user'
import GoodsCard from '/components/pc/goodsCard'
export default {
    name: 'MyCollection',
    components: {
        GoodsCard
    },
    data () {
        return {
            goods: []
        }
    },
    created () {
        collectionList().then(res => {
        if (res.code === '0') {
            this.goods = res.data || []
        }
        })
    },
}
</script>

<style lang="scss" scoped>
.ui-collection {
    // display: flex;
}
//显示无数据样式
.qwui-none_data {
  position: relative;
  left: 50%;
  margin-top: 225px;
  transform: translate(-50%, -50%);
  text-align: center;
  .qwui-none_data_img {
    width: 200px;
    height: 150px;
    margin: 0 auto;
    background: url(/static/svg/icon_none_data.svg) no-repeat center;
  }
  .qwui-none_data_text {
    font-size: 16px;
    color: #a6a6a6;
  }
}
</style>
