<template>
  <div class="home">
    <el-container>
    <!-- <el-collapse-transition> -->
    <el-menu
      :collapse-transition="true"
      :collapse="isCollapse"
      background-color="rgb(144, 169, 248)"
      text-color="#fff"
      active-text-color="#fff"
      router
      :default-active="$route.path">
      <div class="logo">ad-vesy</div>
      <el-menu-item index="/post-list">
        <i class="el-icon-menu"></i>
        <span slot="title">文章列表</span>
      </el-menu-item>
      <el-menu-item index="/post-publish">
        <i class="el-icon-setting"></i>
        <span slot="title">发布文章</span>
      </el-menu-item>
    </el-menu>
    <!-- </el-collapse-transition> -->
    <el-container>
    <el-header>
      <i :class="isCollapse ? 'el-icon-s-fold' : 'el-icon-s-unfold'"
         @click="toggleCollapse"></i>
      <div class="lyout">
        <img :src="'http://localhost:3000' + user.head_img" alt="">
        <div class="nickname">{{user.nickname}}</div>
        <div class="logout" @click="logout">退出</div>
      </div>
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
      user: JSON.parse(localStorage.getItem('user')),
      isCollapse: true
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
    },
    toggleCollapse () {
      console.log(123456789)
      this.isCollapse = !this.isCollapse
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
    background-color: #fff;
    color: #111;
    text-align: center;
    line-height: 60px;
    display: flex;
    align-items: center;
    // justify-content: flex-end;
    justify-content: space-between;
    font-size: 14px;
    .el-icon-s-fold,
    .el-icon-s-unfold{
      color: rgb(144, 169, 248);
      height: 60px;
      line-height: 60px;
      width: 60px;
      text-align: start;
    }
    .lyout{
      height: 60px;
      width: 150px;
      display: flex;
    // align-items: center;
    // justify-content: center;
      img{
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-top: 10px;
    }
    .nickname{
      margin: 0 10px;
    }
    .logout{
      color: #888;
      cursor: pointer;
    }
    }
  }

  // .el-aside {
  //   background-color: #545c64;
  //   color: #fff;
  //   text-align: center;
  // }
    .logo{
      background: #fff;
      height: 60px;
      line-height: 60px;
      color: rgb(144, 169, 248);
      text-align: center;
    }
  .el-main {
    background-color: #E9EEF3;
    color: #333;
  }
.el-menu{
  border: none;
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
