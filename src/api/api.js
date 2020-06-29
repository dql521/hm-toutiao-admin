import { getRequest, postRequest } from '../utils/request'

export const login = p => postRequest('/login', p)
export const getPostList = p => getRequest('/post', p)
