<template>

  <el-header style="padding: 0px;">
    <el-menu
      class="el-menu-demo"
      background-color="#447ed9"
      text-color="#fff"
      active-text-color="#fff"
      mode="horizontal"
    >
      <div style="float: left;color:#fff;height: 60px;line-height: 60px">智慧种植系统</div>
      <el-submenu index="1" style="float: right;right: 0px;">
        <template slot="title">
          你好！
        </template>
        <!--          <el-menu-item index="2-1">个人信息</el-menu-item>-->
        <el-menu-item @click="backLogin()">退出登录</el-menu-item>
      </el-submenu>
    </el-menu>
  </el-header>
</template>

<script>
export default {
  name: 'siteNav',
  methods: {
    // 退出登录
    backLogin () {
      this.$store.commit('updateUsername', 'null')
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>

</style>
