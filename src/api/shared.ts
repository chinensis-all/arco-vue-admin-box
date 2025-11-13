/**
 * 共享类型定义
 * 用于所有API接口的通用类型
 */

/**
 * 分页请求参数
 */
export interface Page {
  page: number
  pageSize: number
}

/**
 * 分页响应数据
 */
export interface Pagination<T> {
  page: number
  pageSize: number
  total: number
  totalPage: number
  count: number
  items: T[]
}

/**
 * API响应包装
 */
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

/**
 * 通用选项模型（用于下拉框等）
 */
export interface Option {
  label: string
  value: string | number
  disabled?: boolean
}

/**
 * 时间范围
 */
export interface DateRange {
  start?: string
  end?: string
}

/**
 * 数值范围
 */
export interface NumberRange {
  start?: number
  end?: number
}
