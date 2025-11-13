/**
 * 用户API接口定义
 * 演示完整的CRUD操作和CQRS模式
 */
import axios from 'axios'
import type { Page, Pagination, Option } from './shared'

/**
 * 用户类型代码值对象
 */
export interface ScopeValue {
  code: string
  name: string
}

/**
 * 角色代码值对象
 */
export interface RoleValue {
  id: string
  name: string
}

/**
 * 用户模型（命令模型 - 用于创建和修改）
 */
export interface UserModel {
  id?: string
  username: string
  email: string
  phone: string
  realName: string
  age: number
  scope: string // 用户类型代码
  gender: 'male' | 'female' | 'other'
  department: string
  position: string
  description?: string
}

/**
 * 用户查询模型（查询模型 - 用于显示）
 */
export interface UserQueryModel {
  id: string
  username: string
  email: string
  phone: string
  realName: string
  age: number
  scope: ScopeValue // 返回值对象
  gender: 'male' | 'female' | 'other'
  department: string
  position: string
  description?: string
  status: 'active' | 'forbidden' // 激活/禁用状态
  roles: RoleValue[] // 角色列表
  avatar?: string // 头像 URL
  createdAt: string
  updatedAt: string
}

/**
 * 用户搜索参数
 */
export interface UserSearchData {
  keywords?: string // 关键词搜索
  scope?: string // 用户类型
  roleIds?: string[] // 角色ID列表
  status?: 'active' | 'forbidden' // 状态
  ageStart?: number // 年龄范围开始
  ageEnd?: number // 年龄范围结束
  createdAtStart?: string // 创建时间范围开始
  createdAtEnd?: string // 创建时间范围结束
}

/**
 * 用户选项模型（用于其他页面的下拉选择）
 */
export interface UserOptionModel extends Option {
  value: string
  label: string
  avatar?: string
}

/**
 * 用户分页模型
 */
export type UserPagination = Pagination<UserQueryModel>

/**
 * 创建用户
 */
export function createUser(data: UserModel) {
  return axios.post('/api/users', data)
}

/**
 * 修改用户
 */
export function modifyUser(id: string, data: UserModel) {
  return axios.put(`/api/users/${id}`, data)
}

/**
 * 禁用用户
 */
export function forbidUser(id: string) {
  return axios.post(`/api/users/${id}/lock`)
}

/**
 * 激活用户
 */
export function activateUser(id: string) {
  return axios.delete(`/api/users/${id}/lock`)
}

/**
 * 删除用户（注释掉，为无法禁用激活只能删除的资源做示例）
 */
// export function destroyUser(id: string) {
//   return axios.delete(`/api/users/${id}`)
// }

/**
 * 修改用户角色（演示聚合根的值对象修改，也是子域的修改）
 */
export function modifyUserRoles(id: string, roleIds: string[]) {
  return axios.put(`/api/users/${id}/roles`, { roleIds })
}

/**
 * 获取用户详情
 */
export function getUser(id: string) {
  return axios.get<UserQueryModel>(`/api/users/${id}`)
}

/**
 * 搜索用户选项列表（用于其他页面的下拉选择）
 */
export function getUserOptions(params: UserSearchData) {
  return axios.get<UserOptionModel[]>('/api/users/options', { params })
}

/**
 * 搜索用户分页
 */
export function getUserPagination(params: UserSearchData, pager: Page) {
  return axios.get<UserPagination>('/api/users', {
    params: { ...params, ...pager }
  })
}

/**
 * 个人资料相关接口
 */

// 获取当前用户信息
export function getCurrentUserProfile() {
  return axios.get<UserQueryModel>('/api/profile')
}

// 更新头像
export function updateAvatar(avatarUrl: string) {
  return axios.put('/api/profile/avatar', { avatarUrl })
}

// 更新基础信息
export interface BasicInfoData {
  realName: string
  gender: 'male' | 'female' | 'other'
  age: number
  department: string
  position: string
  description?: string
}

export function updateBasicInfo(data: BasicInfoData) {
  return axios.put('/api/profile/basic', data)
}

// 更新联系方式
export interface ContactInfoData {
  email: string
  phone: string
}

export function updateContactInfo(data: ContactInfoData) {
  return axios.put('/api/profile/contact', data)
}

// 修改密码
export interface ChangePasswordData {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

export function changePassword(data: ChangePasswordData) {
  return axios.put('/api/profile/password', data)
}
