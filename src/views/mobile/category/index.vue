<template>
  <div class="ui-category-main">
    <category-header title="商品分类"></category-header>
    <div class="calssify-con" >
      <div class="calssify-left">
        <ul class="calssify-left-ul" >
          <template v-for="(list,index) in left">
            <li v-if = "list.status == 1" :key="index" @click="classify(index)" :class="{active:index===classifyIndex}">
                {{list.categoryName}}
            </li>
          </template>
        </ul>
      </div>
      <div class="calssify-rigth">
          <ul class="calssify-left-ul">
              <li
                v-for="(list,index) in right"
                :key="list._id"
                v-show="list.status == 1"
                @click="goodsDetails(list.productId)">
                    <img v-lazy="list.productImage[0]">
                  <span class="ui-category-name">{{list.productName}}</span>
              </li>
          </ul>
      </div>
    </div>
  </div>
</template>

<script>
import CategoryHeader from '/components/mobile/common/header'
import { productHome } from '/api/user'
export default {
  name: 'MobileCategory',
  components: {
    CategoryHeader
  },
  data () {
    return {
      left: [{
        categoryName: '全部',
        _id: '1',
        status: 1
      }],
      right: [],
      list: [],
      classifyIndex: 0
    }
  },
  created () {
    let categoryId = this.$route.query.categoryId
    productHome().then(res => {
      if (res.code === '0') {
        let goodsList = res.data
        let categoryArr = goodsList.map(item => { // 投影分类
          return {_id: item._id, categoryName: item.categoryName, status: item.status}
        }).filter(item => {return item.status == 1})
        // 添加到侧边栏分类
        this.left.push(...categoryArr)
        let categoryAll = [] // 全部商品
        if (goodsList.length) {
          goodsList.forEach(item => {
            if (item.status == 1 && item.goodsData && item.goodsData.length) {
              categoryAll.push(...item.goodsData)
              this.list.push(item.goodsData)
            }
          })
          this.list.unshift(categoryAll) // 添加所有商品到全部分类下
        }
        if (categoryId) { // 初始化商品分类的显示
          if (this.left.length) {
            this.left.forEach((item, index) => {
              if (categoryId.indexOf(item._id) > -1) {
                this.right = this.list[index]
                this.classifyIndex = index
              }
            })
          }
        } else {
          this.right = this.list[0]
        }
      }
    })
  },
  methods: {
    classify (index) {
      this.classifyIndex = index
      this.right = this.list[index]
    },
    goodsDetails (id) {
      this.$router.push({name: 'MobileGoodsDetail', query: {productId: id}})
    }
  }
}
</script>

<style lang='scss' scoped>
.active {
  border-left: 2px solid;
  background: #ffffff;
  color: #199cfe;
}
.calssify-con {
  display: flex;
  overflow: hidden;
  position: absolute;
  width: 100%;
  top: 0;
  bottom: 0;
  padding-top: 1.45rem;

  .calssify-left {
    width: 2.2rem;
    height: 100%;
    background: #f6f6f6;
    // border-right: 10px solid #f6f6f6;
    margin-bottom: 1.51rem;
    font-size: 0.35rem;

    li {
      height: 1.3rem;
      line-height: 1.3rem;
      text-align: center;
    }
  }

  .calssify-rigth {
    flex: 1;
    height: 100%;
    background: white;
    margin-bottom: 1.51rem;
    width: 80%;

    ul {
        display: flex;
        flex-wrap: wrap;

        li {
          display: flex;
          flex-direction: column;
          text-align: center;
          width: 33.3%;
          margin-top: 0.3rem;
          font-size: 0.34rem;
          float: left;

          img {
            width: 1.98rem;
            height: 2.2rem;
            display: block;
            margin: auto;
          }

          span {
            color: #999;
            line-height: 0.9rem;
            font-size: 0.34rem;
            white-space: nowrap;
            padding: 0 10px;
            text-overflow: ellipsis;
            overflow: hidden;
          }
        }
    }
  }
}
</style>
