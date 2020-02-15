<template>
  <div class="post-list">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>文章列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表格 -->
     <el-table
      :data="postList"
      style="width: 100%">
    <el-table-column
      prop="title"
      label="标题"
      width="360">
    </el-table-column>
    <el-table-column
      prop="create_date"
      label="创建时间"
      width="100">
    </el-table-column>
    <el-table-column
      prop="user.nickname"
      label="作者"
      width="100">
    </el-table-column>
    <el-table-column
      prop="user.nickname"
      label="封面"
      width="100">
    </el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button
          size="mini"
          @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      postList: [],
      pageSize: 3,
      pageIndex: 1
    }
  },
  created () {
    this.getPostList()
  },
  methods: {
    async getPostList () {
      const res = await this.$axios.get('/post', {
        params: {
          pageSize: this.pageSize,
          pageIndex: this.pageIndex
        }
      })
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.postList = data
        console.log(data)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.post-list{
  .el-table{
    margin-top: 20px;
  }
}
</style>
