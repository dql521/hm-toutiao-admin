<template>
  <div class="home">
    <el-container>
      <el-header  height="auto">
        <div class="logo">
          <img src="../assets/logo@2x.png" alt />
        </div>
        <div class="collapse" @click="toggleCollapse">
          <i :class="isCollapse ? 'el-icon-s-fold' : 'el-icon-s-unfold'"></i>
        </div>
        <div class="lyout">
          <div class="logout" @click="logout">退出</div>
          <div class="nickname">{{userNickName}}</div>
          <img src="../assets/img.png" alt />
        </div>
      </el-header>
      <el-container>
        <el-aside width="auto">
          <el-menu
            :class="isCollapse ? 'sm' : 'big'"
            :collapse="isCollapse"
            :collapse-transition="false"
            background-color="#03275E"
            text-color="#fff"
            active-text-color="#fff"
            router
            :default-active="$route.path"
          >
            <el-menu-item index="/index">
              <i class="el-icon-s-home"></i>
              <span slot="title">首页</span>
            </el-menu-item>
            <el-submenu v-for="item in menus" :key="item.id" v-if="item.children" :index="item.id">
              <template slot="title">
                <i :class="item.attributes.icon"></i>
                <span>{{ item.text }}</span>
              </template>
              <el-menu-item
                v-for="children in item.children"
                :key="children.id"
                :index="children.attributes.url"
              >{{ children.text }}</el-menu-item>
            </el-submenu>
            <el-menu-item
              v-if="!item.children"
              v-for="item in menus"
              :key="item.id"
              :index="item.attributes.url"
            >{{ item.text }}</el-menu-item>
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
import { getUserMenu } from '../api/api'
export default {
  data () {
    return {
      userNickName: '',
      menus: [],
      isCollapse: false
    }
  },
  created () {
    this.getUserInfo()
  },
  methods: {
    async getUserInfo () {
      const res = await getUserMenu()
      // console.log(res)
      const { code, data } = res.data
      if (code === 200) {
        this.menus = data.menus
        this.userNickName = data.userNickName
        console.log(res.data)
      }
    },
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
    },
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
      console.log(this.isCollapse)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-header {
  background-color: #03275e;
  color: #fff;
  text-align: center;
  display: flex;
  // align-items: center;
  // justify-content: flex-end;
  // justify-content: space-between;
  font-size: 14px;
  padding: 10px 0;
  .logo {
    width: 200px;
    padding-left: 10px;
    img {
      width: 166px;
      height: 40px;
      margin-top: 20px;
    }
  }
  .collapse{
    font-size: 24px;
    text-align: left;
    margin-top: 20px;
    flex: 1;
  }
  .lyout {
    width: auto;
    display: flex;
    margin-top: 20px;
    margin-right: 20px;
    img {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      vertical-align: middle;
    }
    .nickname {
      margin: 0 20px;
    }
    .logout {
      color: #888;
      cursor: pointer;
    }
  }
}

.el-aside {
  background-color: #03275e;
  color: #333;
  // text-align: center;
  // line-height: 200px;
  padding-top: 20px;
  .el-menu--collapse{
    width: 100%;
  }
  .el-menu {
    border: none;
    font-size: 24px;
    .el-menu-item i,
    .el-submenu__title i,
    .el-menu-item span,
    .el-submenu__title span{
      font-size: 18px;
      color: #fff;
    }
    .el-submenu__title i {
      margin-right: 5px;
    }
  }
  .sm{
    width: 70px;
  }
  .big{
    width: 200px;
  }
  .el-menu-item.is-active {
  background: #3374F3 !important;
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
//
</style>
