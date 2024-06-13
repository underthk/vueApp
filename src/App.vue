<template>
  <div class="app">
    <Header/>
    <!-- 导航区 -->
    <div class="navigate">
      <!-- <RouterLink replace to="/home" active-class="active">首页</RouterLink> -->
    </div>
    <!-- 展示区 -->
    <div class="main-content">
      <Home/>
      <!-- <RouterView>
      </RouterView> -->
    </div>
  </div>
</template>

<script lang="ts" setup name="App">
  // import {RouterView,RouterLink} from 'vue-router'
  import Header from './components/Header.vue'
  import Home from './pages/Home.vue'

</script>

<style>
    /* App */
  .navigate {
    display: flex;
    justify-content: space-around;
    margin: 0 100px;
  }
  .navigate a {
    display: block;
    text-align: center;
    width: 90px;
    height: 40px;
    line-height: 40px;
    border-radius: 10px;
    background-color: gray;
    text-decoration: none;
    color: white;
    font-size: 18px;
    letter-spacing: 5px;
  }
  .navigate a.active {
    background-color: #64967E;
    color: #ffc268;
    font-weight: 900;
    text-shadow: 0 0 1px black;
    font-family: 微软雅黑;
  }
  .main-content {
    border-radius: 10px;
    width: 100%;
    height: 600px;
    border: 1px solid;
    padding-top: 0%
  }

</style>
