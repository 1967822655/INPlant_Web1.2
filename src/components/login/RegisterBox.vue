<template>
  <div class="login-box">
    <div class="login-item"><span>用户注册</span></div>
    <div class="login-item">
      <el-input v-model="registerEmail" placeholder="请输入邮箱账号" clearable prefix-icon="el-icon-user"></el-input>
      <div class="hint-box">
        <div @click="setInput(mail)" class="hint-item"  v-for="mail in emails" :key="mail">{{mail}}</div>
      </div>
    </div>
    <div class="login-item space-between">
      <div>
        <el-input v-model="registerCode" placeholder="请输入验证码"></el-input>
      </div>
      <div>
        <span class="span-size" @click="registerSendCode" v-show="show">发送验证</span>
        <span class="span-size count" v-show="!show">{{count}}s</span>
      </div>
    </div>
    <div class="login-item">
      <el-input v-model="registerPassword" placeholder="请输入密码" prefix-icon="el-icon-key" show-password></el-input>
    </div>
    <div class="login-item">
      <el-input v-model="registerAgain" placeholder="请确认密码" prefix-icon="el-icon-key" show-password @keyup.enter="register"></el-input>
    </div>
    <div class="login-item">
      <el-button type="primary" @click="register" style="width: 100%">注册账号</el-button>
    </div>
    <div class="login-item space-between">
      <div class="column-reverse size">
      </div>
      <div class="column-reverse size">
        <span @click="changeLoginIndex('LoginBox')">返回登录</span>
      </div>
    </div>
  </div>
</template>

<script>
import data from '../cache'
export default {
  name: 'registerBox',
  data () {
    return {
      registerEmail: '',
      registerCode: '',
      registerPassword: '',
      registerAgain: '',
      // 30s阻止点击事件
      show: true,
      count: 30,
      timer: null
    }
  },
  methods: {
    setInput (mail) {
      this.registerEmail = mail
    },
    // 发送验证码（注册）
    registerSendCode () {
      if (!this.registerEmail) {
        this.$message.error('尚未填写邮箱')
      } else if (!this.$parent.checkEmail(this.registerEmail)) {
        this.$message.error('邮箱格式不正确')
      } else {
        if (!this.timer) {
          this.show = false
          let node = document.getElementsByClassName('count')
          node[0].style.backgroundColor = '#ccc'
          node[0].style.cursor = 'not-allowed'
          this.count = 30
          this.timer = setInterval(() => {
            if (this.count > 0 && this.count <= 30) {
              this.count--
            } else {
              this.show = true
              clearInterval(this.timer)
              this.timer = null
            }
          }, 1000)
        }
        let registerCode = new FormData()
        registerCode.append('username', this.registerEmail)
        this.axios.post(data.serverSrc + '/user/regsendcode', registerCode).then(body => {
          if (body.data === 'success') {
            this.$message.success('发送成功')
          } else if (body.data === 'has') {
            this.$message.error('用户已存在')
          } else {
            this.$message.error('发送失败')
          }
        })
      }
    },
    // 注册
    register () {
      if (!this.registerEmail) {
        this.$message.error('尚未填写邮箱')
      } else if (!this.$parent.checkEmail(this.registerEmail)) {
        this.$message.error('邮箱格式不正确')
      } else if (!this.registerPassword || !this.registerAgain) {
        this.$message.error('密码不能为空')
      } else if (this.registerPassword !== this.registerAgain) {
        this.$message.error('两次密码不相同')
      } else {
        let registerParam = new FormData()
        registerParam.append('username', this.registerEmail)
        registerParam.append('password', this.registerPassword)
        registerParam.append('code', this.registerCode)
        this.axios.post(data.serverSrc + '/user/reg', registerParam).then(body => {
          if (body.data === 'success') {
            this.$message.success('注册成功')
            // 跳转登录界面
            this.changeLoginIndex('LoginBox')
          } else if (body.data === 'has') {
            this.$message.error('用户已存在')
          } else if (body.data === 'code error') {
            this.$message.error('验证码错误')
          } else {
            this.$message.error('发送失败')
          }
        })
      }
    },
    changeLoginIndex (val) {
      this.$store.commit('updateLoginIndex', val)
    }
  },
  computed: {
    emails () {
      if (!this.registerEmail) return []
      if (this.registerEmail.indexOf('@') > -1) return []
      return [
        this.registerEmail + '@qq.com',
        this.registerEmail + '@163.com',
        this.registerEmail + '@126.com',
        this.registerEmail + '@0355.net',
        this.registerEmail + '@263.net',
        this.registerEmail + '@3721.net',
        this.registerEmail + '@yahoo.com',
        this.registerEmail + '@gmail.com',
        this.registerEmail + '@msn.com',
        this.registerEmail + '@hotmail.com',
        this.registerEmail + '@aol.com',
        this.registerEmail + '@ask.com',
        this.registerEmail + '@live.com',
        this.registerEmail + '@yeah.net'
      ]
    }
  }
}
</script>

<style scoped>

</style>
