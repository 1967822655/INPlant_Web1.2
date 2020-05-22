<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/> -->
<!--    <nav>-->
<!--      <router-link to="/">首页</router-link>-->
<!--      <router-link to="/detail">详情页</router-link>-->
<!--    </nav>-->
    <router-view></router-view>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'app',
  components: {
    // HelloWorld
  }
}
</script>

<style>
  *{
    padding: 0;margin: 0;
  }
  a{
    text-decoration: none;
  }
  ul{
    list-style:none;
  }
  html,body {
    height: 100%;
  }
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    height: 100%;
  }
</style>
