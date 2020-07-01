<template>
<div class="post-publish">
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>文章发布</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 表单编辑区 -->
  <el-form :model="form" label-width="80px">
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
</el-form>
</div>
</template>

<script>
import { VueEditor } from 'vue2-editor'
export default {
  components: {
    VueEditor
  },
  data () {
    return {
      form: {
        title: '',
        content: '',
        categories: [],
        cover: [],
        type: 1
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
    this.postId = this.$route.params.id
    this.getcategoryList()
    if (this.postId) {
      this.getPostDetail(this.postId)
    }
  },
  methods: {
    async getcategoryList () {
      // const res = await this.$axios.get('/category')
      const res = await this.getRequest('/category')
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.categoryList = data.filter(item => item.id !== 999)
      }
    },
    async publish () {
      const data = {
        ...this.form
      }
      data.categories = this.form.categories.map(item => {
        return {
          id: item
        }
      })
      let url
      if (this.postId) {
        url = `/post_update/${this.postId}`
      } else {
        url = '/post'
      }
      // const res = await this.$axios.post(url, data, {
      //   headers: {
      //     Authorization: localStorage.getItem('token')
      //   }
      // })
      const res = await this.postRequest(url, data, {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      })
      console.log(res)
      const { statusCode } = res.data
      if (statusCode === 200) {
        this.$router.push('/post-list')
        this.$message.success('发布成功')
      }
    },
    handleSuccess (res) {
      const { statusCode, data } = res
      if (statusCode === 200) {
        this.form.cover.push({
          id: data.id,
          url: 'http://localhost:3000' + data.url
        })
      }
    },
    async getPostDetail (id) {
      // const res = await this.$axios.get(`/post/${id}`)
      const res = await this.getRequest(`/post/${id}`)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.form = data
        data.categories = data.categories.map(item => {
          return item.id
        })
        data.cover.forEach(item => {
          this.fileList.push({
            url: this.$fixUrl(item.url),
            id: item.id
          })
        })
        data.content = data.content.replace(/<div/g, '<p')
        data.content = data.content.replace(/<\/div>/g, '</p>')
      }
    },
    handleRemove (file) {
      this.form.cover = this.form.cover.filter(item => item.id !== file.id)
    }
  }
}
</script>

<style lang="scss" scoped>
.post-publish{
  .el-form{
    margin-top: 20px;
  }
  .quillWrapper{
    background: #fff;
   ::v-deep .ql-editor{
     height: 300px;
    }
  }
  ::v-deep .el-upload-list__item{
    img{
      object-fit: cover;
    }
  }
}
</style>
