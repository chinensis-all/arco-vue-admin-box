/**
 * 角色API接口定义
 */
import axios from 'axios'
import type { Option } from './shared'

/**
 * 角色搜索参数
 */
export interface RoleSearchData {
  keywords?: string
}

/**
 * 角色选项模型
 */
export interface RoleOptionModel extends Option {
  value: string
  label: string
}

/**
 * 获取角色选项列表（用于下拉选择）
 */
export function getRoleOptions(params: RoleSearchData = {}) {
  return axios.get<RoleOptionModel[]>('/api/roles/options', { params })
}
