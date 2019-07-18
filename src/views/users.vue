<template>
  <div>
    <!-- 顶部面包屑 -->
    <mybread nav1="用户管理" nav2="用户列表"></mybread>
    <el-row>
      <el-col :span="4">
        <!-- 输入框 -->
        <el-input
          placeholder="请输入内容"
          v-model="query"
          @keyup.enter.native="serachUser"
          class="input-with-select"
        >
          <el-button slot="append" icon="el-icon-search" @click="serachUser"></el-button>
        </el-input>
      </el-col>
      <el-col :span="2">
        <!-- 按钮 -->
        <el-button type="success" plain @click="dialogFormVisible = true">添加用户</el-button>
      </el-col>
    </el-row>

    <!-- table -->
    <el-table :data="tableData" style="width: 100%" border>
      <el-table-column type="index" label="#" width="30"></el-table-column>
      <el-table-column prop="username" label="姓名" width="160"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="300"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="300"></el-table-column>
      <el-table-column label="用户状态" width="80">
        <template slot-scope="scope">
          <!-- scope.row就是当前绑定的数据对象 -->
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            @click.native="changeUserState(scope.row)"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" plain icon="el-icon-edit" size="mini" @click="edituser(scope.row)"></el-button>
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            @click="handleDelete(scope.row.id)"
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
    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="ruleForm">
        <el-form-item label="用户名" label-width="120px" prop="username">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="120px" prop="password">
          <el-input v-model="form.password" type="password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="120px">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="120px">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑用户对话框 -->
    <el-dialog title="修改用户" :visible.sync="editFormVisible">
      <el-form :model="editForm" :rules="rules" ref="ruleForm">
        <el-form-item label="用户名" label-width="120px" prop="username">
          <el-input v-model="editForm.username" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="120px">
          <el-input v-model="editForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="120px">
          <el-input v-model="editForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="changeUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
//导入接口
import { users, usersAdd, changeState, deleteUser,putUser } from "../api/http";
export default {
  name: "users",
  data() {
    return {
      //添加用户对话框是否显示
      dialogFormVisible: false,
      form: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      //编辑用户对话框是否显示
      editFormVisible: false,
      editForm: {
        username: "",
        email: "",
        mobile: "",
        id:"",
      },
      //用户列表查询双向绑定
      query: "",
      //当前页
      pageIndex: 1,
      //总条目
      total: 0,
      //每页显示条数
      pagesize: 10,
      //表格数据
      tableData: [],
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
    //修改用户信息-打开对话框
    edituser(row){
      this.editForm = row;
      this.editFormVisible = true;
    },
    //修改用户信息-发送请求
    changeUser(){
      putUser(this.editForm).then(backData=>{
        // console.log(backData)
        if(backData.data.meta.status==200){
          this.editFormVisible = false;
          this.getUserList(this.pageIndex, this.pagesize);
        }
      })
    },
    //改变用户状态
    changeUserState(row) {
      // console.log(row)
      changeState({
        id: row.id,
        type: row.mg_state
      }).then(backdata => {
        if (backdata.data.meta.status == 200) {
          this.$message.success("状态设置成功");
        }
      });
    },
    //添加用户
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //成功时调用接口添加用户
          usersAdd(this.form).then(backData => {
            // console.log(backData)
            if (backData.data.meta.status == 201) {
              //创建成功关闭对话框并重新获取数据渲染
              this.dialogFormVisible = false;
              this.getUserList(this.pageIndex, this.pagesize);
              (this.form.username = ""),
                (this.form.password = ""),
                (this.form.email = ""),
                (this.form.mobile = "");
            }
          });
        } else {
          this.$message.warning("用户名密码不能为空");
          return false;
        }
      });
    },
    //搜索用户
    serachUser() {
      this.getUserList(this.pageIndex, this.pagesize, this.query);
    },
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
    getUserList(pageIndex, pagesize, query) {
      users({
        //当前页
        pagenum: pageIndex,
        //页容量
        pagesize,
        query
      }).then(backData => {
        // console.log(backData)
        //获取总条数
        this.total = backData.data.data.total;
        this.tableData = backData.data.data.users;
      });
    },
    //点击删除按钮删除用户数据
    handleDelete(id) {
      this.$confirm("此操作将永久删除该用户数据, 是否继续?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteUser({
            id
          }).then(backData => {
            // console.log(backData)
            if (backData.data.meta.status == 200) {
              //删除成功
              this.$message.success("状态设置成功");
              this.getUserList(this.pageIndex, this.pagesize);
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
    }
  },
  created() {
    this.getUserList(this.pageIndex, this.pagesize);
  }
};
</script>

<style lang='less' scoped>
</style>
