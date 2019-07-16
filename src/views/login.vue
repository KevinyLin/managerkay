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
      >
        <el-form-item label="用户名" prop="username">
          <el-input type='text' v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')" class="mybtn">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>    
</template>

<script>
//导入登录请求
import {login} from '../api/http'
export default {
  name: "login",
  data() {
    return {
      //表单绑定数据
      ruleForm: {
        password: "",
        username: ""
      },
      rules: {
        //验证规则
        username: [
            { required: true, message: '用户名不能为空', trigger: 'blur' },
            { min: 5, max: 12, message: '长度在 5 到 12 个字符', trigger: 'blur' }
          ],
          password:[
            { required: true, message: '密码不能为空', trigger: 'blur' },
            { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
          ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //发送请求获取登录结果
          login(this.ruleForm).then(backData=>{
            console.log(backData)
            if(backData.data.meta.status==200){
              //登陆成功
              this.$message.success(backData.data.meta.msg)
              //登录成功时保存令牌
              window.sessionStorage.setItem('token',backData.data.data.token)
              //去后台首页
              this.$router.push('/index')
            }else if(backData.data.meta.status==400){
              //登录失败
              this.$message.error(backData.data.meta.msg);
            }
          })
        } else {
          this.$message.error('用户名密码不能为空');
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
