<template>
      <div>
            <el-breadcrumb separator-class="el-icon-arrow-right">
                  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
                  <el-breadcrumb-item>参数列表</el-breadcrumb-item>
            </el-breadcrumb>
            <el-card>
                  <el-alert title="注意：只允许为第三级分类设置相关参数" type="warning" :closable="false" show-icon></el-alert>
                  <!-- 选择商品分类 -->
                  <el-row class="cat_opt">
                        <el-col>
                              <span>选择商品分类：</span>
                              <!-- options指定数据的源头 -->
                              <!-- props用来指定配置对象 -->
                              <el-cascader
                                    v-model="selectedCateKeys"
                                    :options="cateList"
                                    :props="{expandTrigger: 'hover',value:'cat_id',label: 'cat_name',children: 'children' }"
                                    @change="handleChange"
                                    clearable
                              ></el-cascader>
                        </el-col>
                  </el-row>
                  <el-tabs v-model="activeName" @tab-click="handleTabClick">
                        <!-- 动态参数 -->
                        <el-tab-pane label="动态参数" name="many">
                              <el-button
                                    type="primary"
                                    size="mini"
                                    :disabled="idBtnDisabled"
                                    @click="addDialogVisible=true"
                              >添加参数</el-button>
                              <!-- 动态参数的表格 -->
                              <el-table :data="manyTableData" border stripe>
                                    <el-table-column type="expand">
                                          <template slot-scope="scope">
                                                <el-tag
                                                      v-for="(item ,i ) in scope.row.attr_vals"
                                                      :key="i"
                                                      closable
                                                      @close="handleClosed(i ,scope.row)"
                                                >{{item}}</el-tag>
                                                <!-- 添加New Tag -->
                                                <el-input
                                                      class="input-new-tag"
                                                      v-if="scope.row.inputVisible"
                                                      v-model="scope.row.inputValue"
                                                      ref="saveTagInput"
                                                      size="small"
                                                      @keyup.enter.native="handleInputConfirm(scope.row)"
                                                      @blur="handleInputConfirm(scope.row)"
                                                ></el-input>
                                                <el-button
                                                      v-else
                                                      class="button-new-tag"
                                                      size="small"
                                                      @click="showInput(scope.row)"
                                                >+ New Tag</el-button>
                                          </template>
                                    </el-table-column>
                                    <el-table-column type="index" label="#"></el-table-column>
                                    <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                                    <el-table-column label="操作">
                                          <template slot-scope="scope">
                                                <el-button
                                                      size="mini"
                                                      type="primary"
                                                      icon="el-icon-edit"
                                                      @click="showEditDialog(scope.row.attr_id)"
                                                >编辑</el-button>
                                                <el-button
                                                      size="mini"
                                                      type="danger"
                                                      icon="el-icon-delete"
                                                      @click="showDeleteDialog(scope.row.attr_id)"
                                                >删除</el-button>
                                          </template>
                                    </el-table-column>
                              </el-table>
                        </el-tab-pane>
                        <!-- 静态属性 -->
                        <el-tab-pane label="静态属性" name="only">
                              <el-button type="primary" size="mini" :disabled="idBtnDisabled">添加属性</el-button>
                              <!-- 静态属性的表格 -->
                              <el-table :data="onlyTableData" border stripe>
                                    <el-table-column type="expand">
                                          <template slot-scope="scope">
                                                <el-tag
                                                      v-for="(item ,i ) in scope.row.attr_vals"
                                                      :key="i"
                                                      closable
                                                      @close="handleClosed(i ,scope.row)"
                                                >{{item}}</el-tag>
                                                <!-- 添加New Tag -->
                                                <el-input
                                                      class="input-new-tag"
                                                      v-if="scope.row.inputVisible"
                                                      v-model="scope.row.inputValue"
                                                      ref="saveTagInput"
                                                      size="small"
                                                      @keyup.enter.native="handleInputConfirm(scope.row)"
                                                      @blur="handleInputConfirm(scope.row)"
                                                ></el-input>
                                                <el-button
                                                      v-else
                                                      class="button-new-tag"
                                                      size="small"
                                                      @click="showInput(scope.row)"
                                                >+ New Tag</el-button>
                                          </template>
                                    </el-table-column>
                                    <el-table-column type="index" label="#"></el-table-column>
                                    <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                                    <el-table-column label="操作">
                                          <template slot-scope="scope">
                                                <el-button
                                                      size="mini"
                                                      type="primary"
                                                      icon="el-icon-edit"
                                                      @click="showEditDialog(scope.row.attr_id)"
                                                >编辑</el-button>
                                                <el-button
                                                      size="mini"
                                                      type="danger"
                                                      icon="el-icon-delete"
                                                      @click="showDeleteDialog(scope.row.attr_id)"
                                                >删除</el-button>
                                          </template>
                                    </el-table-column>
                              </el-table>
                        </el-tab-pane>
                  </el-tabs>
            </el-card>

            <el-dialog
                  :title="'添加' + titleText"
                  :visible.sync="addDialogVisible"
                  width="50%"
                  :modal-append-to-body="false"
                  @close="addDialogCloesd"
            >
                  <el-form
                        :model="addForm"
                        :rules="addFormRules"
                        ref="addFormRef"
                        label-width="100px"
                  >
                        <el-form-item :label="titleText" prop="attr_name">
                              <el-input v-model="addForm.attr_name"></el-input>
                        </el-form-item>
                  </el-form>
                  <span slot="footer" class="dialog-footer">
                        <el-button @click="addDialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="addParams">确 定</el-button>
                  </span>
            </el-dialog>

            <!-- 编辑对话框 -->
            <el-dialog
                  :title="'编辑'+titleText"
                  :visible.sync="editDialogVisible"
                  width="50%"
                  :modal-append-to-body="false"
            >
                  <el-form
                        :model="editForm"
                        :rules="editFormRules"
                        ref="editFormRef"
                        label-width="100px"
                  >
                        <el-form-item :label="titleText" prop="attr_name">
                              <el-input v-model="editForm.attr_name"></el-input>
                        </el-form-item>
                  </el-form>
                  <span slot="footer" class="dialog-footer">
                        <el-button @click="editDialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="editParams">确 定</el-button>
                  </span>
            </el-dialog>
      </div>
</template>

<script>
export default {
      data() {
            return {
                  //商品分类列表
                  cateList: [],
                  // 级联选择框的双向绑定数组
                  selectedCateKeys: [],
                  //被激活页签名称
                  activeName: "many",
                  //动态参数的数据
                  manyTableData: [],
                  //静态属性的数据
                  onlyTableData: [],
                  addDialogVisible: false,
                  //添加参数的表单数据对话
                  addForm: {
                        attr_name: ""
                  },
                  //添加表单验证规则对象
                  addFormRules: {
                        attr_name: [
                              {
                                    required: true,
                                    message: "请输入参数名称",
                                    trigger: "blur"
                              }
                        ]
                  },
                  // 编辑对话框的表单数据对象
                  editForm: {
                        attr_name: ""
                  },
                  //编辑表单验证规则对象
                  editFormRules: {
                        attr_name: [
                              {
                                    required: true,
                                    message: "请输入参数名称",
                                    trigger: "blur"
                              }
                        ]
                  },
                  //编辑对话框的显示与隐藏
                  editDialogVisible: false
            };
      },
      created() {
            this.getCateList();
      },
      methods: {
            async getCateList() {
                  const { data: res } = await this.$axios.get("categories");
                  if (res.meta.status !== 200) {
                        return this.$message.error("获取商品分配失败");
                  }
                  this.cateList = res.data;
                  this.$message.success(res.meta.msg);
            },
            // 级联选择框选中变化的时候会触发这个函数
            async handleChange() {
                  //证明选中的不是三级分类
                  this.getParamsList();
            },
            // 触发tabs标签
            handleTabClick() {
                  this.getParamsList();
            },
            // 获取参数列表数据
            async getParamsList() {
                  if (this.selectedCateKeys.length !== 3) {
                        this.selectedCateKeys = [];
                        this.manyTableData = [];
                        this.onlyTableData = [];
                        return;
                  }
                  const { data: res } = await this.$axios.get(
                        `categories/${this.cateId}/attributes`,
                        {
                              params: { sel: this.activeName }
                        }
                  );
                  if (res.meta.status !== 200) {
                        return tihs.$message.error("获取失败");
                  }
                  res.data.forEach(item => {
                        item.attr_vals = item.attr_vals
                              ? item.attr_vals.split(" ")
                              : "";
                        //控制文本框的显示与隐藏
                        item.inputVisible = false;
                        item.inputValue = "";
                  });
                  // console.log(res.data);
                  if (this.activeName === "many") {
                        this.manyTableData = res.data;
                  } else {
                        this.onlyTableData = res.data;
                  }
            },
            //监听对话框的关闭事件
            addDialogCloesd() {
                  this.$refs.addFormRef.resetFields();
            },
            //点击按钮添加
            addParams() {
                  this.$refs.addFormRef.validate(async vaild => {
                        if (!vaild) return;
                        const { data: res } = await this.$axios.post(
                              `categories/${this.cateId}/attributes`,
                              {
                                    attr_name: this.addForm.attr_name,
                                    attr_sel: this.activeName
                              }
                        );
                        if (res.meta.status !== 201) {
                              return this.$message.error("提交失败");
                        }
                        this.$message.success(res.meta.msg);
                        this.addDialogVisible = false;
                        this.getParamsList();
                  });
            },
            //编辑对话框
            async showEditDialog(Id) {
                  const { data: res } = await this.$axios.get(
                        `categories/${this.cateId}/attributes/${Id}`,
                        {
                              params: { attr_sel: this.activeName }
                        }
                  );
                  if (res.meta.status !== 200) {
                        return this.$message.error("获取失败");
                  }
                  this.$message.success(res.meta.msg);
                  this.editForm = res.data;
                  this.editDialogVisible = true;
            },
            //修改表单提交
            async editParams() {
                  const { data: res } = await this.$axios.put(
                        `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
                        {
                              attr_name: this.editForm.attr_name,
                              attr_sel: this.activeName
                        }
                  );
                  if (res.meta.status !== 200) {
                        return this.$message.error("修改失败");
                  }
                  this.$message.success(res.meta.msg);
                  this.getParamsList();
                  this.editDialogVisible = false;
            },
            async showDeleteDialog(Id) {
                  const confirmRuesult = await this.$confirm(
                        "此操作将永久删除该文件, 是否继续?",
                        "提示",
                        {
                              confirmButtonText: "确定",
                              cancelButtonText: "取消",
                              type: "warning"
                        }
                  ).catch(error => error);
                  if (confirmRuesult !== "confirm") {
                        return this.$message.info("已经取消删除");
                  }
                  const { data: res } = await this.$axios.delete(
                        `categories/${this.cateId}/attributes/${Id}`
                  );
                  if (res.meta.status !== 200) {
                        return this.$message.error("删除失败");
                  }
                  this.$message.success("删除成功");
                  this.getParamsList();
            },
            // 文本框失去焦点或按下enter都会触发
            async handleInputConfirm(row) {
                  if (row.inputValue.trim().length === 0) {
                        row.inputValue = "";
                        row.inputVisible = false;
                  }
                  //如果没有return 则证明输入 的内容，需要做后续处理
                  row.attr_vals.push(row.inputValue.trim());
                  row.inputValue = "";
                  row.inputVisible = false;
                  //需要发起请求保存操作
                  const { data: res } = await this.$axios.put(
                        `categories/${this.cateId}/attributes/${row.attr_id}`,
                        {
                              attr_name: row.attr_name,
                              attr_sel: row.attr_sel,
                              attr_vals: row.attr_vals.join("")
                        }
                  );
                  if (res.meta.status !== 200) {
                        return this.$message.error("修改参数失败");
                  }
                  this.$message.success("修改参数成功");
            },
            // 点击按钮将布尔兹便出true
            showInput(row) {
                  row.inputVisible = true;
                  // 让文本框自动获得焦点
                  // nextTick方法的作用就是当页面元素被重新渲染之后，才会指定回调函数中的代码
                  this.$nextTick(_ => {
                        this.$refs.saveTagInput.$refs.input.focus();
                  });
            },
            async handleClosed(i, row) {
                  row.attr_vals.splice(i, 1);
                  const { data: res } = await this.$axios.put(
                        `categories/${this.cateId}/attributes/${row.attr_id}`,
                        {
                              attr_name: row.attr_name,
                              attr_sel: row.attr_sel,
                              attr_vals: row.attr_vals.join("")
                        }
                  );
                  if (res.meta.status !== 200) {
                        return this.$message.error("修改参数失败");
                  }
                  this.$message.success("修改参数成功");
            }
      },
      computed: {
            //如果按钮需要被禁用，则返回true 否则就返回false
            idBtnDisabled() {
                  if (this.selectedCateKeys.length !== 3) {
                        return true;
                  }
                  return false;
            },
            //当前选中的三级分类id
            cateId() {
                  if (this.selectedCateKeys.length === 3) {
                        return this.selectedCateKeys[2];
                  }
                  return null;
            },
            titleText() {
                  if (this.selectedCateKeys == "many") {
                        return "动态参数";
                  }
                  return "静态属性";
            }
      }
};
</script>

<style lang="less" scoped>
.cat_opt {
      margin: 15px 0;
}
.el-tag {
      margin: 10px;
}
.input-new-tag {
      width: 120px;
}
</style>