<template>
    <div>
<!--      <span>实验室</span>-->
      <div class="self-adaption">
        <ul class="veg-nav" @click="changeNumber">
          <li v-for="(item) in this.numbers" @click="changeNumber(item.kind)" :key="item.name">{{item.name}}</li>
        </ul>
        <div class="detail">
          <div class="square" v-for="number in activeIndex" :key="number.deviceid">
            <div>实验台名称：{{number.devicename}}</div>
            <div>实验台ID：{{number.deviceid}}</div>
            <div>培育天数：{{number.startday}}天</div>
            <div>描述：<textarea v-model="number.remarks"></textarea></div>
            <el-button style="float: right" type="success" @click="chooseDevice(number.deviceid)">进入实验台</el-button>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import data from '../cache'
export default {
  name: 'UserIndex',
  data () {
    return {
      numbers: [
        {name: '番茄', value: [], kind: 'tomato'},
        {name: '生菜', value: [], kind: 'lettuce'},
        {name: '芹菜', value: [], kind: 'celery'},
        {name: '苦瓜', value: [], kind: 'bitterMelon'},
        {name: '茄子', value: [], kind: 'eggplant'},
        {name: '甜瓜', value: [], kind: 'melon'}
      ],
      activeIndex: null
    }
  },
  mounted () {
    // 获取用户名
    if (this.$store.state.username === 'null') {
      this.$message.error('未登录账号')
      this.$router.push('/')
    }
    let showdev = new FormData()
    showdev.append('username', this.username)
    this.axios.post(data.serverSrc + '/userdev/showdev', showdev).then(body => {
      for (let i = 0; i < body.data.length; i++) {
        if (body.data[i]) {
          for (let j = 0; j < this.numbers.length; j++) {
            if (body.data[i].kind === this.numbers[j].kind) {
              this.numbers[j].value.push(body.data[i])
            }
          }
        }
        this.changeNumber(this.numbers[0].kind)
      }
    })
  },
  methods: {
    changeNumber (kind) {
      for (let i = 0; i < this.numbers.length; i++) {
        if (this.numbers[i].kind === kind) {
          this.activeIndex = this.numbers[i].value
        }
      }
    },
    // 存储选中的设备id
    chooseDevice (deviceID) {
      this.$store.commit('updateChooseDevice', deviceID)
      sessionStorage.setItem('chooseDevice', deviceID)
      this.enterInterface()
    },
    // 跳转单个实验台详细界面
    enterInterface () {
      this.$router.push('/homepage')
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
.self-adaption  {
  display: flex;
  flex-direction: row;
}
.veg-nav li {
  margin: 5px;
  width: 300px;
  height: 125px;
  cursor: pointer;
  background-color: yellow;
}
.veg-nav li:hover {
  background-color: rgba(0,0,0,0.1);
}
.detail {
  margin: 5px;
  width: 100%;
  height: 775px;
  background-color: #42b983;
}
.square {
  float: left;
  margin: 10px;
  padding: 10px;
  height: 150px;
  width: 300px;
  border-radius: 20px;
  background-color: rgba(255,255,255,0.7);
  /*box-shadow: 0 2px 4px rgba(0,0,0,12),0 0 6px rgba(0, 0, 0, .04);*/
  font-family: '楷体','宋体',Times, TimesNR, 'New Century Schoolbook',Georgia, 'New York', serif;
  font-size: 22px;
}
@media screen and (max-width: 778px){
  .self-adaption  {
    display: flex;
    flex-direction: column;
  }
  .veg-nav {
    display: flex;
    flex-direction: row;
  }
  .veg-nav li {
    margin: 0px;
    height: 44px;
    background-color: yellow;
  }
  .detail {
    margin: 0;
    width: 100%;
    height: 775px;
    background-color: #42b983;
  }
  .square {
    margin: 10px;
    padding: 10px;
    height: 150px;
    width: 300px;
    border-radius: 20px;
    background-color: rgba(255,255,255,0.7);
    /*box-shadow: 0 2px 4px rgba(0,0,0,12),0 0 6px rgba(0, 0, 0, .04);*/
    font-family: '楷体','宋体',Times, TimesNR, 'New Century Schoolbook',Georgia, 'New York', serif;
    font-size: 22px;
  }
}
</style>
