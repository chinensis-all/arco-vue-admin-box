import axios from '@/utils/http'

/**
 * 分类查询模型（带children的树形结构）
 */
export interface CategoryQueryModel {
  id: string
  parentId: string
  name: string
  code: string
  sort: number
  description?: string
  status: 'active' | 'inactive'
  children?: CategoryQueryModel[]
  createdAt: string
  updatedAt: string
}

/**
 * 分类命令模型（不带children）
 */
export interface CategoryModel {
  id?: string
  parentId: string
  name: string
  code: string
  sort: number
  description?: string
  status: 'active' | 'inactive'
}

/**
 * 获取分类树
 */
export function getCategoryTree() {
  return axios.get<CategoryQueryModel[]>('/api/categories/tree')
}

/**
 * 获取单个分类
 */
export function getCategory(id: string) {
  return axios.get<CategoryQueryModel>(`/api/categories/${id}`)
}

/**
 * 创建分类
 */
export function createCategory(data: CategoryModel) {
  return axios.post('/api/categories', data)
}

/**
 * 修改分类
 */
export function modifyCategory(id: string, data: CategoryModel) {
  return axios.put(`/api/categories/${id}`, data)
}

/**
 * 删除分类
 */
export function deleteCategory(id: string) {
  return axios.delete(`/api/categories/${id}`)
}

/**
 * 获取所有分类（扁平列表，用于父节点选择）
 */
export function getCategoryList() {
  return axios.get<CategoryQueryModel[]>('/api/categories/list')
}
