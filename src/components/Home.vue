<template>
      <el-container>
            <el-header>
                  <div>
                        <img src="../assets/logo.png" />
                        <span>电商后台管理系统</span>
                  </div>
                  <el-button type="info" @click="logout">退出</el-button>
            </el-header>
            <el-container>
                  <el-aside :width="isCollapse? '64px':'200px'">
                        <div class="toggle-button" @click="buttonCollapse">|||</div>
                        <el-menu
                              background-color="#333744"
                              text-color="#fff"
                              active-text-color="#409eff"
                              :unique-opened="true"
                              :collapse="isCollapse"
                              :collapse-transition="false"
                              router
                        >
                              <!-- 一级菜单 -->
                              <el-submenu
                                    :index="item.id + ' ' "
                                    v-for="item in menuList"
                                    :key="item.id"
                              >
                                    <!-- 一级菜单的模板区域 -->
                                    <template slot="title">
                                          <i :class="iconsObj[item.id]"></i>
                                          <span>{{item.authName}}</span>
                                    </template>
                                    <!-- 二级菜单 -->
                                    <el-menu-item
                                          :index="'/' + subItem.path+''"
                                          v-for="subItem in item.children"
                                          :key="subItem.id"
                                    >
                                          <template slot="title">
                                                <i class="el-icon-menu"></i>
                                                <span>{{subItem.authName}}</span>
                                          </template>
                                    </el-menu-item>
                              </el-submenu>
                        </el-menu>
                  </el-aside>
                  <el-main>
                        <router-view></router-view>
                  </el-main>
            </el-container>
      </el-container>
</template>
<script>
export default {
      name: "home",
      data() {
            return {
                  //左侧菜单数据
                  menuList: [],
                  //一级菜单的列表头像
                  iconsObj: {
                        "125": "iconfont iconicon_users",
                        "103": "iconfont icontijikongjian",
                        "101": "iconfont iconshangpingouwudai2",
                        "102": "iconfont icondingdan",
                        "145": "iconfont iconicon-test"
                  },
                  //默认不折叠
                  isCollapse: false
            };
      },
      created() {
            this.getMenuList();
      },
      methods: {
            async getMenuList() {
                  const { data: res } = await this.$axios.get("menus");
                  if (res.meta.status !== 200) {
                        return this.$message.error(res.meta.msg);
                  }
                  this.menuList = res.data;
                  console.log(this.menuList);
            },
            // 折叠左侧菜单栏
            buttonCollapse() {
                  // collapse
                  this.isCollapse = !this.isCollapse;
            },
            //退出登录（删除token并跳转）
            logout() {
                  window.sessionStorage.clear();
                  this.$router.push("/login");
            }
      }
};
</script>
<style lang="less" scoped>
.el-container {
      height: 100%;
}
.el-header {
      background-color: #373d41;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-left: 0;
      color: #ffffff;
      font-size: 20px;
      div {
            display: flex;
            align-items: center;
            img {
                  height: 60px;
            }
            span {
                  margin-left: 15px;
            }
      }
}
.el-aside {
      background-color: #333744;
      .el-menu {
            border-right: none;
      }
}
.el-main {
      background-color: #eaedf1;
}
.iconfont {
      margin-right: 10px;
}
.toggle-button {
      background-color: #4a5064;
      font-size: 10px;
      line-height: 24px;
      color: #ffffff;
      text-align: center;
      letter-spacing: 0.2em;
      cursor: pointer;
}
</style>
  