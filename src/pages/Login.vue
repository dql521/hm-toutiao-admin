<template>
  <div class="login">
  <el-form ref="form" :model="form" label-width="80px">
  <el-form-item label="账号：">
    <el-input v-model="form.username" placeholder="请输入用户名/邮箱"></el-input>
  </el-form-item>
  <el-form-item label="密码：">
    <el-input v-model="form.password" type="password" placeholder="请输入密码"></el-input>
  </el-form-item>
  <el-form-item label="验证：">
    <div ref="captcha" id="captcha"></div>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="login">登录</el-button>
    <el-button @click="reset">重置</el-button>
  </el-form-item>
  </el-form>
</div>
</template>

<script>
import '../utils/slideBlock.js'
import { login } from '../api/api'
export default {
  props: {
    msg: String
  },
  data () {
    return {
      form: {
        username: '',
        password: ''
      }
    }
  },
  mounted () {
    this.getCaptcha()
  },
  methods: {
    async login () {
      if (this.form.username === '') {
        this.$message.error('用户名不能为空')
        return
      }
      if (this.form.password === '') {
        this.$message.error('密码不能为空')
        return
      }
      console.log(this.form)

      // const res = await this.$axios.post('/login', this.form)
      // const res = await this.postRequest('/login', this.form)
      const res = await login(this.form)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.$message.success('登录成功')
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        this.$router.push('/post-list')
      } else {
        this.$message.error('用户名或密码错误')
      }
    },
    reset () {
      this.form.username = ''
      this.form.password = ''
    },
    getCaptcha () {
      window.Jigsaw.init({
        el: this.$refs.captcha,
        onSuccess: this.onSuccess,
        onFail: this.onFail,
        onRefresh: this.cleanMsg
      })
    },
    onSuccess () {
      console.log('成功')
      // 后台登录认证
    },
    onFail () {
      console.log('失败')
    },
    cleanMsg () {
      console.log('刷新')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../utils/slideBlock.css";
#app{
  background: #ccc;
  .el-form{
    width: 400px;
    margin: 200px auto;
    .el-button:first-child{
      margin-right: 20px;
    }
  }
}
</style>
