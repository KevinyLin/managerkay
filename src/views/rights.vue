<template>
  <div>
    <!-- 顶部面包屑 -->
    <mybread nav1='权限管理' nav2='权限列表'></mybread>
    <!-- table -->
    <el-table :data="tableData" style="width: 100%" border>
      <el-table-column type="index" label="#" width="40"></el-table-column>
      <el-table-column prop="authName" label="权限名称" width="200"></el-table-column>
      <el-table-column prop="path" label="路径" width="200"></el-table-column>
      <el-table-column prop="level" label="层级" width="200">
        <template slot-scope="scope">
          <span v-if="scope.row.level === '0'">一级</span>
          <span v-if="scope.row.level === '1'">二级</span>
          <span v-if="scope.row.level === '2'">三级</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {rights} from '../api/http'
export default {
  name: "rights",
  data() {
    return {
      //表格数据
      tableData: []
    };
  },
  created() {
    rights().then(backData=>{
      // console.log(backData)
      this.tableData = backData.data.data
    })
  },
};
</script>

<style lang='less' scoped>

</style>
