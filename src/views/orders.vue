<template>
  <div>
    <!-- 顶部面包屑 -->
    <mybread nav1="订单管理" nav2="订单列表"></mybread>
    <!-- table -->
    <el-table :data="tableData" style="width: 100%" border>
      <el-table-column type="index" label="#" width="50"></el-table-column>
      <el-table-column prop="order_number" label="订单编号" width="300"></el-table-column>
      <el-table-column prop="order_price" label="订单价格" width="80"></el-table-column>
      <el-table-column prop="pay_status" label="是否付款" width="100" align='center'>
        <template slot-scope="scope2">
          <el-tag type="danger" v-if='scope2.row.pay_status==0' >未付款</el-tag>
          <el-tag type="success" v-if='scope2.row.pay_status==1' >已付款</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="is_send" label="是否发货" width="380"></el-table-column>
      <el-table-column prop="create_time" label="下单时间" width="380">
        <template slot-scope="scope">
          {{scope.row.create_time | formatTime('YYYY-MM-DD HH:mm:ss')}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <el-button type="primary" plain icon="el-icon-edit" size="mini"></el-button>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
import { orders } from "../api/http";
export default {
  name: "orders",
  data() {
    return {
      //当前页
      pageIndex: 1,
      //总条数
      total: 0,
      //页容量
      pagesize: 10,
      //表格数据
      tableData: []
    };
  },
  methods: {
        handleSizeChange(val) {
      this.pagesize = val;
      this.pageIndex = 1;
      this.getOrderList(this.pageIndex,this.pagesize)
    },
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.getOrderList(this.pageIndex,this.pagesize)
    },
    getOrderList(pagenum,pagesize) {
      orders({
        pagenum: pagenum,
        pagesize: pagesize
      }).then(backData => {
        // console.log(backData)
        //获取总条数
        this.total = backData.data.data.total;
        this.tableData = backData.data.data.goods;
      });
    }
  },
  created() {
    this.getOrderList(this.pageIndex,this.pagesize)
  }
};
</script>

<style lang='less' scoped>
</style>
