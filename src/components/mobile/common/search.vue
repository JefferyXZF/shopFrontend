<template>
  <div class="ui-search">
    <div>
      <input v-model="inputText" type="search" class="ui-search-input" @focus="handleFocus">
    </div>
    <div class="right" v-show="!focus">登录</div>
    <div class="right search" v-show="focus"></div>
  </div>
</template>

<script>
export default {
  name: 'Search',
  methods: {
    search () {

    }
  }
}
</script>

<style lang="scss" scoped>
.ui-search {
  position: relative;
  width: 100%;
  height: 1rem;
  .ui-search-icon {

  }
  .ui-search-input {

  }
}
</style>
