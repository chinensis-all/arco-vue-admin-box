<template>
  <div class="user-page">
    <!-- 页面导航和快捷菜单 -->
    <div class="page-header">
      <a-breadcrumb>
        <a-breadcrumb-item>Agent参考示例</a-breadcrumb-item>
        <a-breadcrumb-item>复杂分组表单</a-breadcrumb-item>
      </a-breadcrumb>
      <a-button type="text" @click="addToQuickMenu">
        <template #icon>
          <icon-star />
        </template>
        加入快捷菜单
      </a-button>
    </div>

    <!-- 主内容卡片 -->
    <a-card class="content-card" title="复杂分组表单">
      <!-- 搜索表单 -->
      <div class="search-form">
        <a-form :model="searchForm" layout="inline">
          <a-form-item label="关键词" label-col-flex="80px">
            <a-input
              v-model="searchForm.keywords"
              placeholder="用户名/姓名/邮箱"
              style="width: 200px"
              allow-clear
              @press-enter="handleSearch"
            />
          </a-form-item>

          <a-form-item label="用户类型" label-col-flex="80px">
            <a-select
              v-model="searchForm.scope"
              placeholder="请选择"
              style="width: 200px"
              allow-clear
            >
              <a-option value="admin">管理员</a-option>
              <a-option value="user">普通用户</a-option>
              <a-option value="operator">操作员</a-option>
              <a-option value="guest">访客</a-option>
            </a-select>
          </a-form-item>

          <a-form-item label="用户角色" label-col-flex="80px">
            <a-select
              v-model="searchForm.roleIds"
              placeholder="请选择"
              style="width: 200px"
              allow-clear
              multiple
              :loading="roleOptionsLoading"
            >
              <a-option
                v-for="role in roleOptions"
                :key="role.value"
                :value="role.value"
              >
                {{ role.label }}
              </a-option>
            </a-select>
          </a-form-item>

          <a-form-item label="状态" label-col-flex="80px">
            <a-radio-group v-model="searchForm.status">
              <a-radio :value="undefined">全部</a-radio>
              <a-radio value="active">激活</a-radio>
              <a-radio value="forbidden">禁用</a-radio>
            </a-radio-group>
          </a-form-item>

          <a-form-item label="年龄范围" label-col-flex="80px">
            <a-space>
              <a-input-number
                v-model="searchForm.ageStart"
                placeholder="最小"
                :min="0"
                :max="150"
                style="width: 95px"
              />
              <span>-</span>
              <a-input-number
                v-model="searchForm.ageEnd"
                placeholder="最大"
                :min="0"
                :max="150"
                style="width: 95px"
              />
            </a-space>
          </a-form-item>

          <a-form-item label="创建时间" label-col-flex="80px">
            <a-range-picker
              v-model="createdAtRange"
              style="width: 360px"
              show-time
              format="YYYY-MM-DD HH:mm:ss"
              @change="handleDateRangeChange"
            />
          </a-form-item>

          <a-form-item>
            <a-space>
              <a-button type="primary" @click="handleSearch">
                <template #icon>
                  <icon-search />
                </template>
                搜索
              </a-button>
              <a-button @click="handleReset">
                <template #icon>
                  <icon-refresh />
                </template>
                重置
              </a-button>
            </a-space>
          </a-form-item>
        </a-form>
      </div>

      <!-- 工具栏 -->
      <div class="toolbar">
        <div class="toolbar-left">
          <a-button
            type="primary"
            :disabled="!hasButton('user:add')"
            @click="handleAdd"
          >
            <template #icon>
              <icon-plus />
            </template>
            添加新用户
          </a-button>
        </div>
        <div class="toolbar-right">
          <a-tooltip content="刷新">
            <a-button type="text" @click="handleRefresh">
              <template #icon>
                <icon-refresh />
              </template>
            </a-button>
          </a-tooltip>
          <a-tooltip content="列设置">
            <a-popover trigger="click" position="br">
              <a-button type="text">
                <template #icon>
                  <icon-settings />
                </template>
              </a-button>
              <template #content>
                <div style="width: 200px">
                  <a-checkbox-group v-model="visibleColumns">
                    <a-checkbox
                      v-for="col in columnOptions"
                      :key="col.value"
                      :value="col.value"
                      :style="{ display: 'block', marginBottom: '8px' }"
                    >
                      {{ col.label }}
                    </a-checkbox>
                  </a-checkbox-group>
                </div>
              </template>
            </a-popover>
          </a-tooltip>
        </div>
      </div>

      <!-- 数据表格 -->
      <a-table
        :columns="displayColumns"
        :data="userList"
        :loading="loading"
        :pagination="false"
        :bordered="{ cell: true }"
        row-key="id"
      >
        <!-- 用户类型列 -->
        <template #scope="{ record }">
          <a-tag>{{ record.scope.name }}</a-tag>
        </template>

        <!-- 性别列 -->
        <template #gender="{ record }">
          {{ genderMap[record.gender] }}
        </template>

        <!-- 状态列 -->
        <template #status="{ record }">
          <a-tag :color="record.status === 'active' ? 'green' : 'red'">
            {{ record.status === 'active' ? '激活' : '禁用' }}
          </a-tag>
        </template>

        <!-- 角色列 -->
        <template #roles="{ record }">
          <a-space>
            <a-tag v-for="role in record.roles" :key="role.id" color="arcoblue">
              {{ role.name }}
            </a-tag>
            <span v-if="record.roles.length === 0" style="color: #999">-</span>
          </a-space>
        </template>

        <!-- 操作列 -->
        <template #action="{ record }">
          <a-space>
            <a-button
              size="mini"
              type="primary"
              :disabled="!hasButton('user:modify')"
              @click="handleEdit(record)"
            >
              编辑
            </a-button>
            <a-button
              v-if="record.status === 'active'"
              size="mini"
              type="primary"
              status="danger"
              :disabled="!hasButton('user:forbid')"
              @click="handleForbid(record)"
            >
              禁用
            </a-button>
            <a-button
              v-else
              size="mini"
              type="primary"
              status="success"
              :disabled="!hasButton('user:activate')"
              @click="handleActivate(record)"
            >
              激活
            </a-button>
          </a-space>
        </template>
      </a-table>

      <!-- 分页 -->
      <div class="pagination">
        <a-pagination
          :current="pagination.page"
          :page-size="pagination.pageSize"
          :total="pagination.total"
          show-total
          show-jumper
          show-page-size
          :page-size-options="[10, 20, 50, 100]"
          @change="handlePageChange"
          @page-size-change="handlePageSizeChange"
        />
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Message, Modal } from '@arco-design/web-vue'
import {
  IconStar,
  IconSearch,
  IconRefresh,
  IconPlus,
  IconSettings
} from '@arco-design/web-vue/es/icon'
import { useUserList } from '../user/composables/useUserList'
import { getRoleOptions, type RoleOptionModel } from '@/api/role'
import { forbidUser, activateUser, type UserQueryModel } from '@/api/user'

const router = useRouter()
const route = useRoute()

// 使用组合式函数
const {
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
} = useUserList()

// 性别映射
const genderMap: Record<string, string> = {
  male: '男',
  female: '女',
  other: '其他'
}

// 创建时间范围
const createdAtRange = ref<string[]>([])

// 处理时间范围变化
const handleDateRangeChange = (value: string[]) => {
  searchForm.createdAtStart = value[0] || undefined
  searchForm.createdAtEnd = value[1] || undefined
}

// 角色选项
const roleOptions = ref<RoleOptionModel[]>([])
const roleOptionsLoading = ref(false)

// 加载角色选项
const loadRoleOptions = async () => {
  try {
    roleOptionsLoading.value = true
    const { data } = await getRoleOptions({})
    roleOptions.value = data
  } catch (error) {
    console.error(error)
  } finally {
    roleOptionsLoading.value = false
  }
}

// 表格列配置
const columnOptions = [
  { label: 'ID', value: 'id' },
  { label: '用户名', value: 'username' },
  { label: '真实姓名', value: 'realName' },
  { label: '邮箱', value: 'email' },
  { label: '手机号', value: 'phone' },
  { label: '年龄', value: 'age' },
  { label: '性别', value: 'gender' },
  { label: '用户类型', value: 'scope' },
  { label: '部门', value: 'department' },
  { label: '职位', value: 'position' },
  { label: '状态', value: 'status' },
  { label: '角色', value: 'roles' },
  { label: '创建时间', value: 'createdAt' }
]

// 可见列（默认隐藏一些列）
const visibleColumns = ref([
  'username',
  'realName',
  'email',
  'phone',
  'scope',
  'department',
  'status',
  'roles'
])

// 所有列定义
const allColumns = [
  { title: 'ID', dataIndex: 'id', width: 80 },
  { title: '用户名', dataIndex: 'username', width: 120 },
  { title: '真实姓名', dataIndex: 'realName', width: 100 },
  { title: '邮箱', dataIndex: 'email', width: 180 },
  { title: '手机号', dataIndex: 'phone', width: 120 },
  { title: '年龄', dataIndex: 'age', width: 80 },
  { title: '性别', dataIndex: 'gender', slotName: 'gender', width: 80 },
  { title: '用户类型', dataIndex: 'scope', slotName: 'scope', width: 100 },
  { title: '部门', dataIndex: 'department', width: 120 },
  { title: '职位', dataIndex: 'position', width: 120 },
  { title: '状态', dataIndex: 'status', slotName: 'status', width: 80 },
  { title: '角色', dataIndex: 'roles', slotName: 'roles', width: 200 },
  { title: '创建时间', dataIndex: 'createdAt', width: 180 },
  { title: '操作', slotName: 'action', width: 200, fixed: 'right' as const }
]

// 显示的列（根据visibleColumns过滤）
const displayColumns = computed(() => {
  return allColumns.filter(
    (col) =>
      (col.dataIndex && visibleColumns.value.includes(col.dataIndex)) ||
      col.slotName === 'action'
  )
})

// 权限按钮检查
const hasButton = (buttonCode: string): boolean => {
  const buttons = (route.meta?.buttons as string[]) || []
  return buttons.includes(buttonCode)
}

// 加入快捷菜单
const addToQuickMenu = () => {
  const list = JSON.parse(localStorage.getItem('quickMenus') || '[]')
  const titleText = '复杂分组表单'
  const current = { key: '/group-form', name: titleText }
  
  const existed = list.findIndex((x: any) => x.key === current.key)
  if (existed >= 0) {
    Message.info('已经在快捷菜单中')
    return
  }
  
  list.unshift(current)
  while (list.length > 3) {
    list.pop()
  }
  
  localStorage.setItem('quickMenus', JSON.stringify(list))
  window.dispatchEvent(new Event('storage'))
  Message.success('已加入快捷菜单')
}

// 添加用户 - 打开新标签页
const handleAdd = () => {
  router.push('/group-form/add')
}

// 编辑用户 - 打开新标签页
const handleEdit = (record: UserQueryModel) => {
  router.push(`/group-form/edit/${record.id}`)
}

// 禁用用户
const handleForbid = (record: UserQueryModel) => {
  Modal.confirm({
    title: '确认禁用',
    content: `确定要禁用用户"${record.realName}"吗？`,
    okText: '确定',
    cancelText: '取消',
    onOk: async () => {
      try {
        await forbidUser(record.id)
        Message.success('禁用成功')
        loadUserList()
      } catch (error) {
        Message.error('禁用失败')
        console.error(error)
      }
    }
  })
}

// 激活用户
const handleActivate = (record: UserQueryModel) => {
  Modal.confirm({
    title: '确认激活',
    content: `确定要激活用户"${record.realName}"吗？`,
    okText: '确定',
    cancelText: '取消',
    onOk: async () => {
      try {
        await activateUser(record.id)
        Message.success('激活成功')
        loadUserList()
      } catch (error) {
        Message.error('激活失败')
        console.error(error)
      }
    }
  })
}

// 初始化
onMounted(() => {
  loadUserList()
  loadRoleOptions()
})
</script>

<style scoped lang="scss">
.user-page {
  padding: 20px;

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .content-card {
    :deep(.arco-card-header-title) {
      font-weight: 600;
      font-size: 18px;
    }
    
    .search-form {
      padding: 16px 16px 0;
      background: #f7f8fa;
      border-radius: 4px;
      margin-bottom: 16px;

      :deep(.arco-form-item) {
        margin-bottom: 16px;
      }
    }

    .toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;

      .toolbar-right {
        display: flex;
        gap: 8px;
      }
    }

    .pagination {
      margin-top: 16px;
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
