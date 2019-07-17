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
        <el-button type="success" plain @click="isShow = true">添加用户</el-button>
      </el-col>
    </el-row>

    <!-- table -->
    <el-table :data="tableData" style="width: 100%" border>
      <el-table-column type="index" label="#" width="30"></el-table-column>
      <el-table-column prop="username" label="姓名" width="160"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="300"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="300"></el-table-column>
      <el-table-column prop="mg_state" label="用户状态" width="80">
        <template slot-scope="scope">
          <!-- scope.row就是当前绑定的数据对象 -->
          <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope2">
          <el-button type="primary" plain icon="el-icon-edit" size="mini"></el-button>
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            @click="handleDelete(scope2.row.id)"
          ></el-button>
          <el-button type="warning" plain icon="el-icon-check" size="mini"></el-button>
        </template>
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
    <!-- 遮罩层+添加用户模块 -->
    <div class="shade" v-show="isShow">
      <div class="shadebox">
        <h4>添加用户</h4>
        <div class="adduser">
          <el-form
            :model="ruleForm"
            status-icon
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="用户名" prop="username">
              <el-input type="text" v-model="ruleForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input type="text" v-model="ruleForm.email"></el-input>
            </el-form-item>
            <el-form-item label="电话">
              <el-input type="text" v-model="ruleForm.mobile"></el-input>
            </el-form-item>
            <el-form-item class="useraddb">
              <el-button @click="closeshade">取消</el-button>
              <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//获取用户列表接口
import { users } from "../api/http";
//添加用户接口
import { usersAdd } from "../api/http";
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
      //遮罩层是否显示
      isShow: false,
      //表单绑定数据
      ruleForm: {
        password: "",
        username: "",
        email: "",
        mobile: ""
      },
      rules: {
        //验证规则
        username: [
          //是否为必填项
          { required: true, message: "用户名不能为空", trigger: "blur" },
          //长度验证
          { min: 5, max: 12, message: "长度在 5 到 12 个字符", trigger: "blur" }
        ],
        password: [
          //是否为必填项
          { required: true, message: "密码不能为空", trigger: "blur" },
          //长度验证
          { min: 6, max: 12, message: "长度在 6 到 12 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    handleSizeChange(val) {
      // console.log(val)
      //页容量改变触发事件
      this.pagesize = val;
      this.pageIndex = 1;
      this.getUserList(this.pageIndex, this.pagesize);
    },
    //当前页改变时触发
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.getUserList(this.pageIndex, this.pagesize);
    },
    //获取用户列表
    getUserList(pageIndex, pagesize) {
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
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //验证通过则发送请求添加用户
          usersAdd({
            username: this.ruleForm.username,
            password: this.ruleForm.password,
            email: this.ruleForm.email,
            mobile: this.ruleForm.mobile
          }).then(backData => {
            if (backData.data.meta.status == 201) {
              //创建成功关闭遮罩层
              this.isShow = false;
              //清空表格并重新渲染
              this.getUserList(this.pageIndex, this.pagesize);
              this.ruleForm.username = "";
              this.ruleForm.password = "";
              this.ruleForm.email = "";
              this.ruleForm.mobile = "";
            }
          });
        } else {
          this.$message.error("用户名密码不能为空");
          return false;
        }
      });
    },
    //点击取消关闭遮罩层
    closeshade() {
      this.isShow = false;
      this.ruleForm.username = "";
      this.ruleForm.password = "";
      this.ruleForm.email = "";
      this.ruleForm.mobile = "";
    },
    //点击删除按钮删除用户数据
    handleDelete(id) {
      this.$confirm("此操作将永久删除该用户数据, 是否继续?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            showClose: true,
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            showClose: true,
            type: "info",
            message: "已取消删除"
          });
        });
    }
  },
  created() {
    this.getUserList(this.pageIndex, this.pagesize);
  }
};
</script>

<style lang='less' scoped>
.shade {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  .shadebox {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 960px;
    height: 430px;
    background-color: #fff;
    transform: translate(-50%, -50%);
    h4 {
      font-weight: normal;
      font-size: 18px;
      padding: 20px 0 0 20px;
    }
    .adduser {
      padding: 30px 20px;
    }
    .useraddb {
      float: right;
      margin-top: 40px;
    }
  }
}
</style>
