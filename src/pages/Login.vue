<template>
  <div class="login">
  <el-form ref="form" :model="form" label-width="80px">
  <el-form-item label="账号：">
    <el-input v-model="form.username" placeholder="请输入用户名/邮箱"></el-input>
  </el-form-item>
  <el-form-item label="密码：">
    <el-input v-model="form.password" type="password" placeholder="请输入密码"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="login">登录</el-button>
    <el-button @click="reset">重置</el-button>
  </el-form-item>
  </el-form>
</div>
</template>

<script>
export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      }
    }
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
      const res = await this.$axios.post('/login', this.form)
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
    }
  }
}
</script>

<style lang="scss" scoped>
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
