<template>
      <div>
            <el-breadcrumb separator-class="el-icon-arrow-right">
                  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                  <el-breadcrumb-item>订单管理</el-breadcrumb-item>
                  <el-breadcrumb-item>订单列表</el-breadcrumb-item>
            </el-breadcrumb>
            <el-card>
                  <el-row :gutter="24">
                        <el-col :span="8">
                              <el-input
                                    placeholder="请输入内容"
                                    class="input-with-select"
                                    clearable
                                    @clear="getOrderList"
                                    v-model="queryInfo.query"
                              >
                                    <el-button
                                          slot="append"
                                          icon="el-icon-search"
                                          @click="getOrderList"
                                    ></el-button>
                              </el-input>
                        </el-col>
                  </el-row>
                  <el-table :data="orderList" style="width: 100%" border stripe>
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column prop="order_number" label="订单编号" width="500px"></el-table-column>
                        <el-table-column prop="order_price" label="订单价格"></el-table-column>
                        <el-table-column prop="pay_status" label="是否付款">
                              <template slot-scope="scope">
                                    <el-tag v-if="scope.row.order_pay === 1">付款</el-tag>
                                    <el-tag type="danger" v-else>未付款</el-tag>
                              </template>
                        </el-table-column>
                        <el-table-column prop="is_send" label="是否发货"></el-table-column>
                        <el-table-column prop="create_time" label="下单时间">
                              <template slot-scope="scope">{{scope.row.create_time | dataFormat}}</template>
                        </el-table-column>
                        <el-table-column label="操作">
                              <template slot-scope="scope">
                                    <el-button
                                          type="primary"
                                          size="mini"
                                          icon="el-icon-edit"
                                          @click="showBox"
                                    ></el-button>
                                    <el-button
                                          type="success"
                                          size="mini"
                                          icon="el-icon-location-outline"
                                          @click="showProgress"
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

            <el-dialog
                  title="修改地址"
                  :visible.sync="addDialogVisible"
                  :modal-append-to-body="false"
                  width="50%"
                  @close="addDialogVisibleClosed"
            >
                  <el-form
                        :model="addForm"
                        :rules="addFormRules"
                        ref="addFormRef"
                        label-width="100px"
                  >
                        <el-form-item label="省市区/县" prop="address1">
                              <el-cascader
                                    :options="cityData"
                                    v-model="addForm.address1"
                                    change-on-select
                              ></el-cascader>
                        </el-form-item>
                        <el-form-item label="详细地址" prop="address2">
                              <el-input v-model="addForm.address2"></el-input>
                        </el-form-item>
                  </el-form>
                  <span slot="footer" class="dialog-footer">
                        <el-button @click="addDialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="addDialogVisible = false">确 定</el-button>
                  </span>
            </el-dialog>

            <el-dialog
                  title="物流进度"
                  :visible.sync="progressDialogVisible"
                  width="50%"
                  :modal-append-to-body="false"
            >
                  <el-timeline :reverse="false">
                        <el-timeline-item
                              v-for="(activity, index) in progressInfo"
                              :key="index"
                              :timestamp="activity.ftime"
                        >{{activity.context}}</el-timeline-item>
                  </el-timeline>
            </el-dialog>
      </div>
</template>  

<script>
import cityData from "./city_data2017_element";
export default {
      data() {
            return {
                  orderList: [],
                  queryInfo: {
                        query: "",
                        pagenum: 1,
                        pagesize: 5
                  },
                  total: 0,
                  addDialogVisible: false,
                  addForm: {
                        address1: [],
                        address2: ""
                  },
                  addFormRules: {
                        address1: {
                              required: true,
                              message: "请选择省市区",
                              trigger: "blur"
                        },
                        address2: {
                              required: true,
                              message: "请输入详细地址",
                              trigger: "blur"
                        }
                  },
                  cityData: cityData,
                  progressDialogVisible: false,
                  progressInfo: []
            };
      },
      created() {
            this.getOrderList();
      },
      methods: {
            async getOrderList() {
                  const { data: res } = await this.$axios.get("orders", {
                        params: this.queryInfo
                  });
                  if (res.meta.status !== 200) {
                        return this.$message.error("获取失败");
                  }
                  this.orderList = res.data.goods;
                  this.total = res.data.total;
                  // console.log(res.data);
            },
            handleSizeChange(newSize) {
                  this.queryInfo.pagesize = newSize;
                  this.getOrderList();
            },
            handleCurrentChange(newNum) {
                  this.queryInfo.pagenum = newNum;
                  this.getOrderList();
            },
            addDialogVisibleClosed() {
                  this.$refs.addFormRef.resetFields();
            },
            showBox() {
                  this.addDialogVisible = true;
            },
            async showProgress(id) {
                  const { data: res } = await this.$axios.get(
                        "/kuaidi/" + 1106975712662
                  );
                  if (res.meta.status !== 200) {
                        return this.$message.error("获取物流失败");
                  }
                  this.progressInfo = res.data;
                  this.progressDialogVisible = true;
            }
      }
};
</script>

<style lang="less" scoped>
.el-cascader {
      width: 100%;
}
</style>