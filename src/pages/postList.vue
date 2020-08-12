<template>
  <div class="post-list">
    <!-- 头部渠道 -->
    <el-tabs type="border-card" v-model="activeName">
      <el-tab-pane v-for="item in channelTab" :key="item.id">
        <div slot="label" @click="getChannelId(item.id)">{{item.name}}</div>
      </el-tab-pane>
    </el-tabs>
    <!-- 条件筛选 -->
    <div class="top">
      <span>搜索：</span>
      <el-input placeholder="请输入内容" v-model="params.kw">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <span class="the_title">更新时间：</span>
      <el-button plain @click="getAdList(1)">本周</el-button>
      <el-button plain @click="getAdList(2)">本月</el-button>
      <el-button plain @click="getAdList(3)">近三月</el-button>
      <el-button autofocus plain @click="getAdList(4)">近半年</el-button>
      <span class="the_title">自定义：</span>
      <el-date-picker
        v-model="date"
        type="daterange"
        start-placeholder="选择日期"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        @change="getDate"
      ></el-date-picker>
      <el-button type="primary" @click="getAdList(0)">查询</el-button>
    </div>

    <!-- 广告信息表格 -->
    <div class="ad_table">
      <el-table :data="tableData">
        <el-table-column label="名称">
          <template slot-scope="scope" class="ad_name">
            <el-popover trigger="hover" placement="top">
              <p>名称: {{ scope.row.name }}</p>
              <div slot="reference" class="name-wrapper">{{ scope.row.name }}</div>
            </el-popover>
            <!-- <span>{{ scope.row.name }}</span> -->
          </template>
        </el-table-column>

        <el-table-column label="位置">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>位置: {{ scope.row.position_name }}</p>
              <div slot="reference" class="name-wrapper">{{ scope.row.position_name }}</div>
            </el-popover>
          </template>
        </el-table-column>

        <el-table-column label="顺序" min-width="60" type="index" :index="indexMethod"></el-table-column>

        <el-table-column label="类型" min-width="50">
          <template slot="header">
            <el-dropdown trigger="click">
              <span class="el-dropdown-link">
                类型
                <i class="el-icon-caret-bottom"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="filterType(-1)">轮播图</el-dropdown-item>
                <el-dropdown-item @click.native="filterType(0)">单张图</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <!-- <span>类型</span>
            <i class="el-icon-arrow-down" @click="tyleClick"></i>-->
          </template>
          <template slot-scope="scope">
            <span v-if="scope.row.adsType === -1">轮播</span>
            <span v-if="scope.row.adsType === 0">图片</span>
            <span v-if="scope.row.adsType === 1">视频</span>
            <span v-if="scope.row.adsType === 2">图文</span>
          </template>
        </el-table-column>

        <el-table-column label="开始时间" prop="start_time" sortable>
          <template slot-scope="scope">
            <span>{{scope.row.start_time}}</span>
          </template>
        </el-table-column>

        <el-table-column label="结束时间" prop="end_time" sortable>
          <template slot-scope="scope">
            <span>{{scope.row.end_time}}</span>
          </template>
        </el-table-column>

        <el-table-column label="缩略图">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">
              <el-image :src="scope.row.url" fit="fit"></el-image>
            </div>
          </template>
        </el-table-column>

        <el-table-column>
          <template slot="header">
            <el-dropdown trigger="click">
              <span class="el-dropdown-link">
                状态
                <i class="el-icon-caret-bottom"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="filterState(0)">待上架</el-dropdown-item>
                <el-dropdown-item @click.native="filterState(1)">上架中</el-dropdown-item>
                <el-dropdown-item @click.native="filterState(2)">已下架</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <!-- <span>状态</span>

            <i class="el-icon-arrow-down" @click="tyleClick"></i>-->
          </template>
          <template slot-scope="scope">
            <img
              src="../assets/img/NotOnlineIcon.png"
              v-if="scope.row.state == 0 "
              class="sort_img"
            />
            <img src="../assets/img/on-lineIcon.png" v-if="scope.row.state == 1 " class="sort_img" />
            <img src="../assets/img/Dropicon.png" v-if="scope.row.state == 2 " class="sort_img" />
            <!-- <el-tag size="medium" style="height:30px;border-radius: 30px;padding:9px">{{ scope.row.states }}</el-tag> -->
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              :disabled="scope.row.state == 2 || scope.row.is_default == 1"
              :class="{'let_bray': scope.row.state == 2 || scope.row.is_default == 1}"
              style="color:#3374F3;font-size:12px;margin-right: 10px"
              @click="getCntDetails(scope.$index, scope.row)"
            >预览</el-button>
            <el-button
              type="text"
              :disabled="scope.row.state == 2 || scope.row.is_default == 1"
              :class="{'let_bray': scope.row.state == 2 || scope.row.is_default == 1}"
              style="color:#3374F3;font-size:12px;margin-right: 10px"
              @click.native="editCnt(scope.$index, scope.row)"
            >修改</el-button>
            <el-button
              type="text"
              :disabled="scope.row.state == 1 || scope.row.state == 2 || scope.row.is_default == 1"
              :class="{'let_bray': scope.row.state == 1 || scope.row.state == 2 || scope.row.is_default == 1}"
              style="color:#3374F3;font-size:12px"
              @click="deletCnt(scope.$index, scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="paging">
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        :page-size="params.pageSize"
        :current-page="params.pageNumber"
        @current-change="handleCurrentChange"
        :page-sizes="[10, 20, 30, 40]"
        @size-change="handleSizeChange"
        :total="total"
        :pager-count="11"
      ></el-pagination>
    </div>

    <!-- 查看详情弹框 -->
    <el-dialog title="广告详情" :visible.sync="showDetails" class="ad_Details" width="504px">
      <el-carousel
        arrow="always"
        trigger="click"
        :autoplay="true"
        class="details_img"
        :loop="true"
        @change="changeDetail"
      >
        <el-carousel-item v-for="(item,index) in detailsList" :key="index">
          <el-image :src="item.url" fit="fill"></el-image>
        </el-carousel-item>
      </el-carousel>
      <div class="details_info">
        <p>广告名称：{{detailsListInfo.name}}</p>
        <p>生成时间：{{detailsListInfo.startTime}}</p>
        <p>结束时间：{{detailsListInfo.endTime}}</p>
        <p>跳转链接：{{detailsListInfo.linkUrl == '' ? '无' : detailsListInfo.linkUrl}}</p>
        <p>
          广告状态：
          <img src="../assets/img/NotOnlineIcon.png" v-if="detailsListInfo.state == '待上架'" />
          <img src="../assets/img/on-lineIcon.png" v-if="detailsListInfo.state == '上架中'" />
          <img src="../assets/img/Dropicon.png" v-if="detailsListInfo.state == '已下架'" />
        </p>
      </div>
    </el-dialog>
    <!-- 修改广告弹框 -->
    <el-dialog title="修改" :visible.sync="isAlterDialog">
      <div class="form_data">
        <div class="form_title">
          <i></i>广告信息
        </div>
        <el-form :model="editCntParmas" label-position="left">
          <el-form-item label="广告名称：" required>
            <el-input
              v-model="editCntParmas.name"
              maxlength="20"
              show-word-limit
              placeholder="请输入广告名称"
            ></el-input>
          </el-form-item>
          <el-form-item required>
            <span slot="label">
              <!-- <span>广告图片:&ensp;</span> -->
              广告图片：
            </span>
            <div class="img_upload" @mouseover="imgSizes" :title="imgSize">
              <el-image :src="editCntParmas.adsUrl" fit="fill"></el-image>
              <div class="set_pictrue">
                <el-dropdown>
                  <span class="el-dropdown-link">
                    <i class="el-icon-Set"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="showBigImg = true">查看</el-dropdown-item>
                    <el-dropdown-item @click.native="getPics">替换</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </div>
          </el-form-item>

          <div class="form_title">
            <i></i>投放设置
          </div>
          <el-form-item label="起止时间：" required>
            <el-date-picker
              v-model="dates"
              type="datetimerange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd HH:mm"
              value-format="yyyy-MM-dd HH:mm:ss"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="超链接：" required>
            <el-radio-group v-model="editCntParmas.linkType">
              <el-radio :label="3">不选择</el-radio>
              <el-radio :label="1">APP内跳转</el-radio>
              <el-radio :label="2" style="margin-left: 0;">外部页面</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="链接地址：" required>
            <el-input v-model="editCntParmas.linkUrl" placeholder="请输入链接"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isAlterDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleCnt">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 查看图片弹框 -->
    <el-dialog title="查看图片" :visible.sync="showBigImg" class="big_img">
      <el-image :src="editCntParmas.adsUrl" fit="fit"></el-image>
    </el-dialog>

    <!-- 选择图片弹框 -->
    <el-dialog title="选择图片" :visible.sync="isPictrueDialog" class="pictrue_dialog">
      <div class="choose_pictrue">
        <div class="tabs">
          <el-tabs tab-position="left">
            <el-tab-pane v-model="activeName" v-for="item in channelTabNum" :key="item.name">
              <div
                slot="label"
                @click="getImgList(item.id,item.resourceNum)"
              >{{item.name}}&ensp;({{item.resourceNum}})</div>
            </el-tab-pane>
          </el-tabs>
        </div>
        <div class="pictrue_content">
          <div class="local_up">
            <span>格式要求:&ensp;</span>
            <el-popover
              placement="bottom"
              trigger="hover"
              content="目前支持上传jpeg/png/jpg/gif/bmp/tiff/dwg格式文件，一次性最大限制5张"
            >
              <span class="el-icon-Tip" slot="reference">&ensp;</span>
            </el-popover>
            <span class="upload">
              <el-upload
                :data="fileParmas"
                :action="`${$baseUrl}/resource/upload`"
                multiple
                :headers="headers"
                :limit="5"
                :show-file-list="false"
                :file-list="fileList"
                :on-success="fileSuc"
                :before-upload="beforeUpload"
                :on-exceed="exceedMsg"
              >
                <el-button size="small" type="primary">本地上传</el-button>
              </el-upload>
            </span>
          </div>
          <ul>
            <li v-for="(item, index) in pictrueList"
            :key="item.id"
            :title="imgSize"
            @mouseover="getImgSize(index)">
              <el-checkbox-group v-model="checkList" :max="1" :disabled="isCheckedImg">
                <el-checkbox :label="item">
                  <el-image :src="item.url" fit="fill" lazy>></el-image>
                </el-checkbox>
              </el-checkbox-group>
            </li>
          </ul>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button
          @click="() => {
          isPictrueDialog = false
          checkList = []
          }"
        >取 消</el-button>
        <el-button type="primary" @click="addCheckImg">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getChannels,
  getAdLists,
  delCnt,
  modCnt,
  getCntDetail,
  getPictrueList,
  getChannelsImg
} from '@/api/api'
import { showLoading, hideLoading } from '@/utils/utils'
export default {
  data () {
    return {
      activeName: '0',
      channelTabNum: [], // 素材库渠道
      date: [], // 查询时间选择器
      dates: [], // 时间选择器
      channelTab: [], // 渠道列表
      total: 0, // 总页数
      tableData: [], // 表格数据
      showBigImg: false, // 查看图片
      showDetails: false, // 查看广告详情
      isAlterDialog: false, // 修改广告
      isPictrueDialog: false, // 选择图片弹框
      isCheckedImg: false, // 是否禁用图片选择
      params: {
        kw: '',
        pageSize: 10,
        pageNumber: 1,
        timeType: '',
        startTime: '',
        endTime: '',
        channelId: ''
      }, // 查询参数
      detailsListInfo: {
        name: '',
        startTime: '',
        endTime: '',
        linkUrl: ''
      }, // 详情回显数据
      detailsList: [], // 详情列表
      editCntParmas: {
        id: '',
        name: '', // 广告名称
        resId: '', // 资源编号
        startTime: '', // 开始时间
        endTime: '', // 结束时间
        linkType: 3, // 跳转类型
        linkUrl: '', // 跳转地址
        adsUrl: ''
      },
      fileParmas: {
        channelId: '',
        type: 0
      }, // 本地上传参数
      fileList: [], // 资源列表
      pictrueList: [], // 图片库资源
      checkList: [],
      headers: {
        token: localStorage.getItem('token')
      }, // 请求token
      imgSize: ''
    }
  },
  created () {
    this.getChannel()
  },
  mounted () {

  },
  methods: {
    // 日期选择器选择回调
    getDate (val) {
      if (val == null) {
        this.params.startTime = ''
        this.params.endTime = ''
      } else {
        this.params.startTime = val[0]
        this.params.endTime = val[1]
      }
    },
    // 获取渠道
    async getChannel () {
      const res = await getChannels()
      // debugger
      const { code, data } = res.data
      if (code === 200 || code === 201 || code === 202 || code === 204) {
        this.channelTab = data.channelList
        this.params.channelId = this.channelTab[0].id
        this.fileParmas.channelId = this.channelTab[0].id
        this.getAdList()
      }
    },
    getChannelId (id) {
      this.params.channelId = id
      this.getAdList()
    },
    // 获取广告列表
    async getAdList (timeType) {
      if (timeType != 0) {
        this.params.timeType = timeType
      }
      showLoading()
      const res = await getAdLists(this.params)
      const { code, data } = res.data
      if (code === 200) {
        hideLoading()
        this.tableData = data.list
        this.total = data.total
      } else {
        hideLoading()
      }
    },

    // 修改广告
    editCnt (index, row) {
      // if (row.state == 1) {
      //   this.$alert("该条广告正在上架中，无法修改！", "提示", {
      //     confirmButtonText: "确定",
      //     type: "warning",
      //     callback: () => {}
      //   });
      //   return;
      // }
      this.dates = [row.start_time + ':00', row.end_time + ':00']
      this.editCntParmas.name = row.name
      this.editCntParmas.id = row.id
      this.editCntParmas.resId = row.resId
      this.editCntParmas.linkType = row.linkType
      if (row.linkUrl == null || row.linkUrl == undefined) {
        this.editCntParmas.linkUrl = ''
      } else {
        this.editCntParmas.linkUrl = row.linkUrl
      }
      this.editCntParmas.adsUrl = row.url
      this.isAlterDialog = true
      // this.editCntParmas.userId = row.userId
    },
    async handleCnt () {
      this.editCntParmas.startTime = this.dates[0]
      this.editCntParmas.endTime = this.dates[1]
      if (this.editCntParmas.linkType == 1 || this.editCntParmas.linkType == 2) {
        this.$message.error('请填写链接地址！')
        return
      }
      const res = await modCnt(this.editCntParmas)
      const { code, data, message } = res.data
      if (code == 200) {
        this.$message.success(data)
        this.isAlterDialog = false
        this.getAdList()
      } else {
        this.$message.error(message)
        this.isAlterDialog = false
      }
    },

    // 删除广告
    async deletCnt (index, row) {
      if (row.state == 1) {
        this.$message.error('已上架广告暂无法删除！')
        return
      }
      this.$confirm('确定删除此条广告吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await delCnt(row.id)
          const { code, message } = res.data
          if (code == 204) {
            this.$message.success(message)
            this.getAdList()
          } else {
            this.$message.error(message)
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
    },
    // 查看广告详情
    changeDetail (index, oldIndex) {
      this.detailsListInfo.name = this.detailsList[index].name
      this.detailsListInfo.startTime = this.detailsList[index].startTime
      this.detailsListInfo.endTime = this.detailsList[index].endTime
      this.detailsListInfo.linkUrl = this.detailsList[index].linkUrl
      this.detailsListInfo.state = this.detailsList[index].state
    },
    async getCntDetails (index, row) {
      this.showDetails = true
      const res = await getCntDetail(row.id)
      const { code, data } = res.data
      if (code == 200) {
        this.detailsList = data
        this.detailsListInfo.name = this.detailsList[0].name
        this.detailsListInfo.startTime = this.detailsList[0].startTime
        this.detailsListInfo.endTime = this.detailsList[0].endTime
        this.detailsListInfo.linkUrl = this.detailsList[0].linkUrl
        this.detailsListInfo.state = this.detailsList[0].state
      } else {
        this.$message.error(message)
      }
    },

    // 分页器
    handleCurrentChange (val) {
      this.params.pageNumber = val
      this.getAdList()
    },
    handleSizeChange (val) {
      this.params.pageNumber = 1
      this.params.pageSize = val
      this.getAdList()
    },
    // 排序
    indexMethod (index) {
      return this.params.pageSize * (this.params.pageNumber - 1) + index + 1
    },
    // 条件筛选
    filterType (type) {
      this.tableData = this.tableData.filter((item) => {
        return item.adsType == type
      })
    },
    filterState (state) {
      this.tableData = this.tableData.filter((item) => {
        return item.state == state
      })
    },

    // 上传相关
    // 获取图片库资源
    async getPics () {
      this.isPictrueDialog = true
      const res = await getChannelsImg()
      const { code, data } = res.data
      if (code === 200) {
        this.channelTabNum = data.channelList
      }
      this.getImgList(
        this.channelTabNum[0].id,
        this.channelTabNum[0].resourceNum
      )
    },
    async getImgList (id, resNum) {
      this.fileParmas.channelId = id
      const res = await getPictrueList({
        limit: resNum,
        offset: 1,
        channelId: id
      })
      const { code, data } = res.data
      if (code === 200) {
        this.pictrueList = data.list
      }
    },
    fileSuc (res, file, fileList) {
      const { code, message } = res
      if (code === 200) {
        this.$message.success('资源增加成功')
        this.fileList = []
        this.getPics()
      } else {
        this.fileList = []
        this.$message.error(message)
      }
    },
    beforeUpload (file) {
      var testmsg = /^image\/(jpeg|png|jpg|gif|bmp|tiff|dwg)$/.test(file.type)
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!testmsg) {
        this.$message.error('请上传jpeg/png/jpg/gif/bmp/tiff/dwg格式文件!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return testmsg && isLt2M
    },
    addCheckImg () {
      const { id, url, userId } = this.checkList[0]
      this.editCntParmas.resId = id
      this.editCntParmas.adsUrl = url
      this.editCntParmas.userId = userId
      this.checkList = []
      this.isPictrueDialog = false
    },
    exceedMsg () {
      this.$message.error('已超出最大上传张数')
    },
    getImgSize (index) {
      const img = new Image()
      img.src = this.pictrueList[index].url
      // console.log(img);
      img.onload = () => {
        this.imgSize = `图片尺寸：${img.width}*${img.height}`
        // console.log(img.width+'*'+img.height);
      }
    },
    imgSizes () {
      const img = new Image()
      img.src = this.editCntParmas.adsUrl
      // console.log(img);
      img.onload = () => {
        this.imgSize = `图片尺寸：${img.width}*${img.height}`
        // console.log(img.width+'*'+img.height);
      }
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
  .paging {
    font-size: 16px;
    margin-top: 45px;
    // margin-bottom: 88px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .ad_table {
    width: 100%;
    font-size: 16px;
    ::v-deep .let_bray {
      span {
        color: #e0e0e0;
      }
    }
    ::v-deep .el-table__header-wrapper,
    ::v-deep .el-table__header,
    ::v-deep .el-table__header .has-gutter th {
      background: #eff2f9;
    }
    ::v-deep .cell{
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
// text-align: center;
// margin: auto;
&:nth-of-type(3){
  text-align: center;
}
    }
    ::v-deep .el-dropdown {
      color: #909399;
      font-weight: 700;
    }
    .name-wrapper {
      width: 80px;
      height: 40px;
      .el-image {
        width: 100%;
        height: 100%;
      }
    }
    .sort_img {
      width: 90px;
      height: 25px;
    }
  }
  .top {
    color: #222222;
    font-size: 16px;
    background-color: #eff2f9;
    height: 88px;
    margin: 24px auto;
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
      margin-left: 18px;
    }
    .el-date-editor {
      width: 280px;
    }
  }
}
.ad_Details {
  .el-image {
    width: 100%;
    height: 300px;
    img {
      width: 100%;
    }
  }
}
.form_data {
  padding: 24px;
  font-size: 16px;
  .form_title {
    font-size: 22px;
    font-weight: 700;
    color: rgba(34, 34, 34, 1);
    line-height: 30px;
    margin-bottom: 20px;
    i {
      width: 4px;
      height: 16px;
      display: inline-block;
      background: rgba(51, 116, 243, 1);
      margin-right: 16px;
    }
  }
  .el-form {
    padding: 0 24px;
    .el-input {
      width: 352px;
    }
  }

  .img_upload {
    display: inline-block;
    width: 320px;
    height: 160px;
    position: relative;
    &:hover {
      box-shadow: 2px 2px 10px 5px #eff2f9a9;
      border: 1px solid #409eff;
      .set_pictrue {
        opacity: 1;
        transition: 0.3s all;
      }
    }
    .el-image {
      width: 320px;
      height: 160px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .set_pictrue {
      position: absolute;
      top: 5px;
      right: 16px;
      width: 16px;
      height: 16px;
      opacity: 0;
      .el-icon-Set {
        // font-weight: 700;
        font-family: "PingFang-SC-Regular,PingFang-SC";
        margin-right: 5px;
        background: url("../assets/img/Set.png") center no-repeat;
        background-size: cover;
      }
      .el-icon-Set:before {
        content: "\66ff";
        font-size: 16px;
        visibility: hidden;
      }
    }
  }
  .puton_title {
    font-size: 22px;
    font-weight: bold;
    color: rgba(34, 34, 34, 1);
    line-height: 30px;
  }
  .create_ad {
    margin-left: 100px;
    margin-top: 20px;
  }
  .el-input {
    margin-left: 10px;
  }
}
::v-deep .details_info {
  p {
    font-size: 16px;
    line-height: 40px;
    margin-top: 10px;
    img {
      width: 88px;
      height: 28px;
      vertical-align: middle;
    }
  }
}
.pictrue_dialog {
  ::v-deep .el-dialog__body {
    padding: 0;
  }
  .choose_pictrue {
    display: flex;
    border-bottom: 1px solid #e0e0e0;
    .tabs {
      width: 200px;
      height: 480px;
      overflow: scroll;
      &::-webkit-scrollbar {
        width: 0;
      }
      .el-tabs {
        border: none;
        width: 100%;
        ::v-deep .el-tabs__header {
          width: 100%;
          .el-tabs__item {
            text-align: start;
            text-indent: 10px;
          }
        }
      }
    }
    .pictrue_content {
      flex: 1;
      padding: 24px 24px;
      .local_up {
        display: flex;
        justify-content: flex-end;
        height: 40px;
        line-height: 40px;
      }
      ul {
        height: 400px;
        display: flex;
        justify-content: start;
        flex-wrap: wrap;
        list-style-type: none;
        margin-top: 20px;
        overflow: scroll;
        &::-webkit-scrollbar {
          width: 0;
        }
        li {
          width: 160px;
          height: 90px;
          margin-right: 23px;
          margin-bottom: 23px;
          position: relative;
          &:nth-child(4n) {
            margin-right: 0;
          }
          &:hover {
            box-shadow: 0px 0px 10px 5px #eff2f9cc;
          }
          ::v-deep .el-checkbox__label,
          .el-checkbox {
            width: 160px;
            height: 90px;
            padding-left: 0;
            .el-image {
              height: 90px;
              width: 160px;
              .el-image__inner {
                width: 100%;
                height: 100%;
                object-fit: cover;
                object-position: center;
              }
            }
          }

          ::v-deep .el-checkbox__input,
          ::v-deep .el-checkbox__inner {
            position: absolute;
            top: 5px;
            right: 10px;
            width: 16px;
            height: 16px;
            // opacity: 0;
          }
          // .set_pictrue:hover {
          //   opacity: 1;
          //   transition: 0.3s all;
          // }
        }
      }
    }
  }
}
::v-deep .el-dialog__header {
  border: 1px solid #e0e0e0;
}
.el-icon-Tip {
  // font-weight: 700;
  font-family: "PingFang-SC-Regular,PingFang-SC";
  margin-right: 5px;
  background: url("../assets/img/Tip.png") center no-repeat;
  background-size: cover;
  margin-bottom: 5px;
}
.el-icon-Tip:before {
  content: "\66ff";
  font-size: 16px;
  visibility: hidden;
}
</style>
