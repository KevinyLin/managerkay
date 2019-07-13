<template>
  <div class="login">
    <div class="loginBox">
        <h2>用户登录</h2>
      <el-form
        label-position="top" 
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
        required
        hide-required-asterisk
      >
        <el-form-item label="用户名" prop="user">
          <el-input v-model.number="ruleForm.user"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pass">
          <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')" class="mybtn">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "login",
  data() {
    var checkuser = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("用户名不能为空"));
      }else {
        callback();
      };
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        pass: "",
        user: ""
      },
      rules: {
        pass: [{ validator: validatePass, trigger: "blur" }],
        user: [{ validator: checkuser, trigger: "blur" }]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  }
};
</script>

<style lang='less' scoped>
.login {
  width: 100%;
  height: 100%;
  background-color: #324152;
  display: flex;
  // 水平方向 对其方式 center居中
  justify-content: center;
  // 垂直方向的对其方式 center 居中
  align-items: center;
  h2{
      margin-bottom: 20px;
  }
  .loginBox {
    width: 580px;
    height: 435px;
    background-color: #fff;
    border-radius: 5px;
    padding: 60px 40px;
    box-sizing: border-box;
    .mybtn{
        width: 100%;
    }
  }
}
</style>
