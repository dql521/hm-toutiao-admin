<template>
  <div class="post-list">
    <!-- 头部渠道 -->
    <el-tabs type="border-card" v-model="activeName">
      <el-tab-pane v-for="item in channelTab" :key="item.id">
        <div slot="label">{{item.name}}</div>
      </el-tab-pane>
    </el-tabs>
    <!-- 条件筛选 -->
    <div class="top">
        <span>搜索：</span>
        <el-input placeholder="请输入内容" v-model="input4">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
      <span class="the_title">时间：</span>
      <el-button plain>本周</el-button>
      <el-button plain>本月</el-button>
      <el-button plain>近三月</el-button>
      <el-button plain>近半年</el-button>
      <span class="the_title">自定义：</span>
      <el-date-picker v-model="form.date1" type="date" placeholder="选择日期"></el-date-picker>
      <el-button type="primary">查询</el-button>
    </div>

  <!-- 广告信息表格 -->
   <div class="ad_table">
      <el-table :data="tableData">
      <el-table-column label="名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="位置">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>姓名: {{ scope.row.locations }}</p>
            <p>住址: {{ scope.row.locations }}</p>
            <div slot="reference" class="name-wrapper">{{ scope.row.locations }}</div>
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column label="顺序" prop="order"></el-table-column>

      <el-table-column prop="type" label="类型">
        <template slot="header">
          <el-dropdown trigger="click">
      <span class="el-dropdown-link">
        类型<i class="el-icon-caret-bottom"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item icon="el-icon-plus">轮播图</el-dropdown-item>
        <el-dropdown-item icon="el-icon-circle-plus">单张图</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
          <!-- <span>类型</span>
          <i class="el-icon-arrow-down" @click="tyleClick"></i> -->
        </template>
      </el-table-column>

      <el-table-column label="开始时间" prop="startTime" sortable></el-table-column>

      <el-table-column label="结束时间" prop="endTime" sortable></el-table-column>

      <el-table-column label="缩略图">
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <el-image style="width: 88px; height: 48px" :src="scope.row.thumbnail" :fit="fit"></el-image>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="states">
        <template slot="header">
            <el-dropdown trigger="click">
      <span class="el-dropdown-link">
        状态<i class="el-icon-caret-bottom"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>待上架</el-dropdown-item>
        <el-dropdown-item>上架中</el-dropdown-item>
        <el-dropdown-item>已下架</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
          <!-- <span>状态</span>

          <i class="el-icon-arrow-down" @click="tyleClick"></i> -->
        </template>
        <template slot-scope="scope">
          <span class="statesTag">{{ scope.row.states }}</span>
          <!-- <el-tag size="medium" style="height:30px;border-radius: 30px;padding:9px">{{ scope.row.states }}</el-tag> -->
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            style="color:#3374F3;font-size:12px;margin-right: 10px"
            @click="handleEdit(scope.$index, scope.row)"
          >预览</el-button>
          <el-button
            type="text"
            style="color:#3374F3;font-size:12px;margin-right: 10px"
            @click="handleDelete(scope.$index, scope.row)"
          >修改</el-button>
          <el-button
            type="text"
            style="color:#3374F3;font-size:12px"
            @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
   </div>

    <!-- 分页 -->
    <div class="paging">
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        :page-size="pageSize"
        :current-page="pageIndex"
        @current-change="handleCurrentChange"
        :page-sizes="[3, 6, 9, 12]"
        @size-change="handleSizeChange"
        :total="total"
        :pager-count="11"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import { getChannels } from '../api/api'
export default {
  data () {
    return {
      activeName: '0',
      channelTab: [],
      postList: [],
      pageSize: 3,
      pageIndex: 1,
      total: 1000,
      loading: false,
      msg: '数据加载中，请稍后',
      dialogFormVisible: false,
      tableData: [
        {
          name: '粽香端午',
          locations: '首页/城市生活/顶部banner',
          order: '8',
          type: '轮播',
          startTime: '2020-06-29 14:21',
          endTime: '2020-06-30 14:21',
          thumbnail:
            'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
          states: '上架中',
          operation: ''
        },
        {
          name: '粽香端午',
          locations: '首页/城市生活/顶部banner',
          order: '1',
          type: '轮播',
          startTime: '2020-06-30 14:21',
          endTime: '2020-06-30 14:21',
          thumbnail:
            'https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1594017553&di=dc121fedd61a7aba370575d0006f9e8e&src=http://a0.att.hudong.com/56/12/01300000164151121576126282411.jpg',
          states: '上架中',
          operation: ''
        },
        {
          name: '粽香端午',
          locations: '首页/城市生活/顶部banner',
          order: '5',
          type: '轮播',
          startTime: '2020-06-19 14:21',
          endTime: '2020-06-30 14:21',
          thumbnail:
            'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
          states: '上架中',
          operation: ''
        },
        {
          name: '粽香端午',
          locations: '首页/城市生活/顶部banner',
          order: '3',
          type: '轮播',
          startTime: '2020-06-29 14:21',
          endTime: '2020-06-30 14:21',
          thumbnail:
            'https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1594017553&di=dc121fedd61a7aba370575d0006f9e8e&src=http://a0.att.hudong.com/56/12/01300000164151121576126282411.jpg',
          states: '上架中',
          operation: ''
        },
        {
          name: '粽香端午',
          locations: '首页/城市生活/顶部banner',
          order: '2',
          type: '轮播',
          startTime: '2020-06-29 14:21',
          endTime: '2020-06-30 14:21',
          thumbnail:
            'https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1594017553&di=dc121fedd61a7aba370575d0006f9e8e&src=http://a0.att.hudong.com/56/12/01300000164151121576126282411.jpg',
          states: '上架中',
          operation: ''
        }
      ],
      dialogTableVisible: false,
      dialogFormVisible: false,
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      formLabelWidth: '120px'
    }
  },
  created () {
    this.getChannel()
  },
  methods: {
    // 获取渠道
        async getChannel() {
      const res = await getChannels();
      const { code, data } = res.data;
      if (code === 200) {
        this.channelTab = data.channelList;
      }
    },
    handleEdit (index, row) {
      console.log(index, row)
      dialogFormVisible = true
    },
    handleDelete (index, row) {
      console.log(index, row)
    },
    tyleClick () {
      alert('类型选择')
    },
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
  padding: 24px;
  background: #fff;
  .el-tabs {
    line-height: 22px;
    box-shadow: none;
    border: none;
   ::v-deep .el-tabs__content {
      padding: 0;
    }
  }
  .paging{
    font-size: 16px;
    margin-top: 45px;
    // margin-bottom: 88px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .ad_table{
    width: 100%;
    font-size: 16px;
   ::v-deep .el-table__header-wrapper,
   ::v-deep .el-table__header,
   ::v-deep .el-table__header .has-gutter th{
      background: #EFF2F9;
    }
    ::v-deep .el-dropdown{
      color: #909399;
      font-weight: 700;
    }
  }
  .top {
    color: #222222;
    font-size: 16px;
    background-color: #eff2f9;
    width: 1556px;
    height: 88px;
    margin: 24px 0;
    padding: 24px;
    display: flex;
    // justify-content: center;
    flex-direction: row;
    align-items: center;
      .el-input {
        width: 300px;
    }
    .el-button {
      width: 120px;
      margin-left: 16px;
    }
    .the_title {
      margin-left: 24px;
    }
    .el-date-editor{
      width: 320px;
    }
  }

}
</style>
