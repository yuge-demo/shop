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
                        <el-tabs v-model="activeIndex" :tab-position="'left'">
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
                                    <el-form-item label="商品分类">
                                          <el-cascader
                                                v-model="selectedKeys"
                                                :options="cateList"
                                                :props="{ expandTrigger: 'hover' }"
                                                @change="handleChange"
                                          ></el-cascader>
                                    </el-form-item>
                              </el-tab-pane>
                              <el-tab-pane label="商品参数" name="1">商品参数</el-tab-pane>
                              <el-tab-pane label="商品属性" name="2">商品属性</el-tab-pane>
                              <el-tab-pane label="商品图片" name="3">商品图片</el-tab-pane>
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
                        goods_number: 0
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
                        ]
                  },
                  cateList: [],
                  selectedKeys: {}
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
            handleChange() {}
      }
};
</script>

<style lang="less" scoped>
.el-steps {
      margin: 15px 0;
}
</style>