<template>
  <div class="gallery">
    <!-- 头部渠道 -->
    <el-tabs type="border-card" v-model="activeName">
      <el-tab-pane v-for="item in channelTab" :key="item.id">
        <div slot="label" @click="getChannelId(item.id)">{{item.name}}</div>
      </el-tab-pane>
    </el-tabs>
    <div class="pictrue_top">
      <div class="local_up">
        <span>格式要求:&ensp;</span>
        <el-popover placement="bottom" trigger="hover" content="目前支持上传jpeg/png/jpg/gif/bmp/tiff/dwg格式文件，一次性最大限制5张">
          <span class="el-icon-Tip" slot="reference"></span>
        </el-popover>
        <span class="upload">
          <el-upload
            :data="parmas"
            :action="`${$baseUrl}/resource/upload`"
            :headers="headers"
            :on-success="handleFileSuc"
            :before-upload="beforeAvatarUpload"
            multiple
            :limit="5"
            :on-exceed="exceadMsg"
            :show-file-list="false"
            :file-list="fileList"
          >
            <el-button size="small" type="primary">本地上传</el-button>
          </el-upload>
        </span>
      </div>
    </div>
    <div class="pictrue_content">
      <ul>
        <li v-for="(item,index) in pictrueList" :key="index">
          <el-image :src="item.url" fit="fill" lazy>
            <div slot="error" class="image-slot">
        <i class="el-icon-picture-outline"></i>
      </div>
          </el-image>
          <div class="set_pictrue">
            <el-dropdown>
              <span class="el-dropdown-link">
                <i class="el-icon-Set"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="showDialog(item.url)">查看</el-dropdown-item>
                <el-dropdown-item style="color: red;" @click.native="removePictrues(item.id)">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div class="state" v-if="item.isUse === 1">使用中</div>
        </li>
      </ul>
      <div class="is_null" v-if="pictrueList.length < 1">
        <img src="../assets/img/no.png" />
      </div>
    </div>
    <div class="paging">
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        :page-size="parmas.limit"
        :current-page="parmas.offset"
        @current-change="handleCurrentChange"
        :page-sizes="[18, 54, 100, 200]"
        @size-change="handleSizeChange"
        :total="total"
        :pager-count="11"
      ></el-pagination>
    </div>

    <el-dialog title="查看图片" :visible.sync="isdialog" class="big_img">
      <el-image :src="bigSrc" fit="fit"></el-image>
    </el-dialog>
  </div>
</template>

<script>
import { getChannels, getPictrueList, removePictrue, addChannels } from "@/api/api.js"
import {showLoading, hideLoading} from '@/utils/utils.js'

export default {
  data() {
    return {
      activeName: "0",
      channelTab: [],
      fileList: [],
      bigSrc: "",
      total: 0,
      isDlag: false,
      isdialog: false,
      state: false,
      headers: {
        token: localStorage.getItem('token')
      },
      parmas: {
        limit: 18,
        offset: 1,
        channelId: 7,
        type: 0
      },
      pictrueList: []
    };
  },
  created() {
    this.getChannel();
    this.getPictrueLists();
  },
  methods: {
    // 获取渠道
    async getChannel() {
      const res = await getChannels();
      const { code, data } = res.data;
      if (code === 200 || code === 201 || code === 202 || code === 204) {
        this.channelTab = data.channelList;
      }
    },
    getChannelId(id) {
      this.parmas.channelId = id;
      this.getPictrueLists();
    },

    //查看图片
    showDialog(src) {
      this.isdialog = true;
      this.bigSrc = src;
    },
    //获取图片列表
    async getPictrueLists() {
      showLoading()
      const res = await getPictrueList(this.parmas)
      const { code, data } = res.data;
      if (code === 200) {
        hideLoading()
        this.pictrueList = data.list
        this.total = data.total
      } else {
        hideLoading()
      }
    },
    async removePictrues(id) {
      try {
        await this.$confirm("确定删除此张图片吗？", "提示", {
          type: "warning"
        });
        const res = await removePictrue({ id: id });
        const { code, message } = res.data;
        if (code === 204) {
          this.$message.success(message)
          this.getPictrueLists();
        } else {
          this.$message.error(message)
        }
      } catch {
        this.$message({
          type: "info",
          message: "已取消操作"
        });
      }
    },
    // 上传图片相关
    handleFileSuc(res, file, fileList) {
      const { code, message } = res;
      if (code === 200) {
        this.$message.success("资源增加成功");
        this.fileList = []
        this.getPictrueLists();
      } else {
        this.fileList = []
        this.$message.error(message);
      }
    },
    beforeAvatarUpload(file) {
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
    exceadMsg(){
      this.$message.error('已超出最大上传张数')
      return
    },
    //分页器
    handleCurrentChange(val) {
      this.parmas.offset = val
      this.getPictrueLists()
    },
    handleSizeChange(val) {
      this.parmas.offset = 1
      this.parmas.limit = val
      this.getPictrueLists();
    }
  }
};
</script>

<style lang="scss" scoped>
.gallery {
  padding: 24px;
  background: #fff;
  width: 1652px;
  .el-tabs {
    line-height: 22px;
    box-shadow: none;
    border: none;
    ::v-deep .el-tabs__content {
      padding: 0;
    }
  }
  .pictrue_top {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    padding: 24px 48px;
    .local_up {
      // img{
      //   width: 16px;
      //   height: 16px;
      //   margin-bottom: 5px;
      // }
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
      .upload {
        display: inline-block;
        margin-left: 16px;
      }
    }
  }
  .pictrue_content {
    padding: 0 48px;
    ul {
      display: flex;
      justify-content: start;
      flex-wrap: wrap;
      list-style-type: none;
      li {
        width: 240px;
        height: 180px;
        margin-right: 23px;
        margin-bottom: 23px;
        position: relative;
        &:nth-child(6n) {
          margin-right: 0;
        }
        &:hover {
          box-shadow: 0px 0px 10px 5px #eff2f9cc;
          .set_pictrue {
            opacity: 1;
            transition: 0.3s all;
          }
        }
        .el-image {
          height: 100%;
          width: 100%;
          .el-image__inner {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center;
          }
        }
        .set_pictrue {
          position: absolute;
          top: 10px;
          right: 24px;
          width: 16px;
          height: 16px;
          opacity: 0;
        }
        .state {
          width: 80px;
          height: 30px;
          line-height: 30px;
          font-size: 16px;
          border-radius: 15px;
          color: #fff;
          background: #3374f3;
          text-align: center;
          position: absolute;
          right: 30px;
          bottom: 10px;
        }
      }
    }
    .is_null {
      width: 100%;
      height: 700px;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 319px;
        height: 156px;
      }
    }
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
  .paging {
    font-size: 16px;
    margin-bottom: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  ::v-deep .el-dialog__header {
    border: 1px solid #e0e0e0;
  }
  .new_channelFrom{
   ::v-deep .el-dialog__body{
      text-align: start;
    }
  }
  .big_img{
 ::v-deep .el-dialog__body {
    display: flex;
    justify-content: center;
    align-items: center;
    // padding: 24px 0;
    .el-image {
      width: 100%;
    }
  }
  }
 
}
</style>
