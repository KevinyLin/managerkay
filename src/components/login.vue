<template>
  <div class="login">
    <div class="loginBox">
        
    </div>
  </div>
</template>

<script>
export default {
  name: "login"
};
</script>

<style lang='less' scoped>
.login {
  width: 100%;
  height: 100%;
  background-color: #324152;
  display: flex;
  // 水平方向 对其方式 center居中
  justify-content: center;
  // 垂直方向的对其方式 center 居中
  align-items: center;
  .loginBox {
    width: 580px;
    height: 435px;
    background-color: #fff;
    border-radius: 5px;
  }
}
</style>
