<template>
  <a-modal
    v-model:visible="visible"
    title="修改密码"
    :width="500"
    @cancel="handleCancel"
    @before-ok="handleSubmit"
  >
    <a-form :model="formData" :rules="rules" layout="vertical" ref="formRef">
      <a-form-item label="原密码" field="oldPassword">
        <a-input-password
          v-model="formData.oldPassword"
          placeholder="请输入原密码"
          allow-clear
        >
          <template #prefix>
            <icon-lock />
          </template>
        </a-input-password>
      </a-form-item>
      
      <a-form-item label="新密码" field="newPassword">
        <a-input-password
          v-model="formData.newPassword"
          placeholder="请输入新密码"
          allow-clear
        >
          <template #prefix>
            <icon-lock />
          </template>
        </a-input-password>
      </a-form-item>
      
      <a-form-item label="确认新密码" field="confirmPassword">
        <a-input-password
          v-model="formData.confirmPassword"
          placeholder="请再次输入新密码"
          allow-clear
        >
          <template #prefix>
            <icon-lock />
          </template>
        </a-input-password>
      </a-form-item>
      
      <a-alert type="warning" style="margin-top: 12px">
        密码长度至少6位，建议包含字母、数字和特殊字符
      </a-alert>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Message } from '@arco-design/web-vue'
import { IconLock } from '@arco-design/web-vue/es/icon'
import { changePassword, type ChangePasswordData } from '@/api/user'

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  success: []
}>()

const visible = ref(props.visible)
const formRef = ref()
const formData = ref<ChangePasswordData>({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const validateConfirmPassword = (value: string, callback: (error?: string) => void) => {
  if (value !== formData.value.newPassword) {
    callback('两次输入的密码不一致')
  } else {
    callback()
  }
}

const rules = {
  oldPassword: [
    { required: true, message: '请输入原密码' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码' },
    { minLength: 6, message: '密码长度至少6位' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码' },
    { validator: validateConfirmPassword }
  ]
}

watch(() => props.visible, (val) => {
  visible.value = val
  if (val) {
    formData.value = {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
    formRef.value?.clearValidate()
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
    await changePassword(formData.value)
    Message.success('密码修改成功')
    emit('success')
    visible.value = false
    return true
  } catch (error) {
    console.error('修改密码失败:', error)
    return false
  }
}
</script>
