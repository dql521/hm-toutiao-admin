<template>
  <div id="app" @mouseenter="isClick && isTimeOut()">
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  name: 'app',
  data () {
    return {
      lastTime: null,
      currentTime: null,
      timeOut: 10*60*1000,
      isClick: true
    }
  },
created () {
  this.lastTime = new Date().getTime()
},
methods: {
  isTimeOut () {
    this.currentTime = new Date().getTime()
    // console.log(`${this.currentTime},${this.lastTime}`);
    if (this.currentTime - this.lastTime > this.timeOut) {
      if (localStorage.getItem('isLogin')) {
        this.$message.error('登录超时，请重新登录')
        this.$router.push('/login')
      } else {
        this.lastTime = new Date().getTime()
      }
    } else {
        this.lastTime = new Date().getTime()
    }
  }
},
watch: {
  $route: {
    handler: function (val,oldVal) {
      if (val.name == 'login') {
        this.isClick = false
      } else {
        this.isClick = true
      }
      if (val != oldVal) {
  this.lastTime = new Date().getTime()
      }
    },
    deep: true
  }
},
}
</script>
<style lang="scss">
  *{
    margin: 0;
    padding: 0;
    list-style: none;
  }
  html,body,#app{
 height: 100%;
}
</style>
