<template>
  <a-modal
    v-model:visible="visible"
    title="更换头像"
    :width="500"
    @cancel="handleCancel"
    @before-ok="handleSubmit"
  >
    <a-form :model="formData" layout="vertical">
      <a-form-item label="头像预览">
        <div class="avatar-preview">
          <a-avatar :size="120">
            <img v-if="formData.avatarUrl" :src="formData.avatarUrl" alt="avatar" />
            <icon-user v-else />
          </a-avatar>
        </div>
      </a-form-item>
      
      <a-form-item label="头像URL" field="avatarUrl">
        <a-input
          v-model="formData.avatarUrl"
          placeholder="请输入头像图片URL"
          allow-clear
        />
      </a-form-item>
      
      <a-alert type="info" style="margin-top: 12px">
        提示：请输入有效的图片URL地址，或者上传图片到图床获取URL
      </a-alert>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Message } from '@arco-design/web-vue'
import { IconUser } from '@arco-design/web-vue/es/icon'
import { updateAvatar } from '@/api/user'

const props = defineProps<{
  visible: boolean
  currentAvatar?: string
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  success: []
}>()

const visible = ref(props.visible)
const formData = ref({
  avatarUrl: ''
})

watch(() => props.visible, (val) => {
  visible.value = val
  if (val) {
    formData.value.avatarUrl = props.currentAvatar || ''
  }
})

watch(visible, (val) => {
  emit('update:visible', val)
})

const handleCancel = () => {
  visible.value = false
}

const handleSubmit = async () => {
  if (!formData.value.avatarUrl) {
    Message.warning('请输入头像URL')
    return false
  }
  
  try {
    await updateAvatar(formData.value.avatarUrl)
    Message.success('头像更新成功')
    emit('success')
    visible.value = false
    return true
  } catch (error) {
    console.error('更新头像失败:', error)
    return false
  }
}
</script>

<style scoped lang="scss">
.avatar-preview {
  display: flex;
  justify-content: center;
  padding: 20px;
  background: #f7f8fa;
  border-radius: 8px;
  
  :deep(.arco-avatar) {
    border: 4px solid white;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}
</style>
