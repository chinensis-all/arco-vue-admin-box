<template>
  <a-modal
    v-model:visible="visible"
    title="编辑联系方式"
    :width="500"
    @cancel="handleCancel"
    @before-ok="handleSubmit"
  >
    <a-form :model="formData" :rules="rules" layout="vertical" ref="formRef">
      <a-form-item label="邮箱" field="email">
        <a-input
          v-model="formData.email"
          placeholder="请输入邮箱"
          allow-clear
        >
          <template #prefix>
            <icon-email />
          </template>
        </a-input>
      </a-form-item>
      
      <a-form-item label="手机号" field="phone">
        <a-input
          v-model="formData.phone"
          placeholder="请输入手机号"
          allow-clear
        >
          <template #prefix>
            <icon-phone />
          </template>
        </a-input>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Message } from '@arco-design/web-vue'
import { IconEmail, IconPhone } from '@arco-design/web-vue/es/icon'
import { updateContactInfo, type UserQueryModel, type ContactInfoData } from '@/api/user'

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
const formData = ref<ContactInfoData>({
  email: '',
  phone: ''
})

const rules = {
  email: [
    { required: true, message: '请输入邮箱' },
    { type: 'email', message: '邮箱格式不正确' }
  ],
  phone: [
    { required: true, message: '请输入手机号' },
    { 
      pattern: /^1[3-9]\d{9}$/, 
      message: '手机号格式不正确' 
    }
  ]
}

watch(() => props.visible, (val) => {
  visible.value = val
  if (val && props.userInfo) {
    formData.value = {
      email: props.userInfo.email,
      phone: props.userInfo.phone
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
    await updateContactInfo(formData.value)
    Message.success('联系方式更新成功')
    emit('success')
    visible.value = false
    return true
  } catch (error) {
    console.error('更新联系方式失败:', error)
    return false
  }
}
</script>
