<template>
  <div class="module">
    <div class="module-title">
      <p>历史数据</p>
    </div>
    <el-divider></el-divider>
    <span class="demonstration">查看的时间：</span>
    <el-date-picker
      v-model="dateTime"
      type="daterange"
      align="right"
      unlink-panels
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      :picker-options="pickerOptions">
    </el-date-picker>
    <el-button type="primary buttonSize" @click="searchFromTime()">确定</el-button>
    <div id="historyTable" style="height: 600px; width: 100%"></div>
<!--    <el-table-->
<!--      :data="tableDataEnd"-->
<!--      stripe>-->
<!--      <el-table-column-->
<!--        prop="name"-->
<!--        label="时间"-->
<!--        min-width="100"-->
<!--        height="150">-->
<!--        <template slot-scope="scope">-->
<!--          <span size="small">{{scope.row.time}}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        prop="name"-->
<!--        label="温度"-->
<!--        min-width="100"-->
<!--        height="150">-->
<!--        <template slot-scope="scope">-->
<!--          <span size="small">{{scope.row.temp}}℃</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        prop="name"-->
<!--        label="湿度"-->
<!--        min-width="100"-->
<!--        height="150">-->
<!--        <template slot-scope="scope">-->
<!--          <span size="small">{{scope.row.rh}}%</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        prop="name"-->
<!--        label="CO2浓度"-->
<!--        min-width="100"-->
<!--        height="150">-->
<!--        <template slot-scope="scope">-->
<!--          <span size="small">{{scope.row.co2}}PPM</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        prop="name"-->
<!--        label="光照"-->
<!--        min-width="100"-->
<!--        height="150">-->
<!--        <template slot-scope="scope">-->
<!--          <span size="small">{{scope.row.light}}LUX</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        prop="name"-->
<!--        label="酸碱度"-->
<!--        min-width="100"-->
<!--        height="150">-->
<!--        <template slot-scope="scope">-->
<!--          <span size="small">{{scope.row.ph}}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        prop="name"-->
<!--        label="营养液浓度"-->
<!--        min-width="100"-->
<!--        height="150">-->
<!--        <template slot-scope="scope">-->
<!--          <span size="small">{{scope.row.ec}}mS/cm</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--    </el-table>-->
<!--    <div style="text-align: center; margin-top: 10px;">-->
<!--      <el-pagination-->
<!--        @size-change="handleSizeChange"-->
<!--        @current-change="handleCurrentChange"-->
<!--        :current-page="currentPage"-->
<!--        :page-sizes="[8, 12, 16, 20, 30]"-->
<!--        :page-size="pageSize"-->
<!--        layout="total, sizes, prev, pager, next, jumper"-->
<!--        :total="totalItems">-->
<!--      </el-pagination>-->
<!--    </div>-->
  </div>
</template>

<script>
import echarts from 'echarts'
import data from '../cache'
export default {
  name: 'homepage11',
  data () {
    return {
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      dateTime: [],
      time: [], // 时间
      temperature: [], // 空气温度
      humidity: [], // 空气湿度
      CO2concentration: [], // 二氧化碳浓度
      light: [], // 光照强度
      ph: [], // ph值
      nutrientConcentration: [], // 可溶盐浓度
      tableDataBegin: [],
      tableDataName: '',
      tableDataEnd: [],
      currentPage: 1,
      pageSize: 8,
      totalItems: 8,
      filterTableDataEnd: [],
      flag: true,
      historyChart: null
    }
  },
  mounted () {
    // this.openData(testData)
    // 初始化设备历史数据
    // let time = new Date().getTime()
    let time = new Date().getTime()
    let findHistory = new FormData()
    findHistory.append('deviceID', this.chooseDevice)
    findHistory.append('starttime', this.formatDate(time - 3600 * 8000 - 3600 * 4000))
    findHistory.append('endtime', this.formatDate(time))
    if (this.$store.state.username) {
      this.getHistoryData(findHistory)
    }
  },
  methods: {
    // 历史数据请求接口
    getHistoryData (findHistory) {
      this.axios.post(data.serverSrc + '/dev/historydata', findHistory).then(body => {
        this.time = []
        this.temperature = []
        this.humidity = []
        this.CO2concentration = []
        this.light = []
        this.ph = []
        this.nutrientConcentration = []
        for (let i = 0; i < body.data.length; i++) {
          this.time.push(body.data[i].time)
          this.temperature.push(body.data[i].temp)
          this.humidity.push(body.data[i].rh)
          this.CO2concentration.push(body.data[i].co2)
          this.light.push(body.data[i].light)
          this.ph.push(body.data[i].ph)
          this.nutrientConcentration.push(body.data[i].ec)
        }
        // 显示折线图
        this.historyEcharts()
        // 显示分页
        this.openData(body.data)
      })
    },
    // 时间查找
    searchFromTime () {
      let findHistory = new FormData()
      findHistory.append('deviceID', this.chooseDevice)
      findHistory.append('starttime', this.formatDate(this.dateTime[0]))
      findHistory.append('endtime', this.formatDate(this.dateTime[1]))
      this.getHistoryData(findHistory)
    },
    // 折线图
    historyEcharts () {
      this.historyChart = echarts.init(document.getElementById('historyTable'))
      window.onresize = this.historyChart.resize
      var option = {
        title: {
          text: '折线图堆叠'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['温度', '湿度', 'CO2浓度', '光照', '酸碱度', '营养液浓度']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.time
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '温度',
            type: 'line',
            data: this.temperature
          },
          {
            name: '湿度',
            type: 'line',
            data: this.humidity
          },
          {
            name: 'CO2浓度',
            type: 'line',
            data: this.CO2concentration
          },
          {
            name: '光照',
            type: 'line',
            data: this.light
          },
          {
            name: '酸碱度',
            type: 'line',
            data: this.ph
          },
          {
            name: '营养液浓度',
            type: 'line',
            data: this.nutrientConcentration
          }
        ]
      }
      this.historyChart.setOption(option)
    },
    // 分页初始化
    openData (val) {
      if (val) {
        this.tableDataBegin = val
        this.totalItems = this.tableDataBegin.length
        if (this.totalItems > this.pageSize) {
          for (let index = 0; index < this.pageSize; index++) {
            this.tableDataEnd.push(this.tableDataBegin[index])
          }
          this.filterTableDataEnd = this.tableDataBegin
          this.totalItems = this.tableDataBegin.length
        } else {
          this.tableDataEnd = this.tableDataBegin
          this.filterTableDataEnd = this.tableDataBegin
          this.totalItems = this.tableDataBegin.length
        }
      }
    },
    // 分页功能
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.pageSize = val
      this.handleCurrentChange(this.currentPage)
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.currentPage = val
      // 需要判断是否检索
      if (!this.flag) {
        this.currentChangePage(this.tableDataEnd)
      } else {
        this.currentChangePage(this.filterTableDataEnd)
      }
    },
    // 组件自带监控当前页码
    currentChangePage (list) {
      let from = (this.currentPage - 1) * this.pageSize
      let to = this.currentPage * this.pageSize
      this.tableDataEnd = []
      for (; from < to; from++) {
        if (list[from]) {
          this.tableDataEnd.push(list[from])
        }
      }
    },
    // 时间戳转换
    formatDate (value) {
      let date = new Date(value)
      let y = date.getFullYear()
      let MM = date.getMonth() + 1
      MM = MM < 10 ? ('0' + MM) : MM
      let d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      let h = date.getHours()
      h = h < 10 ? ('0' + h) : h
      let m = date.getMinutes()
      m = m < 10 ? ('0' + m) : m
      let s = date.getSeconds()
      s = s < 10 ? ('0' + s) : s
      return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s
    }
  },
  computed: {
    chooseDevice () {
      return this.$store.state.chooseDevice
    }
  }
}
</script>

<style scoped>
  @import "../../style/module.css";
</style>
