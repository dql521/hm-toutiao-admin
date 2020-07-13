import { getRequest, postRequest } from '../utils/request'

export const login = p => postRequest('/token/login', p)
export const getUserMenu = p => getRequest('/user/loginInfo', p)
export const getCountDate = p => getRequest('/index/count', p)
export const addChannels = p => postRequest('/channel/add', p)
export const getChannels = p => getRequest('/channel/getList', p)
export const addModule = p => postRequest('/module/add', p)
export const getModule = p => postRequest('/module/getTree', p)
export const alterModule = p => postRequest('/module/update', p)
export const addModuleCild = p => postRequest('/position/add', p)

// export const login = p => postRequest('/api/login', p)
export const getPostList = p => getRequest('/post', p)
