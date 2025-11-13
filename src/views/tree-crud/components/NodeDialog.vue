<template>
  <a-modal
    :visible="visible"
    :title="modalTitle"
    :width="600"
    @cancel="handleCancel"
    @before-ok="handleSubmit"
  >
    <a-form :model="formData" :rules="rules" layout="vertical" ref="formRef">
      <a-form-item label="父节点" field="parentId">
        <a-select
          v-model="formData.parentId"
          placeholder="请选择父节点"
          :disabled="mode === 'add'"
        >
          <a-option
            v-for="node in parentOptions"
            :key="node.id"
            :value="node.id"
          >
            {{ node.name }}
          </a-option>
        </a-select>
      </a-form-item>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="分类名称" field="name">
            <a-input
              v-model="formData.name"
              placeholder="请输入分类名称"
              allow-clear
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="分类编码" field="code">
            <a-input
              v-model="formData.code"
              placeholder="请输入分类编码"
              allow-clear
            />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="排序" field="sort">
            <a-input-number
              v-model="formData.sort"
              placeholder="请输入排序"
              :min="0"
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="状态" field="status">
            <a-select v-model="formData.status" placeholder="请选择状态">
              <a-option value="active">启用</a-option>
              <a-option value="inactive">禁用</a-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>

      <a-form-item label="描述" field="description">
        <a-textarea
          v-model="formData.description"
          placeholder="请输入描述"
          :max-length="200"
          show-word-limit
          :auto-size="{ minRows: 3, maxRows: 6 }"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Message } from '@arco-design/web-vue'
import type { FormInstance } from '@arco-design/web-vue'
import {
  createCategory,
  modifyCategory,
  type CategoryModel,
  type CategoryQueryModel
} from '@/api/category'

const props = defineProps<{
  visible: boolean
  mode: 'add' | 'edit'
  parentNode: CategoryQueryModel | null
  editData: CategoryQueryModel | null
  allNodes: CategoryQueryModel[]
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'success'): void
}>()

// 表单引用
const formRef = ref<FormInstance>()

// 表单数据
const formData = ref<CategoryModel>({
  parentId: '',
  name: '',
  code: '',
  sort: 0,
  description: '',
  status: 'active'
})

// 表单验证规则
const rules = {
  parentId: [{ required: true, message: '请选择父节点' }],
  name: [{ required: true, message: '请输入分类名称' }],
  code: [{ required: true, message: '请输入分类编码' }],
  sort: [{ required: true, message: '请输入排序' }],
  status: [{ required: true, message: '请选择状态' }]
}

// 对话框标题
const modalTitle = computed(() => {
  return props.mode === 'add' ? '添加子节点' : '编辑节点'
})

// 父节点选项
const parentOptions = computed(() => {
  if (props.mode === 'add') {
    // 添加模式：只显示当前父节点
    return props.parentNode ? [props.parentNode] : []
  } else {
    // 编辑模式：显示根节点和所有节点（排除自己和自己的子节点）
    const editId = props.editData?.id
    return props.allNodes.filter(node => {
      // 排除自己
      if (node.id === editId) return false
      // 排除自己的子孙节点（通过检查是否在自己的children树中）
      if (editId && isDescendant(props.editData!, node)) return false
      return true
    })
  }
})

// 检查node是否是parent的子孙节点
const isDescendant = (parent: CategoryQueryModel, node: CategoryQueryModel): boolean => {
  if (!parent.children || parent.children.length === 0) return false
  
  for (const child of parent.children) {
    if (child.id === node.id) return true
    if (isDescendant(child, node)) return true
  }
  
  return false
}

// 监听对话框打开
watch(() => props.visible, (val) => {
  if (val) {
    if (props.mode === 'add') {
      // 添加模式：重置表单，设置父节点
      formData.value = {
        parentId: props.parentNode?.id || '',
        name: '',
        code: '',
        sort: 0,
        description: '',
        status: 'active'
      }
    } else {
      // 编辑模式：填充数据
      if (props.editData) {
        formData.value = {
          parentId: props.editData.parentId,
          name: props.editData.name,
          code: props.editData.code,
          sort: props.editData.sort,
          description: props.editData.description || '',
          status: props.editData.status
        }
      }
    }
    
    // 重置验证状态
    formRef.value?.clearValidate()
  }
})

// 取消
const handleCancel = () => {
  emit('update:visible', false)
}

// 提交
const handleSubmit = async () => {
  const valid = await formRef.value?.validate()
  if (!valid) {
    return false
  }

  try {
    if (props.mode === 'add') {
      await createCategory(formData.value)
      Message.success('添加成功')
    } else {
      await modifyCategory(props.editData!.id, formData.value)
      Message.success('修改成功')
    }
    emit('success')
    return true
  } catch (error) {
    console.error(error)
    Message.error(props.mode === 'add' ? '添加失败' : '修改失败')
    return false
  }
}
</script>

<style scoped lang="scss">
// 可以添加自定义样式
</style>
