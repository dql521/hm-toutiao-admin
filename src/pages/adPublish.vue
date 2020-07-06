<template>
<div class="post-publish">
  <el-tabs type="border-card">
  <el-tab-pane
  v-for="item in channelTab"
  :key="item.id"
  :label="item.name">

  <!-- 新增渠道 -->
  <el-button type="primary" @click="isDlag = true">
    <i class="el-icon-add"></i>
    新增渠道</el-button>

    <!-- <el-form :model="form" label-width="80px">
    <el-form-item label="标题">
      <el-input v-model="form.title"></el-input>
    </el-form-item>
    <el-form-item label="内容">
      <vue-editor v-model="form.content"></vue-editor>
    </el-form-item>
    <el-form-item label="栏目">
      <el-checkbox-group v-model="form.categories">
        <el-checkbox v-for="item in categoryList" :key="item.id" :label="item.id">{{item.name}}</el-checkbox>
    </el-checkbox-group>
    </el-form-item>
    <el-form-item label="封面">
      <el-upload
      list-type="picture-card"
      :action="'http://localhost:3000' + '/upload'"
      :headers="headers"
      :on-success="handleSuccess"
      :file-list="fileList"
      :on-remove="handleRemove">
      <i class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
    </el-form-item>
  <el-form-item label="类型">
    <el-radio-group v-model="form.type">
      <el-radio :label="1">文章</el-radio>
      <el-radio :label="2">视频</el-radio>
    </el-radio-group>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="publish">发布</el-button>
  </el-form-item>
</el-form> -->
  </el-tab-pane>
</el-tabs>

<el-dialog title="新增渠道" :visible="isDlag" width="553px">
  <el-form :model="form">
    <el-form-item label="渠道名称：">
      <el-input
      v-model="form.name"
      placeholder="请输入渠道名称"></el-input>
    </el-form-item>
    <el-form-item label="图片接入网络：">
    <el-radio-group v-model="form.netType">
      <el-radio :label="0">内网</el-radio>
      <el-radio :label="1">外网</el-radio>
    </el-radio-group>
  </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="isDlag = false">取 消</el-button>
    <el-button type="primary" @click="addChannel">确 定</el-button>
  </div>
</el-dialog>
  <!-- 表单编辑区 -->
  <!-- <el-form :model="form" label-width="80px">
    <el-form-item label="标题">
      <el-input v-model="form.title"></el-input>
    </el-form-item>
    <el-form-item label="内容">
      <vue-editor v-model="form.content"></vue-editor>
    </el-form-item>
    <el-form-item label="栏目">
      <el-checkbox-group v-model="form.categories">
        <el-checkbox v-for="item in categoryList" :key="item.id" :label="item.id">{{item.name}}</el-checkbox>
    </el-checkbox-group>
    </el-form-item>
    <el-form-item label="封面">
      <el-upload
      list-type="picture-card"
      :action="'http://localhost:3000' + '/upload'"
      :headers="headers"
      :on-success="handleSuccess"
      :file-list="fileList"
      :on-remove="handleRemove">
      <i class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
    </el-form-item>
  <el-form-item label="类型">
    <el-radio-group v-model="form.type">
      <el-radio :label="1">文章</el-radio>
      <el-radio :label="2">视频</el-radio>
    </el-radio-group>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="publish">发布</el-button>
  </el-form-item>
</el-form> -->
</div>
</template>

<script>
import { VueEditor } from 'vue2-editor'
import { addChannels, getChannels } from '@/api/api'
export default {
  components: {
    VueEditor
  },
  data () {
    return {
      channelTab: [],
      isDlag: false,
      form: {
        name: '',
        netType: 0
        // title: '',
        // content: '',
        // categories: [],
        // cover: [],
        // type: 1
      },
      categoryList: [],
      headers: {
        Authorization: localStorage.getItem('token')
      },
      postId: '',
      fileList: []
    }
  },
  created () {
    this.getChannel()
    // this.postId = this.$route.params.id
    // this.getcategoryList()
    // if (this.postId) {
    //   this.getPostDetail(this.postId)
    // }
  },
  methods: {
    async addChannel () {
      if (this.form.name == '') {
        this.$message.error('渠道名称不能为空')
        return
      }
      const res = await addChannels(JSON.stringify(this.form))
      const { code, data } = res.data
      if (code === 200) {
        this.$message.success(data)
        this.getChannel()
        this.isDlag = false
      } else {
        this.$message.error(data)
      }
    },
    async getChannel () {
      const res = await getChannels()
      const { code, data } = res.data
      if (code === 200) {
        this.channelTab = data.channelList
        console.log(this.channelTab)
      }
    }
    // async getcategoryList () {
    //   // const res = await this.$axios.get('/category')
    //   const res = await this.getRequest('/category')
    //   const { statusCode, data } = res.data
    //   if (statusCode === 200) {
    //     this.categoryList = data.filter(item => item.id !== 999)
    //   }
    // },
    // async publish () {
    //   const data = {
    //     ...this.form
    //   }
    //   data.categories = this.form.categories.map(item => {
    //     return {
    //       id: item
    //     }
    //   })
    //   let url
    //   if (this.postId) {
    //     url = `/post_update/${this.postId}`
    //   } else {
    //     url = '/post'
    //   }
    //   // const res = await this.$axios.post(url, data, {
    //   //   headers: {
    //   //     Authorization: localStorage.getItem('token')
    //   //   }
    //   // })
    //   const res = await this.postRequest(url, data, {
    //     headers: {
    //       Authorization: localStorage.getItem('token')
    //     }
    //   })
    //   console.log(res)
    //   const { statusCode } = res.data
    //   if (statusCode === 200) {
    //     this.$router.push('/post-list')
    //     this.$message.success('发布成功')
    //   }
    // },
    // handleSuccess (res) {
    //   const { statusCode, data } = res
    //   if (statusCode === 200) {
    //     this.form.cover.push({
    //       id: data.id,
    //       url: 'http://localhost:3000' + data.url
    //     })
    //   }
    // },
    // async getPostDetail (id) {
    //   // const res = await this.$axios.get(`/post/${id}`)
    //   const res = await this.getRequest(`/post/${id}`)
    //   const { statusCode, data } = res.data
    //   if (statusCode === 200) {
    //     this.form = data
    //     data.categories = data.categories.map(item => {
    //       return item.id
    //     })
    //     data.cover.forEach(item => {
    //       this.fileList.push({
    //         url: this.$fixUrl(item.url),
    //         id: item.id
    //       })
    //     })
    //     data.content = data.content.replace(/<div/g, '<p')
    //     data.content = data.content.replace(/<\/div>/g, '</p>')
    //   }
    // },
    // handleRemove (file) {
    //   this.form.cover = this.form.cover.filter(item => item.id !== file.id)
    // }
  }
}
</script>

<style lang="scss" scoped>

.post-publish{
  font-size: 16px;
  .el-tabs{
    padding: 24px;
  background: #fff;
  text-align: start;
  }
  .el-tabs__header{
    height: 48px;
  }
  .el-button{
    .el-icon-add{
      // font-weight: 700;
      font-family: "PingFang-SC-Regular,PingFang-SC";
      margin-right: 5px;
      background: url("../assets/img/Add.png") center no-repeat;
    background-size: cover;
    }
    .el-icon-add:before{
      content: "\66ff";
    font-size: 16px;
    visibility: hidden;
    }
  }

  .el-form{
    margin-top: 20px;
    .el-form-item{
      text-align: start;
      .el-input{
        width: 384px;
        height: 40px;
        margin-left: 32px;
        .el-input_inner{
          width: 100%;
          height: 40px;
        }
      }
      .el-radio:last-child{
        margin-left: 32px;
      }
    }
  }
}
</style>
