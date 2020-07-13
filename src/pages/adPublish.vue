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
            <span slot="title">填写广告信息及投放位置</span>
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
                  <el-input placeholder="输入关键字进行搜素" v-model="filterText" size="small"></el-input>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown placement="bottom">
              <span class="el-dropdown-link" style="padding: 0 26px;">
                <i class="el-icon-CreateModule"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="addCildModule(0)">新建主模块</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
        <div class="tree_content">
          <el-tree
            :data="moduleData"
            node-key="id"
            :indent="5"
            :highlight-current="true"
            :expand-on-click-node="false"
            :check-on-click-node="true"
            ref="tree"
            :filter-node-method="filterNode"
          >
            <span class="custom-tree-node" slot-scope="{ data }">
              <span>{{ data.text }}</span>
              <span v-if="data.attributes.type === 0">
                <el-dropdown placement="bottom" :hide-on-click="false" class="bianji">
                  <span class="el-dropdown-link">
                    <i class="el-icon-bianji"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                      @click.native="getAlterModule(data.text,data.parentId,data.id)"
                    >修改属性</el-dropdown-item>
               <el-dropdown-item @click.native="getModulesCild(data.id)">新增子栏位</el-dropdown-item>
               <el-dropdown-item style="color: red;" @click.native="notOpen">删除</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <el-dropdown placement="bottom" class="add_cild_module">
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
        <img src="../assets/img/NA.png" v-if="false" />
        <div class="form_data">
          <div class="form_title">
            <i></i>广告信息（ID：10324912）
          </div>
          <el-form :model="modules">
            <el-form-item label="广告名称：" required>
              <el-input v-model="modules.name" maxlength="20" show-word-limit placeholder="请输入广告名称"></el-input>
            </el-form-item>
            <el-form-item prop="flieList" required>
              <span slot="label">
                <span>广告图片:</span>

                <i class="el-icon-Tip"></i>
              </span>
              <div class="img_upload">
                <el-upload
                  class="avatar-uploader"
                  :data="modules"
                  :action="`${$baseUrl}/resource/upload`"
                  :auto-upload="false"
                  :headers="headers"
                  :limit="8"
                  multiple
                  list-type="picture-card"
                  :file-list="fileList"
                  :show-file-list="true"
                  :on-success="handleFileSuc"
                  :on-error="handleFileErr"
                  :before-upload="setPositionSize"
                  :on-exceed="exceedMsg"
                >
                  <i slot="default" class="el-icon-plus"></i>
                  <div slot="tip" class="el-upload__tip">支持尺寸800*600px</div>
                </el-upload>
              </div>
            </el-form-item>
            <el-form-item class="puton_title">投放设置</el-form-item>

            <el-form-item label="投放时间：" required>
              <el-date-picker
                v-model="dates"
                type="datetimerange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy-MM-dd HH-mm"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="超链接：" required>
              <el-radio-group v-model="modules">
                <el-radio label="0">不选择</el-radio>
                <el-radio label="1">APP内跳转</el-radio>
                <el-radio label="2" style="margin-left: 0;">外部页面</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="链接地址：" required>
              <el-input v-model="modules.name" placeholder="请输入链接"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="create_ad">生成广告</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>

    <!-- 新增渠道弹框 -->
    <el-dialog title="新增渠道" :visible.sync="isDlag" width="532px">
      <el-form
        :model="form"
        class="new_channelFrom"
        label-width="120px"
        :rules="rules"
        label-position="left"
      >
        <el-form-item label="渠道名称：" prop="name">
          <el-input v-model="form.name" placeholder="请输入渠道名称"></el-input>
        </el-form-item>
        <el-form-item label="图片接入网络：" required>
          <el-radio-group v-model="form.netType">
            <el-radio :label="0">内网</el-radio>
            <el-radio :label="1">外网</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isDlag = false">取 消</el-button>
        <el-button type="primary" @click="addChannel">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 新增主模块 -->
    <el-dialog title="新建主模块" :visible.sync="isModuleDlag" width="532px">
      <el-form
        :model="modules"
        class="module_"
        label-width="100px"
        :rules="rules"
        label-position="left"
      >
        <el-form-item label="主模块名称：" prop="name">
          <el-input v-model="modules.name" placeholder="请输入主模块名称"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isModuleDlag = false">取 消</el-button>
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
        <el-form-item label="模块名称：" prop="name">
          <el-input v-model="modules.name" placeholder="请输入模块名称"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isCildModuleDlag = false">取 消</el-button>
        <el-button type="primary" @click="moduleAdd">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改属性 -->
    <el-dialog title="修改属性" :visible.sync="isAlterDlag" width="350px">
      <el-form :model="modules">
        <el-form-item>
          <el-input v-model="modules.name" placeholder="请输入属性名称"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isAlterDlag = false">取 消</el-button>
        <el-button type="primary" @click="alterModule">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加子烂尾 -->
    <el-dialog title="新增子栏位" :visible.sync="isAddModuleCild" width="552px">
      <el-form :model="modules" class="module_child" label-width="100px" label-position="left">
        <el-form-item label="子栏位名称:" prop="name">
          <el-input v-model="modules.name" placeholder="请输入子栏位名称"></el-input>
        </el-form-item>
        <el-form-item label="广告图类型:" prop="adsType">
          <el-radio-group v-model="modules.adsType">
            <el-radio :label="0">单张图</el-radio>
            <el-radio :label="-1">轮播图</el-radio>
          </el-radio-group>
          <el-select v-model="modules.adsNum" placeholder="8">
            <el-option label="8" value="8"></el-option>
            <el-option label="7" value="7"></el-option>
            <el-option label="6" value="6"></el-option>
            <el-option label="5" value="5"></el-option>
            <el-option label="4" value="4"></el-option>
            <el-option label="3" value="3"></el-option>
            <el-option label="2" value="2"></el-option>
            <el-option label="1" value="1"></el-option>
          </el-select>张
        </el-form-item>

        <el-form-item label="广告尺寸:" class="ad_size">
          <el-input v-model="imgWSize"></el-input>
          <span style="color:#E0E0E0;">×</span>
          <el-input v-model="imgHSize"></el-input>
        </el-form-item>
        <el-form-item label="默认图片:">
          <el-upload
            class="upload-demo"
            :data="modules"
            :action="`${$baseUrl}/resource/upload`"
            :headers="headers"
            :limit="1"
            list-type="picture"
            :file-list="fileList"
            :show-file-list="showFile"
            :on-success="handleFileSuc"
            :on-error="handleFileErr"
            :before-upload="setPositionSize"
            :on-exceed="exceedMsg"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isAddModuleCild = false">取 消</el-button>
        <el-button type="primary" @click="addModuleCild">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="选择图片" :visible.sync="isPictrueDialog">
      <div class="choose_pictrue">
        <div class="tabs">
          <el-tabs tab-position="left">
            <el-tab-pane v-model="activeName" v-for="item in channelTab" :key="item.id">配置管理</el-tab-pane>
          </el-tabs>
        </div>
        <div class="pictrue_content">
          <div class="local_up">
            <span>格式要求：&ensp;</span>
            <el-popover placement="bottom" trigger="hover" content="仅支持png/jpg/jpeg格式">
              <span class="el-icon-Tip" slot="reference"></span>
            </el-popover>
            <span class="upload">
              <el-upload action="#" multiple :limit="3" :file-list="fileList">
                <el-button size="small" type="primary">本地上传</el-button>
              </el-upload>
            </span>
          </div>
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
            </li>
          </ul>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isAddModuleCild = false">取 消</el-button>
        <el-button type="primary" @click="addModuleCild">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { VueEditor } from "vue2-editor";
import {
  addChannels,
  getChannels,
  addModule,
  getModule,
  alterModule,
  addModuleCild
} from "@/api/api";
export default {
  components: {
    VueEditor
  },
  data() {
    return {
      dates: [],
      active: 1,
      activeName: "0",
      channelTab: [],
      isDlag: false,
      isModuleDlag: false,
      isCildModuleDlag: false,
      isAlterDlag: false,
      isAddModuleCild: false,
      isPictrueDialog: false,
      showFile: true,
      imgWSize: 800,
      imgHSize: 600,
      filterText: "",
      rules: {
        name: [
          { required: true, message: "名称不能为空", trigger: "blur" },
          { min: 2, max: 12, message: "长度在 2 到 12 个字符", trigger: "blur" }
        ]
      },
      form: {
        name: "",
        netType: 0
        // title: '',
        // content: '',
        // categories: [],
        // cover: [],
        // type: 1
      },
      modules: {
        id: null,
        parentId: 0,
        channelId: 7,
        name: "",
        type: 0,
        positionSize: "",
        adsType: 0,
        adsNum: 8,
        resourceId: null
      },
      moduleData: [],
      categoryList: [],
      headers: {
        token: localStorage.getItem("token")
      },
      postId: "",
      fileList: [],
      menuList: [
        {
          id: 1,
          src:
            "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
          des: "这是第一个描述",
          price: 198
        },
        {
          id: 2,
          src:
            "https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1594017553&di=dc121fedd61a7aba370575d0006f9e8e&src=http://a0.att.hudong.com/56/12/01300000164151121576126282411.jpg",
          des: "这是第二个描述",
          price: 198
        },
        {
          id: 3,
          src:
            "https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1594017553&di=dc121fedd61a7aba370575d0006f9e8e&src=http://a0.att.hudong.com/56/12/01300000164151121576126282411.jpg",
          des: "这是第三个描述",
          price: 211
        },
        {
          id: 4,
          src:
            "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1594027754481&di=ea01700f72369abc392074fb512df58b&imgtype=0&src=http%3A%2F%2Fa0.att.hudong.com%2F64%2F76%2F20300001349415131407760417677.jpg",
          des: "这是第一个描述",
          price: 198
        },
        {
          id: 5,
          src:
            "https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2037841410,2887638459&fm=26&gp=0.jpg",
          des: "这是第二个描述",
          price: 112
        },
        {
          id: 6,
          src:
            "https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg",
          des: "这是第三个描述",
          price: 423
        },
        {
          id: 7,
          src: "images/3.jpg",
          des: "这是第二个描述",
          price: 112
        },
        {
          id: 8,
          src: "images/3.jpg",
          des: "这是第三个描述",
          price: 423
        },
        {
          id: 9,
          src: "images/3.jpg",
          des: "这是第二个描述",
          price: 112
        },
        {
          id: 10,
          src: "images/3.jpg",
          des: "这是第三个描述",
          price: 423
        },
        {
          id: 11,
          src: "images/3.jpg",
          des: "这是第二个描述",
          price: 112
        },
        {
          id: 12,
          src: "images/3.jpg",
          des: "这是第三个描述",
          price: 423
        },
        {
          id: 13,
          src: "images/3.jpg",
          des: "这是第二个描述",
          price: 112
        },
        {
          id: 14,
          src: "images/3.jpg",
          des: "这是第三个描述",
          price: 423
        },
        {
          id: 15,
          src: "images/3.jpg",
          des: "这是第二个描述",
          price: 112
        },
        {
          id: 16,
          src: "images/3.jpg",
          des: "这是第三个描述",
          price: 423
        }
      ]
    };
  },
  created() {
    this.getChannel();
    this.getModule();
    // this.postId = this.$route.params.id
    // this.getcategoryList()
    // if (this.postId) {
    //   this.getPostDetail(this.postId)
    // }
  },
  methods: {
    //暂未开通功能统一提示
    notOpen() {
      this.$message.error('该功能暂未开通，请选择其他操作！')
      return
    },
    // 树状结构节点过滤
    filterNode(value, data) {
      if (!value) return true;
      return data.text.indexOf(value) !== -1;
    },
    // 图片上传相关
    exceedMsg() {
      this.$message.error("默认图片只能上传1张");
    },
    setPositionSize() {
      this.modules.positionSize = `${this.imgWSize}_${this.imgHSize}`;
    },
    handleFileSuc(res, file, fileList) {
      const { code, data, message } = res;
      if (code === 200) {
        this.modules.resourceId = data.resourceId;
        this.showFile = true;
      } else {
        this.$message.error(message);
        this.showFile = false;
        this.fileList = [];
      }
    },
    handleFileErr(err, file, fileList) {
      this.$message.error("文件上传失败");
    },

    // 获取渠道
    async getChannel() {
      const res = await getChannels();
      const { code, data } = res.data;
      if (code === 200) {
        this.channelTab = data.channelList;
      }
    },
    // 增加渠道
    async addChannel() {
      this.channelTab.forEach(item => {
        if (this.form.name == item.name) {
          this.$message.error("渠道名称已存在");
          return;
        }
      });
      if (this.form.name == "") {
        this.$message.error("渠道名称不能为空");
        return;
      }

      const res = await addChannels(JSON.stringify(this.form));
      const { code, data } = res.data;
      if (code === 200) {
        this.$message.success(data);
        this.getChannel();
        this.isDlag = false;
      } else {
        this.$message.error(data);
      }
    },
    // 获取模块数据
    async getModule() {
      const res = await getModule({ channelId: this.modules.channelId });
      const { code, data } = res.data;
      if (code === 200) {
        const { positionTree } = data;
        this.moduleData = positionTree;
      }
    },
    // 添加模块
    addCildModule(id) {
      if (id === 0) {
        this.isModuleDlag = true
        this.modules.parentId = 0;
        this.modules.type = 0;
      } else {
      this.isCildModuleDlag = true;
      this.modules.parentId = id;
      this.modules.type = 0;
      }
    },
    async moduleAdd() {
      if (this.modules.name === "") {
        this.$message.error("模块名称不能为空");
        return;
      }
      const res = await addModule(this.modules);
      const { code, message, data } = res.data;
      if (code === 200) {
        (this.isModuleDlag = false) || (this.isCildModuleDlag = false)
        this.$message.success(data);
        this.getModule();
      } else {
        this.$message.error(message);
      }
    },

    getChannelId(id) {
      this.modules.channelId = id;
      this.getModule();
    },
    // 获取修改模块参数
    getAlterModule(name, parentId, id) {
      this.isAlterDlag = true;
      this.modules.name = name;
      this.modules.parentId = parentId;
      this.modules.id = id;
    },
    // 修改主模块
    async alterModule() {
      const res = await alterModule(this.module);
      const { code, data } = res.data;
      if (code === 200) {
        this.isAlterDlag = false;
        this.$message.success(data);
        this.getModule();
      } else {
        this.$message.error(message);
      }
    },
    // 获取子栏位参数
    getModulesCild(id) {
      this.isAddModuleCild = true;
      this.modules.parentId = id;
      console.log(this.modules.parentId);
    },
    // 增加子栏位
    async addModuleCild() {
      const { name } = this.modules;
      if (name === "") {
        this.$message.error("子烂尾名称不能为空");
        return;
      }
      if (!this.imgWSize && !this.imgHSize) {
        this.$message.error("图片尺寸不能为空");
        return;
      }
      if (!this.fileList) {
        this.$message.error("必须上传1张默认图");
        return;
      }
      this.modules.type = 1;
      const res = await addModuleCild(this.modules);
      const { code, data, message } = res.data;
      if (code == 200) {
        this.$message.success(data);
        this.isAddModuleCild = false;
        this.fileList = [];
        this.getModule();
      } else {
        this.$message.error(message);
        this.fileList = [];
      }
    },
    // 添加树节点
    append(data) {
      const newChild = { id: id++, label: "testtest", children: [] };
      if (!data.children) {
        this.$set(data, "children", []);
      }
      data.children.push(newChild);
    },
    // 删除树节点
    remove(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === data.id);
      children.splice(index, 1);
    }
    // async getcategoryList () {
    //   // const res = await this.$axios.get('/category')
    //   const res = await this.getRequest('/category')
    //   const { statusCode, data } = res.data
    //   if (statusCode === 200) {
    //     this.categoryList = data.filter(item => item.id !== 999)
    //   }
    // },
    // async publish () {
    //   const data = {
    //     ...this.form
    //   }
    //   data.categories = this.form.categories.map(item => {
    //     return {
    //       id: item
    //     }
    //   })
    //   let url
    //   if (this.postId) {
    //     url = `/post_update/${this.postId}`
    //   } else {
    //     url = '/post'
    //   }
    //   // const res = await this.$axios.post(url, data, {
    //   //   headers: {
    //   //     Authorization: localStorage.getItem('token')
    //   //   }
    //   // })
    //   const res = await this.postRequest(url, data, {
    //     headers: {
    //       Authorization: localStorage.getItem('token')
    //     }
    //   })
    //   console.log(res)
    //   const { statusCode } = res.data
    //   if (statusCode === 200) {
    //     this.$router.push('/post-list')
    //     this.$message.success('发布成功')
    //   }
    // },
    // handleSuccess (res) {
    //   const { statusCode, data } = res
    //   if (statusCode === 200) {
    //     this.form.cover.push({
    //       id: data.id,
    //       url: 'http://localhost:3000' + data.url
    //     })
    //   }
    // },
    // async getPostDetail (id) {
    //   // const res = await this.$axios.get(`/post/${id}`)
    //   const res = await this.getRequest(`/post/${id}`)
    //   const { statusCode, data } = res.data
    //   if (statusCode === 200) {
    //     this.form = data
    //     data.categories = data.categories.map(item => {
    //       return item.id
    //     })
    //     data.cover.forEach(item => {
    //       this.fileList.push({
    //         url: this.$fixUrl(item.url),
    //         id: item.id
    //       })
    //     })
    //     data.content = data.content.replace(/<div/g, '<p')
    //     data.content = data.content.replace(/<\/div>/g, '</p>')
    //   }
    // },
    // handleRemove (file) {
    //   this.form.cover = this.form.cover.filter(item => item.id !== file.id)
    // }
  },
  watch: {
    filterText: function(val) {
      this.$refs.tree.filter(val);
    }
  }
};
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

  // .el-form {
  //   margin-top: 20px;
  //   .el-form-item {
  //     text-align: start;
  //     .el-input {
  //       width: 384px;
  //       height: 40px;
  //       margin-left: 32px;
  //       .el-input_inner {
  //         width: 100%;
  //         height: 40px;
  //       }
  //     }
  //     .el-radio:last-child {
  //       margin-left: 32px;
  //     }
  //   }
  // }

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
        .bianji:hover,
        .add_cild_module:hover {
          opacity: 1;
          transition: 0.1s all;
        }
        .add_cild_module {
          opacity: 0;
          margin-left: 20px;
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
      img {
        position: absolute;
        width: 320px;
        height: 155.2px;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
      }
      .form_data {
        padding: 24px;
        font-size: 16px;
        .form_title {
          font-size: 22px;
          font-weight: 700;
          color: rgba(34, 34, 34, 1);
          line-height: 30px;
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
        .img_upload {
          display: inline-block;
          width: 1000px;
          .upload_text {
            font-size: 12px;
          }
          ::v-deep .el-upload.el-upload--picture-card,
          ::v-deep .el-upload-list__item.is-ready {
            width: 320px;
            height: 160px;
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
    }
  }
  .module_child{
    .el-select{
      width: 120px;
      margin: 0 10px;
    }
    .ad_size{
      .el-input{
        width: 160px;
        text-align: center;
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
::v-deep .el-dialog__header{
  border: 1px solid #E0E0E0;
}

.pictrue_content {
  width: 760px;
  padding: 0 24px;
  ul {
    display: flex;
    justify-content: start;
    flex-wrap: wrap;
    list-style-type: none;
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
</style>
