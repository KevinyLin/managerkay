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
      <el-table-column type="index" label="#" width="50"></el-table-column>
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
          <!-- 修改用户 -->
          <el-button
            type="primary"
            plain
            icon="el-icon-edit"
            size="mini"
            @click="edituser(scope.row)"
          ></el-button>
          <!-- 删除用户 -->
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            @click="handleDelete(scope.row.id)"
          ></el-button>
          <!-- 分配角色 -->
          <el-button
            type="warning"
            plain
            icon="el-icon-check"
            @click="disRoleDialog(scope.row)"
            size="mini"
          ></el-button>
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

    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="disRoleFormVisible">
      <el-form :model="disRoleform">
        <el-form-item label="当前用户" label-width="120px">{{disRoleform.username}}</el-form-item>
        <el-form-item label="请选择角色" label-width="120px">
          <el-select v-model="disRoleform.role" placeholder="请选择角色">
            <el-option
              v-for="item in roleList"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="disRoleFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="disRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
//导入接口
import {
  users,
  usersAdd,
  changeState,
  deleteUser,
  putUser,
  getRoles,
  disRoles
} from "../api/http";
export default {
  name: "users",
  data() {
    return {
      //分配角色列表
      roleList: [],
      //分配角色对话框是否显示
      disRoleFormVisible: false,
      disRoleform: {
        role: "",
        //当前正在编辑的用户名
        username: "",
        //当前正在编辑的用户id
        id: 0
      },
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
        id: ""
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
    //点击确定分配角色
    disRole() {
      if (typeof this.disRoleform.role == "string") {
        //关闭弹框 啥也不干
        this.disRoleFormVisible = false;
        return;
      }
      //点击确定时获取修改的角色发送请求
      disRoles({ id: this.disRoleform.id, rid: this.disRoleform.role }).then(
        backData => {
          // console.log(backData);
          if (backData.data.meta.status == 200) {
            this.disRoleFormVisible = false;
            this.$message.success(backData.data.meta.msg);
            this.getUserList();
          }
        }
      );
    },
    //分配角色打开对话框
    disRoleDialog(row) {
      // console.log(row)
      this.disRoleFormVisible = true;
      //将角色名直接显示在对话框中
      this.disRoleform.username = row.username;
      //默认选中当前角色
      this.disRoleform.role = row.role_name;
      //保存当前正在编辑的角色id
      this.disRoleform.id = row.id;
      //调用接口获取角色列表渲染到下拉框中
      getRoles().then(backData => {
        // console.log(backData)
        if (backData.data.meta.status == 200) {
          //获取成功 关联数据
          this.roleList = backData.data.data;
        }
      });
    },
    //修改用户信息-打开对话框
    edituser(row) {
      this.editForm = row;
      this.editFormVisible = true;
    },
    //修改用户信息-发送请求
    changeUser() {
      putUser(this.editForm).then(backData => {
        // console.log(backData)
        if (backData.data.meta.status == 200) {
          this.editFormVisible = false;
          this.getUserList();
          this.$message.success(backData.data.meta.msg);
        }
      });
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
              this.getUserList();
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
      this.getUserList();
    },
    handleSizeChange(val) {
      // console.log(val)
      //页容量改变触发事件
      this.pagesize = val;
      this.pageIndex = 1;
      this.getUserList();
    },
    //当前页改变时触发
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.getUserList();
    },
    //获取用户列表
    getUserList() {
      users({
        //当前页
        pagenum: this.pageIndex,
        //页容量
        pagesize: this.pagesize,
        query: this.query
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
              this.getUserList();
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
    this.getUserList();
  }
};
</script>

<style lang='less' scoped>
</style>
