<template>
      <div>
            <el-breadcrumb separator-class="el-icon-arrow-right">
                  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                  <el-breadcrumb-item>权限管理</el-breadcrumb-item>
                  <el-breadcrumb-item>权限列表</el-breadcrumb-item>
            </el-breadcrumb>
            <el-card class="box-card">
                  <el-table :data="rightList" border style="width: 100%" stripe>
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column prop="authName" label="权限名称"></el-table-column>
                        <el-table-column prop="path" label="路径"></el-table-column>
                        <el-table-column prop="level" label="权限地址">
                              <template slot-scope="scope">
                                    <el-button type="primary" size="mini" v-if="scope.row.level === '0'">一级</el-button>
                                    <el-button type="success" size="mini" v-else-if="scope.row.level === '1'">二级</el-button>
                                    <el-button type="warning" size="mini" v-else="scope.row.level === '2'">三级</el-button>
                              </template>
                        </el-table-column>
                  </el-table>
            </el-card>
      </div>
</template>

<script>
export default {
      name: "rights",
      data() {
            return {
                  rightList: []
            };
      },
      created() {
            this.getRightsList();
      },
      methods: {
            async getRightsList() {
                  const { data: res } = await this.$axios.get("rights/list");
                  if (res.meta.status !== 200) {
                        return this.$message.error("获取数据列表失败");
                  }
                  this.rightList = res.data;
            }
      }
};
</script>

<style lang="less" scoped>
</style>