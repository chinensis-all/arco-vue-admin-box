/**
 * 用户列表逻辑复用
 * 封装搜索、分页、刷新等通用逻辑
 */
import { ref, reactive } from 'vue'
import { Message } from '@arco-design/web-vue'
import {
  getUserPagination,
  type UserSearchData,
  type UserQueryModel,
  type UserPagination
} from '@/api/user'

export function useUserList() {
  // 加载状态
  const loading = ref(false)

  // 搜索条件
  const searchForm = reactive<UserSearchData>({
    keywords: '',
    scope: undefined,
    roleIds: undefined,
    status: undefined,
    ageStart: undefined,
    ageEnd: undefined,
    createdAtStart: undefined,
    createdAtEnd: undefined
  })

  // 分页数据
  const pagination = reactive({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPage: 0,
    count: 0
  })

  // 用户列表
  const userList = ref<UserQueryModel[]>([])

  /**
   * 加载用户列表
   */
  const loadUserList = async () => {
    try {
      loading.value = true

      const { data } = await getUserPagination(searchForm, {
        page: pagination.page,
        pageSize: pagination.pageSize
      })

      userList.value = data.items
      pagination.total = data.total
      pagination.totalPage = data.totalPage
      pagination.count = data.count
    } catch (error) {
      Message.error('加载用户列表失败')
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  /**
   * 搜索用户
   */
  const handleSearch = () => {
    pagination.page = 1
    loadUserList()
  }

  /**
   * 重置搜索
   */
  const handleReset = () => {
    Object.assign(searchForm, {
      keywords: '',
      scope: undefined,
      roleIds: undefined,
      status: undefined,
      ageStart: undefined,
      ageEnd: undefined,
      createdAtStart: undefined,
      createdAtEnd: undefined
    })
    pagination.page = 1
    loadUserList()
  }

  /**
   * 刷新当前页
   */
  const handleRefresh = () => {
    loadUserList()
  }

  /**
   * 分页变化
   */
  const handlePageChange = (page: number) => {
    pagination.page = page
    loadUserList()
  }

  /**
   * 每页条数变化
   */
  const handlePageSizeChange = (pageSize: number) => {
    pagination.pageSize = pageSize
    pagination.page = 1
    loadUserList()
  }

  return {
    loading,
    searchForm,
    pagination,
    userList,
    loadUserList,
    handleSearch,
    handleReset,
    handleRefresh,
    handlePageChange,
    handlePageSizeChange
  }
}
