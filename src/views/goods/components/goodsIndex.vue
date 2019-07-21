<template>
  <div>
    <el-row>
      <el-col :span="4">
        <!-- 输入框 -->
        <el-input
          placeholder="请输入内容"
          v-model="query"
          @keyup.enter.trim.native="searchGoods"
          class="input-with-select"
        >
          <el-button slot="append" icon="el-icon-search" @click="searchGoods"></el-button>
        </el-input>
      </el-col>
      <el-col :span="2">
        <!-- 按钮 -->
        <el-button type="success" plain class="mybtn" @click="goGoodsAdd">添加商品</el-button>
      </el-col>
    </el-row>

    <!-- table -->
    <el-table :data="tableData" style="width: 100%" border>
      <el-table-column type="index" label="#" width="50"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称" width="500"></el-table-column>
      <el-table-column prop="goods_price" label="商品价格(元)" width="120"></el-table-column>
      <el-table-column prop="goods_weight" label="商品重量" width="80"></el-table-column>
      <el-table-column label="创建时间" width="160">
        <template slot-scope="scope">{{scope.row.add_time | formatTime('YYYY-MM-DD HH:mm:ss')}}</template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" plain icon="el-icon-edit" size="mini"></el-button>
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            @click="deleteOne(scope.row)"
          ></el-button>
        </template>
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
import { goods, deleteGoods } from "../../../api/http";
export default {
  name: "goodsIndex",
  data() {
    return {
      //搜索框双向绑定
      query: "",
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
    //去商品添加页
    goGoodsAdd() {
      this.$router.push("/index/goods/add");
    },
    //删除一个商品
    deleteOne(row) {
      // console.log(row)
      this.$confirm("此操作将永久删除该商品数据, 是否继续?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteGoods({ id: row.goods_id }).then(backData => {
            // console.log(backData)
            if (backData.data.meta.status == 200) {
              //删除成功
              this.$message.success("删除成功");
              this.getGoodsList(this.pageIndex, this.pagesize);
            }
          });
        })
        .catch(() => {
          this.$message({
            showClose: true,
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //搜索商品
    searchGoods() {
      this.getGoodsList(this.pageIndex, this.pagesize, this.query);
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.pageIndex = 1;
      this.getGoodsList(this.pageIndex, this.pagesize);
    },
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.getGoodsList(this.pageIndex, this.pagesize);
    },
    getGoodsList(pagenum, pagesize, query) {
      goods({
        pagenum,
        pagesize,
        query
      }).then(backData => {
        // console.log(backData)
        //获取总条数
        this.total = backData.data.data.total;
        this.tableData = backData.data.data.goods;
      });
    }
  },
  created() {
    //进来获取商品列表
    this.getGoodsList(this.pageIndex, this.pagesize);
  }
};
</script>

<style lang='less' scoped>
.mybtn {
  margin-left: 5px;
}
</style>
