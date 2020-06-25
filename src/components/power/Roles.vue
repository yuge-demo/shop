<template>
      <div>
            <el-breadcrumb separator-class="el-icon-arrow-right">
                  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                  <el-breadcrumb-item>权限管理</el-breadcrumb-item>
                  <el-breadcrumb-item>角色列表</el-breadcrumb-item>
            </el-breadcrumb>
            <el-card>
                  <el-button type="primary" @click="addDialogVisible=true">添加角色</el-button>
                  <el-table :data="rolesList" border style="width: 100%" stripe>
                        <el-table-column type="expand">
                              <template slot-scope="scope">
                                    <el-row
                                          :class="['bdbottom',i1===0 ? 'bdtop' : ' ','vcenter']"
                                          v-for="(item1, i1) in scope.row.children"
                                          :key="item1.id"
                                    >
                                          <el-col :span="5">
                                                <el-tag
                                                      closable
                                                      @close="removeRightById(scope.row,item1.id)"
                                                >{{item1.authName}}</el-tag>
                                                <i class="el-icon-caret-right"></i>
                                          </el-col>
                                          <el-col :span="19">
                                                <el-row
                                                      :class="[ i2 === 0 ? ' ' : 'bdtop' ,'vcenter']"
                                                      v-for="(item2,i2) in item1.children"
                                                      :key="item2.id"
                                                >
                                                      <el-col :span="6">
                                                            <el-tag
                                                                  closable
                                                                  type="success"
                                                                  @close="removeRightById(scope.row,item2.id)"
                                                            >{{item2.authName}}</el-tag>
                                                            <i class="el-icon-caret-right"></i>
                                                      </el-col>
                                                      <el-col :span="11">
                                                            <el-tag
                                                                  closable
                                                                  type="warning"
                                                                  v-for="(item3,i3) in item2.children"
                                                                  :key="item3.id"
                                                                  @close="removeRightById(scope.row,item3.id)"
                                                            >{{item3.authName}}</el-tag>
                                                      </el-col>
                                                </el-row>
                                          </el-col>
                                    </el-row>
                              </template>
                        </el-table-column>
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column prop="roleName" label="角色名称"></el-table-column>
                        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
                        <el-table-column label="操作">
                              <template slot-scope="scoped">
                                    <el-button
                                          size="mini"
                                          type="primary"
                                          icon="el-icon-edit"
                                          @click="showEditDialog(scoped.row.id)"
                                    >编辑</el-button>
                                    <el-button
                                          size="mini"
                                          type="danger"
                                          icon="el-icon-delete"
                                          @click="showDelete(scoped.row.id)"
                                    >删除</el-button>
                                    <el-button
                                          size="mini"
                                          type="warning"
                                          icon="el-icon-setting"
                                          @click="showSetRightDialog(scoped.row)"
                                    >
                                          分配权限
                                          <!-- {{scoped.row}} -->
                                    </el-button>
                              </template>
                        </el-table-column>
                  </el-table>
            </el-card>
            <!-- 添加角色 -->
            <el-dialog
                  title="添加角色"
                  :visible.sync="addDialogVisible"
                  width="50%"
                  :modal-append-to-body="false"
                  @close="addDialogClosed"
            >
                  <el-form
                        ref="addFormRef"
                        :model="addForm"
                        :rules="addFormRules"
                        label-width="100px"
                  >
                        <el-form-item label="角色名称" prop="roleName">
                              <el-input v-model="addForm.roleName"></el-input>
                        </el-form-item>
                        <el-form-item label="角色描述" prop="roleDesc">
                              <el-input v-model="addForm.roleDesc"></el-input>
                        </el-form-item>
                  </el-form>
                  <span slot="footer" class="dialog-footer">
                        <el-button @click="addDialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="addUser">确 定</el-button>
                  </span>
            </el-dialog>

            <el-dialog
                  title="修改角色"
                  :visible.sync="editDialogVisible"
                  width="50%"
                  :modal-append-to-body="false"
            >
                  <el-form
                        ref="editFormRef"
                        :model="editForm"
                        :rules="editFormRules"
                        label-width="100px"
                  >
                        <el-form-item label="角色名称">
                              <el-input v-model="editForm.roleName"></el-input>
                        </el-form-item>
                        <el-form-item label="角色描述">
                              <el-input v-model="editForm.roleDesc"></el-input>
                        </el-form-item>
                  </el-form>
                  <span slot="footer" class="dialog-footer">
                        <el-button @click="editDialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="editRoles">确 定</el-button>
                  </span>
            </el-dialog>

            <!-- 分配权限对话框 -->
            <el-dialog
                  title="分配权限"
                  :visible.sync="setRightDialogVisible"
                  width="50%"
                  :modal-append-to-body="false"
                  @close="setRightDialogClosed"
            >
                  <el-tree
                        :data="rightList"
                        :props="treeProps"
                        show-checkbox
                        node-key="id"
                        default-expand-all
                        :default-checked-keys="defKeys"
                        ref="treeRef"
                  ></el-tree>
                  <span slot="footer" class="dialog-footer">
                        <el-button @click="setRightDialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="allotRights">确 定</el-button>
                  </span>
            </el-dialog>
      </div>
</template>

<script>
export default {
      name: "roles",
      data() {
            return {
                  rolesList: [],
                  //添加角色显示与隐藏
                  addDialogVisible: false,
                  //添加对话框的数据
                  addForm: {
                        roleName: "",
                        roleDesc: ""
                  },
                  //添加表单验证
                  addFormRules: {
                        roleName: [
                              {
                                    required: true,
                                    message: "请输入角色名称",
                                    trigger: "blur"
                              },
                              {
                                    min: 3,
                                    max: 7,
                                    message: "长度在  1 到 7 个字符",
                                    trigger: "blur"
                              }
                        ],
                        roleDesc: [
                              {
                                    required: true,
                                    message: "请描述",
                                    trigger: "blur"
                              },
                              {
                                    min: 3,
                                    max: 7,
                                    message: "长度在  1 到 7 个字符",
                                    trigger: "blur"
                              }
                        ]
                  },
                  //修改角色的显示与隐藏
                  editDialogVisible: false,
                  editForm: {
                        roleId: "",
                        roleName: "",
                        roleDesc: ""
                  },
                  //修改表单验证
                  editFormRules: {},
                  //分配权限对话框的显示与隐藏
                  setRightDialogVisible: false,
                  //tree数据的保存
                  rightList: [],
                  //树形空间指定绑定
                  treeProps: {
                        label: "authName",
                        children: "children"
                  },
                  //默认选中节点数值
                  defKeys: [],
                  //权限管理的id
                  roleId: ""
            };
      },
      created() {
            this.getRolesList();
      },
      methods: {
            async getRolesList() {
                  const { data: res } = await this.$axios.get("roles");
                  if (res.meta.status !== 200) {
                        return this.$message.error("获取数据失败");
                  }
                  this.rolesList = res.data;
            },
            //关闭
            addDialogClosed() {
                  this.$refs.addFormRef.resetFields();
            },
            //添加角色
            addUser() {
                  this.$refs.addFormRef.validate(async vaild => {
                        if (!vaild) {
                              return vaild;
                        }
                        const { data: res } = await this.$axios.post(
                              "roles",
                              this.addForm
                        );
                        if (res.meta.status !== 201) {
                              return this.$message.error("用户添加失败");
                        }
                        this.$message.success(res.meta.msg);
                        this.getRolesList();
                        this.addDialogVisible = false;
                  });
            },
            async showEditDialog(Id) {
                  const { data: res } = await this.$axios.get("roles/" + Id);
                  if (res.meta.status !== 200) {
                        return this.$message.error("查询用户失败");
                  }
                  this.editForm = res.data;
                  this.editDialogVisible = true;
            },
            async editRoles() {
                  const { data: res } = await this.$axios.put(
                        `roles/ ${this.editForm.roleId} `,
                        {
                              roleName: this.editForm.roleName,
                              roleDesc: this.editForm.roleDesc
                        }
                  );
                  if (res.meta.status !== 200) {
                        return this.$message.error("提交失败");
                  }
                  this.$message.success("提交成功");
                  this.getRolesList();
                  this.editDialogVisible = false;
            },
            //刪除操作
            async showDelete(Id) {
                  const confirmResult = await this.$confirm(
                        "此操作将永久删除该文件, 是否继续?",
                        "提示",
                        {
                              confirmButtonText: "确定",
                              cancelButtonText: "取消",
                              type: "warning"
                        }
                  ).catch(error => error);
                  if (confirmResult !== "confirm") {
                        return this.$message.info("已經取消刪除");
                  }
                  const { data: res } = await this.$axios.delete("roles/" + Id);
                  if (res.meta.status !== 200) {
                        return this.$message.error("刪除失敗");
                  }
                  this.$message.success(res.meta.mag);
                  this.getRolesList();
            },
            //刪除tag标签
            async removeRightById(role, rightsId) {
                  const confirmResult = await this.$confirm(
                        "此操作将永久删除该文件, 是否继续?",
                        "提示",
                        {
                              confirmButtonText: "确定",
                              cancelButtonText: "取消",
                              type: "warning"
                        }
                  ).catch(error => error);
                  if (confirmResult !== "confirm") {
                        return this.$message.info("已經取消刪除");
                  }
                  const { data: res } = await this.$axios.delete(
                        `roles/${role.id}/rights/${rightsId}`
                  );
                  if (res.meta.status !== 200) {
                        return this.$message.error("删除失败");
                  }
                  role.children = res.data;
            },
            //分配权限对话框
            async showSetRightDialog(role) {
                  this.roleId = role.id;
                  const { data: res } = await this.$axios.get("rights/tree");
                  if (res.meta.status !== 200) {
                        return this.$message.error("获取数据列表失败");
                  }
                  this.rightList = res.data;
                  // console.log(this.rightList);
                  this.getLeafKeys(role, this.defKeys);
                  this.setRightDialogVisible = true;
            },
            //通过递归函数的形式，获取角色下所有三级权限的id，并保存到defKeys这个数组中
            getLeafKeys(node, arr) {
                  //node.children 看是不是三级节点id  如果有就不是
                  //!node.children 意思是三级节点id
                  if (!node.children) {
                        return arr.push(node.id);
                  }
                  // console.log(node.children);
                  node.children.forEach(item => this.getLeafKeys(item, arr));
            },
            setRightDialogClosed() {
                  this.defKeys = [];
            },
            //点击按钮分配权限
            async allotRights() {
                  const keys = [
                        ...this.$refs.treeRef.getCheckedKeys(),
                        ...this.$refs.treeRef.getHalfCheckedKeys()
                  ];
                  const idStr = keys.join(" ");

                  const { data: res } = await this.$axios.post(
                        `roles/${this.roleId}/rights`,
                        {
                              rids: idStr
                        }
                  );

                  if (res.meta.status !== 200) {
                        return this.$message.error("分配权限失败");
                  }
                  this.$message.success(res.meta.msg);
                  this.getRolesList();
                  this.setRightDialogVisible = false;
            }
      }
};
</script>

<style lang="less" scoped>
.el-tag {
      margin: 7px;
}
.vcenter {
      display: flex;
      align-items: center;
}
.bdtop {
      border-top: 1px solid #eeeeee;
}
.bdbottom {
      border-bottom: 1px solid #eeeeee;
}
</style>