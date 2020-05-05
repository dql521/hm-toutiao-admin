<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <el-container>
    <el-aside width="160px">
      <div class="logo">豆乐资讯</div>
       <el-menu
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      router
      :default-active="$route.path">
      <el-menu-item index="/post-list">
        <i class="el-icon-menu"></i>
        <span slot="title">文章列表</span>
      </el-menu-item>
      <el-menu-item index="/post-publish">
        <i class="el-icon-setting"></i>
        <span slot="title">发布文章</span>
      </el-menu-item>
    </el-menu>
    </el-aside>
    <el-container>
    <el-header>
      <img :src="$axios.defaults.baseURL + user.head_img" alt="">
      <div class="nickname">{{user.nickname}}</div>
      <div class="logout" @click="logout">退出</div>
    </el-header>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  components: {
    HelloWorld
  }
}
</script>
