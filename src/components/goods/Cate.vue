<template>
      <div>
            <el-breadcrumb separator-class="el-icon-arrow-right">
                  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
                  <el-breadcrumb-item>商品分类</el-breadcrumb-item>
            </el-breadcrumb>
            <el-card>
                  <!-- 添加分类 -->
                  <el-button type="primary" class="button" @click="showAddDialogVisible">添加分类</el-button>
                  <!-- Tree-Table -->
                  <tree-table
                        :data="cateList"
                        :columns="columns"
                        :selection-type="false"
                        :expand-type="false"
                        show-index
                        index-text="#"
                        border
                  >
                        <template slot="isok" slot-scope="scope">
                              <i
                                    class="el-icon-success"
                                    v-if="scope.row.cat_deleted =attr_name= false"
                                    style="color:lightgreen;"
                              ></i>
                              <i class="el-icon-error" v-else style="color:lightgreen"></i>
                        </template>
                        <template slot="level" slot-scope="scope">
                              <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
                              <el-tag
                                    type="success"
                                    size="mini"
                                    v-else-if="scope.row.cat_level===1"
                              >二级</el-tag>
                              <el-tag type="warning" size="mini" v-else>三级</el-tag>
                        </template>
                        <template slot="opt" slot-scope="scope">
                              <el-button
                                    type="primary"
                                    icon="el-icon-edit"
                                    size="mini"
                                    @click="showEditDialog(scope.row.cat_id)"
                              >编辑</el-button>
                              <el-button
                                    type="danger"
                                    icon="el-icon-delete"
                                    size="mini"
                                    @click="showDelete(scope.row.cat_id)"
                              >删除</el-button>
                        </template>
                  </tree-table>

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

            <!-- 添加分类的对话框 -->
            <el-dialog
                  title="添加分类"
                  :visible.sync="addCateDialogVisible"
                  width="50%"
                  :modal-append-to-body="false"
                  @close="addCateDialogClosed"
            >
                  <el-form
                        ref="addFormRef"
                        :model="addForm"
                        :rules="addFormRules"
                        label-width="100px"
                  >
                        <el-form-item label="分类名称：" prop="cat_name">
                              <el-input v-model="addForm.cat_name"></el-input>
                        </el-form-item>
                        <el-form-item label="分级分类：">
                              <!-- options指定数据的源头 -->
                              <!-- props用来指定配置对象 -->
                              <el-cascader
                                    v-model="selectedKeys"
                                    :options="parentCateList"
                                    :props="{expandTrigger: 'hover',value:'cat_id',label: 'cat_name',children: 'children' }"
                                    @change="parentCateChange"
                                    clearable
                              ></el-cascader>
                        </el-form-item>
                  </el-form>
                  <span slot="footer" class="dialog-footer">
                        <el-button @click="addCateDialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="addUser">确 定</el-button>
                  </span>
            </el-dialog>

            <!-- 编辑对话框 -->
            <el-dialog
                  title="修改分类"
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
                        <el-form-item label="分类名称" prop="cat_name">
                              <el-input v-model="editForm.cat_name"></el-input>
                        </el-form-item>
                  </el-form>
                  <span slot="footer" class="dialog-footer">
                        <el-button @click="editDialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="editCate">确 定</el-button>
                  </span>
            </el-dialog>
      </div>
</template>
<script>
export default {
      name: "cate",
      data() {
            return {
                  //数据
                  cateList: [],
                  //分页的效果设置
                  queryInfo: {
                        type: 3,
                        pagenum: 1,
                        pagesize: 5
                  },
                  total: 0,
                  // 为table指定的定义
                  columns: [
                        {
                              label: "分类名称",
                              prop: "cat_name"
                        },
                        {
                              label: "是否有效",
                              // 表示 将当前列定义为模板列
                              type: "template",
                              // 表示当前这一列使用模板名称
                              template: "isok"
                        },
                        {
                              label: "排序",
                              // 表示 将当前列定义为模板列
                              type: "template",
                              // 表示当前这一列使用模板名称
                              template: "level"
                        },
                        {
                              label: "排序",
                              // 表示 将当前列定义为模板列
                              type: "template",
                              // 表示当前这一列使用模板名称
                              template: "opt"
                        }
                  ],
                  // 添加分类对话框的显示与隐藏
                  addCateDialogVisible: false,
                  //添加分类的表单数据对象
                  addForm: {
                        // 将要添加的分类数据对象
                        cat_name: "",
                        // 父级分类的id
                        cat_pid: 0,
                        // 分类的等级，默认要添加的是哦一级分类
                        cat_level: 0
                  },
                  // 添加分类表单验证规则对象
                  addFormRules: {
                        cat_name: [
                              {
                                    required: true,
                                    message: "请输入分类名称",
                                    trigger: "blur"
                              }
                        ]
                  },
                  //父级分类的列表保存数据
                  parentCateList: [],
                  // 选中的父级选择分类的id数组
                  selectedKeys: [],
                  //编辑对话框的显示与隐藏
                  editDialogVisible: false,
                  //编辑对话框的数据对象
                  editForm: {
                        cat_name: ""
                  },
                  // 编辑对话框的验证规则
                  editFormRules: {
                        cat_name: [
                              {
                                    required: true,
                                    message: "请输入分类名称",
                                    trigger: "blur"
                              }
                        ]
                  }
            };
      },
      created() {
            this.getCateList();
      },
      methods: {
            async getCateList() {
                  const { data: res } = await this.$axios.get("categories", {
                        params: this.queryInfo
                  });
                  if (res.meta.status !== 200) {
                        return this.$message.error("获取商品分配失败");
                  }
                  // console.log(res.data);
                  this.cateList = res.data.result;
                  this.total = res.data.total;
                  this.$message.success(res.meta.msg);
            },
            // 监听pagesize改变的事件
            handleSizeChange(newSize) {
                  this.queryInfo.pagesize = newSize;
                  this.getCateList();
            },
            // 监听pagenum改变的事件
            handleCurrentChange(newNum) {
                  this.queryInfo.pagenum = newNum;
                  this.getCateList();
                  result;
            },
            //点击按钮，展示添加分类对话框
            showAddDialogVisible() {
                  //获取父级数据列表在展示对话列
                  this.getParentCateList();
                  this.addCateDialogVisible = true;
            },
            // 获取父级分类的数据列表
            async getParentCateList() {
                  const { data: res } = await this.$axios.get("categories", {
                        params: { type: 2 }
                  });
                  if (res.meta.status !== 200) {
                        return this.$message.error("获取商品分配失败");
                  }
                  // console.log(res.data);
                  this.parentCateList = res.data;
                  this.$message.success(res.meta.msg);
            },
            //选择项发生变化触发这个函数
            parentCateChange() {
                  // 如果selectedKeys数组中的 length 大于0 证明选中的父级分类
                  // 反之,就说明没有选中任何父级分类
                  if (this.selectedKeys.length > 0) {
                        //父级分类的id
                        this.addForm.cat_pid = this.selectedKeys[
                              this.selectedKeys.length - 1
                        ];
                        //为当前分级的等级赋值
                        this.addForm.cat_level = this.selectedKeys.length;
                        return;
                  } else {
                        //父级分类的id
                        this.addForm.cat_pid = 0;
                        //为当前分级的等级赋值
                        this.addForm.cat_level = 0;
                  }
            },
            addUser() {
                  // console.log(this.addForm);
                  this.$refs.addFormRef.validate(async vaild => {
                        if (!vaild) return;
                        const { data: res } = await this.$axios.post(
                              "categories",
                              this.addForm
                        );
                        if (res.meta.status !== 201) {
                              return this.$message.error("添加分类失败");
                        }
                        this.$message.success(res.meta.msg);
                        this.getCateList();
                        this.addCateDialogVisible = false;
                  });
            },
            //监听对话框的关闭事件,重置表单数据
            addCateDialogClosed() {
                  this.$refs.addFormRef.resetFields();
                  this.selectedKeys = [];
                  this.addForm.cat_pid = 0;
                  this.addForm.cat_level = 0;
            },
            //编辑对话框的显示
            async showEditDialog(id) {
                  const { data: res } = await this.$axios.get(
                        `categories/${id}`
                  );
                  if (res.meta.status !== 200) {
                        return this.$message.error("获取失败");
                  }
                  this.editForm = res.data;
                  // console.log(this.editForm.cat_name);
                  this.$message.success("获取成功");
                  this.editDialogVisible = true;
            },
            //提交编辑编辑对话框的修改
            editCate() {
                  this.$refs.editFormRef.validate(async vaild => {
                        if (!vaild) return;
                        const {
                              data: res
                        } = await this.$axios.put(
                              `categories/${this.editForm.cat_id}`,
                              { cat_name: this.editForm.cat_name }
                        );
                        if (res.meta.status !== 200) {
                              return this.$message.error("更新失败");
                        }
                        this.$message.success(res.meta.msg);
                        this.getCateList();
                        this.editDialogVisible = false;
                  });
            },
            //删除分类
            async showDelete(id) {
                  const resultConfirm = await this.$confirm(
                        "此操作将永久删除该文件, 是否继续?",
                        "提示",
                        {
                              confirmButtonText: "确定",
                              cancelButtonText: "取消",
                              type: "warning"
                        }
                  ).catch(error => error);
                  // console.log(resultConfirm);
                  if (resultConfirm !== "confirm") {
                        return this.$message.info("已经取消删除");
                  }
                  const { data: res } = await this.$axios.delete(
                        "categories/" + id
                  );
                  if (res.meta.status !== 200) {
                        return this.$message.error("删除失败");
                  }
                  this.$message.success(res.meta.msg);
                  this.getCateList();
            }
      }
};
</script>

<style lang="less" scoped>
.button {
      margin-bottom: 15px;
}
.el-cascader {
      width: 100%;
}
</style>