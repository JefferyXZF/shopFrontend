<template>
  <div class="ui-main-box">
    <ul>
      <li v-for="(todo, index) in goods" :key="todo._id"   @click="goodsDetail(todo.productId)">
        <div class="list" v-if="todo.status == 1">
          <div class="image">
            <img v-lazy="todo.productImage[0]" :alt="todo.productName">
          </div>
          <div :title="todo.productName">
            <p class="name" >{{ todo.productName }}</p>
          </div>
          <p class="nametwo">{{ todo.subTitle }}</p>
          <p class="price">￥{{ todo.salePrice }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    goods: {type: Array}
  },
  methods: {
    goodsDetail (id) {
      this.$router.push({name: 'MobileGoodsDetail', query: {productId: id}})
    }
  }
}
</script>

<style lang='scss' scoped>
.ui-main-box ul {
  overflow: hidden;
}
ul li {
  list-style: none;
}
.list {
  height: 5.7rem;
  background: white;
  float: left;
  width: 50%;
  border-right: 1px solid #f4f4f4;
  border-top: 1px solid #f4f4f4;
  .name {
    width: 80%;
    height: 0.5rem;
    line-height: 0.5rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin: auto;
    font-size: 0.29rem;
    font-weight: 800;
    text-align: center;
  }
  .nametwo {
    height: 0.48rem;
    font-size: 0.1rem;
    text-align: center;
  }
  .price {
    font-size: 0.33rem;
    color: red;
    margin: auto;
    text-align: center;
    font-size: 0.3rem;
  }
  .image {
    width: 100%;
    background: white;
    img {
      width: 3.5rem;
      height: 3.3rem;
      display: block;
      margin: auto;
      margin-top: .5rem;
      margin-bottom: .2rem;
    }
  }
}

</style>
