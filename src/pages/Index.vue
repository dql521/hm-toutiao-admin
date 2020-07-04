<template>
  <div class="ad_index">
    <h1>我的广告</h1>
    <div class="myAdData">
      <div class="count_item">
        <div class="item">
          <img src="../assets/allAd.png" />
          <div class="item_data">
            <p>总广告数</p>
            <h1>{{total.current}}</h1>
            <span style="margin-right: 20px;">上周：{{total.last}}</span>
            <span>同比：{{total.rate}}%</span>
            <i class="el-icon-top"></i>
          </div>
        </div>
      </div>
      <div class="count_item">
        <div class="item">
          <img src="../assets/onShelves.png" />
          <div class="item_data">
            <p>待上线数量</p>
           <h1>{{published.current}}</h1>
            <span style="margin-right: 20px;">上周：{{published.last}}</span>
            <span>同比：{{published.rate}}%</span>
            <i class="el-icon-top"></i>
          </div>
        </div>
      </div>
      <div class="count_item">
        <div class="item">
          <img src="../assets/shelves.png" />
          <div class="item_data">
            <p>上架中数量</p>
            <h1>{{publishing.current}}</h1>
            <span style="margin-right: 20px;">上周：{{publishing.last}}</span>
            <span>同比：{{publishing.rate}}%</span>
            <i class="el-icon-top"></i>
          </div>
        </div>
      </div>
      <div class="count_item">
        <div class="item">
          <img src="../assets/didShelves.png" />
          <div class="item_data">
            <p>已下架数量</p>
            <h1>{{topublish.current}}</h1>
            <span style="margin-right: 20px;">上周：{{topublish.last}}</span>
            <span>同比：{{topublish.rate}}%</span>
            <i class="el-icon-top"></i>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <h1>快捷操作</h1>
      <div class="bottomBtn">
        <router-link v-for="item in bottomImgDatas" :key="item.id" :to="{path: item.path}">
          <img :src="item.img" />
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { getCountDate } from '../api/api'
// import aurl from "@/assets/a.png";
// import burl from "@/assets/b.png";
// import curl from "@/assets/c.png";
export default {
  data () {
    return {
      ADdata: [],
      total: {
        current: 0,
        last: 153,
        rate: 8
      },
      published: {
        current: 0,
        last: 277,
        rate: 4
      },
      publishing: {
        current: 0,
        last: 96,
        rate: 5
      },
      topublish: {
        current: 0,
        last: 277,
        rate: 4
      },
      bottomImgDatas: [
        { img: require('@/assets/a.png'), id: 0, path: '/adpublish' },
        { img: require('@/assets/b.png'), id: 1, path: '/postlist' },
        { img: require('@/assets/c.png'), id: 2, path: '/gallery' }
      ]
    }
  },
  created () {
    this.getCountDates()
  },
  mounted () {},
  methods: {
    jump (i) {
      console.log('点击了第' + i + '张图片')
    },
    async getCountDates () {
      const res = await getCountDate()
      const { code, data } = res.data
      if (code === 200) {
        this.ADdata = data
        console.log(this.ADdata)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.ad_index {
  background-color: #eff2f9;
  overflow: hidden;
}
.myAdData {
  width: 1652px;
  height: 240px;
  padding: 50px 0;
  background: rgba(255, 255, 255, 1);
  margin: auto;
  display: flex;
  .count_item {
    flex: 1;
    padding: 0 46px;
    border-right: 2px solid #EFF2F9;
    .item {
      height: 100%;
      display: flex;
      align-items: center;
      img {
        display: block;
        width: 72px;
        height: 72px;
        border-radius: 4px;
      }
    }
  }
}
.myAdData .count_item:last-child{
  border-right: 0;
}
.item_data {
  flex: 1;
  text-align: start;
  margin-left: 32px;
  font-family: "PingFang-SC-Regular,PingFang-SC";
  font-weight: 400;
  p {
    font-size: 16px;
    font-weight: 400;
    color: rgba(34, 34, 34, 1);
    line-height: 22px;
  }
  h1 {
    font-size: 40px;
    font-weight: 700;
    color: rgba(34, 34, 34, 1);
    line-height: 70px;
    margin: 0;
  }
  span,
  i {
    font-size: 16px;
    color: rgba(143, 153, 171, 1);
    line-height: 22px;
  }
  i {
    font-weight: 900;
    margin-left: 5px;
  }
  .el-icon-top {
    color: #21ce54;
  }
  .el-icon-bottom {
    color: #d80000;
  }
}

.bottom {
  .bottomBtn {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-left: 24px;
    margin-right: 24px;
    img {
      width: 520px;
      height: 220px;
    }
  }
}
h1 {
  font-size: 22px;
  color: #222222;
  font-weight: bold;
  margin-left: 24px;
  height: 80px;
  align-items: center;
  display: flex;
}
</style>
