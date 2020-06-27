<template>
      <div class="app">
            <router-view></router-view>
      </div>
</template>

<script>
export default {
      name: "app"
};
</script>

<style>
.app {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      /* height: 100%; */
      min-width: 1366px;
}

.el-cascader-panel {
      height: 200px;
}
</style>
