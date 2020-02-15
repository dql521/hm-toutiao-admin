<template>
  <div class="home">
    <el-container>
    <el-aside width="160px">
      <div class="logo">黑马头条</div>
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
export default {
  data () {
    return {
      user: JSON.parse(localStorage.getItem('user'))
    }
  },
  methods: {
    async logout () {
      try {
        await this.$confirm('您确定退出管理系统吗？', '提示', { type: 'warning' })
        this.$message({
          type: 'success',
          message: '退出成功!'
        })
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        this.$router.push('/login')
      } catch {
        this.$message({
          type: 'info',
          message: '已取消操作。'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.home{
  position: absolute;
  width: 100%;
  height: 100%;
  .el-container{
    height: 100%;
  }
  .el-header {
    background-color: #666;
    color: #ccc;
    text-align: center;
    line-height: 60px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    font-size: 14px;
    img{
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
    .nickname{
      margin: 0 10px;
    }
    .logout{
      color: #fff;
      cursor: pointer;
    }
  }

  .el-aside {
    background-color: #545c64;
    color: #fff;
    text-align: center;
    .logo{
      background: #333;
      height: 60px;
      line-height: 60px;
    }
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
  }

  body > .el-container {
    margin-bottom: 40px;
  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
}
</style>
