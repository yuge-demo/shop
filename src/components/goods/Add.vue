<template>
      <div>
            <el-breadcrumb separator-class="el-icon-arrow-right">
                  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
                  <el-breadcrumb-item>添加商品</el-breadcrumb-item>
            </el-breadcrumb>
            <el-card>
                  <el-alert title="添加商品信息" type="info" show-icon center :closable="false"></el-alert>
                  <el-steps :active="activeIndex-0" align-center finish-status="success">
                        <el-step title="基本信息"></el-step>
                        <el-step title="商品参数"></el-step>
                        <el-step title="商品属性"></el-step>
                        <el-step title="商品图片"></el-step>
                        <el-step title="商品内容"></el-step>
                        <el-step title="完成"></el-step>
                  </el-steps>
                  <el-form
                        :model="addForm"
                        :rules="addFormRules"
                        ref="addFormRef"
                        label-width="100px"
                        label-position="top"
                  >
                        <el-tabs
                              v-model="activeIndex"
                              :tab-position="'left'"
                              :before-leave="beforeTabLeave"
                              @tab-click="tavClicked"
                        >
                              <el-tab-pane label="基本信息" name="0">
                                    <el-form-item label="商品名称" prop="goods_name">
                                          <el-input v-model="addForm.goods_name"></el-input>
                                    </el-form-item>
                                    <el-form-item label="商品价格" prop="goods_price" type="number">
                                          <el-input v-model="addForm.goods_price"></el-input>
                                    </el-form-item>
                                    <el-form-item label="商品重量" prop="goods_weight" type="number">
                                          <el-input v-model="addForm.goods_weight"></el-input>
                                    </el-form-item>
                                    <el-form-item label="商品数量" prop="goods_number" type="number">
                                          <el-input v-model="addForm.goods_number"></el-input>
                                    </el-form-item>
                                    <el-form-item label="商品分类" prop="goods_cat">
                                          <el-cascader
                                                v-model="addForm.goods_cat"
                                                :options="cateList"
                                                :props="{expandTrigger: 'hover',value:'cat_id',label: 'cat_name',children: 'children' }"
                                                @change="handleChange"
                                                clearable
                                          ></el-cascader>
                                    </el-form-item>
                              </el-tab-pane>
                              <el-tab-pane label="商品参数" name="1">
                                    <el-form-item
                                          :label="item.attr_name"
                                          v-for="item in manyTableData"
                                          :key="item.attr_id"
                                    >
                                          <el-checkbox-group v-model="item.attr_vals">
                                                <el-checkbox
                                                      border
                                                      :label="cb"
                                                      v-for="(cb ,i) in item.attr_vals"
                                                      :key="i"
                                                ></el-checkbox>
                                          </el-checkbox-group>
                                    </el-form-item>
                              </el-tab-pane>
                              <el-tab-pane label="商品属性" name="2">
                                    <el-form-item
                                          :label="item.attr_name"
                                          v-for="item in onlyTableData"
                                          :key="item.attr_id"
                                    >
                                          <el-input v-model="item.attr_vals"></el-input>
                                    </el-form-item>
                              </el-tab-pane>
                              <el-tab-pane label="商品图片" name="3">
                                    <el-upload
                                          action="https://www.liulongbin.top:8888/api/private/v1/upload"
                                          :on-preview="handlePreview"
                                          :on-remove="handleRemove"
                                          list-type="picture"
                                          headers="headerObj"
                                          on-success="handleSuccess"
                                    >
                                          <el-button size="small" type="primary">点击上传</el-button>
                                          <div
                                                slot="tip"
                                                class="el-upload__tip"
                                          >只能上传jpg/png文件，且不超过500kb</div>
                                    </el-upload>
                              </el-tab-pane>
                              <el-tab-pane label="商品内容" name="4">商品内容</el-tab-pane>
                        </el-tabs>
                  </el-form>
            </el-card>
      </div>
</template>

<script>
export default {
      data() {
            return {
                  activeIndex: "0",
                  //添加商品表单数据对象
                  addForm: {
                        goods_name: "",
                        goods_price: 0,
                        goods_weight: 0,
                        goods_number: 0,
                        goods_cat: []
                  },
                  //添加表单验证规则对象
                  addFormRules: {
                        goods_name: [
                              {
                                    required: true,
                                    message: "请输入商品名称",
                                    trigger: "blur"
                              }
                        ],
                        goods_price: [
                              {
                                    required: true,
                                    message: "请输入商品价格",
                                    trigger: "blur"
                              }
                        ],
                        goods_weight: [
                              {
                                    required: true,
                                    message: "请输入商品重量",
                                    trigger: "blur"
                              }
                        ],
                        goods_number: [
                              {
                                    required: true,
                                    message: "请输入商品数量",
                                    trigger: "blur"
                              }
                        ],
                        goods_cat: [
                              {
                                    required: true,
                                    message: "请选择商品分类",
                                    trigger: "blur"
                              }
                        ]
                  },
                  cateList: [],
                  //商品参数数据对象
                  manyTableData: [],
                  //商品属性数据对象
                  onlyTableData: [],
                  //图片上传的请求头
                  headerObj: {
                        Authorization: window.sessionStorage.getItem("token")
                  },

                  pics:[]
            };
      },
      created() {
            this.getCateList();
      },
      methods: {
            async getCateList() {
                  const { data: res } = await this.$axios.get("categories", {
                        params: { type: 3 }
                  });
                  if (res.meta.status !== 200) {
                        return this.$message.error("获取失败");
                  }
                  this.cateList = res.data;
                  // console.log(res.data);
            },
            //级联选择器变化会触发这个函数
            handleChange() {
                  if (this.addForm.goods_cat.length !== 3) {
                        this.addForm.goods_cat = [];
                  }
            },
            // 即将离开的标签页 activeName
            // 即将进入的标签页 oldActiveName
            beforeTabLeave(activeName, oldActiveName) {
                  if (
                        oldActiveName === "0" &&
                        this.addForm.goods_cat.length !== 3
                  ) {
                        this.$message.error("请先选择商品分类");
                        return false;
                  }
            },
            async tavClicked() {
                  // 访问的是动态参数面板
                  if (this.activeIndex === "1") {
                        const { data: res } = await this.$axios.get(
                              `categories/${this.cateId}/attributes`,
                              {
                                    params: { sel: "many" }
                              }
                        );
                        if (res.meta.status !== 200) {
                              return this.$message.error("获取失败");
                        }
                        res.data.forEach(item => {
                              item.attr_vals =
                                    item.attr_vals.length === 0
                                          ? []
                                          : item.attr_vals.split("");
                        });
                        this.manyTableData = res.data;
                  } else if (this.activeIndex === "2") {
                        const { data: res } = await this.$axios.get(
                              `categories/${this.cateId}/attributes`,
                              {
                                    params: { sel: "only" }
                              }
                        );
                        if (res.meta.status !== 200) {
                              return this.$message.error("获取失败");
                        }
                        this.onlyTableData = res.data;
                  }
            },
            //处理图片预览的效果
            handlePreview() {},
            //删除照片的效果
            handleRemove() {},
            //监听图片上传的成功事件
            handleSuccess(response) {
                  // 1.拼接图片信息对象
                  // 2.将图片信息对象push到pics数组中
            }
      },
      computed: {
            cateId() {
                  if (this.addForm.goods_cat.length === 3) {
                        // console.log(this.addForm.goods_cat[2]);
                        return this.addForm.goods_cat[2];
                  }
                  return null;
            }
      }
};
</script>

<style lang="less" scoped>
.el-steps {
      margin: 15px 0;
}
.el-tabs {
      margin-bottom: 50px;
}
.el-checkbox {
      margin: 0 5px 0 0 !important;
}
</style>