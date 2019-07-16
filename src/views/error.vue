<template>
  <div class="error">
    <img src="../assets/img/404.jpg" alt @click="goIndex" />
  </div>
</template>

<script>
export default {
  name: "error",
  created() {
    this.$message.error("无法找到页面 点击屏幕中间回到首页");
  },
  methods: {
    goIndex() {
      this.$router.push("/index");
    }
  }
};
</script>

<style lang='less' scoped>
.error {
  height: 100%;
  background-color: #fffbf0;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
