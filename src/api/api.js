import { getRequest, postRequest } from '../utils/request'

export const login = p => postRequest('/token/login', p)
export const getUserMenu = p => getRequest('/user/loginInfo', p)
export const getCountDate = p => getRequest('/index/count', p)

// export const login = p => postRequest('/api/login', p)
export const getPostList = p => getRequest('/post', p)
