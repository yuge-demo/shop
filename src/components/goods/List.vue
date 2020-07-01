<template>
      <div>
            <el-breadcrumb separator-class="el-icon-arrow-right">
                  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
                  <el-breadcrumb-item>商品列表</el-breadcrumb-item>
            </el-breadcrumb>

            <el-card>
                  <el-row :gutter="24">
                        <el-col :span="8">
                              <el-input
                                    placeholder="请输入内容"
                                    clearable
                                    v-model="queryInfo.query"
                                    @clear="getGoodsList"
                              >
                                    <el-button
                                          slot="append"
                                          icon="el-icon-search"
                                          @click="getGoodsList"
                                    ></el-button>
                              </el-input>
                        </el-col>
                        <el-col :span="4">
                              <el-button type="primary" @click="goAddPage">添加用户</el-button>
                        </el-col>
                  </el-row>
                  <el-table :data="goodsList" stripe border>
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
                        <el-table-column prop="goods_price" label="商品价格(元)" width="95px"></el-table-column>
                        <el-table-column prop="goods_weight" label="商品重量" width="70px"></el-table-column>
                        <el-table-column label="创建时间" width="140px">
                              <template slot-scope="scope">{{scope.row.add_time | dataFormat}}</template>
                        </el-table-column>
                        <el-table-column label="操作" width="130px">
                              <template slot-scope="scope">
                                    <el-button size="mini" type="primary" icon="el-icon-edit"></el-button>
                                    <el-button
                                          size="mini"
                                          type="danger"
                                          icon="el-icon-delete"
                                          @click="removeById(scope.row.goods_id)"
                                    ></el-button>
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
      </div>
</template>

<script>
export default {
      data() {
            return {
                  queryInfo: {
                        query: "",
                        pagenum: 1,
                        pagesize: 5
                  },
                  total: 0,
                  //商品列表数据
                  goodsList: []
            };
      },
      created() {
            this.getGoodsList();
      },
      methods: {
            async getGoodsList() {
                  const { data: res } = await this.$axios.get("goods", {
                        params: this.queryInfo
                  });
                  if (res.meta.status !== 200) {
                        return this.$message.error("获取失败");
                  }
                  // console.log(res.data);
                  this.goodsList = res.data.goods;
                  this.total = res.data.total;
                  this.$message.success(res.meta.msg);
            },
            handleSizeChange(newSize) {
                  this.queryInfo.pagesize = newSize;
                  this.getGoodsList();
            },
            handleCurrentChange(newNum) {
                  this.queryInfo.pagenum = newNum;
                  this.getGoodsList();
            },
            // 删除商品
            async removeById(id) {
                  const resultConfirm = await this.$confirm(
                        "此操作将永久删除该文件, 是否继续?",
                        "提示",
                        {
                              confirmButtonText: "确定",
                              cancelButtonText: "取消",
                              type: "warning"
                        }
                  ).catch(error => error);
                  if (resultConfirm !== "confirm") {
                        return this.$message.info("已取消删除");
                  }
                  const { data: res } = await this.$axios.delete("goods/" + id);
                  if (res.meta.status !== 200) {
                        return this.$message.error("删除失败");
                  }
                  this.$message.success(res.meta.msg);
                  this.getGoodsList();
            },
            goAddPage() {
                  this.$router.push("/goods/add");
            }
      }
};
</script>

<style lang="less" scoped>
</style>