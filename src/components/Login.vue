<template>
      <div class="login">
            <div class="login_box">
                  <div class="avatar_box">
                        <img src="../assets/logo.png" alt />
                  </div>
                  <el-form
                        ref="loginFromRef"
                        :model="loginFrom"
                        :rules="loginFromRules"
                        label-width="0"
                        class="login_form"
                  >
                        <el-form-item prop="username">
                              <el-input
                                    v-model="loginFrom.username"
                                    prefix-icon="iconfont icontouxiang"
                              ></el-input>
                        </el-form-item>
                        <el-form-item prop="password">
                              <el-input
                                    v-model="loginFrom.password"
                                    prefix-icon="iconfont iconsuo"
                                    show-password
                              ></el-input>
                        </el-form-item>
                        <el-form-item class="btn">
                              <el-button type="primary" @click="login">登录</el-button>
                              <el-button type="info" @click="resetLoginFrom">重置</el-button>
                        </el-form-item>
                  </el-form>
            </div>
      </div>
</template>
<script>
export default {
      name: "login",
      data() {
            return {
                  //登录表单的数据对象
                  loginFrom: {
                        username: "admin",
                        password: "123456"
                  },
                  loginFromRules: {
                        username: [
                              {
                                    required: true,
                                    message: "请输入用户名称",
                                    trigger: "blur"
                              },
                              {
                                    min: 3,
                                    max: 7,
                                    message: "长度在 3 到 7 个字符",
                                    trigger: "blur"
                              }
                        ],
                        password: [
                              {
                                    required: true,
                                    message: "请输入用户名密码",
                                    trigger: "blur"
                              },
                              {
                                    min: 6,
                                    max: 10,
                                    message: "长度在 6 到 10 个字符",
                                    trigger: "blur"
                              }
                        ]
                  }
            };
      },
      methods: {
            login() {
                  this.$refs.loginFromRef.validate(async valid => {
                        if (!valid) {
                              return;
                        }
                        const { data: res } = await this.$axios.post(
                              "login",
                              this.loginFrom
                        );
                        if (res.meta.status !== 200) {
                              this.$message.error("登录失败");
                        }
                        this.$message.success(res.meta.msg);
                        window.sessionStorage.setItem('token' , res.data.token)
                        this.$router.push('/home')
                  });
            },
            // 点击重置按钮重置表单
            resetLoginFrom() {
                  // console.log(this);
                  this.$refs.loginFromRef.resetFields();
            }
      }
};
</script>
<style lang="less" scoped>
.login {
      background-color: #2b4b6b;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
}
.login_box {
      width: 450px;
      height: 300px;
      background-color: #fff;
      border-radius: 3px;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
}
.avatar_box {
      width: 130px;
      height: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #ffffff;
      img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #eee;
      }
}
.login_form {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 0 20px;
      box-sizing: border-box;
}
.btn {
      display: flex;
      justify-content: flex-end;
}
</style>