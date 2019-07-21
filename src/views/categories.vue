<template>
  <div>
    <!-- 顶部面包屑 -->
    <mybread nav1="商品管理" nav2="商品分类"></mybread>
    <el-row>
      <el-col :span="2">
        <!-- 按钮 -->
        <el-button type="success" plain>添加分类</el-button>
      </el-col>
    </el-row>

    <!-- table -->
    <el-table :data="tableData" style="width: 100%" border row-key="cat_id">
      <el-table-column prop="cat_name" label="分类名称" width="320"></el-table-column>
      <el-table-column label="级别" width="180">
        <template slot-scope="scope">
          {{scope.row.cat_level | formatLevel}}
        </template>
      </el-table-column>
      <el-table-column label="是否有效" width="180">
        <template slot-scope="scope">
          {{scope.row.cat_deleted | formatDeleted}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" plain icon="el-icon-edit" size="mini"></el-button>
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="pageIndex"
      :page-size="5"
      layout="total, prev, pager, next, jumper"
      :total="400"
    ></el-pagination>
  </div>
</template>

<script>
import { categories } from "../api/http";
export default {
  name: "categories",
  data() {
    return {
      //当前页
      pageIndex: 1,
      //表格数据
      tableData: []
    };
  },
  methods: {
    //当前页改变时
    handleCurrentChange() {}
  },
  created() {
    categories().then(backData => {
      // console.log(backData)
      if (backData.data.meta.status == 200) {
        this.tableData = backData.data.data;
      }
    });
  },
  filters:{
    formatLevel(num){
      switch (num) {
        case 0:
          return '一级'
          break;
        case 1:
          return '二级'
          break;
        case 2:
          return '三级'
          break;
      }
    },
    formatDeleted(youxiao){
      return youxiao?'无效':'有效';
    }
  }
};
</script>

<style lang='less' scoped>
</style>
