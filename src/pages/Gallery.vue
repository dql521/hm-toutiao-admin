<template>
  <div class="gallery">
    <div class="pictrue_top">
      <!-- 新增渠道 -->
      <el-button type="primary" @click="isDlag = true" class="new_button">
        <i class="el-icon-add"></i>
        新增渠道
      </el-button>
      <div class="local_up">
        <span>格式要求&ensp;</span>
        <el-popover placement="bottom" trigger="hover" content="仅支持png/jpg/jpeg格式">
          <span class="el-icon-Tip" slot="reference"></span>
        </el-popover>
        <span class="upload">
          <el-upload
            action="#"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            multiple
            :limit="3"
            :on-exceed="handleExceed"
            :file-list="fileList"
          >
            <el-button size="small" type="primary">本地上传</el-button>
          </el-upload>
        </span>
      </div>
    </div>
    <div class="pictrue_content">
      <ul>
        <li v-for="item in menuList" :key="item.id">
          <el-image :src="item.src" fit="fill" lazy>></el-image>
          <div class="set_pictrue">
            <el-dropdown>
              <span class="el-dropdown-link">
                <i class="el-icon-Set"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="showDialog(item.src)">查看</el-dropdown-item>
                <el-dropdown-item>替换</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div class="state" v-if="state">使用中</div>
        </li>
      </ul>
    </div>
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

    <el-dialog title="查看图片" :visible.sync="isdialog">
      <el-image :src="bigSrc" fit="fit"></el-image>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      fileList: [],
      bigSrc: '',
      pageSize: 3,
      pageIndex: 1,
      total: 100,
      isdialog: false,
      state: false,
      value: '',
      menuList: [
        {
          id: 1,
          src:
            'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
          des: '这是第一个描述',
          price: 198
        },
        {
          id: 2,
          src:
            'https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1594017553&di=dc121fedd61a7aba370575d0006f9e8e&src=http://a0.att.hudong.com/56/12/01300000164151121576126282411.jpg',
          des: '这是第二个描述',
          price: 198
        },
        {
          id: 3,
          src:
            'https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1594017553&di=dc121fedd61a7aba370575d0006f9e8e&src=http://a0.att.hudong.com/56/12/01300000164151121576126282411.jpg',
          des: '这是第三个描述',
          price: 211
        },
        {
          id: 4,
          src:
            'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1594027754481&di=ea01700f72369abc392074fb512df58b&imgtype=0&src=http%3A%2F%2Fa0.att.hudong.com%2F64%2F76%2F20300001349415131407760417677.jpg',
          des: '这是第一个描述',
          price: 198
        },
        {
          id: 5,
          src:
            'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2037841410,2887638459&fm=26&gp=0.jpg',
          des: '这是第二个描述',
          price: 112
        },
        {
          id: 6,
          src:
            'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
          des: '这是第三个描述',
          price: 423
        },
        {
          id: 7,
          src: 'images/3.jpg',
          des: '这是第二个描述',
          price: 112
        },
        {
          id: 8,
          src: 'images/3.jpg',
          des: '这是第三个描述',
          price: 423
        },
        {
          id: 9,
          src: 'images/3.jpg',
          des: '这是第二个描述',
          price: 112
        },
        {
          id: 10,
          src: 'images/3.jpg',
          des: '这是第三个描述',
          price: 423
        },
        {
          id: 11,
          src: 'images/3.jpg',
          des: '这是第二个描述',
          price: 112
        },
        {
          id: 12,
          src: 'images/3.jpg',
          des: '这是第三个描述',
          price: 423
        },
        {
          id: 13,
          src: 'images/3.jpg',
          des: '这是第二个描述',
          price: 112
        },
        {
          id: 14,
          src: 'images/3.jpg',
          des: '这是第三个描述',
          price: 423
        },
        {
          id: 15,
          src: 'images/3.jpg',
          des: '这是第二个描述',
          price: 112
        },
        {
          id: 16,
          src: 'images/3.jpg',
          des: '这是第三个描述',
          price: 423
        }
      ]
    }
  },
  methods: {
    showDialog (src) {
      this.isdialog = true
      this.bigSrc = src
    },
    handlePreview () {},
    handleRemove () {},
    beforeRemove () {},
    handleExceed () {},
    handleCurrentChange () {},
    handleSizeChange () {},
    // 鼠标移入加入class
    changeActive (item) {
      //  $event.currentTarget.className="active";
      //  $$event.currentTarget.methods
      //  alert(item.src);
    },
    removeActive (item) {
      //  $event.currentTarget.className="";
    }
  }
}
</script>

<style lang="scss" scoped>
.gallery {
  padding: 24px;
  background: #fff;
  width: 1652px;
  .pictrue_top {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 24px 48px;
    .new_button {
      .el-icon-add {
        // font-weight: 700;
        font-family: "PingFang-SC-Regular,PingFang-SC";
        margin-right: 5px;
        background: url("../assets/img/Add.png") center no-repeat;
        background-size: cover;
      }
      .el-icon-add:before {
        content: "\66ff";
        font-size: 16px;
        visibility: hidden;
      }
    }
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
          top: 5px;
          right: 24px;
          width: 16px;
          height: 16px;
          opacity: 0;
        }
        .set_pictrue:hover {
          opacity: 1;
          transition: 0.3s all;
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
</style>
