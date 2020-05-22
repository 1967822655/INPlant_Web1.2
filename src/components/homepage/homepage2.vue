<template>
  <div class="module">
    <!--    手动调节-->
    <div class="module-title">
      <p>手动调节</p>
    </div>
    <el-divider></el-divider>
    <div class="module-content" v-loading="fullscreenLoading">
      <!--      蓝色-->
      <el-row  class="deviceSettings-input" :gutter="10">
        <el-col :span="8">
          <el-card class="box-card" shadow="hover">
            <div>
              <el-tag class="card-name">光照时间</el-tag>
              <i class="el-icon-edit-outline card-edit" v-show="lightNotEdit" @click="lightNotEdit = !lightNotEdit"></i>
              <i class="el-icon-finished card-edit" v-show="!lightNotEdit" @click="commitLightToServer()"></i>
              <i class="el-icon-close card-edit" v-show="!lightNotEdit" @click="lightNotEdit = !lightNotEdit"></i>
            </div>
            <div>
              <input
                type="number"
                v-model="lightSet"
                :disabled="lightNotEdit">
<!--              <input-->
<!--                type="number"-->
<!--                v-model="ChangeLedTime"-->
<!--                :disabled="true">-->
              <span class="changeTime">{{ChangeLedTime}}</span>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="box-card" shadow="hover">
            <div>
              <el-tag class="card-name">风扇时间</el-tag>
              <i class="el-icon-edit-outline card-edit" v-show="fanNotEdit" @click="fanNotEdit = !fanNotEdit"></i>
              <i class="el-icon-finished card-edit" v-show="!fanNotEdit" @click="commitFanTimeToServer()"></i>
              <i class="el-icon-close card-edit" v-show="!fanNotEdit" @click="fanNotEdit = !fanNotEdit"></i>
            </div>
            <div>
              <input
                type="number"
                v-model="fanSet"
                :disabled="fanNotEdit">
<!--              <input-->
<!--                type="number"-->
<!--                v-model="ChangeFanTime"-->
<!--                :disabled="true">-->
              <span class="changeTime">{{ChangeFanTime}}</span>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="box-card" shadow="hover">
            <div>
              <el-tag class="card-name">营养液浓度(us/cm)</el-tag>
              <i class="el-icon-edit-outline card-edit" v-show="nutrientNotEdit" @click="nutrientNotEdit = !nutrientNotEdit"></i>
              <i class="el-icon-finished card-edit" v-show="!nutrientNotEdit" @click="commitNutrientToServer()"></i>
              <i class="el-icon-close card-edit" v-show="!nutrientNotEdit" @click="nutrientNotEdit = !nutrientNotEdit"></i>
            </div>
            <div>
              <input
                type="number"
                v-model="nutrientSet"
                :disabled="nutrientNotEdit">
            </div>
          </el-card>
        </el-col>
      </el-row>
      <!--      黄色-->
      <el-row class="deviceSettings-switch" :gutter="10">
        <el-col :span="8">
          <el-card class="box-card" shadow="hover">
            <el-tag class="card-name">LED灯</el-tag>
            <el-switch
              v-model="ledSetAndValue"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="commitLedToServer()">
            </el-switch>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="box-card" shadow="hover">
            <el-tag class="card-name">风扇</el-tag>
            <el-switch
              v-model="fanSetAndValue"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="commitFanToServer()">
            </el-switch>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="box-card" shadow="hover">
            <el-tag class="card-name">循环泵</el-tag>
            <el-switch
              v-show="autoControl==='out'"
              v-model="pumpSetAndValue"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="commitPumpToServer()">
            </el-switch>
            <el-switch
              v-show="autoControl!=='out'||autoControl===''"
              v-model="pumpSetAndValue"
              disabled>
            </el-switch>
          </el-card>
        </el-col>
      </el-row>
      <el-row class="deviceSettings-switch" :gutter="10">
        <el-col :span="8">
          <el-card class="box-card" shadow="hover">
            <el-tag class="card-name">抽水</el-tag>
            <el-switch
              v-model="chouShui"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="chouShuiToServer()">
            </el-switch>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="box-card" shadow="hover">
            <el-tag class="card-name">放水</el-tag>
            <el-switch
              v-model="fangShui"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="fangShuiToServer()">
            </el-switch>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="box-card" shadow="hover">
            <el-tag class="card-name">换箱</el-tag>
            <el-switch
              v-model="huanXiang"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="huanXiangToServer()">
            </el-switch>
          </el-card>
        </el-col>
      </el-row>
      <div style="font-size: 12px;font-weight: bold;margin-bottom: 20px">营养液自动调配状态：
      <span v-if="autoControl==='out'">未调配</span>
      <span v-if="autoControl==='auto_compound'">正在调配营养液</span>
      <span v-if="autoControl==='auto_changew'">正在换箱</span>
      <span v-if="autoControl==='auto_circulatew'">正在循环</span>
      </div>
    </div>
    <!--    自动调节-->
    <div class="module-title">
      <p>自动调节</p>
    </div>
    <el-divider></el-divider>
  </div>
</template>

<script>
import data from '../cache'
export default {
  name: 'homepage2',
  created () {
    // websocket初始化 -> load data of nutrient light fan
    this.setAllInterval()
    this.initWebSocket()
  },
  // 离开该层时执行
  beforeDestroy () {
    // 离开路由之后断开websocket连接
    this.clearAllInterval()
    this.websock.close()
  },
  data () {
    return {
      nutrientSet: 0,
      lightSet: 0,
      fanSet: 0,
      fanSetAndValue: false,
      fanTime: 0,
      ChangeFanTime: '',
      ledSetAndValue: false,
      ledTime: 0,
      ChangeLedTime: '',
      pumpSetAndValue: false,
      chouShui: false,
      fangShui: false,
      huanXiang: false,
      autoControl: '',
      nutrientNotEdit: true,
      lightNotEdit: true,
      fanNotEdit: true,
      fullscreenLoading: false,
      editObjectName: '',
      websock: undefined,
      ledInterval: null,
      fanInterval: null
    }
  },
  methods: {
    // 初始化websocket
    initWebSocket () {
      const path = 'ws://106.15.195.144:8081/webSocket'
      this.websock = new WebSocket(path)
      this.websock.onmessage = this.websocketOnMessage
      this.websock.onopen = this.websocketOnOpen
      this.websock.onerror = this.websocketOnError
      this.websock.onclose = this.websocketClose
    },
    // 连接建立
    websocketOnOpen () {
      this.websocketSend()
    },
    // 连接建立失败重连
    websocketOnError () {
      this.initWebSocket()
    },
    // 数据接收
    websocketOnMessage (e) {
      if (e.data === 'false') {
      } else {
        let data = JSON.parse(e.data)
        /**
         * 修改状态中，开关类型参数等待10s内，再显示实时数据正常值
         */
        if (this.editObjectName !== '') {
          setTimeout(() => {
            //  返回初始值
            this.editObjectName = ''
          }, 1000 * 10)
        } else {
          /**
           * 未修改状态中如果数据没变化则不需要同步到view层
           */
          if (this.nutrientNotEdit && this.nutrientSet !== data.ec) {
            this.nutrientSet = data.ec
          }
          // if (this.fanNotEdit && this.nutrientSet !== data.fantime) {
          //   this.fanSet = data.fantime
          // }
          if (this.fanSetAndValue !== Boolean(data['fan'])) {
            this.fanSetAndValue = Boolean(data['fan'])
          }
          if (this.ledSetAndValue !== Boolean(data['LED'])) {
            this.ledSetAndValue = Boolean(data['LED'])
          }
          if (this.pumpSetAndValue !== Boolean(data['pump'])) {
            this.pumpSetAndValue = Boolean(data['pump'])
          }
          if (this.chouShui !== Boolean(data['choushui'])) {
            this.chouShui = Boolean(data['shoushui'])
          }
          if (this.fangShui !== Boolean(data['fangshui'])) {
            this.fangShui = Boolean(data['fangshui'])
          }
          if (this.huanXiang !== Boolean(data['huanxiang'])) {
            this.huanXiang = Boolean(data['huanxiang'])
          }
          if (this.autoControl !== data['auto_control']) {
            this.autoControl = data['auto_control']
          }
          if (this.ledTime !== data['ledtime']) {
            this.ledTime = data['ledtime']
          }
          if (this.fanTime !== data['fantime']) {
            this.fanTime = data['fantime']
          }
        }
      }
    },
    // 数据发送
    websocketSend () {
      // this.websock.send('6af6188e14aa')
      this.websock.send(this.chooseDevice)
    },
    // 关闭
    websocketClose () {
    },
    /**
     * 1.check inputvalue -> commit to server ->load
     * 3.display true value
     */
    // 发送给服务器
    commitToServer (msg) {
      var upCtrl = new FormData()
      upCtrl.append('username', this.username)
      upCtrl.append('deviceID', this.chooseDevice)
      upCtrl.append('msg', msg)
      // 超时10s
      this.axios.post(data.serverSrc + '/dev/downctrl', upCtrl).then(body => {
        var infoMsg = '提交成功'
        if (body.data === 'recvice error') {
          infoMsg = '下行异常'
        } else if (body.data === 'time out') {
          infoMsg = '下行响应超时'
        }
        this.fullscreenLoading = !this.fullscreenLoading
        this.$notify.info({
          title: '消息',
          message: infoMsg
        })
      }).catch(() => {
        this.fullscreenLoading = !this.fullscreenLoading
        this.$notify.error({
          title: '消息',
          message: '操作失败'
        })
      })
    },
    // 数值类型
    commitNutrientToServer () {
      this.nutrientNotEdit = !this.nutrientNotEdit
      this.fullscreenLoading = !this.fullscreenLoading
      var newNutrient = parseFloat(this.nutrientSet)
      if (newNutrient >= 0 && newNutrient <= 4400) {
        var msg = JSON.stringify({
          'ec': newNutrient,
          'style': 0
        })
        this.commitToServer(msg)
      } else {
        this.fullscreenLoading = !this.fullscreenLoading
        this.$notify.error({
          title: '错误',
          message: '输入数值无效'
        }, 1000)
      }
    },
    commitLightToServer () {
      this.lightNotEdit = !this.lightNotEdit
      this.fullscreenLoading = !this.fullscreenLoading
      var newLight = parseFloat(this.lightSet)
      this.lightSet = 0
      if (newLight >= 0) {
        var msg = JSON.stringify({
          'light': newLight
        })
        this.commitToServer(msg)
      } else {
        this.fullscreenLoading = !this.fullscreenLoading
        this.$notify.error({
          title: '错误',
          message: '输入数值无效'
        }, 1000)
      }
    },
    commitFanTimeToServer () {
      this.fanNotEdit = !this.fanNotEdit
      this.fullscreenLoading = !this.fullscreenLoading
      var newFan = parseFloat(this.fanSet)
      this.fanSet = 0
      if (newFan >= 0) {
        var msg = JSON.stringify({
          'fan_time': newFan
        })
        this.commitToServer(msg)
      } else {
        this.fullscreenLoading = !this.fullscreenLoading
        this.$notify.error({
          title: '错误',
          message: '输入数值无效'
        }, 1000)
      }
    },
    // 开关类型
    commitFanToServer () {
      this.fullscreenLoading = !this.fullscreenLoading
      this.editObjectName = 'fan'
      var msg = JSON.stringify({
        'fan': this.fanSetAndValue ? 1 : 0
      })
      this.commitToServer(msg)
    },
    commitLedToServer () {
      this.fullscreenLoading = !this.fullscreenLoading
      this.editObjectName = 'LED'
      var msg = JSON.stringify({
        'LED': this.ledSetAndValue ? 1 : 0
      })
      this.commitToServer(msg)
    },
    commitPumpToServer () {
      this.fullscreenLoading = !this.fullscreenLoading
      this.editObjectName = 'pump'
      var msg = JSON.stringify({
        'pump': this.pumpSetAndValue ? 1 : 0,
        'style': 0
      })
      this.commitToServer(msg)
    },
    chouShuiToServer () {
      this.fullscreenLoading = !this.fullscreenLoading
      this.editObjectName = 'chouShui'
      var msg = JSON.stringify({
        'choushui': this.pumpSetAndValue ? 1 : 0,
        'style': 1
      })
      this.commitToServer(msg)
    },
    fangShuiToServer () {
      this.fullscreenLoading = !this.fullscreenLoading
      this.editObjectName = 'fangShui'
      var msg = JSON.stringify({
        'fangshui': this.fangShui ? 1 : 0,
        'style': 1
      })
      this.commitToServer(msg)
    },
    huanXiangToServer () {
      this.fullscreenLoading = !this.fullscreenLoading
      this.editObjectName = 'huanXiang'
      var msg = JSON.stringify({
        'huanxiang': this.huanXiang ? 1 : 0,
        'style': 1
      })
      this.commitToServer(msg)
    },
    setAllInterval () {
      let that = this
      this.ledInterval = setInterval(function () {
        if (that.ledTime !== 0) {
          that.ledTime -= 1
        }
        that.ChangeLedTime = that.formatSeconds(that.ledTime)
      }, 1000)
      this.fanInterval = setInterval(function () {
        if (that.fanTime !== 0) {
          that.fanTime -= 1
        }
        that.ChangeFanTime = that.formatSeconds(that.fanTime)
      }, 1000)
    },
    clearAllInterval () {
      clearInterval(this.ledInterval)
      clearInterval(this.fanInterval)
    },
    formatSeconds (value) {
      var secondTime = parseInt(value)// 秒
      var minuteTime = 0// 分
      var hourTime = 0// 小时
      if (secondTime > 60) { // 如果秒数大于60，将秒数转换成整数
        // 获取分钟，除以60取整数，得到整数分钟
        minuteTime = parseInt(secondTime / 60)
        // 获取秒数，秒数取佘，得到整数秒数
        secondTime = parseInt(secondTime % 60)
        // 如果分钟大于60，将分钟转换成小时
        if (minuteTime > 60) {
          // 获取小时，获取分钟除以60，得到整数小时
          hourTime = parseInt(minuteTime / 60)
          // 获取小时后取佘的分，获取分钟除以60取佘的分
          minuteTime = parseInt(minuteTime % 60)
        }
      }
      var result = '' + parseInt(secondTime)
      if (minuteTime > 0) {
        result = '' + parseInt(minuteTime) + ':' + result
      }
      if (hourTime > 0) {
        result = '' + parseInt(hourTime) + ':' + result
      }
      return result
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
  @import "../../style/module.css";
  .box-card {
    margin-bottom: 20px;
  }
  .deviceSettings-switch .box-card {
    margin-bottom: 20px;
    background-color: #FFFFF0;
  }
  .deviceSettings-switch .box-card .card-name{
    margin: 0;
    font-size: 20px;
    letter-spacing: 0.1em;
  }
  .deviceSettings-switch .box-card .el-switch {
    float: right;
    margin-top: 10px;
  }
  .deviceSettings-input .box-card {
    background-color: #87CEFA;
  }
  .deviceSettings-input .box-card .card-name{
    margin: 0;
    font-size: 13px;
    letter-spacing: 0.1em;
  }
  .deviceSettings-input .box-card .card-edit{
    float: right;
    color: white;
    font-size: 1.3em;
    margin-left: 5px;
    margin-top: 5px;
  }
  .deviceSettings-input .box-card .card-edit{
    float: right;
    color: white;
    font-size: 1.3em;
    margin-left: 5px;
  }
  .deviceSettings-input .box-card input {
    width: 40%;
    margin-top: 10px;
    font-size: 23px;
    color: black;
    border-radius: 5px;
    border: 1px solid #d9ecff;
    min-width: 90px;
  }
  .deviceSettings-input .box-card input:disabled {
    background:none;
    outline:none;
    border:none;
    font-size: 25px;
    color: white;
    min-width: 90px;
  }
  .changeTime {
    background: none;
    outline: none;
    border: none;
    font-size: 25px;
    color: white;
  }
</style>
