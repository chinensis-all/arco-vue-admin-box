<template>
  <div class="form-page">
    <div class="page-header">
      <a-breadcrumb>
        <a-breadcrumb-item>Agent参考示例</a-breadcrumb-item>
        <a-breadcrumb-item>复杂分步表单</a-breadcrumb-item>
        <a-breadcrumb-item>{{ pageTitle }}</a-breadcrumb-item>
      </a-breadcrumb>
    </div>

    <a-card class="form-card">
      <template #title>
        <div class="card-title">
          <span>{{ pageTitle }}</span>
          <a-tag v-if="formChanged" color="orange">未保存</a-tag>
        </div>
      </template>

      <a-steps :current="currentStep" class="steps-bar">
        <a-step title="基础信息" />
        <a-step title="安全信息" />
        <a-step title="附加信息" />
      </a-steps>

      <div class="form-container">
        <a-form :model="formData" :rules="rules" ref="formRef" layout="vertical">
          <!-- 第一步：基础信息 -->
          <div v-show="currentStep === 0" class="step-content">
            <a-row :gutter="16">
              <a-col :span="12">
                <a-form-item label="用户名" field="username">
                  <a-input
                    v-model="formData.username"
                    placeholder="请输入用户名"
                    @input="handleFormChange"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="真实姓名" field="realName">
                  <a-input
                    v-model="formData.realName"
                    placeholder="请输入真实姓名"
                    @input="handleFormChange"
                  />
                </a-form-item>
              </a-col>
            </a-row>

            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item label="性别" field="gender">
                  <a-select
                    v-model="formData.gender"
                    placeholder="请选择性别"
                    @change="handleFormChange"
                  >
                    <a-option value="male">男</a-option>
                    <a-option value="female">女</a-option>
                    <a-option value="other">其他</a-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="年龄" field="age">
                  <a-input-number
                    v-model="formData.age"
                    placeholder="请输入年龄"
                    :min="1"
                    :max="150"
                    style="width: 100%"
                    @input="handleFormChange"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="用户类型" field="scope">
                  <a-select
                    v-model="formData.scope"
                    placeholder="请选择用户类型"
                    @change="handleFormChange"
                  >
                    <a-option value="admin">管理员</a-option>
                    <a-option value="user">普通用户</a-option>
                    <a-option value="operator">操作员</a-option>
                    <a-option value="guest">访客</a-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>

            <a-row :gutter="16">
              <a-col :span="12">
                <a-form-item label="部门" field="department">
                  <a-input
                    v-model="formData.department"
                    placeholder="请输入部门"
                    @input="handleFormChange"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="职位" field="position">
                  <a-input
                    v-model="formData.position"
                    placeholder="请输入职位"
                    @input="handleFormChange"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </div>

          <!-- 第二步：安全信息 -->
          <div v-show="currentStep === 1" class="step-content">
            <a-row :gutter="16">
              <a-col :span="12">
                <a-form-item label="邮箱" field="email">
                  <a-input
                    v-model="formData.email"
                    placeholder="请输入邮箱"
                    @input="handleFormChange"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="手机号" field="phone">
                  <a-input
                    v-model="formData.phone"
                    placeholder="请输入手机号"
                    @input="handleFormChange"
                  />
                </a-form-item>
              </a-col>
            </a-row>

            <a-row :gutter="16" v-if="isAdd">
              <a-col :span="12">
                <a-form-item label="密码" field="password">
                  <a-input-password
                    v-model="formData.password"
                    placeholder="请输入密码"
                    @input="handleFormChange"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="确认密码" field="confirmPassword">
                  <a-input-password
                    v-model="formData.confirmPassword"
                    placeholder="请再次输入密码"
                    @input="handleFormChange"
                  />
                </a-form-item>
              </a-col>
            </a-row>

            <a-form-item label="角色" field="roleIds">
              <a-select
                v-model="formData.roleIds"
                placeholder="请选择角色"
                multiple
                :loading="roleOptionsLoading"
                @change="handleFormChange"
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
          </div>

          <!-- 第三步：附加信息 -->
          <div v-show="currentStep === 2" class="step-content">
            <a-form-item label="个人简介" field="description">
              <a-textarea
                v-model="formData.description"
                placeholder="请输入个人简介"
                :max-length="200"
                show-word-limit
                :auto-size="{ minRows: 4, maxRows: 8 }"
                @input="handleFormChange"
              />
            </a-form-item>

            <a-divider />

            <div class="form-summary">
              <h3>信息确认</h3>
              <a-descriptions :column="2" bordered>
                <a-descriptions-item label="用户名">
                  {{ formData.username }}
                </a-descriptions-item>
                <a-descriptions-item label="真实姓名">
                  {{ formData.realName }}
                </a-descriptions-item>
                <a-descriptions-item label="性别">
                  {{ genderMap[formData.gender] }}
                </a-descriptions-item>
                <a-descriptions-item label="年龄">
                  {{ formData.age }}
                </a-descriptions-item>
                <a-descriptions-item label="用户类型">
                  {{ scopeMap[formData.scope] }}
                </a-descriptions-item>
                <a-descriptions-item label="部门">
                  {{ formData.department }}
                </a-descriptions-item>
                <a-descriptions-item label="职位">
                  {{ formData.position }}
                </a-descriptions-item>
                <a-descriptions-item label="邮箱">
                  {{ formData.email }}
                </a-descriptions-item>
                <a-descriptions-item label="手机号">
                  {{ formData.phone }}
                </a-descriptions-item>
                <a-descriptions-item label="角色">
                  {{ getRoleNames(formData.roleIds) }}
                </a-descriptions-item>
                <a-descriptions-item label="个人简介" :span="2">
                  {{ formData.description || '无' }}
                </a-descriptions-item>
              </a-descriptions>
            </div>
          </div>
        </a-form>
      </div>

      <!-- 底部按钮 -->
      <div class="form-footer">
        <a-space>
          <a-button v-if="currentStep > 0" @click="handlePrevStep">
            上一步
          </a-button>
          <a-button
            v-if="currentStep < 2"
            type="primary"
            @click="handleNextStep"
          >
            下一步
          </a-button>
          <a-button
            v-if="currentStep === 2"
            type="primary"
            :loading="submitting"
            @click="handleSubmit"
          >
            提交
          </a-button>
        </a-space>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'
import { Message, Modal } from '@arco-design/web-vue'
import { getUser, createUser, modifyUser, type UserModel } from '@/api/user'
import { getRoleOptions, type RoleOptionModel } from '@/api/role'

const route = useRoute()
const router = useRouter()

// 判断是添加还是编辑
const isAdd = computed(() => route.params.action === 'add')
const userId = computed(() => route.params.id as string)

// 页面标题
const pageTitle = computed(() => {
  if (isAdd.value) {
    return '添加新用户'
  } else {
    return `编辑用户: ${formData.value.realName || userId.value}`
  }
})

// 当前步骤
const currentStep = ref(0)

// 表单是否被修改
const formChanged = ref(false)

// 表单数据
const formData = ref<any>({
  username: '',
  realName: '',
  email: '',
  phone: '',
  age: 18,
  scope: 'user',
  gender: 'other',
  department: '',
  position: '',
  description: '',
  password: '',
  confirmPassword: '',
  roleIds: []
})

// 原始数据（用于对比是否修改）
const originalData = ref<any>(null)

// 表单引用
const formRef = ref()

// 提交中
const submitting = ref(false)

// 映射
const genderMap: Record<string, string> = {
  male: '男',
  female: '女',
  other: '其他'
}

const scopeMap: Record<string, string> = {
  admin: '管理员',
  user: '普通用户',
  operator: '操作员',
  guest: '访客'
}

// 角色选项
const roleOptions = ref<RoleOptionModel[]>([])
const roleOptionsLoading = ref(false)

// 表单验证规则
const rules = {
  username: [
    { required: true, message: '请输入用户名' },
    { minLength: 3, message: '用户名至少3个字符' }
  ],
  realName: [{ required: true, message: '请输入真实姓名' }],
  gender: [{ required: true, message: '请选择性别' }],
  age: [{ required: true, message: '请输入年龄' }],
  scope: [{ required: true, message: '请选择用户类型' }],
  department: [{ required: true, message: '请输入部门' }],
  position: [{ required: true, message: '请输入职位' }],
  email: [
    { required: true, message: '请输入邮箱' },
    { type: 'email', message: '邮箱格式不正确' }
  ],
  phone: [
    { required: true, message: '请输入手机号' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' }
  ],
  password: [
    { required: isAdd.value, message: '请输入密码' },
    { minLength: 6, message: '密码至少6位' }
  ],
  confirmPassword: [
    { required: isAdd.value, message: '请确认密码' },
    {
      validator: (value: string, callback: (error?: string) => void) => {
        if (value !== formData.value.password) {
          callback('两次输入的密码不一致')
        } else {
          callback()
        }
      }
    }
  ]
}

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

// 获取角色名称
const getRoleNames = (roleIds: string[]) => {
  if (!roleIds || roleIds.length === 0) return '无'
  return roleOptions.value
    .filter((r) => roleIds.includes(r.value))
    .map((r) => r.label)
    .join('、')
}

// 加载用户数据（编辑模式）
const loadUserData = async () => {
  if (isAdd.value) return

  try {
    const { data } = await getUser(userId.value)
    formData.value = {
      username: data.username,
      realName: data.realName,
      email: data.email,
      phone: data.phone,
      age: data.age,
      scope: data.scope.code,
      gender: data.gender,
      department: data.department,
      position: data.position,
      description: data.description || '',
      roleIds: data.roles.map((r) => r.id),
      password: '',
      confirmPassword: ''
    }
    // 保存原始数据
    originalData.value = JSON.parse(JSON.stringify(formData.value))
    
    // 更新标签标题为真实姓名
    updateTabTitle(`编辑用户: ${data.realName}`)
  } catch (error) {
    console.error(error)
    Message.error('加载用户数据失败')
  }
}

// 更新当前标签标题
const updateTabTitle = (newTitle: string) => {
  const tabs = JSON.parse(localStorage.getItem('tabs') || '[]')
  const currentPath = route.fullPath
  const tabIndex = tabs.findIndex((t: any) => t.path === currentPath)
  
  if (tabIndex >= 0) {
    tabs[tabIndex].title = newTitle
    localStorage.setItem('tabs', JSON.stringify(tabs))
    window.dispatchEvent(new Event('storage'))
    document.title = newTitle + ' - Arco Vue Admin Box'
  }
}

// 表单变化处理
const handleFormChange = () => {
  if (!originalData.value) {
    formChanged.value = true
    return
  }
  
  // 对比当前数据和原始数据
  formChanged.value = JSON.stringify(formData.value) !== JSON.stringify(originalData.value)
}

// 下一步
const handleNextStep = async () => {
  // 验证当前步骤的字段
  const fieldsToValidate = getStepFields(currentStep.value)
  try {
    const errors = await formRef.value?.validateField(fieldsToValidate)
    if (errors) {
      return
    }
    currentStep.value++
  } catch (error) {
    console.error('验证失败:', error)
  }
}

// 上一步
const handlePrevStep = () => {
  currentStep.value--
}

// 获取每步需要验证的字段
const getStepFields = (step: number): string[] => {
  const fieldMap: Record<number, string[]> = {
    0: ['username', 'realName', 'gender', 'age', 'scope', 'department', 'position'],
    1: ['email', 'phone', ...(isAdd.value ? ['password', 'confirmPassword'] : [])],
    2: []
  }
  return fieldMap[step] || []
}

// 提交表单
const handleSubmit = async () => {
  try {
    const errors = await formRef.value?.validate()
    if (errors) {
      return
    }

    submitting.value = true

    const submitData: UserModel = {
      username: formData.value.username,
      realName: formData.value.realName,
      email: formData.value.email,
      phone: formData.value.phone,
      age: formData.value.age,
      scope: formData.value.scope,
      gender: formData.value.gender,
      department: formData.value.department,
      position: formData.value.position,
      description: formData.value.description
    }

    if (isAdd.value) {
      await createUser(submitData)
      Message.success('添加成功')
    } else {
      await modifyUser(userId.value, submitData)
      Message.success('修改成功')
    }

    // 标记为未修改
    formChanged.value = false
    
    // 延迟关闭标签页
    setTimeout(() => {
      closeCurrentTab()
    }, 500)
  } catch (error) {
    console.error(error)
    Message.error(isAdd.value ? '添加失败' : '修改失败')
  } finally {
    submitting.value = false
  }
}

// 关闭当前标签页
const closeCurrentTab = () => {
  // 获取当前tabs
  const tabs = JSON.parse(localStorage.getItem('tabs') || '[]')
  const currentPath = route.fullPath
  
  // 找到当前tab的索引
  const currentIndex = tabs.findIndex((t: any) => t.path === currentPath)
  
  if (currentIndex >= 0) {
    // 删除当前tab
    tabs.splice(currentIndex, 1)
    localStorage.setItem('tabs', JSON.stringify(tabs))
    window.dispatchEvent(new Event('storage'))
    
    // 跳转到列表页
    router.push('/complex-form')
  }
}

// 路由守卫：离开前确认
onBeforeRouteLeave((to, from, next) => {
  if (formChanged.value) {
    Modal.confirm({
      title: '提示',
      content: '当前页面信息已修改，是否关闭？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        next()
      },
      onCancel: () => {
        next(false)
      }
    })
  } else {
    next()
  }
})

// 监听浏览器关闭/刷新
const handleBeforeUnload = (e: BeforeUnloadEvent) => {
  if (formChanged.value) {
    e.preventDefault()
    e.returnValue = ''
  }
}

onMounted(() => {
  loadRoleOptions()
  loadUserData()
  
  // 保存初始数据
  if (isAdd.value) {
    originalData.value = JSON.parse(JSON.stringify(formData.value))
  }
  
  // 添加浏览器关闭监听
  window.addEventListener('beforeunload', handleBeforeUnload)
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload)
})
</script>

<style scoped lang="scss">
.form-page {
  padding: 20px;

  .page-header {
    margin-bottom: 16px;
  }

  .form-card {
    :deep(.arco-card-header) {
      border-bottom: 1px solid #e5e6eb;
    }

    .card-title {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 18px;
      font-weight: 600;
    }

    .steps-bar {
      margin: 32px auto;
      max-width: 600px;
      
      :deep(.arco-steps) {
        transform: scale(1.5);
        transform-origin: center;
        padding: 24px 0;
      }
    }

    .form-container {
      min-height: 400px;
      padding: 24px 0;
    }

    .step-content {
      max-width: 800px;
      margin: 0 auto;
    }

    .form-summary {
      margin-top: 24px;

      h3 {
        margin-bottom: 16px;
        font-size: 16px;
        font-weight: 600;
      }
    }

    .form-footer {
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid #e5e6eb;
      display: flex;
      justify-content: center;
    }
  }
}
</style>
