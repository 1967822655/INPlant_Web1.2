<template>
  <div class="login-box">
    <div class="login-item"><span>找回密码</span></div>
    <div class="login-item">
      <el-input v-model="findEmail" placeholder="请输入用户邮箱" clearable prefix-icon="el-icon-user"></el-input>
      <div class="hint-box" v-if="emails">
        <div @click="setInput(mail)" class="hint-item"  v-for="mail in emails" :key="mail">{{mail}}</div>
      </div>
    </div>
    <div class="login-item space-between">
      <div>
        <el-input v-model="findCode" placeholder="请输入验证码"></el-input>
      </div>
      <div>
        <span class="span-size" @click="findSendCode" v-show="show">发送验证</span>
        <span class="span-size count" v-show="!show">{{count}}s</span>
      </div>
    </div>
    <div class="login-item">
      <el-input v-model="findPassword" placeholder="请输入修改密码" prefix-icon="el-icon-key" show-password></el-input>
    </div>
    <div class="login-item">
      <el-input v-model="findAgain" placeholder="请确认密码" prefix-icon="el-icon-key" show-password @keyup.enter="login"></el-input>
    </div>
    <div class="login-item">
      <el-button class="login-item" type="primary" @click="find" style="width: 100%">修改密码</el-button>
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
  name: 'findBox',
  data () {
    return {
      findEmail: '',
      findCode: '',
      findPassword: '',
      findAgain: '',
      show: true,
      count: 30,
      timer: null
    }
  },
  methods: {
    setInput (mail) {
      this.findEmail = mail
    },
    // 发送验证码（找回）
    findSendCode () {
      if (!this.findEmail) {
        this.$message.error('尚未填写邮箱')
      } else if (!this.$parent.checkEmail(this.findEmail)) {
        this.$message.error('邮箱格式不正确')
      } else {
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
        let findCode = new FormData()
        findCode.append('username', this.findEmail)
        this.axios.post(data.serverSrc + '/user/resetpwdsendcode', findCode).then(body => {
          if (body.data === 'success') {
            this.$message.success('发送成功')
          } else if (body.data === 'not exist') {
            this.$message.error('用户名不存在')
          } else {
            this.$message.error('发送失败')
          }
        })
      }
    },
    // 找回密码
    find () {
      if (!this.findEmail) {
        this.$message.error('尚未填写邮箱')
      } else if (!this.$parent.checkEmail(this.findEmail)) {
        this.$message.error('邮箱格式不正确')
      } else if (!this.findPassword || !this.findAgain) {
        this.$message.error('密码不能为空')
      } else if (this.findPassword !== this.findAgain) {
        this.$message.error('两次密码不相同')
      } else {
        let findParam = new FormData()
        findParam.append('username', this.findEmail)
        findParam.append('newpassword', this.findPassword)
        findParam.append('code', this.findCode)
        this.axios.post(data.serverSrc + '/user/resetpwd', findParam).then(body => {
          if (body.data === 'success') {
            this.$message.success('修改成功')
            // 跳转登录界面
            this.changeLoginIndex('LoginBox')
          } else if (body.data === 'error') {
            this.$message.error('修改失败')
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
      if (!this.findEmail) return []
      if (this.findEmail.indexOf('@') > -1) return []
      return [
        this.findEmail + '@qq.com',
        this.findEmail + '@163.com',
        this.findEmail + '@126.com',
        this.findEmail + '@0355.net',
        this.findEmail + '@263.net',
        this.findEmail + '@3721.net',
        this.findEmail + '@yahoo.com',
        this.findEmail + '@gmail.com',
        this.findEmail + '@msn.com',
        this.findEmail + '@hotmail.com',
        this.findEmail + '@aol.com',
        this.findEmail + '@ask.com',
        this.findEmail + '@live.com',
        this.findEmail + '@yeah.net'
      ]
    }
  }
}
</script>

<style scoped>

</style>
