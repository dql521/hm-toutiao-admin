<template>
  <div class="ad_index">
    <h1>我的广告</h1>
    <div class="myAdData">
      <div class="count_item">
        <div class="item">
          <img src="../assets/img/AdvertisementsCount.png" />
          <div class="item_data">
            <p>总广告数</p>
            <h1>{{total.current}}</h1>
            <span style="margin-right: 20px;">上周：{{total.last}}</span>
            <span>同比：{{total.rate}}%</span>
            <i
            :class="total.rate > 0 ? 'el-icon-Asc'  : 'el-icon-Desc' "
            ></i>
          </div>
        </div>
      </div>
      <div class="count_item">
        <div class="item">
          <img src="../assets/img/NotOnline.png" />
          <div class="item_data">
            <p>待上架数量</p>
           <h1>{{topublish.current}}</h1>
            <span style="margin-right: 10px;">上周：{{topublish.last}}</span>
            <span>同比：{{topublish.rate}}%</span>
            <i :class="topublish.rate > 0 ? 'el-icon-Asc'  : 'el-icon-Desc' "></i>
          </div>
        </div>
      </div>
      <div class="count_item">
        <div class="item">
          <img src="../assets/img/On-Line.png" />
          <div class="item_data">
            <p>上架中数量</p>
            <h1>{{publishing.current}}</h1>
            <span style="margin-right: 10px;">上周：{{publishing.last}}</span>
            <span>同比：{{publishing.rate}}%</span>
            <i :class="publishing.rate > 0 ? 'el-icon-Asc'  : 'el-icon-Desc' "></i>
          </div>
        </div>
      </div>
      <div class="count_item">
        <div class="item">
          <img src="../assets/img/HaveDrop.png" />
          <div class="item_data">
            <p>已下架数量</p>
            <h1>{{published.current}}</h1>
            <span style="margin-right: 10px;">上周：{{published.last}}</span>
            <span>同比：{{published.rate}}%</span>
            <i :class="published.rate > 0 ? 'el-icon-Asc' : 'el-icon-Desc'"></i>
          </div>
        </div>
      </div>
    </div>
    <div class="shortcut_menu">
      <h1>快捷操作</h1>
      <div class="menu_btn">
        <router-link v-for="item in shortcutMenuDatas" :key="item.id" :to="{path: item.path}">
          <img :src="item.img" />
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { getCountDate } from '@/api/api'
import {showLoading, hideLoading} from '@/utils/utils'
export default {
  data () {
    return {
      total: {}, // 总数
      published: {}, // 已下架
      publishing: {}, // 上架中
      topublish: {}, // 待上架
      shortcutMenuDatas: [
        { img: require('@/assets/img/myPublish.png'), id: 0, path: '/adPublish' },
        { img: require('@/assets/img/LetMeSee.png'), id: 1, path: '/postlist' },
        { img: require('@/assets/img/MyImage.png'), id: 2, path: '/gallery' }
      ]
    }
  },
  created () {
    this.getCountDates()
  },
  mounted () {},
  methods: {
    // 获取最新数据
    async getCountDates () {
      showLoading()
      const res = await getCountDate()
      const { code, data } = res.data
      if (code === 200 || code === 201 || code === 202 || code === 204) {
        hideLoading()
        this.total = data[0].index_count_data_total
        this.published = data[1].index_count_data_published
        this.publishing = data[2].index_count_data_publishing
        this.topublish = data[3].index_count_data_topublish
        this.total.rate = this.total.rate.toFixed(2)
        this.published.rate = this.published.rate.toFixed(2)
        this.publishing.rate = this.publishing.rate.toFixed(2)
        this.topublish.rate = this.topublish.rate.toFixed(2)
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
    padding: 0 30px;
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
  span{
    font-size: 16px;
    color: rgba(143, 153, 171, 1);
    line-height: 22px;
  }
 i{
   margin-left: 5px;
 }
  .el-icon-Asc{
      // font-weight: 700;
      margin-right: 5px;
      background: url("../assets/img/Asc.png") center no-repeat;
    background-size: cover;
    }
    .el-icon-Desc{
      // font-weight: 700;
      margin-left: 5px;
      background: url("../assets/img/Desc.png") center no-repeat;
    background-size: cover;
    }
    .el-icon-Asc:before,
    .el-icon-Desc:before{
      content: "\66ff";
    font-size: 12px;
    visibility: hidden;
    }
}

.shortcut_menu {
  .menu_btn {
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
