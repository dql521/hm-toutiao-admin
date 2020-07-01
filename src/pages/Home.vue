<template>
  <div class="home">
    <el-container>
      <el-header>
        <div class="logo">advesy</div>
        <div class="lyout">
          <img :src="'http://localhost:3000' + user.head_img" alt />
          <div class="nickname">{{user.nickname}}</div>
          <div class="logout" @click="logout">退出</div>
        </div>
      </el-header>
      <el-container>
        <el-aside width="160px">
          <el-menu
            background-color="#4EA0FF"
            text-color="#fff"
            active-text-color="#FFEE44"
            router
            :default-active="$route.path"
          >
            <el-menu-item index="/index">
              <i class="el-icon-menu"></i>
              <span slot="title">首页</span>
            </el-menu-item>
            <el-menu-item index="/ad-publish">
              <i class="el-icon-setting"></i>
              <span slot="title">广告发布</span>
            </el-menu-item>
            <el-menu-item index="/post-list">
              <i class="el-icon-setting"></i>
              <span slot="title">内容管理</span>
            </el-menu-item>
            <el-menu-item index="/gallery">
              <i class="el-icon-setting"></i>
              <span slot="title">图片库</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
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
        await this.$confirm('您确定退出管理系统吗？', '提示', {
          type: 'warning'
        })
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
    // toggleCollapse () {
    //   console.log(123456789)
    //   this.isCollapse = !this.isCollapse
    // }
  }
}
</script>

<style lang="scss" scoped>
.el-header {
  background-color: #fff;
  color: #333;
  text-align: center;
  height: 60px;
  line-height: 60px;
  display: flex;
  // align-items: center;
  // justify-content: flex-end;
  justify-content: space-between;
  font-size: 14px;
  padding: 0;
  .logo {
    text-align: center;
    width: 160px;
    height: 60px;
    line-height: 60px;
  }
  .lyout {
    height: 60px;
    width: 200px;
    display: flex;
    img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-top: 10px;
    }
    .nickname {
      margin: 0 10px;
    }
    .logout {
      color: #888;
      cursor: pointer;
    }
  }
}

.el-aside {
  background-color: #4ea0ff;
  color: #333;
  // text-align: center;
  // line-height: 200px;
  padding-top: 20px;
  &.el-menu{
    border: none;
  }
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  // line-height: 160px;
  font-size: 14px;
}

// body > .el-container {
//   margin-bottom: 40px;
//   height: 100%;
// }

// .el-container:nth-child(5) .el-aside,
// .el-container:nth-child(6) .el-aside {
//   line-height: 260px;
// }

// .el-container:nth-child(7) .el-aside {
//   line-height: 320px;
// }

.home {
  position: absolute;
  width: 100%;
  height: 100%;
  .el-container {
    height: 100%;
  }
}
//   .el-header {
//     background-color: #fff;
//     color: #111;
//     text-align: center;
//     line-height: 60px;
//     display: flex;
//     align-items: center;
//     // justify-content: flex-end;
//     justify-content: space-between;
//     font-size: 14px;
//     .el-icon-s-fold,
//     .el-icon-s-unfold{
//       color: rgb(144, 169, 248);
//       height: 60px;
//       line-height: 60px;
//       width: 60px;
//       text-align: start;
//     }
//     .lyout{
//       height: 60px;
//       width: 150px;
//       display: flex;
//     // align-items: center;
//     // justify-content: center;
//       img{
//       width: 40px;
//       height: 40px;
//       border-radius: 50%;
//       margin-top: 10px;
//     }
//     .nickname{
//       margin: 0 10px;
//     }
//     .logout{
//       color: #888;
//       cursor: pointer;
//     }
//     }
//   }

//   // .el-aside {
//   //   background-color: #545c64;
//   //   color: #fff;
//   //   text-align: center;
//   // }
//     .logo{
//       background: #fff;
//       height: 60px;
//       line-height: 60px;
//       color: rgb(144, 169, 248);
//       text-align: center;
//     }
//   .el-main {
//     background-color: #E9EEF3;
//     color: #333;
//   }
// .el-menu{
//   border: none;
// }
//   body > .el-container {
//     margin-bottom: 40px;
//   }

//   .el-container:nth-child(5) .el-aside,
//   .el-container:nth-child(6) .el-aside {
//     line-height: 260px;
//   }

//   .el-container:nth-child(7) .el-aside {
//     line-height: 320px;
//   }
// }
</style>
