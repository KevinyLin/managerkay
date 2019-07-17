<template>
  <div>
    <!-- 顶部面包屑 -->
    <mybread nav1="用户管理" nav2="用户列表"></mybread>
    <el-row>
      <el-col :span="4">
        <!-- 输入框 -->
        <el-input placeholder="请输入内容" v-model="input3" class="input-with-select">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </el-col>
      <el-col :span="2">
        <!-- 按钮 -->
        <el-button type="success" plain>添加用户</el-button>
      </el-col>
    </el-row>

    <!-- table -->
    <el-table :data="tableData" style="width: 100%" border>
      <el-table-column type='index' label="#" width="30"></el-table-column>
      <el-table-column prop="username" label="姓名" width="160"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="300"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="300"></el-table-column>
      <el-table-column prop="mg_state" label="用户状态" width="80">
        <template slot-scope="scope">
            <!-- scope.row就是当前绑定的数据对象 -->
         <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
      </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <el-button type="primary" plain icon="el-icon-edit" size="mini"></el-button>
        <el-button type="danger" plain icon="el-icon-delete" size="mini"></el-button>
        <el-button type="warning" plain icon="el-icon-check" size="mini"></el-button>
      </el-table-column> 
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageIndex"
      :page-sizes="[10, 20]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
import { users } from "../api/http";
export default {
  name: "users",
  data() {
    return {
      //搜索框双向绑定
      input3: "",
      //当前页
      pageIndex: 1,
      //总条目
      total: 0,
      //每页显示条数
      pagesize: 10,
      //表格数据
      tableData: [],
    };
  },
  methods: {
    handleSizeChange(val) {
      // console.log(val)
      //页容量改变触发事件
      this.pagesize = val;
      this.pageIndex = 1;
      this.getUserList(this.pageIndex,this.pagesize)
    },
    //当前页改变时触发
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.getUserList(this.pageIndex,this.pagesize)
    },
    //获取用户列表
    getUserList(pageIndex,pagesize){
      users({
      //当前页
      pagenum: pageIndex,
      //页容量
      pagesize: pagesize
    }).then(backData => {
      // console.log(backData)
      //获取总条数
      this.total = backData.data.data.total;
      this.tableData = backData.data.data.users;
    });
    }
  },
  created() {
   this.getUserList(this.pageIndex,this.pagesize)
  }
};
</script>

<style lang='less' scoped>
</style>
