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
        <el-menu default-active="2" class="el-menu-vertical-demo" :unique-opened="true" router>
          <el-submenu v-for="(item,index) in menusList" :index="'' + index">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item v-for="it in item.children" :index="'/index/' + it.path">
              <i class="el-icon-menu"></i>
              {{it.authName}}
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="my-main">
        <!-- 嵌套路由出口 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { menus } from "../api/http";
export default {
  name: "index",
  data() {
    return {
      //左侧菜单列表
      menusList: []
    };
  },
  methods: {
    logout() {
      this.$confirm("是否退出登录", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            showClose: true,
            type: "success",
            message: "登出成功!"
          });
          //删除令牌且跳转到登录页
          window.sessionStorage.removeItem("token");
          this.$router.push("/login");
        })
        .catch(() => {
          this.$message({
            showClose: true,
            type: "info",
            message: "阿里嘎多哇抠你急哇!"
          });
        });
    }
  },
  created() {
    //调用方法获取左侧菜单列表
    menus().then(backData => {
      // console.log(backData)
      this.menusList = backData.data.data;
    });
  },
  beforeDestroy() {
    if (window.sessionStorage.getItem("token") != undefined) {
      this.$message.success("欢迎回来");
    }
  }
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
    padding-top: 0;
  }
}
</style>
