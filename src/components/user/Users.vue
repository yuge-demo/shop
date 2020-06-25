<template>
      <div class="user">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                  <el-breadcrumb-item>用户管理</el-breadcrumb-item>
                  <el-breadcrumb-item>用户列表</el-breadcrumb-item>
            </el-breadcrumb>
            <el-card class="box-card">
                  <el-row :gutter="24">
                        <el-col :span="8" class="input">
                              <el-input
                                    placeholder="请输入内容"
                                    class="input"
                                    v-model="queryInfo.query"
                                    clearable
                                    @clear="getUserList"
                              >
                                    <el-button
                                          type="primary"
                                          slot="append"
                                          icon="el-icon-search"
                                          @click="getUserList"
                                    ></el-button>
                              </el-input>
                        </el-col>
                        <el-col :span="4">
                              <el-button type="primary" @click="showSialogVisible=true">添加用户</el-button>
                        </el-col>
                  </el-row>
                  <el-table :data="userList" border style="width: 100%">
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column prop="username" label="姓名"></el-table-column>
                        <el-table-column prop="email" label="邮箱"></el-table-column>
                        <el-table-column prop="mobile" label="电话"></el-table-column>
                        <el-table-column prop="role_name" label="角色"></el-table-column>
                        <el-table-column label="状态">
                              <template slot-scope="scope">
                                    <el-switch
                                          v-model="scope.row.mg_state"
                                          @change="userStateChanged(scope.row)"
                                    ></el-switch>
                              </template>
                        </el-table-column>
                        <el-table-column label="操作">
                              <template slot-scope="scope">
                                    <el-button
                                          type="primary"
                                          icon="el-icon-edit"
                                          size="mini"
                                          @click="showEditDialog(scope.row.id)"
                                    ></el-button>
                                    <el-button
                                          type="danger"
                                          icon="el-icon-delete"
                                          size="mini"
                                          @click="showDeleteDialog(scope.row.id)"
                                    ></el-button>
                                    <el-tooltip
                                          effect="dark"
                                          content="分配角色"
                                          placement="top"
                                          :enterable="false"
                                    >
                                          <el-button
                                                type="warning"
                                                icon="el-icon-setting"
                                                size="mini"
                                                @click="showSettingDialog(scope.row)"
                                          ></el-button>
                                    </el-tooltip>
                              </template>
                        </el-table-column>
                  </el-table>
                  <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="queryInfo.pagenum"
                        :page-sizes="[5,10,15,20]"
                        :page-size="queryInfo.pagesize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total"
                  ></el-pagination>
            </el-card>

            <el-dialog
                  title="添加用户"
                  :visible.sync="showSialogVisible"
                  width="50%"
                  :modal-append-to-body="false"
                  @close="addDialogClosed"
            >
                  <el-form
                        ref="addFormRef"
                        :model="addForm"
                        :rules="addFormRules"
                        label-width="70px"
                  >
                        <el-form-item label="用户名" prop="username">
                              <el-input v-model="addForm.username"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="password">
                              <el-input v-model="addForm.password"></el-input>
                        </el-form-item>
                        <el-form-item label="邮箱" prop="email">
                              <el-input v-model="addForm.email"></el-input>
                        </el-form-item>
                        <el-form-item label="手机" prop="mobile">
                              <el-input v-model="addForm.mobile"></el-input>
                        </el-form-item>
                  </el-form>
                  <span slot="footer" class="dialog-footer">
                        <el-button @click="showSialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="addUser">确 定</el-button>
                  </span>
            </el-dialog>

            <el-dialog
                  title="修改用户信息"
                  :visible.sync="editDialogVisible"
                  width="50%"
                  :modal-append-to-body="false"
                  @close="editDialogClosed"
            >
                  <el-form
                        ref="editFromRef"
                        :model="editFrom"
                        :rules="editFromRules"
                        label-width="70px"
                  >
                        <el-form-item label="用户名">
                              <el-input v-model="editFrom.username" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="邮箱" prop="email">
                              <el-input v-model="editFrom.email"></el-input>
                        </el-form-item>
                        <el-form-item label="手机号" prop="mobile">
                              <el-input v-model="editFrom.mobile"></el-input>
                        </el-form-item>
                  </el-form>
                  <span slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="editUser">确 定</el-button>
                        <el-button type="info" @click="editDialogVisible = false">取 消</el-button>
                  </span>
            </el-dialog>
            <!-- 分配角色 -->
            <el-dialog
                  title="分类角色"
                  :visible.sync="settingDialogVisible"
                  width="50%"
                  :modal-append-to-body="false"
                  @close="setRoleDialogClosed"
            >
                  <div>
                        <p>当前的用户：{{userInfo.username}}</p>
                        <p>当前的角色：{{userInfo.role_name}}</p>
                        <p>
                              分配新的角色：
                              <el-select v-model="selectRoleId" placeholder="请选择">
                                    <el-option
                                          v-for="item in rolesList"
                                          :key="item.id"
                                          :label="item.userName"
                                          :value="item.id"
                                    ></el-option>
                              </el-select>
                        </p>
                  </div>
                  <span slot="footer" class="dialog-footer">
                        <el-button @click="settingDialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="saveInfo">确 定</el-button>
                  </span>
            </el-dialog>
      </div>
</template>

<script>
export default {
      name: "app",
      data() {
            var email = (rule, value, callback) => {
                  const regEmail = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
                  if (regEmail.test(value)) {
                        //验证通过合法邮箱
                        return callback();
                  }
                  callback(new Error("验证合法的邮箱"));
            };
            var mobile = (rule, value, callback) => {
                  const regMobil = /^[1][3,4,5,7,8][0-9]{9}$/;
                  if (regMobil.test(value)) {
                        //验证通过合法手机号
                        return callback();
                  }
                  callback(new Error("请输入正确形式的手机号"));
            };

            return {
                  queryInfo: {
                        query: "",
                        //当前页码
                        pagenum: 1,
                        //每页显示条数
                        pagesize: 5
                  },
                  userList: [],
                  total: 0,
                  //添加用户对话框的显示与隐藏
                  showSialogVisible: false,
                  //用户的信息
                  addForm: {
                        username: "",
                        password: "",
                        email: "",
                        mobile: ""
                  },
                  //表单验证规则
                  addFormRules: {
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
                                    message: "请输入密码",
                                    trigger: "blur"
                              },
                              {
                                    min: 3,
                                    max: 7,
                                    message: "长度在 6 到 15 个字符",
                                    trigger: "blur"
                              }
                        ],
                        //通过From表单中的自定义校验规则实现邮箱和手机号的验证
                        email: [
                              {
                                    validator: email,
                                    trigger: "blur"
                              }
                        ],
                        mobile: [
                              {
                                    validator: mobile,
                                    trigger: "blur"
                              }
                        ]
                  },
                  //修改表单验证的显示
                  editDialogVisible: false,
                  //修改表单的信息
                  editFrom: {},
                  //表单验证规则
                  editFromRules: {
                        email: [
                              {
                                    required: true,
                                    message: "请输入邮箱",
                                    trigger: "blur"
                              },
                              {
                                    validator: email,
                                    trigger: "blur"
                              }
                        ],
                        mobile: [
                              {
                                    required: true,
                                    message: "请输入手机号",
                                    trigger: "blur"
                              },
                              {
                                    validator: mobile,
                                    trigger: "blur"
                              }
                        ]
                  },
                  settingDialogVisible: false,
                  //需要被分配角色的用户信息
                  userInfo: {},
                  //所有角色的数据列表
                  rolesList: [],
                  //selete 双向绑定 已经选中的角色
                  selectRoleId: ""
            };
      },
      created() {
            this.getUserList();
      },
      methods: {
            async getUserList() {
                  const { data: res } = await this.$axios.get("users", {
                        params: this.queryInfo
                  });
                  if (res.meta.status !== 200) {
                        return this.$message.error("数据获取失败");
                  }
                  // console.log(res.data);
                  this.userList = res.data.users;
                  this.total = res.data.total;
            },
            handleSizeChange(NewSize) {
                  this.queryInfo.pagesize = NewSize;
            },
            handleCurrentChange(newNum) {
                  this.queryInfo.pagenum = newNum;
            },
            //监听switch开关的改变
            async userStateChanged(userInfo) {
                  const { data: res } = await this.$axios.put(
                        `users/${userInfo.id}/state/${userInfo.mg_state}`
                  );
                  if (res.meta.status !== 200) {
                        userInfo.mg_state = !userInfo.mg_state;
                        return this.$message.error("更新用户失败");
                  }
                  this.$message.success(res.meta.msg);
                  this.getUserList();
            },
            //监听对话框的关闭事件
            addDialogClosed() {
                  this.$refs.addFormRef.resetFields();
            },
            //添加用户
            addUser() {
                  this.$refs.addFormRef.validate(async vaild => {
                        if (!vaild) return;
                        const { data: res } = await this.$axios.post(
                              "users",
                              this.addForm
                        );
                        if (res.meta.status !== 201) {
                              return this.$message.error("添加用户失败");
                        }
                        this.$message.success(res.meta.msg);
                        this.showSialogVisible = false;
                        this.getUserList();
                  });
            },
            //修改用户对话框
            async showEditDialog(id) {
                  // console.log(id);
                  const { data: res } = await this.$axios.get("users/" + id, {
                        params: this.editForm
                  });
                  if (res.meta.status !== 200) {
                        return this.$message.error("查询用户失败");
                  }
                  this.editFrom = res.data;
                  this.editDialogVisible = true;
            },
            editDialogClosed() {
                  this.$refs.editFromRef.resetFields();
            },
            //点击确定修改
            editUser() {
                  this.$refs.editFromRef.validate(async vaild => {
                        if (!vaild) return;
                        const { data: res } = await this.$axios.put(
                              "users/" + this.editFrom.id,
                              {
                                    email: this.editFrom.email,
                                    mobile: this.editFrom.mobile
                              }
                        );
                        if (res.meta.status !== 200) {
                              return this.$message.error("提交用户失败");
                        }
                        this.$message.success(res.meta.msg);
                        this.getUserList();
                        this.editDialogVisible = false;
                  });
            },
            //删除显示
            async showDeleteDialog(id) {
                  const confirmResult = await this.$confirm(
                        "此操作将永久删除该文件, 是否继续?",
                        "提示",
                        {
                              confirmButtonText: "确定",
                              cancelButtonText: "取消",
                              type: "warning"
                        }
                  ).catch(error => error);
                  // .then(() => {
                  //       this.$message({
                  //             type: "success",
                  //             message: "删除成功!"
                  //       });
                  // })
                  // console.log(confirmResult);
                  if (confirmResult !== "confirm") {
                        return this.$message.info("取消删除");
                  }
                  const { data: res } = await this.$axios.delete("users/" + id);
                  if (res.meta.status !== 200) {
                        return this.$message.error("获取参数失败");
                  }
                  this.$message.success("删除成功");
                  this.getUserList();
            },
            //分配角色列表
            async showSettingDialog(userInfo) {
                  this.userInfo = userInfo;
                  const { data: res } = await this.$axios.get("roles");
                  if (res.meta.status !== 200) {
                        return this.$message.error("获取数据列表失败");
                  }
                  this.rolesList = res.data;
                  this.settingDialogVisible = true;
            },
            // 点击按钮分配角色
            async saveInfo() {
                  if (!this.selectRoleId) {
                        return this.$message.error("请选择要分配的角色");
                  }
                  const { data: res } = await this.$axios.put(
                        `users/${this.userInfo.id}/role`,
                        {
                              rid: this.selectRoleId
                        }
                  );
                  if (res.meta.status !== 200) {
                        return this.$message.error("更新角色失败");
                  }
                  this.$message.success(res.meta.msg);
                  this.getUserList();
                  this.settingDialogVisible = false;
            },
            //分配角色的关闭事件
            setRoleDialogClosed(){
                  this.selectRoleId = " ",
                  this.userInfo = {}
            }
      }
};
</script>

<style>
.el-breadcrumb {
      margin-bottom: 15px;
}
.el-table {
      margin-top: 15px;
}
.el-pagination {
      margin-top: 15px;
      text-align: right;
}
</style>
