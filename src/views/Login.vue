<template>
  <div class="container">
    <header>
      <div class="header-left">
        <span>智慧种植系统平台</span>
      </div>
      <div class="header-right">
        <a href="https://github.com/1967822655/INPlant_Web">项目开源</a>
      </div>
    </header>
    <main>
      <div></div>
      <component :is="this.$store.state.loginIndex"></component>
    </main>
  </div>
</template>

<script>
import LoginBox from '../components/login/LoginBox'
import RegisterBox from '../components/login/RegisterBox'
import FindBox from '../components/login/FindBox'
import '../style/login-box.css'
export default {
  name: 'login',
  data () {
    return {
    }
  },
  methods: {
    // 判断邮箱是否正确
    checkEmail (data) {
      // 正则表达式
      let reg = new RegExp('^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$')
      // 正则验证不通过，格式不对
      if (!reg.test(data)) {
        return false
      } else {
        return true
      }
    }
  },
  components: {
    LoginBox,
    RegisterBox,
    FindBox
  },
  computed: {
    // loginIndex () {
    //   return this.$store.state.loginIndex
    // }
  }
}
</script>

<style scoped>
  .container {
    width: 100%;
    height: 100%;
  }
  header{
    width: 100%;
    height: 51px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .header-left {
    font-size: 26px;
    font-weight: bold;
    padding-left: 10px;
    color: #2c3e50;
  }
  .header-right {
    padding-right: 10px;
  }
  main {
    height: 100%;
    width: 100%;
    display: inline-block;
    background-color: #425ee6;
    background-image: url("../assets/login/login-bgc.jpg");
    background-size: cover;
  }
</style>
