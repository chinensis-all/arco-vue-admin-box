<template>
  <a-modal
    :visible="visible"
    title="分配角色"
    :width="500"
    @cancel="handleCancel"
    @ok="handleSubmit"
  >
    <a-spin :loading="loading" style="width: 100%">
      <a-form layout="vertical">
        <a-form-item label="选择角色">
          <a-checkbox-group v-model="selectedRoleIds">
            <a-checkbox
              v-for="role in roleOptions"
              :key="role.value"
              :value="role.value"
              :style="{ display: 'block', marginBottom: '8px' }"
            >
              {{ role.label }}
            </a-checkbox>
          </a-checkbox-group>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Message } from '@arco-design/web-vue'
import { getRoleOptions, type RoleOptionModel } from '@/api/role'
import { modifyUserRoles } from '@/api/user'

interface Props {
  visible: boolean
  userId: string
  currentRoleIds: string[]
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  userId: '',
  currentRoleIds: () => []
})

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'success'): void
}>()

// 加载状态
const loading = ref(false)

// 角色选项列表
const roleOptions = ref<RoleOptionModel[]>([])

// 选中的角色ID列表
const selectedRoleIds = ref<string[]>([])

// 监听visible变化，加载角色选项
watch(
  () => props.visible,
  async (val) => {
    if (val) {
      selectedRoleIds.value = [...props.currentRoleIds]
      await loadRoleOptions()
    }
  }
)

/**
 * 加载角色选项
 */
const loadRoleOptions = async () => {
  try {
    loading.value = true
    const { data } = await getRoleOptions({})
    roleOptions.value = data
  } catch (error) {
    Message.error('加载角色列表失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

/**
 * 取消
 */
const handleCancel = () => {
  emit('update:visible', false)
}

/**
 * 提交
 */
const handleSubmit = async () => {
  try {
    loading.value = true
    await modifyUserRoles(props.userId, selectedRoleIds.value)
    Message.success('角色分配成功')
    emit('update:visible', false)
    emit('success')
  } catch (error) {
    Message.error('角色分配失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>
