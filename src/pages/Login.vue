<template>
  <div class="login">
    <div class="setion_box">
      <img src="../assets/img/bj_left.png" class="bj_left">
      <el-form ref="form" :model="form" label-width="50px">
        <el-form-item>
          <div class="lg_title">线上统一广告登录</div>
        </el-form-item>
        <el-form-item>
          <el-input
          v-model="form.userName"
          placeholder="用户名">
          <i slot="prefix" class="el-icon-User"></i>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-input
          v-model="form.password"
          type="password"
          placeholder="密码">
          <i slot="prefix" class="el-icon-Pwd"></i>
          </el-input>
        </el-form-item>
        <!-- <el-form-item label="验证：">
    <div ref="captcha" id="captcha"></div>
        </el-form-item>-->
        <el-link type="primary" disabled class="zh_password">忘记密码？</el-link>
        <el-form-item>
          <el-button type="primary" @click="login">登录</el-button>
        </el-form-item>
        <el-form-item>
          <el-link type="primary" disabled class="go_logon">没有账号去注册
            <i class="el-icon-rightArrow"></i>
          </el-link>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// import '../utils/slideBlock.js'
import { login } from '../api/api'
export default {
  // props: {
  //   msg: String
  // },
  data () {
    return {
      form: {
        userName: '',
        password: ''
      }
    }
  },
  // 行为校验（暂未使用）
  // mounted () {
  //   this.getCaptcha()
  // },
  methods: {
    async login () {
      // const _this = this
      if (this.form.userName === '') {
        this.$message.error('用户名不能为空')
        return
      }
      if (this.form.password === '') {
        this.$message.error('密码不能为空')
        return
      }

      // const res = await this.$axios.post('/login', this.form)
      // const res = await this.postRequest('/login', this.form)
      const res = await login(JSON.stringify(this.form))
      console.log(res)

      const { code, data } = res.data
      // const { status, data } = res
      if (code === 200) {
        this.$message.success('登录成功')
        localStorage.setItem('token', data.token)
        // this.$store.commit('SET_TOKEN', data.token)
        // localStorage.setItem('user', JSON.stringify(data.user))
        this.$router.push('/index')
      } else {
        this.$message.error('用户名或密码错误')
      }
    },
    reset () {
      this.form.username = ''
      this.form.password = ''
    }
    // 行为校验（暂未使用）
    // getCaptcha () {
    //   window.Jigsaw.init({
    //     el: this.$refs.captcha,
    //     onSuccess: this.onSuccess,
    //     onFail: this.onFail,
    //     onRefresh: this.cleanMsg
    //   })
    // },
    // onSuccess () {
    //   console.log('成功')
    //   // 后台登录认证
    // },
    // onFail () {
    //   console.log('失败')
    // },
    // cleanMsg () {
    //   console.log('刷新')
    // }
  }
}
</script>

<style lang="scss" scoped>
// @import "../utils/slideBlock.css";

.login {
  height: 100%;
  background: url("../assets/img/bj2.png") no-repeat;
  background-size: 100% 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .setion_box{
    height: 720px;
    width: 1400px;
    display: flex;
    .bj_left{
      width: 732.4px;
    }
    .el-form{
    flex: 1;
    background: #fff;
    padding-top: 100px;
    .el-form-item__content{
      margin-left: 50px;
    }
    .lg_title{
      font-size: 32px;
      color: #3374F3;
      margin-bottom: 40px;
      text-align: start;
    }
}
.el-input {
  width:531px;
  height:48px;
}
  .zh_password{
    margin-left: 500px;
  }
  .el-button{
   width:531px;
  height:48px;
  margin-top: 70px;
  background:rgba(51,116,243,1);
  border-radius:4px;
  opacity:0.5;

  }
  .go_logon{
    display: block;
    margin: auto;
    text-align: center;
  }
  }
}

// 自定义图标
.el-icon-User{
    background: url("../assets/img/User.png") center no-repeat;
    background-size: cover;
}
.el-icon-Pwd{
    background: url("../assets/img/Pwd.png") center no-repeat;
    background-size: cover;
}
.el-icon-rightArrow{
    background: url("../assets/img/rightArrow.png") center no-repeat;
    background-size: cover;
}
.el-icon-User:before,
.el-icon-Pwd:before,
.el-icon-rightArrow:before{
    content: "\66ff";
    font-size: 16px;
    visibility: hidden;
}
</style>
