<template>
  <div class="post-list">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>文章列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表格 -->
<!-- v-loading="loading"
     v-loading.fullscreen="true"
     :element-loading-text="msg"
     element-loading-background="rgba(1, 1, 1, 0.3)" -->
     <el-table
      :data="postList"
      style="width: 100%">
    <el-table-column
      label="序号"
      width="50"
      type="index"
      :index="indexMethod">
    </el-table-column>
    <el-table-column
      prop="title"
      label="标题"
      width="240">
    </el-table-column>
    <el-table-column label="创建时间" width="100">
      <template v-slot="{row}">{{row.create_date | time}}</template>
    </el-table-column>
    <el-table-column
      prop="user.nickname"
      label="作者"
      width="100">
    </el-table-column>
    <el-table-column
      prop="user.nickname"
      label="封面">
      <template v-slot="{row}">
        <img class="avatar" :src="$fixUrl(row.cover[0].url)" alt="">
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template v-slot="{row}">
        <el-button @click="edit(row.id)">编辑</el-button>
        <el-button type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 分页 -->
  <div class="paging">
    <el-pagination
      layout="total, sizes, prev, pager, next, jumper"
      background
      :page-size="pageSize"
      :current-page="pageIndex"
      @current-change="handleCurrentChange"
      :page-sizes="[3, 6, 9, 12]"
      @size-change="handleSizeChange"
      :total="total">
    </el-pagination>
  </div>
  </div>
</template>
<script>
import { getPostList } from '../api/api'
export default {
  data () {
    return {
      postList: [],
      pageSize: 3,
      pageIndex: 1,
      total: 0,
      loading: false,
      msg: '数据加载中，请稍后'
    }
  },
  created () {
    this.getPostList()
  },
  methods: {
    async getPostList () {
      // const _this = this
      // _this.loading = true
      // const res = await this.$axios.get('/post', {
      //   params: {
      //     pageSize: this.pageSize,
      //     pageIndex: this.pageIndex
      //   }
      // })
      // const params = {
      //   pageSize: this.pageSize,
      //   pageIndex: this.pageIndex
      // }
      // const res = await this.getRequest('/post', {
      //   pageSize: this.pageSize,
      //   pageIndex: this.pageIndex
      // })
      const res = await getPostList({
        pageSize: this.pageSize,
        pageIndex: this.pageIndex
      })
      console.log(res.data)

      const { statusCode, data, total } = res.data
      if (statusCode === 200) {
        this.postList = data
        this.total = total
        // setTimeout(function () {
        //   _this.loading = false
        // }, 1000)
      }
    },
    handleCurrentChange (val) {
      this.pageIndex = val
      // console.log(this.pageIndex)

      this.getPostList()
    },
    handleSizeChange (val) {
      this.pageIndex = 1
      this.pageSize = val
      this.getPostList()
    },
    indexMethod (index) {
      return this.pageSize * (this.pageIndex - 1) + index + 1
    },
    edit (id) {
      this.$router.push({
        name: 'postpublish',
        params: {
          id: id
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.post-list {
  .paging{
    margin: auto;
  }
  .el-table {
    margin-top: 10px;
    .avatar {
      width: 200px;
      height: 150px;
      object-fit: cover;
    }
    .el-button{
      margin-left: 20px;
    }
  }
}
</style>
