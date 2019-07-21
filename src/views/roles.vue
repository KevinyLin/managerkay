<template>
  <div>
    <!-- 顶部面包屑 -->
    <mybread nav1="权限管理" nav2="角色列表"></mybread>
    <el-row>
      <el-col :span="2">
        <!-- 按钮 -->
        <el-button plain @click="showAddRoles">添加角色</el-button>
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
              <el-tag
                :key="tag.authName"
                closable
                type
                class="my-tag"
                @close="delrights(scope.row,tag)"
              >{{tag.authName}}</el-tag>
              <span class="el-icon-arrow-right"></span>
            </el-col>
            <el-col :span="20">
              <!-- 二级容器 -->
              <el-row v-for="secTag in tag.children">
                <el-col :span="6">
                  <el-tag
                    :key="secTag.authName"
                    closable
                    type="success"
                    class="my-tag"
                    @close="delrights(scope.row,secTag)"
                  >{{secTag.authName}}</el-tag>
                  <span class="el-icon-arrow-right"></span>
                </el-col>
                <el-col :span="18">
                  <!-- 三级容器标签 -->
                  <el-tag
                    v-for="thrTag in secTag.children"
                    :key="thrTag.authName"
                    closable
                    type="warning"
                    class="my-tag"
                    @close="delrights(scope.row,thrTag)"
                  >{{thrTag.authName}}</el-tag>
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
          <el-button
            type="primary"
            plain
            icon="el-icon-edit"
            size="mini"
            @click="openEdit(scope.row)"
          ></el-button>
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            @click="deleteRole(scope.row)"
          ></el-button>
          <el-button
            type="warning"
            plain
            icon="el-icon-check"
            size="mini"
            @click="openTree(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 权限树对话框 -->
    <el-dialog title="权限分配" :visible.sync="treeFormVisible">
      <!-- 权限树 -->
      <el-tree
        :data="data"
        show-checkbox
        node-key="id"
        :default-checked-keys="checkedkeys"
        :props="defaultProps"
        default-expand-all
        ref="tree"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="treeFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="roleRights">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="addFormVisible">
      <el-form :model="addRolesForm" :rules="rules" ref="ruleForm">
        <el-form-item label="角色名称" label-width="120px" prop="roleName">
          <el-input v-model="addRolesForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" label-width="120px" prop="roleDesc">
          <el-input v-model="addRolesForm.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑角色对话框 -->
    <el-dialog title="编辑角色" :visible.sync="editFormVisible">
      <el-form :model="editRolesForm" :rules="rules" ref="editRuleForm">
        <el-form-item label="角色名称" label-width="120px" prop="roleName">
          <el-input v-model="editRolesForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" label-width="120px" prop="roleDesc">
          <el-input v-model="editRolesForm.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEditForm('editRuleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRoles,
  delRoleRights,
  rightsTree,
  roleRights,
  addRole,
  removeRole,
  editRole
} from "../api/http";
export default {
  name: "roles",
  data() {
    return {
      //编辑角色对话框
      editFormVisible: false,
      //添加角色对话框
      addFormVisible: false,
      //权限分配对话框
      treeFormVisible: false,
      //正在编辑的角色
      editRole: {},
      //表格数据
      tableData: [],
      //权限树数据
      data: [
        {
          id: 1,
          label: "一级 1",
          children: [
            {
              id: 4,
              label: "二级 1-1",
              children: [
                {
                  id: 9,
                  label: "三级 1-1-1"
                },
                {
                  id: 10,
                  label: "三级 1-1-2"
                }
              ]
            }
          ]
        },
        {
          id: 2,
          label: "一级 2",
          children: [
            {
              id: 5,
              label: "二级 2-1"
            },
            {
              id: 6,
              label: "二级 2-2"
            }
          ]
        },
        {
          id: 3,
          label: "一级 3",
          children: [
            {
              id: 7,
              label: "二级 3-1"
            },
            {
              id: 8,
              label: "二级 3-2"
            }
          ]
        }
      ],
      defaultProps: {
        children: "children",
        label: "authName"
      },
      //权限树默认被选中
      checkedkeys: [],
      //添加角色对话框绑定数据
      addRolesForm: {
        roleName: "测试角色",
        roleDesc: "测试角色描述"
      },
      //编辑角色对话框绑定数据
      editRolesForm: {
        roleName: "",
        roleDesc: "",
        id: 0
      },
      //添加角色表单验证规则
      rules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" }
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    //一进来获取角色列表
    this.getRolesList();
    //一进来获取权限树
    this.getTree();
  },
  methods: {
    //编辑角色
    submitEditForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          editRole({
            id: this.editRolesForm.id,
            roleName: this.editRolesForm.roleName,
            roleDesc: this.editRolesForm.roleDesc
          }).then(backData=>{
            // console.log(backData)
            if(backData.data.meta.status == 200){
              //关闭对话框
              this.editFormVisible = false;
              //提示用户
              this.$message.success('编辑成功');
              //重新获取角色列表
              this.getRolesList();
            }
          })
        } else {
          this.$message.error("角色名与描述不能为空");
          return false;
        }
      });
    },
    //打开编辑角色对话框
    openEdit(row) {
      //打开对话框
      this.editFormVisible = true;
      // console.log(row)
      //将当前正在编辑的角色信息渲染到对话框中
      this.editRolesForm.roleName = row.roleName;
      this.editRolesForm.roleDesc = row.roleDesc;
      //另外保存id发送请求用
      this.editRolesForm.id = row.id;
    },
    //删除角色
    deleteRole(row) {
      // console.log(row)
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          removeRole({ id: row.id }).then(backData => {
            // console.log(backData)
            if (backData.data.meta.status == 200) {
              //提示用户
              this.$message.success(backData.data.meta.msg);
              //重新获取角色列表
              this.getRolesList();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //添加角色确定
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          addRole({
            roleName: this.addRolesForm.roleName,
            roleDesc: this.addRolesForm.roleDesc
          }).then(backData => {
            // console.log(backData)
            if (backData.data.meta.status == 201) {
              //关闭对话框
              this.addFormVisible = false;
              //提示用户
              this.$message.success(backData.data.meta.msg);
              //重新获取角色列表
              this.getRolesList();
              //清空数据
              this.addRolesForm.roleName = "";
              this.addRolesForm.roleDesc = "";
            }
          });
        } else {
          this.$message.error("角色名与描述不能为空");
          return false;
        }
      });
    },
    //打开添加角色对话框
    showAddRoles() {
      this.addFormVisible = true;
    },
    //获取角色列表
    getRolesList() {
      getRoles().then(backData => {
        // console.log(backData)
        if (backData.data.meta.status == 200) {
          this.tableData = backData.data.data;
        }
      });
    },
    //角色授权
    roleRights() {
      // console.log(this.$refs.tree.getCheckedKeys());
      // console.log(this.$refs.tree.getHalfCheckedKeys());
      const rids = [...this.$refs.tree.getCheckedKeys(), ...this.$refs.tree.getHalfCheckedKeys()].join(",");
      // console.log(rids)
      const roleId = this.editRole.id;
      roleRights({ roleId, rids }).then(backData => {
        // console.log(backData)
        if (backData.data.meta.status == 200) {
          this.treeFormVisible = false;
          this.$message.success(backData.data.meta.msg);
          this.getRolesList();
        }
      });
    },
    //获取权限树
    getTree() {
      //获取权限树并渲染
      rightsTree().then(backData => {
        // console.log(backData);
        if (backData.data.meta.status == 200) {
          this.data = backData.data.data;
        }
      });
    },
    //删除指定权限tag
    delrights(role, rights) {
      // console.log(roleId,rightsId)
      delRoleRights(role.id, rights.id).then(backData => {
        // console.log(backData)
        if (backData.data.meta.status == 200) {
          //更新权限数据
          role.children = backData.data.data;
          this.$message.success(backData.data.meta.msg);
        }
      });
    },
    //打开权限分配对话框
    openTree(row) {
      //每次进来重新获取权限树
      this.getTree();
      // console.log(row)
      //声明个变量来暂存遍历出来的权限id
      let checkedkeys = [];
      //使用遍历来获取
      // for(let i =0;i<row.children.length;i++){
      //   //第一层循环
      //   // checkedkeys.push(row.children[i].id)
      //   let secChildren = row.children[i].children
      //   for(let i =0;i<secChildren.length;i++){
      //     //第二层循环
      //     // checkedkeys.push(secChildren[i].id)
      //     let thrChildren = secChildren[i].children
      //     for(let i =0;i<thrChildren.length;i++){
      //       //第三层循环
      //       checkedkeys.push(thrChildren[i].id)
      //     }
      //   }
      // }

      //使用递归来获取权限树默认选中权限
      function addCheckedKeys(items) {
        for (let i = 0; i < items.children.length; i++) {
          //判断还有没有儿子  如果还有则继续调用自己 没有则退出 返回最底层的id
          if (items.children[i].children) {
            //还有儿子 调用自己
            addCheckedKeys(items.children[i]);
          } else {
            //没有儿子 返回id添加进数组
            checkedkeys.push(items.children[i].id);
          }
        }
      }

      addCheckedKeys(row);
      // console.log(checkedkeys)
      // 将遍历完的值重新复制给data中的checkedkeys
      this.checkedkeys = checkedkeys;
      //在正在编辑的角色
      this.editRole = row;
      //弹框
      this.treeFormVisible = true;
    }
  }
};
</script>

<style lang='less' scoped>
.my-tag {
  margin-right: 10px;
  margin-bottom: 10px;
}
</style>
