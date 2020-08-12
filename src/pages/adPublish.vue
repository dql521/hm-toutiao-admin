<template>
  <div class="post-publish">
    <!-- 头部渠道 -->
    <el-tabs type="border-card" v-model="activeName">
      <el-tab-pane v-for="item in channelTab" :key="item.id">
        <div slot="label" @click="getChannelId(item.id)">{{item.name}}</div>
      </el-tab-pane>
    </el-tabs>

    <div class="step_content">
      <!-- 新增渠道 -->
      <el-button type="primary" @click="isDlag = true" class="new_button">
        <i class="el-icon-add"></i>
        新增渠道
      </el-button>
      <!-- 步骤条 -->
      <div class="steps">
        <el-steps :active="active" finish-status="success">
          <el-step>
            <span slot="title">在左侧菜单选择发布广告位</span>
          </el-step>
          <el-step>
            <span slot="title">填写广告信息及投放位置</span>
          </el-step>
          <el-step class="width_style">
            <span slot="title">生成广告</span>
          </el-step>
        </el-steps>
      </div>
    </div>
    <!-- 发布广告 -->
    <div class="publish_content">
      <!-- 模块广告位 -->
      <div class="module_tree">
        <div class="tree_title">
          <span>已新建的</span>
          <div class="tree_operation">
            <el-dropdown placement="bottom" :hide-on-click="false">
              <span class="el-dropdown-link">
                <i class="el-icon-Search"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <el-input placeholder="输入关键字进行搜索" v-model="filterText" size="small"></el-input>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown placement="bottom" :hide-on-click="false">
              <span class="el-dropdown-link" style="padding: 0 26px;">
                <i class="el-icon-CreateModule"></i>
              </span>
              <el-dropdown-menu slot="dropdown" :hide-on-click="false">
                <el-dropdown-item @click.native="addCildModule(0)">新建主模块</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <!-- <el-dropdown placement="bottom" style="padding-right: 26px;" :hide-on-click="false">
              <span class="el-dropdown-link">
                <i class="el-icon-refresh" style="color: #409EFF; font-weight: 900;"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>更新</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown> -->
          </div>
        </div>
        <div class="tree_content">
          <el-tree
            :data="moduleData"
            node-key="id"
            :indent="5"
            :default-expand-all="expandAll"
            :highlight-current="true"
            :expand-on-click-node="true"
            :check-on-click-node="true"
            ref="tree"
            :filter-node-method="filterNode"
            @node-click="getModuleInfo"
          >
            <span class="custom-tree-node" slot-scope="{ data }">
              <span>{{ data.text }}</span>
              <span>
                <el-dropdown placement="bottom" :hide-on-click="false" class="bianji">
                  <span class="el-dropdown-link">
                    <i class="el-icon-bianji"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="getAlterModule(data)">修改属性</el-dropdown-item>
                    <el-dropdown-item
                      @click.native="getModulesCild(data.id)"
                      v-if="data.attributes.type === 0"
                    >新建子栏位</el-dropdown-item>
                    <el-dropdown-item style="color: red;" @click.native="delModules(data.id)">删除</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <el-dropdown
                  placement="bottom"
                  class="add_cild_module"
                  v-if="data.parentId === '0'"
                >
                  <span class="el-dropdown-link">
                    <i class="el-icon-CreateModule"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="addCildModule(data.id)">增加模块</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </span>
            </span>
          </el-tree>
        </div>
      </div>
      <!-- 广告发布表单 -->
      <div class="module_form">
        <div class="no_ad" v-if="active == 0">
          <img src="../assets/img/NA.png" />
          <!-- <p v-if="">您还没有创建子栏位，无法发布广告</p> -->
          <p>您还没有创建/选择子栏位，无法发布广告</p>
        </div>
        <div class="form_data" v-if="active == 1 || active == 2">
          <div class="form_title">
            <i></i>
            广告信息（ID：{{addCntParmas.positionId}}）
          </div>
          <el-form :model="addCntParmas" label-position="left">
            <el-form-item label="广告名称：" required>
              <el-input
                v-model="addCntParmas.name"
                maxlength="20"
                show-word-limit
                placeholder="请输入广告名称"
              ></el-input>
            </el-form-item>
            <el-form-item prop="flieList" required>
              <span slot="label">
                <span>广告图片:&ensp;</span>
                <el-popover
                  placement="bottom"
                  trigger="hover"
                  content="目前支持上传jpeg/png/jpg/gif/bmp/tiff/dwg/psd格式文件"
                >
                  <span class="el-icon-Tip" slot="reference">&ensp;</span>
                </el-popover>
              </span>
              <div class="img_upload">
                <div class="upload_add" @click="chackImg">
                  <i class="el-icon-plus"></i>
                  <div class="upload_size">支持尺寸:{{ modules.positionSize }}</div>
                </div>

                <div
                  class="img_echo"
                  v-for="(item,index) in echoList"
                  :key="item.id"
                  @click="setAdInfo(item.id,index)"
                >
                  <el-image :src="item.url" fit="fill"></el-image>
                  <div class="set_pictrue">
                    <el-dropdown>
                      <span class="el-dropdown-link">
                        <i class="el-icon-Set"></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="showDialog(item.url)">查看</el-dropdown-item>
                        <el-dropdown-item @click.native="alterImg(index)">替换</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>
                  <span class="set_status" v-show="isStatus">编辑中</span>
                </div>
              </div>
            </el-form-item>

            <!-- <el-form-item class="puton_title">投放设置</el-form-item> -->
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
              <el-radio-group v-model="addCntParmas.linkType">
                <el-radio :label="3">不选择</el-radio>
                <el-radio :label="1">APP内跳转</el-radio>
                <el-radio :label="2" style="margin-left: 0;">外部页面</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="链接地址：" required>
              <el-input v-model="addCntParmas.linkUrl" placeholder="请输入链接"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="create_ad" @click="createAd">生成广告</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="finish_page" v-if="active == 3">
          <img src="../assets/img/chenggong.png" class="details_img" />
          <p>广告已生成</p>
          <div class="details">
            <span>点击&ensp;</span>
            <el-link type="primary" @click="showDetail">查看详情</el-link>
          </div>
        </div>
      </div>
    </div>

    <!-- 新增渠道弹框 -->
    <el-dialog title="新增渠道" :visible.sync="isDlag" width="532px">
      <el-form
        :model="oneModules"
        class="new_channelFrom"
        label-width="120px"
        :rules="rules"
        label-position="left"
      >
        <el-form-item label="渠道名称：" required>
          <el-input v-model="oneModules.name" placeholder="请输入渠道名称"></el-input>
        </el-form-item>
        <el-form-item label="图片接入网络：" required>
          <el-radio-group v-model="oneModules.netType">
            <el-radio :label="0">内网</el-radio>
            <el-radio :label="1">外网</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog(0)">取 消</el-button>
        <el-button type="primary" @click="addChannel">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 新增主模块 -->
    <el-dialog title="新建主模块" :visible.sync="isModuleDlag" width="532px">
      <el-form
        :model="modules"
        class="module_"
        label-width="100px"
        label-position="left"
        :rules="rules"
      >
        <el-form-item label="主模块名称：" prop="name" required>
          <el-input v-model="modules.name" placeholder="请输入主模块名称"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog(1)">取 消</el-button>
        <el-button type="primary" @click="moduleAdd">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 新建子模块 -->
    <el-dialog title="新增模块" :visible.sync="isCildModuleDlag" width="532px">
      <el-form
        :model="modules"
        class="module_"
        label-width="100px"
        :rules="rules"
        label-position="left"
      >
        <el-form-item label="模块名称：" prop="name" required>
          <el-input v-model="modules.name" placeholder="请输入模块名称"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog(2)">取 消</el-button>
        <el-button type="primary" @click="moduleAdd">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改属性 -->
    <el-dialog
      title="修改属性"
      :visible.sync="isAlterDlag"
      :width="modules.type == 0 ? '350px' : '532px'"
    >
      <el-form :model="modules" v-if="modules.type == 0" :rules="rules">
        <el-form-item prop="name">
          <el-input v-model="modules.name" placeholder="请输入属性名称"></el-input>
        </el-form-item>
      </el-form>

      <el-form
        :model="modules"
        class="module_child"
        label-width="100px"
        label-position="left"
        v-if="modules.type == 1"
        :rules="rules"
      >
        <el-form-item label="子栏位名称:" prop="name" required>
          <el-input v-model="modules.name" placeholder="请输入子栏位名称"></el-input>
        </el-form-item>
        <el-form-item label="广告图类型:" required>
          <el-radio-group v-model="modules.adsType">
            <el-radio :label="0">单张图</el-radio>
            <el-radio :label="-1">轮播图</el-radio>
          </el-radio-group>

          <el-select v-model="modules.adsNum" placeholder="请选择">
            <el-option v-for="i in modules.adsType == -1 ? 8 : 1" :key="i" :label="i" :value="i"></el-option>
          </el-select>张
        </el-form-item>

        <el-form-item label="广告尺寸:" class="ad_size" required>
          <el-input v-model="imgWSize"></el-input>
          <span style="color:#E0E0E0;">×</span>
          <el-input v-model="imgHSize"></el-input>
        </el-form-item>
        <el-form-item label="默认图片:" required>
          <el-upload
            class="upload-demo"
            :data="fileParmas"
            :action="`${$baseUrl}/resource/upload`"
            :headers="headers"
            :limit="1"
            list-type="picture"
            :file-list="fileList"
            :show-file-list="showFile"
            :on-success="handleFileSuc"
            :on-error="handleFileErr"
            :before-upload="beforeUpload"
            :on-exceed="exceedMsg"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog(5)">取 消</el-button>
        <el-button type="primary" @click="alterModule">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加子栏位 -->
    <el-dialog title="新建子栏位" :visible.sync="isAddModuleCild" width="552px">
      <el-form
        :model="modules"
        class="module_child"
        label-width="100px"
        label-position="left"
        :rules="rules"
      >
        <el-form-item label="子栏位名称:" prop="name" required>
          <el-input v-model="modules.name" placeholder="请输入子栏位名称"></el-input>
        </el-form-item>
        <el-form-item label="广告图类型:" required>
          <el-radio-group v-model="modules.adsType">
            <el-radio :label="0">单张图</el-radio>
            <el-radio :label="-1">轮播图</el-radio>
          </el-radio-group>

          <el-select v-model="modules.adsNum" placeholder="请选择">
            <el-option v-for="i in modules.adsType == -1 ? 8 : 1" :key="i" :label="i" :value="i"></el-option>
          </el-select>张
        </el-form-item>

        <el-form-item label="广告尺寸:" class="ad_size" required>
          <el-input v-model="imgWSize"></el-input>
          <span style="color:#E0E0E0;">×</span>
          <el-input v-model="imgHSize"></el-input>
        </el-form-item>
        <el-form-item label="默认图片:" required>
          <el-upload
            class="upload-demo"
            :data="fileParmas"
            :action="`${$baseUrl}/resource/upload`"
            :headers="headers"
            :limit="1"
            list-type="picture"
            :file-list="fileList"
            :show-file-list="showFile"
            :on-success="handleFileSuc"
            :on-error="handleFileErr"
            :before-upload="beforeUpload"
            :on-exceed="exceedMsg"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog(3)">取 消</el-button>
        <el-button type="primary" @click="addModuleCild">确 定</el-button>
      </div>
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
              <el-checkbox-group v-model="checkList" :max="modules.adsNum">
                <el-checkbox :label="item">
                  <el-image :src="item.url" fit="fill" lazy>></el-image>
                </el-checkbox>
              </el-checkbox-group>
            </li>
          </ul>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog(4)">取 消</el-button>
        <el-button type="primary" @click="addCheckImg">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 查看图片弹框 -->
    <el-dialog title="查看图片" :visible.sync="showBigImg" class="big_img">
      <el-image :src="bigSrc" fit="fit"></el-image>
    </el-dialog>
    <!-- 查看详情弹框 -->
    <el-dialog title="广告详情" :visible.sync="showDetails" class="ad_Details" width="504px">
      <el-carousel
        arrow="always"
        trigger="click"
        :autoplay="true"
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
          <img src="../assets/img/NotOnlineIcon.png" v-if="detailsListInfo.state == 0" />
          <img src="../assets/img/on-lineIcon.png" v-if="detailsListInfo.state == 1" />
          <img src="../assets/img/Dropicon.png" v-if="detailsListInfo.state == 2" />
        </p>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { VueEditor } from 'vue2-editor'
import {
  addChannels,
  getChannels,
  addModule,
  getModule,
  alterModule,
  addModuleCild,
  addCnt,
  getPictrueList,
  getChannelsImg,
  delModule,
  getCntInfo,
  editModuleCild,
  getModuleCild
} from '@/api/api'
import { showLoading, hideLoading } from '@/utils/utils.js'
export default {
  components: {
    VueEditor
  },
  data () {
    return {
      dates: [], // 投放时间
      active: 0, // 步骤条
      offset: 1,
      pages: 0,
      isnub: 0,
      alterIndex: 0,
      oldIndex: 0,
      attrType: 0, // 修改属性类型
      activeName: '0', // tab绑定值
      channelTab: [], // 渠道
      channelTabNum: [], // 素材库渠道
      isDlag: false, // 新增渠道弹框
      isModuleDlag: false, // 新增主模块弹框
      isCildModuleDlag: false, // 新增子模块
      isAlterDlag: false, // 修改属性弹框
      isAddModuleCild: false, // 新增子栏位
      isPictrueDialog: false, // 图片选择弹框
      showBigImg: false, // 查看大图弹框
      showDetails: false, // 查看详情
      isStatus: false, // 编辑信息标识
      showFile: true, // 上传列表回显
      imgWSize: 800, // 图片尺寸宽
      imgHSize: 600, // 图片尺寸高
      filterText: '', // 树状结构过滤
      expandAll: false, // 是否展开
      rules: {
        name: [
          {
            required: true,
            message: '名称不能为空',
            trigger: ['blur', 'change']
          },
          {
            // min: 2,
            max: 8,
            message: '请将内容控制在 8 个字符以内！',
            trigger: ['blur', 'change']
          }
        ]
      }, // 表单校验
      oneModules: {
        name: '',
        netType: 0
      }, // 主模块
      modules: {
        id: null,
        parentId: 0,
        channelId: '',
        name: '',
        type: 0,
        positionSize: '',
        adsType: 0,
        adsNum: '',
        resourceId: null
      }, // 模块新增修改
      moduleData: [], // 树形菜单
      headers: {
        token: localStorage.getItem('token')
      }, // 请求token
      fileList: [], // 资源列表
      pictrueList: [], // 图片库资源
      addCntFrom: [],
      addCntParmas: {
        name: '', // 广告名称
        positionId: '', // 广告位编号
        resId: '', // 资源编号
        linkType: 3, // 跳转类型
        linkUrl: '', // 跳转地址
        startTime: '', // 开始时间
        endTime: '' // 结束时间
      },
      fileParmas: {
        channelId: '',
        type: 0
      }, // 本地上传参数
      echoList: [],
      checkList: [],
      bigSrc: '',
      detailsList: [], // 详情列表
      detailsListInfo: {
        name: '',
        startTime: '',
        endTime: '',
        linkUrl: '',
        state: ''
      },
      detailParmas: {
        positionId: '',
        id: ''
      },
      imgSize: ''
    }
  },
  created () {
    this.getChannel()
  },
  computed: {
    disabled () {
      return this.offset > this.pages
    }
  },
  methods: {
    // 暂未开通功能统一提示
    notOpen () {
      this.$message.error('该功能暂未开通，请选择其他操作！')
    },
    // 树状结构节点过滤
    filterNode (value, data) {
      if (!value) return true
      return data.text.indexOf(value) !== -1
    },
    // 图片上传相关
    exceedMsg () {
      this.$message.error('已超出最大上传张数')
    },
    // setPositionSize(file) {
    //   this.modules.positionSize = `${this.imgWSize}_${this.imgHSize}`;
    //   var testmsg = /^image\/(jpeg|png|jpg|gif|bmp|tiff|dwg)$/.test(file.type);
    //   const isLt2M = file.size / 1024 / 1024 < 2;
    //   if (!testmsg) {
    //     this.$message.error("请上传jpeg/png/jpg/gif/bmp/tiff/dwg格式文件!");
    //   }
    //   if (!isLt2M) {
    //     this.$message.error("上传图片大小不能超过 2MB!");
    //   }
    //   return testmsg && isLt2M;
    // },
    handleFileSuc (res, file, fileList) {
      const { code, data, message } = res
      if (code === 200) {
        this.modules.resourceId = data.resourceId
        this.showFile = true
      } else {
        this.$message.error(message)
        this.showFile = false
        this.fileList = []
      }
    },
    handleFileErr (err, file, fileList) {
      this.$message.error('文件上传失败')
    },

    // 获取渠道
    async getChannel () {
      showLoading()
      const res = await getChannels()
      const { code, data, message } = res.data
      if (code === 200 || code === 201 || code === 202 || code === 204) {
        this.channelTab = data.channelList
        this.modules.channelId = this.channelTab[0].id
        this.fileParmas.channelId = this.channelTab[0].id
        this.getModule()
        // console.log(this.channelTab);
        hideLoading()
      } else {
        hideLoading()
        this.$message.error(message)
      }
    },
    // 增加渠道
    async addChannel () {
      if (this.oneModules.name == '') {
        this.$message.error('渠道名称不能为空')
        return
      }
      const res = await addChannels(this.oneModules)
      const { code, message } = res.data
      if (code === 200 || code === 201 || code === 202 || code === 204) {
        this.isDlag = false
        this.$message.success(message)
        this.oneModules.name = ''
        this.getChannel()
      } else {
        this.$message.error(message)
        this.oneModules.name = ''
      }
    },

    // 获取模块数据
    async getModule () {
      const res = await getModule({ channelId: this.modules.channelId })
      const { code, data } = res.data
      if (code === 200 || code === 201 || code === 202 || code === 204) {
        const { positionTree } = data
        this.moduleData = positionTree
      }
    },
    // 添加模块
    addCildModule (id) {
      this.isModuleDlag = true
      if (id === 0) {
        this.modules.parentId = 0
        this.modules.type = 0
      } else {
        this.isCildModuleDlag = true
        this.modules.parentId = id
        this.modules.type = 0
      }
    },
    async moduleAdd () {
      if (this.modules.name === '') {
        // this.$message.error("模块名称不能为空");
        return
      }
      if (this.modules.name.length > 8) {
        return
      }

      const res = await addModule(this.modules)
      const { code, message } = res.data
      if (code === 200 || code === 201 || code === 202 || code === 204) {
        (this.isModuleDlag = false) || (this.isCildModuleDlag = false)
        this.$message.success(message)
        this.modules.name = ''
        this.getModule()
      } else {
        this.$message.error(message)
        this.modules.name = ''
      }
    },
    // 删除模块/子栏位
    async delModules (id) {
      const res = await delModule(id)
      const { code, message } = res.data
      if (code === 200 || code === 204) {
        this.$message.success(message)
        this.getModule()
      } else {
        this.$message.error(message)
      }
    },

    getChannelId (id) {
      this.modules.channelId = id
      this.active = 0
      this.getModule()
    },
    // 获取修改模块参数
    getAlterModule (data) {
      this.modules.type = data.attributes.type
      this.modules.id = data.id
      if (data.attributes.type == 0) {
        this.modules.name = data.text
        this.modules.parentId = data.parentId
      } else {
        this.getModuleCildInfo()
      }
      this.isAlterDlag = true
    },
    // 查询子栏位信息
    async getModuleCildInfo () {
      const res = await getModuleCild({ id: this.modules.id })
      const { code, data, message } = res.data
      if (code == 200) {
        this.modules.name = data.adsPosition.name
        this.modules.parentId = data.adsPosition.parentId
        // this.modules.id = data.adsPosition.id
        //  this.modules.type = data.positionSize.type
        this.imgWSize = data.adsPosition.positionSize.split('_')[0]
        this.imgHSize = data.adsPosition.positionSize.split('_')[1]
        this.modules.adsNum = data.adsPosition.adsNum
        this.modules.adsType = data.adsPosition.adsType
        this.modules.resourceId = data.adsContent.resId
      }
    },
    // 修改模块名称
    async alterModule () {
      if (this.modules.type == 0) {
        if (this.modules.name == '') {
          // this.$message.error("属性名称不能为空");
          return
        }
        if (this.modules.name.length > 8) {
          return
        }
        const res = await alterModule(this.modules)
        const { code, message } = res.data
        if (code === 200 || code === 201 || code === 202 || code === 204) {
          this.isAlterDlag = false
          this.$message.success(message)
          this.getModule()
        } else {
          this.$message.error(message)
        }
      } else {
        if (this.modules.name === '') {
          // this.$message.error("子栏位名称不能为空");
          return
        }
        if (this.modules.adsType == 0 && this.modules.adsNum > 1) {
          this.$message.error('请选择正确的广告图片数')
          return
        }
        if (this.modules.adsNum == null || this.modules.adsNum == '') {
          this.$message.error('请选择广告图片数')
          return
        }
        if (!this.imgWSize && !this.imgHSize) {
          this.$message.error('图片尺寸不能为空')
          return
        }
        // this.setPositionSize();
        this.modules.positionSize = `${this.imgWSize}_${this.imgHSize}`
        const res = await editModuleCild(this.modules)
        const { code, data, message } = res.data
        if (code == 201) {
          this.getModule()
          this.$message.success(message)
          this.isAlterDlag = false
        } else {
          this.$message.error(message)
        }
      }
    },

    // 获取子栏位参数
    getModulesCild (id) {
      this.isAddModuleCild = true
      this.modules.parentId = id
    },
    // 增加子栏位
    async addModuleCild () {
      if (this.modules.name == '') {
        // this.$message.error("子栏位名称不能为空");
        return
      }
      if (this.modules.name.length > 8) {
        return
      }
      if (this.modules.adsType == 0 && this.modules.adsNum > 1) {
        this.$message.error('请选择正确的广告图片数')
        return
      }
      if (this.modules.adsNum == null || this.modules.adsNum == '') {
        this.$message.error('请选择广告图片数')
        return
      }
      if (!this.imgWSize && !this.imgHSize) {
        this.$message.error('图片尺寸不能为空')
        return
      }
      if (!this.fileList) {
        this.$message.error('必须上传1张默认图')
        return
      }
      this.modules.type = 1
      this.modules.positionSize = `${this.imgWSize}_${this.imgHSize}`
      const res = await addModuleCild(this.modules)
      const { code, message } = res.data
      if (code === 200 || code === 201 || code === 202 || code === 204) {
        this.$message.success(message)
        this.isAddModuleCild = false
        this.fileList = []
        this.modules.name = ''
        this.getModule()
      } else {
        this.$message.error(message)
        this.fileList = []
        // this.modules.name = "";
      }
    },

    // 发布广告相关
    // 获取广告位信息
    getModuleInfo (data, node, that) {
      if (data.attributes.type == 1) {
        this.active = 1
        this.addCntParmas.positionId = data.id
        this.modules.adsType = data.attributes.adsType
        this.modules.adsNum = data.attributes.adsNum
        this.modules.positionSize = data.attributes.size.replace('_', '*')
        this.echoList = []
        this.checkList = [];
        (this.addCntParmas.name = ''),
        (this.addCntParmas.resId = ''),
        (this.addCntParmas.linkType = 3),
        (this.addCntParmas.linkUrl = ''),
        (this.dates = [])
      } else {
        this.active = 0
      }
    },
    // 选择图片
    chackImg () {
      if (this.echoList.length >= this.modules.adsNum) {
        this.$message.error(`图片总数量不得大于${this.modules.adsNum}张`)
        return
      }
      this.isPictrueDialog = true
      this.isnub = 0
      this.getPics()
    },
    // 获取替换index和判断码
    alterImg (index) {
      this.isPictrueDialog = true
      this.alterIndex = index
      this.isnub = 1
    },
    // 替换/添加图片
    addCheckImg () {
      if (this.isnub == 1) {
        if (this.checkList.length > 1) {
          this.$message.error('请选择一张替换图片！')
          return
        }
        this.echoList[this.alterIndex].url = this.checkList[0].url
        this.addCntFrom[this.alterIndex].resId = this.checkList[0].id
        this.checkList = []
        this.isPictrueDialog = false
      } else {
        if (
          this.checkList.length + this.echoList.length >
          this.modules.adsNum
        ) {
          this.$message.error(`图片总数量不得大于${this.modules.adsNum}张`)
          return
        }
        this.echoList = [...this.echoList, ...this.checkList]
        this.checkList = []
        this.active = 2
        for (let i = 0; i < this.echoList.length; i++) {
          this.addCntFrom.splice(i, 1, {
            name: '',
            positionId: '',
            resId: '',
            linkType: 3,
            linkUrl: '',
            startTime: '',
            endTime: ''
          })
        }
        this.isPictrueDialog = false
      }
    },
    // 获取图片库资源
    async getPics () {
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
    // 收集广告信息
    setAdInfo (id, index) {
      // this.echoList.forEach(item => {
      //   if (item.id == id) {
      //     this.isStatus = true
      //   }
      // })
      if (this.oldIndex != index) {
        this.addCntFrom.splice(this.oldIndex, 1, {
          name: this.addCntParmas.name, // 广告名称
          positionId: this.addCntParmas.positionId, // 广告位编号
          resId: this.echoList[this.oldIndex].id, // 资源编号
          linkType: this.addCntParmas.linkType, // 跳转类型
          linkUrl: this.addCntParmas.linkUrl, // 跳转地址
          startTime: this.dates[0], // 开始时间
          endTime: this.dates[1] // 结束时间
        })
        this.oldIndex = index
      } else {
        this.addCntFrom.splice(index, 1, {
          name: this.addCntParmas.name, // 广告名称
          positionId: this.addCntParmas.positionId, // 广告位编号
          resId: this.echoList[this.index].id, // 资源编号
          linkType: this.addCntParmas.linkType, // 跳转类型
          linkUrl: this.addCntParmas.linkUrl, // 跳转地址
          startTime: this.dates[0], // 开始时间
          endTime: this.dates[1] // 结束时间
        })
      }
      this.dates = [
        this.addCntFrom[index].startTime,
        this.addCntFrom[index].endTime
      ]
      this.addCntParmas.name = this.addCntFrom[index].name
      this.addCntParmas.linkType = this.addCntFrom[index].linkType
      this.addCntParmas.linkUrl = this.addCntFrom[index].linkUrl
    },
    // 生成广告
    async createAd () {
      if (this.echoList.length == 1) {
        this.addCntFrom[0].name = this.addCntParmas.name
        this.addCntFrom[0].linkType = this.addCntParmas.linkType
        this.addCntFrom[0].linkUrl = this.addCntParmas.linkUrl
        this.addCntFrom[0].startTime = this.dates[0]
        this.addCntFrom[0].endTime = this.dates[1]
        this.addCntFrom[0].resId = this.echoList[0].id
        this.addCntFrom[0].positionId = this.addCntParmas.positionId
      }
      this.$confirm('确定生成此条广告吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          showLoading()
          const res = await addCnt(this.addCntFrom)
          const { code, message, data } = res.data
          if (code == 200) {
            hideLoading()
            this.active = 3
            this.detailParmas.positionId = this.addCntParmas.positionId
            this.detailParmas.id = data.adsId
            // this.detailsList = this.addCntFrom;
            this.echoList = [];
            (this.addCntParmas.name = ''),
            (this.addCntParmas.positionId = ''),
            (this.addCntParmas.resId = ''),
            (this.addCntParmas.linkType = 3),
            (this.addCntParmas.linkUrl = ''),
            (this.dates = [])
          } else {
            hideLoading()
            this.$message.error(message)
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })

      // try {
      //   await this.echoList.forEach(item => {
      //   if (item.name == '') {
      //     this.$message.error('广告名称不能为空！')
      //     return
      //   }
      //   if (item.linkType != 3) {
      //     if (item.linkUrl == '') {
      //       this.$message.error('跳转链接不能为空！')
      //       return
      //     }
      //   }
      //   if (item.startTime == '' || item.endTime == '') {
      //     this.$message.error('请选择起止时间！')
      //     return
      //   }
      // })

      //   await this.$confirm("确定生成此条广告吗？", "提示", {
      //     type: "warning"
      //   });
      // showLoading()
      //   const res = await addCnt(this.addCntFrom)
      //   console.log(res)
      //   const { code, message, data } = res.data
      //   if (code == 200) {
      //   hideLoading()
      //     this.active = 3
      //     this.detailParmas.positionId = this.addCntParmas.positionId
      //     this.detailParmas.id = data.adsId
      //     // this.detailsList = this.addCntFrom;
      //     this.echoList = [];
      //     this.addCntParmas.name = "",
      //       this.addCntParmas.positionId = "",
      //       this.addCntParmas.resId = "",
      //       this.addCntParmas.linkType = 3,
      //       this.addCntParmas.linkUrl = "",
      //       this.dates = [];
      //   } else {
      //   hideLoading()
      //     this.$message.error(message);
      //   }
      // } catch {
      //   hideLoading()
      //   this.$message({
      //     type: "info",
      //     message: message == "" ? "已取消操作" : message
      //   });
      // }

      // const res = await addCnt(this.addCntFrom)
      // const { code, message } = res.data
      // if (code == 200) {
      //   this.active = 3
      //   this.echoList = []
      // } else {
      //   this.$message.error(message)
      // }
    },

    // 查看图片
    showDialog (src) {
      this.showBigImg = true
      this.bigSrc = src
    },

    // 广告详情
    async showDetail () {
      this.showDetails = true
      const res = await getCntInfo(this.detailParmas)
      const { code, data, message } = res.data
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
    changeDetail (index, oldIndex) {
      this.detailsListInfo.name = this.detailsList[index].name
      this.detailsListInfo.startTime = this.detailsList[index].startTime
      this.detailsListInfo.endTime = this.detailsList[index].endTime
      this.detailsListInfo.linkUrl = this.detailsList[index].linkUrl
      this.detailsListInfo.state = this.detailsList[index].state
    },

    // 弹框取消统一控制
    closeDialog (num) {
      if (num == 0) {
        this.isDlag = false
        this.oneModules.name = ''
        this.oneModules.netType = 0
      }
      if (num == 1) {
        this.isModuleDlag = false
        this.modules.name = ''
      }
      if (num == 2) {
        this.isCildModuleDlag = false
        this.modules.name = ''
      }
      if (num == 3) {
        this.isAddModuleCild = false
        this.modules.name = ''
        this.modules.adsType = 0
        this.modules.adsNum = 1
        this.imgWSize = 800
        this.imgHSize = 600
        this.fileList = []
      }
      if (num == 4) {
        this.isPictrueDialog = false
        this.checkList = []
      }
      if (num == 5) {
        if (this.modules.type == 0) {
          this.isAlterDlag = false
          this.modules.name = ''
        } else {
          this.isAlterDlag = false
          this.modules.name = ''
          this.modules.adsType = 0
          this.modules.adsNum = 1
          this.imgWSize = 800
          this.imgHSize = 600
          this.fileList = []
        }
      }
    },
    // 添加树节点
    append (data) {
      const newChild = { id: id++, label: 'testtest', children: [] }
      if (!data.children) {
        this.$set(data, 'children', [])
      }
      data.children.push(newChild)
    },
    // 删除树节点
    remove (node, data) {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex((d) => d.id === data.id)
      children.splice(index, 1)
    },
    // 图片尺寸展示
    getImgSize (index) {
      const img = new Image()
      img.src = this.pictrueList[index].url
      // console.log(img);
      img.onload = () => {
        this.imgSize = `图片尺寸：${img.width}*${img.height}`
        // console.log(img.width+'*'+img.height);
      }
    }
  },
  watch: {
    filterText: function (val) {
      this.$refs.tree.filter(val)
      this.expandAll = true
    }
  }
}
</script>

<style lang="scss" scoped>
.post-publish {
  font-size: 16px;
  padding: 24px;
  background: #fff;
  .el-tabs {
    line-height: 22px;
    box-shadow: none;
    border: none;
    border-left: 1px solid #e0e0e0;
    border-right: 1px solid #e0e0e0;
    border-top: 1px solid #e0e0e0;
    .el-tabs__content {
      border-left: 1px solid #e0e0e0;
      border-right: 1px solid #e0e0e0;
    }
  }

  .step_content {
    border-left: 1px solid #e0e0e0;
    border-right: 1px solid #e0e0e0;
    border-bottom: 1px solid #e0e0e0;
    .new_button {
      margin-left: 30px;
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
    .steps {
      padding: 30px 24px;
      .width_style {
        width: 140px;
      }
      .el-step__title {
        position: relative;
        span {
          position: absolute;
          top: -10px;
          left: 20px;
          padding: 0 20px;
          background: #fff;
        }
      }
    }
  }
  .publish_content {
    width: 100%;
    font-size: 16px;
    display: flex;
    border-left: 1px solid #e0e0e0;
    border-right: 1px solid #e0e0e0;
    border-bottom: 1px solid #e0e0e0;
    // padding-top: 20px;
    .module_tree {
      width: 319px;
      height: 703px;
      color: #222222;
      border-right: 1px solid #e0e0e0;
      padding-left: 20px;
      font-size: 16px;
      .tree_title {
        height: 56px;
        line-height: 56px;
        display: flex;
        justify-content: space-between;
        // .el-dropdown-link:last-of-type{
        //   padding: 0 26px;
        // }
      }
      .tree_content {
        margin-top: 10px;
        .bianji {
          opacity: 0;
          margin-left: 100px;
        }
        .add_cild_module {
          opacity: 0;
          margin-left: 20px;
        }
        .el-tree-node__content:hover {
          .bianji,
          .add_cild_module {
            width: 20px;
            opacity: 1;
            transition: 0.1s all;
          }
        }
        .el-icon-bianji {
          // font-weight: 700;
          background: url("../assets/img/bianji.png") center no-repeat;
          background-size: cover;
        }
        .el-icon-bianji:before {
          content: "\66ff";
          font-size: 16px;
          visibility: hidden;
        }
      }
      .el-icon-Search {
        background: url("../assets/img/Search.png") center no-repeat;
        background-size: cover;
      }
      .el-icon-CreateModule {
        background: url("../assets/img/CreateModule.png") center no-repeat;
        background-size: cover;
      }
      .el-icon-Search:before,
      .el-icon-CreateModule:before {
        content: "\66ff";
        font-size: 12px;
        visibility: hidden;
      }
    }
    .module_form {
      flex: 1;
      position: relative;
      .no_ad {
        position: absolute;
        width: 400px;
        height: 200px;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        text-align: center;
        img {
          width: 320px;
          height: 155px;
        }
        p {
          color: #222222;
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
          display: flex;
          justify-content: flex-start;
          flex-wrap: wrap;
          width: 1000px;
          .upload_add {
            width: 320px;
            height: 160px;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-wrap: wrap;
            background: rgba(239, 242, 249, 0.5);
            margin-right: 10px;
            margin-top: 10px;
            .el-icon-plus {
              width: 100%;
              margin-top: 50px;
              text-align: center;
              font-size: 32px;
            }
            .upload_size {
              font-size: 10px;
            }
          }
          .img_echo {
            position: relative;
            width: 320px;
            height: 160px;
            margin-right: 10px;
            margin-top: 10px;
            &:hover {
              box-shadow: 2px 2px 10px 5px #eff2f9a9;
              border: 1px solid #409eff;
              .set_pictrue {
                opacity: 1;
                transition: 0.3s all;
              }
            }
            .set_status {
              font-size: 12px;
              color: #fff;
              position: absolute;
              top: 5px;
              left: 10px;
            }
            .el-image {
              width: 320px;
              height: 160px;
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
          // {
          //   box-shadow: 5px 5px 10px 5px rgb(71, 70, 70);
          // }
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
      .finish_page {
        width: 320px;
        height: 320px;
        margin: auto;
        margin-top: 200px;
        text-align: center;
        .details_img {
          width: 88px;
          height: 88px;
        }
        p {
          font-size: 22px;
          line-height: 80px;
          font-weight: 700;
        }
        .details {
          font-size: 16px;
          line-height: 22px;
          vertical-align: middle;
        }
      }
    }
  }
  .module_child {
    .el-select {
      width: 120px;
      margin: 0 10px;
    }
    .ad_size {
      .el-input {
        width: 160px;
        text-align: center;
      }
    }
  }

  .big_img {
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
::v-deep .el-tree-node.is-current > .el-tree-node__content {
  color: #3374f3;
}
::v-deep .el-tree {
  .el-tree-node {
    .el-tree-node__content {
      font-size: 16px;
      line-height: 32px;
      padding: 5px 0;
    }
  }
}
::v-deep .el-dialog__header {
  border: 1px solid #e0e0e0;
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
::v-deep .ad_Details {
  .el-image {
    width: 100%;
    height: 100%;
    img {
      width: 100%;
      height: 100%;
    }
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
