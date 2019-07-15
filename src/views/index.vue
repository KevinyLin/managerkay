<template>
  <el-container class="my-container">
    <el-header class="my-header">
      <el-row>
        <el-col :span="4">
          <div class="grid-content bg-purple">
            <img src="../assets/img/logo.png" alt />
          </div>
        </el-col>
        <el-col :span="16">
          <div class="grid-content bg-purple-light">
            <h2 class="title">电商后台管理系统</h2>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple">
            <a href="#" class="logout" @click.prevent="logout">退出</a>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="200px" class="my-aside">
        <el-menu default-active="2" class="el-menu-vertical-demo" :unique-opened="true">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>导航一</span>
            </template>
            <el-menu-item index="1-1">
              <i class="el-icon-menu"></i>选项1
            </el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>导航二</span>
            </template>
            <el-menu-item index="1-1">
              <i class="el-icon-menu"></i>选项1
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="my-main"></el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "index",
  methods: {
    logout() {
      this.$confirm("是否退出登录", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "登出成功!"
          });
          //删除令牌且跳转到登录页
          window.sessionStorage.removeItem('token')
          this.$router.push('/login')
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "阿里嘎多哇抠你急哇!"
          });
        });
    }
  },
  created() {
      this.$message.success('欢迎回来')
  },
};
</script>

<style lang='less' scoped>
.my-container {
  height: 100%;
  img {
    margin: 0 auto;
  }
  .my-header {
    height: 60px;
    background-color: #b3c0d1;
    line-height: 60px;
    .title {
      text-align: center;
      color: #fff;
    }
    .logout {
      color: #ffa500;
      text-decoration: none;
      float: right;
    }
  }
  .my-main {
    background-color: #e9eef3;
  }
}
</style>
