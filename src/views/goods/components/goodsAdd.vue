<template>
  <div>
    <!-- alert -->
    <el-alert title="添加商品信息" type="info" center show-icon class="my-alert"></el-alert>
    <!-- 步骤条 -->
    <el-steps :active="parseInt(active)" finish-status="success" align-center class="my-steps">
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>
    <!-- tabs -->
    <el-tabs v-model="active" tab-position="left">
      <el-tab-pane label="基本信息" name="0">基本信息</el-tab-pane>
      <el-tab-pane label="商品参数" name="1">商品参数</el-tab-pane>
      <el-tab-pane label="商品属性" name="2">商品属性</el-tab-pane>
      <el-tab-pane label="商品图片" name="3">
        <!-- 图片上传 -->
        <el-upload
          class="upload-demo"
          action="http://localhost:8888/api/private/v1/upload"
          :file-list="fileList"
          list-type="picture"
          :headers='headers'
          :on-success='uploadSuccess'
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </el-tab-pane>
      <el-tab-pane label="商品内容" name="4">商品内容</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: "goodsAdd",
  data() {
    return {
      //步骤条绑定标记
      active: "0",
      //文件上传列表
      fileList: [],
      //设置请求头
      headers:{
          Authorization:window.sessionStorage.getItem('token')
      }
    };
  },
  methods: {
      uploadSuccess(){
          this.$message.success('上传成功');
      }
  },
};
</script>

<style lang='less' scoped>
.my-alert {
  margin: 20px 0;
}
.my-steps {
  width: 1000px;
  margin-bottom: 20px;
}
</style>
