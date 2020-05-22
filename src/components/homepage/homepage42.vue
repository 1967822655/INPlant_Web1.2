<template>
  <div class="module">
    <div class="module-title">
      <p>模型预测</p>
    </div>
    <el-divider></el-divider>
    <div class="module-content">
      <div class="modelPredictions-have">
        <div class="modelPredictions-models">
          <el-carousel type="card" :autoplay="false">
            <el-carousel-item v-for="(item, index) in modelPredictionsList" :key="index">
              <h3 class="medium" @click="modelHandle(item, index)">
<!--                {{ item.modelid + '/' + item.time}}-->
                <p>模型编号：{{item.modelid}}</p>
                <p>创建日期：{{item.time}}</p>
                <p>模数：{{item.intercept}}</p>
                <p>co2系数：{{item.co2_coefficient}}</p>
                <p>ec系数：{{item.ec_coefficient}}</p>
                <p>光照强度系数：{{item.light_coefficient}}</p>
                <p>光照时间系数：{{item.lighttime_coefficient}}</p>
                <p>ph系数：{{item.ph_coefficient}}</p>
                <p>湿度系数：{{item.rh_coefficient}}</p>
                <p>温度系数：{{item.temp_coefficient}}</p>
                <p>模数：{{item.intercept}}</p>
                <p>模型评估：{{item.rmse}}</p>
              </h3>
            </el-carousel-item>
          </el-carousel>
        </div>
        <div v-if="count>0 ? true : false" class="modelPredictions-Prediction"
          style="margin: 20px 0px;">
          <div class="modelPredictions-Prediction-title">
            <p >预测模块</p>
          </div>
          <el-divider></el-divider>
          <div class="modelPredictions-Prediction-content"
                style="width: 50%;
                margin-left:25%;">
            <p style="font-size: 12px;font-weight: bold;color:#333">模型编号：{{this.formData.id}}</p>
            <el-form :model="formData" :label-position="'left'">
              <el-form-item label="CO2浓度" :label-width="'100px'">
                <el-input v-model="formData.carbonDioxide"></el-input>
              </el-form-item>
              <el-form-item label="湿度" :label-width="'100px'">
                <el-input v-model="formData.humidty"></el-input>
              </el-form-item>
              <el-form-item label="温度" :label-width="'100px'">
                <el-input v-model="formData.temperature"></el-input>
              </el-form-item>
              <el-form-item label="光照" :label-width="'100px'">
                <el-input v-model="formData.beam"></el-input>
              </el-form-item>
              <el-form-item label="营养液浓度" :label-width="'100px'">
                <el-input v-model="formData.nutrient"></el-input>
              </el-form-item>
              <el-form-item label="PH值" :label-width="'100px'">
                <el-input v-model="formData.pH"></el-input>
              </el-form-item>
              <el-form-item >
                <el-button type="primary" icon="el-icon-s-promotion" @click="makePrediction()"
                  style="float: right;">立即预测</el-button>
              </el-form-item>
            </el-form>
          </div>
          <!--<div style="background-color:gray;">预测结果</div>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import data from '../cache'
// import ElButton from '../../../node_modules/element-ui/packages/button/src/button.vue'
export default {
  // components: {ElButton},
  name: 'homepage42',
  created () {
    var device = new FormData()
    device.append('deviceID', this.chooseDevice)
    this.showAllTrainModel(device)
  },
  methods: {
    // 展示全部数据
    showAllTrainModel (device) {
      this.axios.post(data.serverSrc + '/trainmodel/show', device).then(body => {
        this.modelPredictionsList = body.data
      })
    },
    modelHandle (item, index) {
      this.count = 1
      this.formData.id = item.modelid
    },
    makePrediction () {
      // console.log('makePrediction')
    }
  },
  data () {
    return {
      modelPredictionsList: [],
      count: 0,
      formData: {
        id: '',
        carbonDioxide: '',
        humidty: '',
        temperature: '',
        nutrient: '',
        pH: '',
        beam: ''
      }
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
  .module .module-content .modelPredictions-models {
    height: 60%;
    width: 100%;
  }
  .module .module-content .modelPredictions-Prediction {
    height: 40%;
    width: 100%;
  }

  .el-carousel__item h3 {
    /*color: #475669;*/
    font-size: 15px;
    opacity: 0.75;
    height: 300px;
    margin: 0;
  }
  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }
  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
</style>
