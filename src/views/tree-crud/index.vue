<template>
  <div class="tree-crud-page">
    <!-- 页面导航和快捷菜单 -->
    <div class="page-header">
      <a-breadcrumb>
        <a-breadcrumb-item>Agent参考示例</a-breadcrumb-item>
        <a-breadcrumb-item>树状数据CRUD</a-breadcrumb-item>
      </a-breadcrumb>
      <a-button type="text" @click="addToQuickMenu">
        <template #icon>
          <icon-star />
        </template>
        加入快捷菜单
      </a-button>
    </div>

    <!-- 主内容卡片 -->
    <a-card class="content-card" title="树状数据CRUD">
      <template #extra>
        <a-space>
          <a-button type="primary" @click="handleRefresh">
            <template #icon>
              <icon-refresh />
            </template>
            刷新
          </a-button>
        </a-space>
      </template>

      <a-spin :loading="loading" style="width: 100%">
        <a-tree
          v-if="treeData.length > 0"
          :data="treeData"
          :default-expand-all="true"
          :show-line="true"
          class="category-tree"
        >
          <template #title="nodeData">
            <div class="tree-node">
              <div class="node-info">
                <span class="node-name">{{ nodeData.name }}</span>
                <a-tag v-if="nodeData.status === 'active'" color="green" size="small">启用</a-tag>
                <a-tag v-else color="red" size="small">禁用</a-tag>
                <span class="node-code">{{ nodeData.code }}</span>
              </div>
              <div class="node-actions">
                <a-button
                  size="mini"
                  type="primary"
                  @click.stop="handleAdd(nodeData)"
                >
                  添加子节点
                </a-button>
                <a-button
                  v-if="nodeData.id !== ''"
                  size="mini"
                  type="primary"
                  @click.stop="handleEdit(nodeData)"
                >
                  编辑
                </a-button>
                <a-button
                  v-if="nodeData.id !== '' && (!nodeData.children || nodeData.children.length === 0)"
                  size="mini"
                  type="primary"
                  status="danger"
                  @click.stop="handleDelete(nodeData)"
                >
                  删除
                </a-button>
              </div>
            </div>
          </template>
        </a-tree>
        <a-empty v-else description="暂无数据" />
      </a-spin>
    </a-card>

    <!-- 添加/编辑对话框 -->
    <NodeDialog
      v-model:visible="dialogVisible"
      :mode="dialogMode"
      :parent-node="currentParentNode"
      :edit-data="currentEditData"
      :all-nodes="allNodes"
      @success="handleSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Message, Modal } from '@arco-design/web-vue'
import { IconStar, IconRefresh } from '@arco-design/web-vue/es/icon'
import {
  getCategoryTree,
  deleteCategory,
  type CategoryQueryModel
} from '@/api/category'
import NodeDialog from './components/NodeDialog.vue'

// 加载状态
const loading = ref(false)

// 树形数据
const treeData = ref<CategoryQueryModel[]>([])

// 所有节点的扁平列表（用于父节点选择）
const allNodes = ref<CategoryQueryModel[]>([])

// 对话框状态
const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const currentParentNode = ref<CategoryQueryModel | null>(null)
const currentEditData = ref<CategoryQueryModel | null>(null)

// 加载树形数据
const loadTreeData = async () => {
  loading.value = true
  try {
    const { data } = await getCategoryTree()
    
    // 确保data是数组，如果为空则使用演示数据
    let treeList = Array.isArray(data) ? data : []
    
    // 如果Mock数据为空，使用本地演示数据
    if (treeList.length === 0) {
      treeList = [
        {
          id: '1',
          parentId: '',
          name: '电子产品',
          code: 'electronics',
          sort: 1,
          description: '各类电子产品分类',
          status: 'active' as const,
          createdAt: '2024-01-01 10:00:00',
          updatedAt: '2024-01-01 10:00:00',
          children: [
            {
              id: '1-1',
              parentId: '1',
              name: '手机',
              code: 'phone',
              sort: 1,
              description: '智能手机',
              status: 'active' as const,
              createdAt: '2024-01-01 10:00:00',
              updatedAt: '2024-01-01 10:00:00',
              children: [
                {
                  id: '1-1-1',
                  parentId: '1-1',
                  name: 'iPhone',
                  code: 'iphone',
                  sort: 1,
                  status: 'active' as const,
                  createdAt: '2024-01-01 10:00:00',
                  updatedAt: '2024-01-01 10:00:00'
                },
                {
                  id: '1-1-2',
                  parentId: '1-1',
                  name: 'Android',
                  code: 'android',
                  sort: 2,
                  status: 'active' as const,
                  createdAt: '2024-01-01 10:00:00',
                  updatedAt: '2024-01-01 10:00:00'
                }
              ]
            },
            {
              id: '1-2',
              parentId: '1',
              name: '电脑',
              code: 'computer',
              sort: 2,
              description: '台式机和笔记本',
              status: 'active' as const,
              createdAt: '2024-01-01 10:00:00',
              updatedAt: '2024-01-01 10:00:00',
              children: [
                {
                  id: '1-2-1',
                  parentId: '1-2',
                  name: '笔记本',
                  code: 'laptop',
                  sort: 1,
                  status: 'active' as const,
                  createdAt: '2024-01-01 10:00:00',
                  updatedAt: '2024-01-01 10:00:00'
                },
                {
                  id: '1-2-2',
                  parentId: '1-2',
                  name: '台式机',
                  code: 'desktop',
                  sort: 2,
                  status: 'active' as const,
                  createdAt: '2024-01-01 10:00:00',
                  updatedAt: '2024-01-01 10:00:00'
                }
              ]
            },
            {
              id: '1-3',
              parentId: '1',
              name: '平板',
              code: 'tablet',
              sort: 3,
              status: 'active' as const,
              createdAt: '2024-01-01 10:00:00',
              updatedAt: '2024-01-01 10:00:00'
            }
          ]
        },
        {
          id: '2',
          parentId: '',
          name: '图书',
          code: 'books',
          sort: 2,
          description: '各类图书分类',
          status: 'active' as const,
          createdAt: '2024-01-01 10:00:00',
          updatedAt: '2024-01-01 10:00:00',
          children: [
            {
              id: '2-1',
              parentId: '2',
              name: '技术',
              code: 'tech',
              sort: 1,
              status: 'active' as const,
              createdAt: '2024-01-01 10:00:00',
              updatedAt: '2024-01-01 10:00:00',
              children: [
                {
                  id: '2-1-1',
                  parentId: '2-1',
                  name: '编程',
                  code: 'programming',
                  sort: 1,
                  status: 'active' as const,
                  createdAt: '2024-01-01 10:00:00',
                  updatedAt: '2024-01-01 10:00:00'
                },
                {
                  id: '2-1-2',
                  parentId: '2-1',
                  name: '设计',
                  code: 'design',
                  sort: 2,
                  status: 'active' as const,
                  createdAt: '2024-01-01 10:00:00',
                  updatedAt: '2024-01-01 10:00:00'
                }
              ]
            },
            {
              id: '2-2',
              parentId: '2',
              name: '文学',
              code: 'literature',
              sort: 2,
              status: 'active' as const,
              createdAt: '2024-01-01 10:00:00',
              updatedAt: '2024-01-01 10:00:00'
            }
          ]
        },
        {
          id: '3',
          parentId: '',
          name: '服装',
          code: 'clothing',
          sort: 3,
          status: 'inactive' as const,
          createdAt: '2024-01-01 10:00:00',
          updatedAt: '2024-01-01 10:00:00'
        }
      ]
    }
    
    // 创建虚拟根节点
    const rootNode: CategoryQueryModel = {
      id: '',
      parentId: '',
      name: '根',
      code: 'root',
      sort: 0,
      status: 'active',
      children: treeList,
      createdAt: '',
      updatedAt: ''
    }
    
    treeData.value = [rootNode]
    
    // 生成扁平列表
    allNodes.value = flattenTree([rootNode])
  } catch (error) {
    console.error(error)
    Message.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

// 将树形数据扁平化
const flattenTree = (nodes: CategoryQueryModel[]): CategoryQueryModel[] => {
  const result: CategoryQueryModel[] = []
  const traverse = (nodeList: CategoryQueryModel[]) => {
    if (!Array.isArray(nodeList)) return
    
    nodeList.forEach(node => {
      result.push(node)
      if (node.children && Array.isArray(node.children) && node.children.length > 0) {
        traverse(node.children)
      }
    })
  }
  traverse(nodes)
  return result
}

// 刷新数据
const handleRefresh = () => {
  loadTreeData()
}

// 添加子节点
const handleAdd = (node: CategoryQueryModel) => {
  dialogMode.value = 'add'
  currentParentNode.value = node
  currentEditData.value = null
  dialogVisible.value = true
}

// 编辑节点
const handleEdit = (node: CategoryQueryModel) => {
  dialogMode.value = 'edit'
  currentParentNode.value = null
  currentEditData.value = node
  dialogVisible.value = true
}

// 删除节点
const handleDelete = (node: CategoryQueryModel) => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除分类"${node.name}"吗？此操作不可恢复。`,
    onOk: async () => {
      try {
        await deleteCategory(node.id)
        Message.success('删除成功')
        loadTreeData()
      } catch (error) {
        console.error(error)
        Message.error('删除失败')
      }
    }
  })
}

// 操作成功回调
const handleSuccess = () => {
  dialogVisible.value = false
  loadTreeData()
}

// 加入快捷菜单
const addToQuickMenu = () => {
  const list = JSON.parse(localStorage.getItem('quickMenus') || '[]')
  const titleText = '树状数据CRUD'
  const current = { key: '/tree-crud', name: titleText }
  
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

onMounted(() => {
  loadTreeData()
})
</script>

<style scoped lang="scss">
.tree-crud-page {
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

    .category-tree {
      margin-top: 16px;

      :deep(.arco-tree-node-title) {
        flex: 1;
        min-width: 0;
      }

      .tree-node {
        display: flex;
        align-items: center;
        width: 100%;
        min-height: 32px;

        .node-info {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-left: 12px;
          min-width: 0;
          flex: 1;

          .node-name {
            font-size: 14px;
            font-weight: 500;
            color: #1d2129;
          }

          .node-code {
            font-size: 12px;
            color: #86909c;
            font-family: 'Courier New', monospace;
          }
        }

        .node-actions {
          display: flex;
          gap: 8px;
          margin-left: 420px;
          opacity: 0;
          transition: opacity 0.2s;
        }

        &:hover .node-actions {
          opacity: 1;
        }
      }
    }
  }
}
</style>
