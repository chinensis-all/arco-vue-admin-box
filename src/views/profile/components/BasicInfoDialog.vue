<template>
  <a-modal
    v-model:visible="visible"
    title="编辑基础信息"
    :width="600"
    @cancel="handleCancel"
    @before-ok="handleSubmit"
  >
    <a-form :model="formData" :rules="rules" layout="vertical" ref="formRef">
      <a-form-item label="真实姓名" field="realName">
        <a-input
          v-model="formData.realName"
          placeholder="请输入真实姓名"
          allow-clear
        />
      </a-form-item>
      
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="性别" field="gender">
            <a-select v-model="formData.gender" placeholder="请选择性别">
              <a-option value="male">男</a-option>
              <a-option value="female">女</a-option>
              <a-option value="other">其他</a-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="年龄" field="age">
            <a-input-number
              v-model="formData.age"
              placeholder="请输入年龄"
              :min="1"
              :max="150"
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
      </a-row>
      
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="部门" field="department">
            <a-input
              v-model="formData.department"
              placeholder="请输入部门"
              allow-clear
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="职位" field="position">
            <a-input
              v-model="formData.position"
              placeholder="请输入职位"
              allow-clear
            />
          </a-form-item>
        </a-col>
      </a-row>
      
      <a-form-item label="个人简介" field="description">
        <a-textarea
          v-model="formData.description"
          placeholder="请输入个人简介"
          :max-length="200"
          show-word-limit
          :auto-size="{ minRows: 3, maxRows: 5 }"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Message } from '@arco-design/web-vue'
import { updateBasicInfo, type UserQueryModel, type BasicInfoData } from '@/api/user'

const props = defineProps<{
  visible: boolean
  userInfo?: UserQueryModel
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  success: []
}>()

const visible = ref(props.visible)
const formRef = ref()
const formData = ref<BasicInfoData>({
  realName: '',
  gender: 'other',
  age: 18,
  department: '',
  position: '',
  description: ''
})

const rules = {
  realName: [{ required: true, message: '请输入真实姓名' }],
  gender: [{ required: true, message: '请选择性别' }],
  age: [{ required: true, message: '请输入年龄' }],
  department: [{ required: true, message: '请输入部门' }],
  position: [{ required: true, message: '请输入职位' }]
}

watch(() => props.visible, (val) => {
  visible.value = val
  if (val && props.userInfo) {
    formData.value = {
      realName: props.userInfo.realName,
      gender: props.userInfo.gender,
      age: props.userInfo.age,
      department: props.userInfo.department,
      position: props.userInfo.position,
      description: props.userInfo.description
    }
  }
})

watch(visible, (val) => {
  emit('update:visible', val)
})

const handleCancel = () => {
  visible.value = false
}

const handleSubmit = async () => {
  const valid = await formRef.value?.validate()
  if (!valid) {
    return false
  }
  
  try {
    await updateBasicInfo(formData.value)
    Message.success('基础信息更新成功')
    emit('success')
    visible.value = false
    return true
  } catch (error) {
    console.error('更新基础信息失败:', error)
    return false
  }
}
</script>
