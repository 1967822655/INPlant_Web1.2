<template>
    <div class="login-box">
        <div class="login-item"><span>用户登录</span></div>
        <div class="login-item">
            <el-input v-model="inputEmail" placeholder="请输入邮箱账号" clearable prefix-icon="el-icon-user"></el-input>
            <div class="hint-box">
                <div @click="setInput(mail)" class="hint-item"  v-for="mail in emails" :key="mail">{{mail}}</div>
            </div>
        </div>
        <div class="login-item">
            <el-input v-model="inputPassword" placeholder="请输入密码" prefix-icon="el-icon-key" show-password @keyup.enter="login"></el-input>
        </div>
        <div class="login-item column-reverse">
            <el-button type="primary" @click="login">登录</el-button>
        </div>
        <div class="login-item space-between">
            <div class="column-reverse size">
                <span @click="changeLoginIndex('registerBox')">注册账号</span>
            </div>
            <div class="column-reverse size">
                <span @click="changeLoginIndex('findBox')">忘记密码</span>
            </div>
        </div>
    </div>
</template>

<script>
import data from '../cache'
export default {
    name: 'loginBox',
    data () {
        return {
            inputEmail: '',
            inputPassword: ''
        }
    },
    methods: {
        setInput (mail) {
            this.inputEmail = mail
        },
        // 登录
        login () {
            if (!this.inputEmail) {
                this.$message.error('尚未填写邮箱')
            } else if (!this.$parent.checkEmail(this.inputEmail)) {
                this.$message.error('邮箱格式不正确')
            } else if (!this.inputPassword) {
                this.$message.error('密码不能为空')
            } else {
                let registerParam = new FormData()
                registerParam.append('username', this.inputEmail)
                registerParam.append('password', this.inputPassword)
                this.axios.post(data.serverSrc + '/user/login', registerParam).then(body => {
                    if (body.data === 'success') {
                        this.changeUsername(this.inputEmail)
                        this.$message.success('登录成功')
                        this.$router.push({path: '/index'})// 跳转主界面
                    } else if (body.data === 'root') {
                        this.changeUsername(this.inputEmail)
                        this.$message.success('登录成功')
                        this.$router.push('/rootIndex')
                    } else if (body.data === 'not exist') {
                        this.$message.error('用户名不存在')
                        this.inputEmail = ''
                        this.inputPassword = ''
                    } else if (body.data === 'password error') {
                        this.$message.error('密码错误')
                        this.inputPassword = ''
                    } else {
                        this.$message.error('发送失败')
                    }
                })
            }
        },
        changeLoginIndex (val) {
            this.$store.commit('updateLoginIndex', val)
        },
        changeUsername (val) {
            this.$store.commit('updateUsername', val)
        }
    },
    computed: {
        emails () {
            if (!this.inputEmail) return []
            if (this.inputEmail.indexOf('@') > -1) return []
            return [
                this.inputEmail + '@qq.com',
                this.inputEmail + '@163.com',
                this.inputEmail + '@126.com',
                this.inputEmail + '@0355.net',
                this.inputEmail + '@263.net',
                this.inputEmail + '@3721.net',
                this.inputEmail + '@yahoo.com',
                this.inputEmail + '@gmail.com',
                this.inputEmail + '@msn.com',
                this.inputEmail + '@hotmail.com',
                this.inputEmail + '@aol.com',
                this.inputEmail + '@ask.com',
                this.inputEmail + '@live.com',
                this.inputEmail + '@yeah.net'
            ]
        }
    }
}
</script>

<style scoped>

</style>
