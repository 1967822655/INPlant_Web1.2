<template>
  <el-container style="height: 100%">
    <el-header>
      <el-menu
        class="el-menu-demo"
        background-color="#447ed9"
        text-color="#fff"
        active-text-color="#fff"
        mode="horizontal"
      >
        <!--        <div style="float: left;height: 60px;"><img src="../../assets/logo.png" style="height: 40px;width:110px"></div>-->
        <div style="float: left;height: 60px;width: 50px"></div>
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
    <!--    主界面-->
    <el-main style="width:100%;height: 100%;overflow-y: auto;">
      <div style="height: 50px;width: 100%;padding: 15px">
        <div style="float:left;top: 10px;" class="loader">
          <div class="face">
            <div class="circle"></div>
          </div>
          <div class="face">
            <div class="circle"></div>
          </div>
        </div>
        <span style="float:left;font-size: 40px;margin-left: 20px">实验室</span>
        <!--      添加模块-->
        <el-button type="primary" @click="openAddGroup" style="float: right;margin: 6px 50px">添加新组</el-button>
        <el-button type="primary" @click="openAddDevice" style="float: right;margin: 6px 5px">新设备入库</el-button>
      </div>
      <div style="height: 85%;width: 100%;display: table;overflow-y: auto;">
        <!--        左分组-->
        <div class="leftBody">
          <template>
            <el-table
              :data="numbers"
              height="100%"
              border>
              <el-table-column
                prop="groupID"
                label="实验组"
                width="100">
              </el-table-column>
              <el-table-column
                label="操作"
                width="200">
                <template slot-scope="scope">
                  <el-button type="success" @click="showDetails(scope.row)">查看</el-button>
                  <el-button type="danger" @click="deleteGroupWay(scope.row.groupID)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </div>
        <!--        右详情-->
        <div class="rightBody">
          <div class="titleCss">{{ownGroup.groupID}}</div>
          <!--          设备表-->
          <!--          添加设备-->
          <el-button style="margin-top: 10px;margin-left: 5px" type="primary" @click="clearForm()">添加设备</el-button>
          <el-dialog title="添加设备" :visible.sync="dialogFormVisible">
            <el-form :model="form">
              <el-form-item label="设备ID" :label-width="formLabelWidth">
                <el-input v-model="form.deviceID" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="种类" :label-width="formLabelWidth">
                <el-select v-model="form.kind" placeholder="请选择种类">
                  <el-option label="番茄" value="tomato">番茄</el-option>
                  <el-option label="生菜" value="lettuce">生菜</el-option>
                  <el-option label="芹菜" value="celery">芹菜</el-option>
                  <el-option label="苦瓜" value="bitterMelon">苦瓜</el-option>
                  <el-option label="茄子" value="eggplant">茄子</el-option>
                  <el-option label="甜瓜" value="melon">甜瓜</el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="设备名" :label-width="formLabelWidth">
                <el-input v-model="form.devicename" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="描述" :label-width="formLabelWidth">
                <el-input v-model="form.remarks" autocomplete="off"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="cancelWay()">取 消</el-button>
              <el-button type="primary" @click="addDeviceWay()">确 定</el-button>
            </div>
          </el-dialog>
          <!--          设备表-->
          <table class="imageTable">
            <tr>
              <th>设备名</th>
              <th>操作</th>
            </tr>
            <tr v-for="device in ownGroup.devices" :key="device">
              <td>{{device}}</td>
              <td><el-button type="danger" @click="deleteDevice(ownGroup.groupID, device)">删除设备</el-button></td>
            </tr>
            <tr v-if="!ownGroup.devices[0]">
              <td colspan="2">暂无数据</td>
            </tr>
          </table>
          <!--          用户表-->
          <el-button style="margin-left: 5px" type="primary"  @click="addUserWay()">添加用户</el-button>
          <!--          用户表-->
          <table class="imageTable">
            <tr>
              <th>用户名</th>
              <th>操作</th>
            </tr>
            <tr v-for="user in ownGroup.users" :key="user">
              <td>{{user}}</td>
              <td><el-button type="danger"  @click="deleteUser(ownGroup.groupID, user)">删除用户</el-button></td>
            </tr>
            <tr v-if="!ownGroup.users[0]">
              <td colspan="2">暂无数据</td>
            </tr>
          </table>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import data from '../cache'
export default {
  name: 'RootIndex',
  data () {
    return {
      numbers: null,
      // 左边详细显示
      ownGroup: {
        groupID: null,
        devices: [],
        users: []
      },
      dialogTableVisible: false,
      dialogFormVisible: false,
      form: {
        deviceID: '',
        kind: '',
        devicename: '',
        remarks: ''
      },
      formLabelWidth: '120px'
    }
  },
  mounted () {
    // 获取用户名
    if (this.username === 'null') {
      this.$message.error('未登录账号')
      this.$router.push('/')
    }
    console.log(this.username)
    this.showGroup()
  },
  methods: {
    // 退出登录
    backLogin () {
      this.$store.commit('updateUsername', 'null')
      this.$router.push('/')
    },
    // 跳转单个实验台详细界面
    enterInterface () {
      this.$router.push('/INPlant_Web/homepage')
    },
    // 展示组
    showGroup () {
      this.axios.get(data.serverSrc + '/root/showgroup').then(body => {
        console.log(body)
        this.numbers = body.data
        this.showDetails(this.numbers[0])
      })
    },
    // 添加组 弹出界面
    openAddGroup () {
      this.$prompt('请输入组名', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        this.addGroupWay(value)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        })
      })
    },
    // 添加设备入库
    openAddDevice () {
      this.$prompt('请输入新设备', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        let temp = new FormData()
        temp.append('deviceID', value)
        this.axios.post(data.serverSrc + '/root/newdevtest', temp).then(body => {
          if (body.data === 'valid') {
            this.$message.success('设备连接有效')
            this.axios.post(data.serverSrc + '/root/adddev', temp).then(body => {
              if (body.data === 'success') {
                this.$message.success('设备入库成功')
              } else if (body.data === 'has') {
                this.$message.error('设备已入库')
              }
            })
          } else if (body.data === 'invalid') {
            this.$message.error('设备连接无效')
          } else if (body.data === 'has') {
            this.$message.error('设备已存在')
          } else {
            this.$message.error('请求失败')
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        })
      })
    },
    // 添加组
    addGroupWay (val) {
      if (val) {
        let addGroup = new FormData()
        addGroup.append('groupID', val)
        this.axios.post(data.serverSrc + '/root/addgroup', addGroup).then(body => {
          if (body.data === 'success') {
            this.$message.success('添加成功')
            this.showGroup()
          } else if (body.data === 'failed') {
            this.$message.error('添加失败')
          } else if (body.data === 'has') {
            this.$message.error('组已存在')
          } else {
            this.$message.error('请求失败')
          }
        })
      }
    },
    // 删除组
    deleteGroupWay (val) {
      if (val) {
        let deleteGroup = new FormData()
        deleteGroup.append('groupID', val)
        this.axios.post(data.serverSrc + '/root/delgroup', deleteGroup).then(body => {
          if (body.data === 'success') {
            this.$message.success('删除成功')
            this.showGroup()
          } else if (body.data === 'failed') {
            this.$message.error('添加失败')
          } else if (body.data === 'no has') {
            this.$message.error('组不存在')
          } else if (body.data === 'userlist not null') {
            this.$message.error('用户列表不为空，无法删除')
          } else if (body.data === 'devlist not null') {
            this.$message.error('设备列表不为空，无法删除')
          } else {
            this.$message.error('请求失败')
          }
        })
      }
    },
    // 查看详细信息
    showDetails (val) {
      console.log(val)
      this.ownGroup.groupID = null
      this.ownGroup.devices = []
      this.ownGroup.users = []
      this.ownGroup.groupID = val.groupID
      if (val.devices) {
        this.ownGroup.devices = val.devices
      } else {
        this.ownGroup.devices = []
      }
      if (val.users) {
        this.ownGroup.users = val.users
      } else {
        this.ownGroup.users = []
      }
    },
    // 删除设备
    deleteDevice () {
      let temp = new FormData()
      console.log(arguments)
      temp.append('groupID', arguments[0])
      temp.append('deviceID', arguments[1])
      this.axios.post(data.serverSrc + '/root/deldevingroup', temp).then(body => {
        if (body.data === 'success') {
          this.$message.success('设备删除成功')
          this.flashDetails()
        } else if (body.data === 'failed') {
          this.$message.error('设备删除失败')
        } else if (body.data === 'not has') {
          this.$message.error('设备不存在')
        } else if (body.data === 'device not exsit') {
          this.$message.error('设备不存在')
        } else {
          this.$message.error('请求失败')
        }
      })
    },
    // 删除用户
    deleteUser (val) {
      let temp = new FormData()
      console.log(arguments)
      temp.append('groupID', arguments[0])
      temp.append('username', arguments[1])
      this.axios.post(data.serverSrc + '/root/deluseringroup', temp).then(body => {
        if (body.data === 'success') {
          this.$message.success('用户删除成功')
          this.flashDetails()
        } else if (body.data === 'failed') {
          this.$message.error('用户删除失败')
        } else if (body.data === 'not has') {
          this.$message.error('用户不存在')
        } else {
          this.$message.error('请求失败')
        }
      })
    },
    // 刷新详细信息
    flashDetails () {
      this.axios.get(data.serverSrc + '/root/showgroup').then(body => {
        console.log(body)
        this.numbers = body.data
        for (let number in this.numbers) {
          if (this.numbers[number].groupID === this.ownGroup.groupID) {
            // 展示详细信息
            this.showDetails(this.numbers[number])
          }
        }
      })
    },
    // 添加设备
    addDeviceWay () {
      let temp = new FormData()
      temp.append('groupID', this.ownGroup.groupID)
      temp.append('deviceID', this.form.deviceID)
      temp.append('kind', this.form.kind)
      temp.append('devicename', this.form.devicename)
      temp.append('remarks', this.form.remarks)
      console.log(this.form)
      this.axios.post(data.serverSrc + '/root/adddevingroup', temp).then(body => {
        if (body.data === 'success') {
          this.$message.success('设备添加成功')
          this.flashDetails()
        } else if (body.data === 'device not exsit') {
          this.$message.error('设备不存在')
        } else if (body.data === 'device is already in use') {
          this.$message.error('设备已被使用')
        } else if (body.data === 'failed') {
          this.$message.error('设备添加失败')
        } else if (body.data === 'has') {
          this.$message.error('设备已存在')
        } else {
          this.$message.error('请求失败')
        }
      })
      this.dialogFormVisible = false
    },
    // 添加用户
    addUserWay () {
      this.$prompt('请输入用户名', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        let temp = new FormData()
        temp.append('groupID', this.ownGroup.groupID)
        temp.append('username', value)
        this.axios.post(data.serverSrc + '/root/adduseringroup', temp).then(body => {
          if (body.data === 'success') {
            this.$message.success('用户添加成功')
            this.flashDetails()
          } else if (body.data === 'has') {
            this.$message.error('用户已存在')
          } else if (body.data === 'failed') {
            this.$message.error('用户添加失败')
          } else {
            this.$message.error('请求失败')
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        })
      })
    },
    // clear
    clearForm () {
      this.form.deviceID = ''
      this.form.kind = ''
      this.form.devicename = ''
      this.form.remarks = ''
      this.dialogFormVisible = true
    },
    cancelWay () {
      this.dialogFormVisible = false
      this.$message.info('取消输入')
    }
  },
  computed: {
    username () {
      return this.$store.state.username
    }
  }
}
</script>

<style scoped>
  @import "../../style/style.css";
  @import "../../style/translateelement.css";
  .el-header {
    min-width: 625px;
    background-color: #B3C0D1;
    color: #333;
    padding: 0px;
    /*text-align: center;*/
    /*line-height: 60px;*/
  }
  .el-main {
    background-color: #E9EEF3;
    min-width: 625px;
    color: #333;
    padding: 0px;
    overflow: hidden;
    /*text-align: center;*/
    /*line-height: 160px;*/
  }
  body > .el-container {
    margin-bottom: 40px;
  }
  .addGroup {
    position: absolute;
    top: 61px;
    left: 50%;
    transform: translate(-50%, 0%);
    height: 500px;
    min-width: 500px;
    max-width: 800px;
    width: 80%;
    background-color: #898989;
    -webkit-border-radius: 20px;
    -moz-border-radius: 20px;
    border-radius: 20px;
    z-index: 99;
  }
  .leftBody {
    width:300px;
    height: 100%;
    display: table-cell
  }
  .rightBody {
    overflow: auto;
    height: 100%;
    display: table-cell;
    overflow-x: hidden;
    overflow-y: auto;
  }
  table.imageTable {
    font-family: verdana,arial,sans-serif;
    font-size:11px;
    color:#333333;
    border-width: 1px;
    border-color: #999999;
    border-collapse: collapse;
    width: 100%;
    margin: 10px 5px 10px 5px;
  }
  table.imageTable th {
    background: rgba(137, 137, 137, 0.2);
    border-width: 1px;
    padding: 8px;
    border-style: solid;
    border-color: #999999;
    width: 50%;
  }
  table.imageTable td {
    background:#ffffff;
    border-width: 1px;
    padding: 8px;
    border-style: solid;
    border-color: #999999;
    width: 50%;
    /*text-align: center;*/
  }
  .titleCss {
    background-color: #fff;
    border-radius: 20px;
    margin-left: 5px;
    padding-left: 5px;
    font-size: 24px;
  }
</style>
