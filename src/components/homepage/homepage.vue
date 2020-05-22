<template>
  <el-container style="height: 100%">
    <div style="background: #447ed9"></div>
    <el-header>
      <el-menu
        class="el-menu-demo"
        background-color="#447ed9"
        text-color="#fff"
        active-text-color="#fff"
        mode="horizontal"
        >
<!--        <div style="float: left;height: 60px;"><img src="../../assets/logo.png" style="height: 40px;width:110px"></div>-->
        <div style="float: left;height: 60px;width:50px"></div>
        <div style="float: left;color:#fff;height: 60px;line-height: 60px">智慧种植系统</div>
        <el-submenu index="1" style="float: right;right: 0px;">
          <template slot="title">
            你好！
          </template>
<!--          <el-menu-item index="2-1">个人信息</el-menu-item>-->
          <el-menu-item @click="backChoose()">选择设备</el-menu-item>
          <el-menu-item @click="backLogin()">退出登录</el-menu-item>
        </el-submenu>
      </el-menu>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-col>
          <el-menu
            default-active="1-1"
            class="el-menu-vertical-demo">
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>数据显示</span>
              </template>
              <el-menu-item index="1-1" @click="handleSelect">历史数据</el-menu-item>
              <el-menu-item index="1-2" @click="handleSelect">实时数据</el-menu-item>
            </el-submenu>
            <el-menu-item index="2" @click="handleSelect">
              <i class="el-icon-menu"></i>
              <span slot="title">设备调节</span>
            </el-menu-item>
            <el-menu-item index="3" @click="handleSelect">
              <i class="el-icon-document"></i>
              <span slot="title">阈值设置</span>
            </el-menu-item>
            <el-submenu index="4">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>智能种植</span>
              </template>
              <el-menu-item index="4-1" @click="handleSelect">训练模型</el-menu-item>
              <el-menu-item index="4-2" @click="handleSelect">模型预测</el-menu-item>
            </el-submenu>
          </el-menu>
        </el-col>
      </el-aside>
      <el-main>
        <component :is="showPage"></component>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import homepage11 from '@/components/homepage/homepage11'
import homepage12 from '@/components/homepage/homepage12'
import homepage2 from '@/components/homepage/homepage2'
import homepage3 from '@/components/homepage/homepage3'
import homepage41 from '@/components/homepage/homepage41'
import homepage42 from '@/components/homepage/homepage42'
export default {
  name: 'homepage',
  data () {
    return {
      // activeIndex: '1',
      showPage: 'homepage11'
    }
  },
  mounted () {
    // 拦截
    if (this.$store.state.username === 'null') {
      this.$message.error('未登录账号')
      this.$router.push('/')
    }
  },
  components: {
    homepage11,
    homepage12,
    homepage2,
    homepage3,
    homepage41,
    homepage42
  },
  methods: {
    // 退出登录
    backLogin () {
      this.$store.commit('updateUsername', 'null')
      this.$router.push('/')
    },
    backChoose () {
      this.$router.push('/index')
    },
    handleSelect (key, keyPath) {
      switch (key.index) {
        case '1-1':
          this.showPage = 'homepage11'
          break
        case '1-2':
          this.showPage = 'homepage12'
          break
        case '2':
          this.showPage = 'homepage2'
          break
        case '3':
          this.showPage = 'homepage3'
          break
        case '4-1':
          this.showPage = 'homepage41'
          break
        case '4-2':
          this.showPage = 'homepage42'
          break
      }
    }
  },
  computed: {
    chooseDevice () {
      return this.$store.state.chooseDevice
    },
    username () {
      return this.$store.state.username
    }
  }
}
</script>

<style scoped>
  @import "../../style/homepage.css";
</style>
