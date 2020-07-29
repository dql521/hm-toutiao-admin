import { getRequest, postRequest } from '../utils/request'

export const login = p => postRequest('/token/login', p) //登录
export const getUserMenu = p => getRequest('/user/loginInfo', p) //获取用户信息
export const getCountDate = p => getRequest('/index/count', p) //首页数据
export const addChannels = p => postRequest('/channel/add', p) //添加渠道
export const getChannels = p => getRequest('/channel/getList', p) //获取渠道
export const addModule = p => postRequest('/module/add', p) //添加模块
export const getModule = p => postRequest('/module/getTree', p) //获得模块树
export const alterModule = p => postRequest('/module/update', p) //修改模块
export const delModule = p => postRequest(`/module/del/${p}`) //删除模块
export const addModuleCild = p => postRequest('/position/add', p) //添加子栏位
export const editModuleCild = p => postRequest('/position/update', p) //修改子栏位
export const getModuleCild = p => postRequest('/position/getInfo', p) //查询子栏位信息
export const getPictrueList = p => getRequest('/resource/getList', p) //获取资源库
export const removePictrue = p => postRequest('/resource/remove', p) //删除图片
export const getAdLists = p => getRequest('/cnt/list', p) //获取广告列表
export const addCnt = p => postRequest('/cnt/add', p) //生成广告
export const getChannelsImg = p => getRequest('/channel/getListAndResourceNum', p) //获取图片库tab
export const getCntInfo = p => postRequest('/cnt/getInfo',p) //查看广告详情
export const delCnt = p => getRequest(`/cnt/del/${p}`) //删除广告
export const modCnt = p => postRequest('/cnt/mod',p) //修改广告
export const getCntDetail = p => getRequest(`/cnt/detail/${p}`) //获取广告详情
