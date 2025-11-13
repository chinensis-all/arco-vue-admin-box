/**
 * 用户模块 Mock 数据
 */
import { MockMethod } from 'vite-plugin-mock'
import type { UserQueryModel, UserPagination, UserOptionModel } from '../src/api/user'
import type { RoleOptionModel } from '../src/api/role'

// 模拟用户数据
const users: UserQueryModel[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@example.com',
    phone: '13800138000',
    realName: '张三',
    age: 28,
    scope: { code: 'admin', name: '管理员' },
    gender: 'male',
    department: '技术部',
    position: '技术总监',
    description: '系统管理员',
    status: 'active',
    roles: [
      { id: '1', name: '超级管理员' },
      { id: '2', name: '系统管理员' }
    ],
    createdAt: '2024-01-01 10:00:00',
    updatedAt: '2024-01-15 15:30:00'
  },
  {
    id: '2',
    username: 'user001',
    email: 'user001@example.com',
    phone: '13800138001',
    realName: '李四',
    age: 25,
    scope: { code: 'user', name: '普通用户' },
    gender: 'female',
    department: '市场部',
    position: '市场专员',
    description: '负责市场推广',
    status: 'active',
    roles: [{ id: '3', name: '普通用户' }],
    createdAt: '2024-01-05 09:00:00',
    updatedAt: '2024-01-20 11:20:00'
  },
  {
    id: '3',
    username: 'user002',
    email: 'user002@example.com',
    phone: '13800138002',
    realName: '王五',
    age: 32,
    scope: { code: 'operator', name: '操作员' },
    gender: 'male',
    department: '运营部',
    position: '运营经理',
    description: '负责日常运营',
    status: 'forbidden',
    roles: [{ id: '4', name: '操作员' }],
    createdAt: '2024-01-10 14:30:00',
    updatedAt: '2024-01-25 16:45:00'
  },
  {
    id: '4',
    username: 'user003',
    email: 'user003@example.com',
    phone: '13800138003',
    realName: '赵六',
    age: 29,
    scope: { code: 'user', name: '普通用户' },
    gender: 'male',
    department: '技术部',
    position: '前端工程师',
    status: 'active',
    roles: [{ id: '3', name: '普通用户' }],
    createdAt: '2024-01-12 10:15:00',
    updatedAt: '2024-01-28 09:30:00'
  },
  {
    id: '5',
    username: 'user004',
    email: 'user004@example.com',
    phone: '13800138004',
    realName: '孙七',
    age: 26,
    scope: { code: 'user', name: '普通用户' },
    gender: 'female',
    department: '设计部',
    position: 'UI设计师',
    description: '负责界面设计',
    status: 'active',
    roles: [{ id: '3', name: '普通用户' }],
    createdAt: '2024-01-15 11:00:00',
    updatedAt: '2024-02-01 14:20:00'
  },
  {
    id: '6',
    username: 'user005',
    email: 'user005@example.com',
    phone: '13800138005',
    realName: '周八',
    age: 30,
    scope: { code: 'operator', name: '操作员' },
    gender: 'male',
    department: '客服部',
    position: '客服主管',
    description: '负责客户服务',
    status: 'active',
    roles: [{ id: '4', name: '操作员' }],
    createdAt: '2024-01-18 09:30:00',
    updatedAt: '2024-02-05 10:15:00'
  },
  {
    id: '7',
    username: 'user006',
    email: 'user006@example.com',
    phone: '13800138006',
    realName: '吴九',
    age: 27,
    scope: { code: 'user', name: '普通用户' },
    gender: 'female',
    department: '人力资源部',
    position: 'HR专员',
    status: 'active',
    roles: [{ id: '3', name: '普通用户' }],
    createdAt: '2024-01-20 14:00:00',
    updatedAt: '2024-02-08 16:30:00'
  },
  {
    id: '8',
    username: 'user007',
    email: 'user007@example.com',
    phone: '13800138007',
    realName: '郑十',
    age: 35,
    scope: { code: 'admin', name: '管理员' },
    gender: 'male',
    department: '财务部',
    position: '财务经理',
    description: '负责财务管理',
    status: 'active',
    roles: [{ id: '2', name: '系统管理员' }],
    createdAt: '2024-01-22 11:20:00',
    updatedAt: '2024-02-10 13:40:00'
  },
  {
    id: '9',
    username: 'user008',
    email: 'user008@example.com',
    phone: '13800138008',
    realName: '钱十一',
    age: 24,
    scope: { code: 'user', name: '普通用户' },
    gender: 'female',
    department: '技术部',
    position: '后端开发',
    status: 'forbidden',
    roles: [{ id: '3', name: '普通用户' }],
    createdAt: '2024-01-25 10:00:00',
    updatedAt: '2024-02-12 14:50:00'
  },
  {
    id: '10',
    username: 'user009',
    email: 'user009@example.com',
    phone: '13800138009',
    realName: '孙十二',
    age: 31,
    scope: { code: 'operator', name: '操作员' },
    gender: 'male',
    department: '运营部',
    position: '运营总监',
    description: '负责公司运营',
    status: 'active',
    roles: [
      { id: '4', name: '操作员' },
      { id: '2', name: '系统管理员' }
    ],
    createdAt: '2024-01-28 15:30:00',
    updatedAt: '2024-02-15 09:20:00'
  },
  {
    id: '11',
    username: 'user010',
    email: 'user010@example.com',
    phone: '13800138010',
    realName: '李十三',
    age: 28,
    scope: { code: 'user', name: '普通用户' },
    gender: 'male',
    department: '技术部',
    position: '测试工程师',
    status: 'active',
    roles: [{ id: '3', name: '普通用户' }],
    createdAt: '2024-02-01 09:00:00',
    updatedAt: '2024-02-18 10:30:00'
  },
  {
    id: '12',
    username: 'user011',
    email: 'user011@example.com',
    phone: '13800138011',
    realName: '周十四',
    age: 26,
    scope: { code: 'user', name: '普通用户' },
    gender: 'female',
    department: '市场部',
    position: '新媒体运营',
    description: '负责社交媒体运营',
    status: 'active',
    roles: [{ id: '3', name: '普通用户' }],
    createdAt: '2024-02-03 13:45:00',
    updatedAt: '2024-02-20 15:10:00'
  },
  {
    id: '13',
    username: 'user012',
    email: 'user012@example.com',
    phone: '13800138012',
    realName: '王十五',
    age: 33,
    scope: { code: 'guest', name: '访客' },
    gender: 'male',
    department: '外部',
    position: '合作伙伴',
    status: 'active',
    roles: [{ id: '5', name: '访客' }],
    createdAt: '2024-02-05 16:20:00',
    updatedAt: '2024-02-22 11:40:00'
  },
  {
    id: '14',
    username: 'user013',
    email: 'user013@example.com',
    phone: '13800138013',
    realName: '赵十六',
    age: 29,
    scope: { code: 'user', name: '普通用户' },
    gender: 'female',
    department: '技术部',
    position: '产品经理',
    description: '负责产品规划',
    status: 'active',
    roles: [{ id: '3', name: '普通用户' }],
    createdAt: '2024-02-08 10:00:00',
    updatedAt: '2024-02-25 14:20:00'
  },
  {
    id: '15',
    username: 'user014',
    email: 'user014@example.com',
    phone: '13800138014',
    realName: '孙十七',
    age: 27,
    scope: { code: 'user', name: '普通用户' },
    gender: 'male',
    department: '设计部',
    position: 'UX设计师',
    status: 'forbidden',
    roles: [{ id: '3', name: '普通用户' }],
    createdAt: '2024-02-10 11:30:00',
    updatedAt: '2024-02-28 09:50:00'
  }
]

// 角色选项数据
const roleOptions: RoleOptionModel[] = [
  { value: '1', label: '超级管理员' },
  { value: '2', label: '系统管理员' },
  { value: '3', label: '普通用户' },
  { value: '4', label: '操作员' },
  { value: '5', label: '访客' }
]

export default [
  // 获取用户分页列表
  {
    url: '/api/users',
    method: 'get',
    timeout: 300,
    response: (request: any) => {
      const {
        page = 1,
        pageSize = 10,
        keywords,
        scope,
        roleIds,
        status,
        ageStart,
        ageEnd,
        createdAtStart,
        createdAtEnd
      } = request.query

      // 过滤数据
      let filteredUsers = [...users]

      if (keywords) {
        filteredUsers = filteredUsers.filter(
          (u) =>
            u.username.includes(keywords) ||
            u.realName.includes(keywords) ||
            u.email.includes(keywords)
        )
      }

      if (scope) {
        filteredUsers = filteredUsers.filter((u) => u.scope.code === scope)
      }

      if (status) {
        filteredUsers = filteredUsers.filter((u) => u.status === status)
      }

      if (roleIds) {
        const roleIdArray = Array.isArray(roleIds) ? roleIds : [roleIds]
        filteredUsers = filteredUsers.filter((u) =>
          u.roles.some((r) => roleIdArray.includes(r.id))
        )
      }

      if (ageStart) {
        filteredUsers = filteredUsers.filter((u) => u.age >= Number(ageStart))
      }

      if (ageEnd) {
        filteredUsers = filteredUsers.filter((u) => u.age <= Number(ageEnd))
      }

      if (createdAtStart) {
        filteredUsers = filteredUsers.filter((u) => u.createdAt >= createdAtStart)
      }

      if (createdAtEnd) {
        filteredUsers = filteredUsers.filter((u) => u.createdAt <= createdAtEnd)
      }

      // 分页
      const total = filteredUsers.length
      const start = (Number(page) - 1) * Number(pageSize)
      const end = start + Number(pageSize)
      const items = filteredUsers.slice(start, end)

      const result: UserPagination = {
        page: Number(page),
        pageSize: Number(pageSize),
        total,
        totalPage: Math.ceil(total / Number(pageSize)),
        count: items.length,
        items
      }

      return result
    }
  },

  // 获取用户详情
  {
    url: '/api/users/:id',
    method: 'get',
    response: (request: any) => {
      const { id } = request.params
      const user = users.find((u) => u.id === id)

      if (user) {
        return user
      } else {
        return null
      }
    }
  },

  // 创建用户
  {
    url: '/api/users',
    method: 'post',
    timeout: 500,
    response: (request: any) => {
      const newUser: UserQueryModel = {
        id: String(Date.now()),
        ...request.body,
        scope: { code: request.body.scope, name: getScopeName(request.body.scope) },
        status: 'active',
        roles: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      users.unshift(newUser)

      return newUser.id
    }
  },

  // 修改用户
  {
    url: '/api/users/:id',
    method: 'put',
    timeout: 500,
    response: (request: any) => {
      const { id } = request.params
      const index = users.findIndex((u) => u.id === id)

      if (index > -1) {
        users[index] = {
          ...users[index],
          ...request.body,
          scope: { code: request.body.scope, name: getScopeName(request.body.scope) },
          updatedAt: new Date().toISOString()
        }

        return true
      } else {
        return false
      }
    }
  },

  // 禁用用户
  {
    url: '/api/users/:id/lock',
    method: 'post',
    response: (request: any) => {
      const { id } = request.params
      const user = users.find((u) => u.id === id)

      if (user) {
        user.status = 'forbidden'
        user.updatedAt = new Date().toISOString()

        return true
      } else {
        return false
      }
    }
  },

  // 激活用户
  {
    url: '/api/users/:id/lock',
    method: 'delete',
    response: (request: any) => {
      const { id } = request.params
      const user = users.find((u) => u.id === id)

      if (user) {
        user.status = 'active'
        user.updatedAt = new Date().toISOString()

        return true
      } else {
        return false
      }
    }
  },

  // 修改用户角色
  {
    url: '/api/users/:id/roles',
    method: 'put',
    response: (request: any) => {
      const { id } = request.params
      const { roleIds } = request.body
      const user = users.find((u) => u.id === id)

      if (user) {
        user.roles = roleIds.map((roleId: string) => {
          const role = roleOptions.find((r) => r.value === roleId)
          return { id: roleId, name: role?.label || '' }
        })
        user.updatedAt = new Date().toISOString()

        return true
      } else {
        return false
      }
    }
  },

  // 获取用户选项列表
  {
    url: '/api/users/options',
    method: 'get',
    response: (request: any) => {
      const { keywords } = request.query
      let filteredUsers = [...users]

      if (keywords) {
        filteredUsers = filteredUsers.filter(
          (u) => u.username.includes(keywords) || u.realName.includes(keywords)
        )
      }

      const options: UserOptionModel[] = filteredUsers.map((u) => ({
        value: u.id,
        label: `${u.realName} (${u.username})`
      }))

      return options
    }
  },

  // 获取角色选项列表
  {
    url: '/api/roles/options',
    method: 'get',
    response: () => {
      return roleOptions
    }
  },

  // 个人资料相关接口

  // 获取当前用户信息
  {
    url: '/api/profile',
    method: 'get',
    response: () => {
      // 默认返回第一个用户（admin）的信息
      const currentUser = users[0]
      return {
        ...currentUser,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
      }
    }
  },

  // 更新头像
  {
    url: '/api/profile/avatar',
    method: 'put',
    response: ({ body }: any) => {
      console.log('[更新头像]', body)
      // 模拟更新
      return { success: true }
    }
  },

  // 更新基础信息
  {
    url: '/api/profile/basic',
    method: 'put',
    response: ({ body }: any) => {
      console.log('[更新基础信息]', body)
      const user = users[0]
      Object.assign(user, body)
      user.updatedAt = new Date().toLocaleString('zh-CN')
      return { success: true }
    }
  },

  // 更新联系方式
  {
    url: '/api/profile/contact',
    method: 'put',
    response: ({ body }: any) => {
      console.log('[更新联系方式]', body)
      const user = users[0]
      user.email = body.email
      user.phone = body.phone
      user.updatedAt = new Date().toLocaleString('zh-CN')
      return { success: true }
    }
  },

  // 修改密码
  {
    url: '/api/profile/password',
    method: 'put',
    response: ({ body }: any) => {
      console.log('[修改密码]', body)
      // 模拟密码验证
      if (body.oldPassword !== '123456') {
        return {
          status: 400,
          message: '原密码错误'
        }
      }
      return { success: true }
    }
  }
] as MockMethod[]

// 辅助函数：根据scope代码获取名称
function getScopeName(code: string): string {
  const scopeMap: Record<string, string> = {
    admin: '管理员',
    user: '普通用户',
    operator: '操作员',
    guest: '访客'
  }
  return scopeMap[code] || '未知'
}
