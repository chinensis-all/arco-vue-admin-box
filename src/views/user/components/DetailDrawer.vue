<template>
  <a-drawer
    :visible="visible"
    :title="isEdit ? '编辑用户' : '添加新用户'"
    :width="600"
    :mask-closable="false"
    @cancel="handleCancel"
    @ok="handleSubmit"
  >
    <a-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      layout="vertical"
      :style="{ paddingRight: '20px' }"
    >
      <!-- 用户名 -->
      <a-form-item field="username" label="用户名">
        <a-input
          v-model="formData.username"
          placeholder="请输入用户名"
          :max-length="20"
          show-word-limit
        />
      </a-form-item>

      <!-- 真实姓名 -->
      <a-form-item field="realName" label="真实姓名">
        <a-input
          v-model="formData.realName"
          placeholder="请输入真实姓名"
          :max-length="10"
          show-word-limit
        />
      </a-form-item>

      <!-- 邮箱 -->
      <a-form-item field="email" label="邮箱">
        <a-input
          v-model="formData.email"
          placeholder="请输入邮箱地址"
          :max-length="50"
        />
      </a-form-item>

      <!-- 手机号 -->
      <a-form-item field="phone" label="手机号">
        <a-input
          v-model="formData.phone"
          placeholder="请输入手机号"
          :max-length="11"
        />
      </a-form-item>

      <!-- 年龄 -->
      <a-form-item field="age" label="年龄">
        <a-input-number
          v-model="formData.age"
          placeholder="请输入年龄"
          :min="18"
          :max="100"
          :style="{ width: '100%' }"
        />
      </a-form-item>

      <!-- 性别 -->
      <a-form-item field="gender" label="性别">
        <a-radio-group v-model="formData.gender">
          <a-radio value="male">男</a-radio>
          <a-radio value="female">女</a-radio>
          <a-radio value="other">其他</a-radio>
        </a-radio-group>
      </a-form-item>

      <!-- 用户类型 -->
      <a-form-item field="scope" label="用户类型">
        <a-select v-model="formData.scope" placeholder="请选择用户类型">
          <a-option value="admin">管理员</a-option>
          <a-option value="user">普通用户</a-option>
          <a-option value="operator">操作员</a-option>
          <a-option value="guest">访客</a-option>
        </a-select>
      </a-form-item>

      <!-- 部门 -->
      <a-form-item field="department" label="部门">
        <a-input
          v-model="formData.department"
          placeholder="请输入部门"
          :max-length="30"
        />
      </a-form-item>

      <!-- 职位 -->
      <a-form-item field="position" label="职位">
        <a-input
          v-model="formData.position"
          placeholder="请输入职位"
          :max-length="30"
        />
      </a-form-item>

      <!-- 描述 -->
      <a-form-item field="description" label="描述">
        <a-textarea
          v-model="formData.description"
          placeholder="请输入描述信息"
          :max-length="200"
          show-word-limit
          :auto-size="{ minRows: 3, maxRows: 5 }"
        />
      </a-form-item>
    </a-form>
  </a-drawer>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { Message } from '@arco-design/web-vue'
import type { FormInstance } from '@arco-design/web-vue'
import { createUser, modifyUser, getUser, type UserModel } from '@/api/user'

interface Props {
  visible: boolean
  action: 'add' | 'edit'
  userId?: string
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  action: 'add',
  userId: ''
})

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'success'): void
}>()

// 表单引用
const formRef = ref<FormInstance>()

// 是否编辑模式
const isEdit = ref(false)

// 提交加载状态
const submitLoading = ref(false)

// 表单数据
const formData = reactive<UserModel>({
  username: '',
  email: '',
  phone: '',
  realName: '',
  age: 18,
  scope: 'user',
  gender: 'male',
  department: '',
  position: '',
  description: ''
})

// 表单验证规则
const rules = {
  username: [
    { required: true, message: '请输入用户名' },
    { minLength: 3, message: '用户名至少3个字符' },
    { maxLength: 20, message: '用户名最多20个字符' },
    {
      match: /^[a-zA-Z0-9_]+$/,
      message: '用户名只能包含字母、数字和下划线'
    }
  ],
  realName: [
    { required: true, message: '请输入真实姓名' },
    { minLength: 2, message: '姓名至少2个字符' },
    { maxLength: 10, message: '姓名最多10个字符' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址' },
    {
      match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: '请输入正确的邮箱格式'
    }
  ],
  phone: [
    { required: true, message: '请输入手机号' },
    {
      match: /^1[3-9]\d{9}$/,
      message: '请输入正确的手机号格式'
    }
  ],
  age: [
    { required: true, message: '请输入年龄' },
    {
      type: 'number',
      min: 18,
      message: '年龄不能小于18岁'
    },
    {
      type: 'number',
      max: 100,
      message: '年龄不能大于100岁'
    }
  ],
  gender: [{ required: true, message: '请选择性别' }],
  scope: [{ required: true, message: '请选择用户类型' }],
  department: [
    { required: true, message: '请输入部门' },
    { maxLength: 30, message: '部门名称最多30个字符' }
  ],
  position: [
    { required: true, message: '请输入职位' },
    { maxLength: 30, message: '职位名称最多30个字符' }
  ],
  description: [
    { maxLength: 200, message: '描述最多200个字符' }
  ]
}

// 监听visible变化，加载数据
watch(
  () => props.visible,
  async (val) => {
    if (val) {
      isEdit.value = props.action === 'edit'
      
      if (isEdit.value && props.userId) {
        // 编辑模式，加载用户数据
        await loadUserData()
      } else {
        // 添加模式，重置表单
        resetForm()
      }
    }
  }
)

/**
 * 加载用户数据
 */
const loadUserData = async () => {
  try {
    const { data } = await getUser(props.userId!)
    const user = data

    // 将查询模型转换为命令模型
    Object.assign(formData, {
      username: user.username,
      email: user.email,
      phone: user.phone,
      realName: user.realName,
      age: user.age,
      scope: user.scope.code, // 从值对象中提取code
      gender: user.gender,
      department: user.department,
      position: user.position,
      description: user.description
    })
  } catch (error) {
    Message.error('加载用户数据失败')
    console.error(error)
  }
}

/**
 * 重置表单
 */
const resetForm = () => {
  Object.assign(formData, {
    username: '',
    email: '',
    phone: '',
    realName: '',
    age: 18,
    scope: 'user',
    gender: 'male',
    department: '',
    position: '',
    description: ''
  })
  formRef.value?.clearValidate()
}

/**
 * 取消
 */
const handleCancel = () => {
  emit('update:visible', false)
}

/**
 * 提交表单
 */
const handleSubmit = async () => {
  try {
    // 表单验证
    const valid = await formRef.value?.validate()
    if (!valid) {
      submitLoading.value = true

      if (isEdit.value) {
        // 修改用户
        await modifyUser(props.userId!, formData)
        Message.success('修改成功')
      } else {
        // 创建用户
        await createUser(formData)
        Message.success('创建成功')
      }

      emit('update:visible', false)
      emit('success')
    }
  } catch (error) {
    Message.error(isEdit.value ? '修改失败' : '创建失败')
    console.error(error)
  } finally {
    submitLoading.value = false
  }
}
</script>
