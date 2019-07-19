<template>
  <div>
    <!-- 顶部面包屑 -->
    <mybread nav1="权限管理" nav2="角色列表"></mybread>
    <el-row>
      <el-col :span="2">
        <!-- 按钮 -->
        <el-button plain>添加角色</el-button>
      </el-col>
    </el-row>

    <!-- table -->
    <el-table :data="tableData" style="width: 100%" border>
      <!-- 展开行 -->
      <el-table-column type="expand">
        <template slot-scope="scope">
          <!-- 一级容器 -->
          <el-row v-for="tag in scope.row.children">
            <el-col :span="4">
              <el-tag :key="tag.authName" closable type class="my-tag" @close='delrights(scope.row,tag)'>{{tag.authName}}</el-tag>
              <span class="el-icon-arrow-right"></span>
            </el-col>
            <el-col :span="20">
              <!-- 二级容器 -->
              <el-row v-for="secTag in tag.children">
                <el-col :span="6">
                  <el-tag :key="secTag.authName" closable type="success" class="my-tag" @close='delrights(scope.row,secTag)'>{{secTag.authName}}</el-tag>
                  <span class="el-icon-arrow-right"></span>
                </el-col>
                <el-col :span="18">
                  <!-- 三级容器标签 -->
                  <el-tag v-for="thrTag in secTag.children" :key="thrTag.authName" closable type="warning" class="my-tag" @close='delrights(scope.row,thrTag)'>{{thrTag.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="530"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述" width="530"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" plain icon="el-icon-edit" size="mini"></el-button>
          <el-button type="danger" plain icon="el-icon-delete" size="mini"></el-button>
          <el-button type="warning" plain icon="el-icon-check" size="mini" @click="openTree"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 权限树对话框 -->
    <el-dialog title="权限分配" :visible.sync="treeFormVisible">

  <div slot="footer" class="dialog-footer">
    <el-button @click="treeFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="treeFormVisible = false">确 定</el-button>
  </div>
</el-dialog>

  </div>
</template>

<script>
import { getRoles,delRoleRights } from "../api/http";
export default {
  name: "roles",
  data() {
    return {
      //权限分配对话框
      treeFormVisible:false,
      //表格数据
      tableData: []
    };
  },
  created() {
    //获取角色列表
    getRoles().then(backData => {
      // console.log(backData)
      if (backData.data.meta.status == 200) {
        this.tableData = backData.data.data;
      }
    });
  },
  methods: {
    //删除指定权限
    delrights(role,rights){
      // console.log(roleId,rightsId)
      delRoleRights(role.id,rights.id).then(backData=>{
        // console.log(backData)
        if(backData.data.meta.status==200){
          //更新权限数据
          role.children = backData.data.data;
          this.$message.success(backData.data.meta.msg);
        }
      })
    },
    //打开权限分配
    openTree(){
      this.treeFormVisible = true;
    }
  },
};
</script>

<style lang='less' scoped>
.my-tag{
  margin-right: 10px;
  margin-bottom: 10px;
}
</style>
