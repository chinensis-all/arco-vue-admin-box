# 树状数据CRUD开发指南

本文档是AI Agent开发树状数据CRUD功能的参考模板，涵盖了树形数据的展示、增删改查的完整开发流程。

## 一、功能概述

树状数据CRUD适用于具有层级关系的数据管理场景，如分类管理、组织架构、菜单管理等。

**核心特点：**
- 使用树形控件展示层级数据
- 不分页，完整展示树形结构
- 支持添加子节点、编辑节点、删除节点
- 父节点选择时排除自身及子孙节点（避免循环引用）
- 只有叶子节点可以删除

## 二、目录结构

```
src/views/tree-crud/
├── index.vue              # 树形列表页
└── components/
    └── NodeDialog.vue     # 添加/编辑对话框

src/api/
└── category.ts            # 分类API定义（示例）

mock/
└── category.ts            # Mock数据
```

## 三、数据模型设计

### 3.1 查询模型（树形结构）

```typescript
export interface CategoryQueryModel {
  id: string
  parentId: string
  name: string
  code: string
  sort: number
  description?: string
  status: 'active' | 'inactive'
  children?: CategoryQueryModel[]  // 子节点
  createdAt: string
  updatedAt: string
}
```

**特点：**
- 包含 `children` 字段，表示子节点数组
- 用于展示和编辑时的数据回显

### 3.2 命令模型（扁平结构）

```typescript
export interface CategoryModel {
  id?: string
  parentId: string  // 父节点ID
  name: string
  code: string
  sort: number
  description?: string
  status: 'active' | 'inactive'
}
```

**特点：**
- 不包含 `children` 字段
- 用于创建和修改操作

## 四、API接口定义

### 4.1 基础CRUD接口

```typescript
// 获取分类树（不分页）
export function getCategoryTree() {
  return axios.get<CategoryQueryModel[]>('/api/categories/tree')
}

// 获取单个分类
export function getCategory(id: string) {
  return axios.get<CategoryQueryModel>(`/api/categories/${id}`)
}

// 创建分类
export function createCategory(data: CategoryModel) {
  return axios.post('/api/categories', data)
}

// 修改分类
export function modifyCategory(id: string, data: CategoryModel) {
  return axios.put(`/api/categories/${id}`, data)
}

// 删除分类
export function deleteCategory(id: string) {
  return axios.delete(`/api/categories/${id}`)
}
```

### 4.2 辅助接口

```typescript
// 获取所有分类（扁平列表，用于父节点选择）
export function getCategoryList() {
  return axios.get<CategoryQueryModel[]>('/api/categories/list')
}
```

## 五、树形列表页开发

### 5.1 虚拟根节点

为了统一操作，需要创建一个虚拟根节点包装后端返回的数据：

```typescript
const loadTreeData = async () => {
  const { data } = await getCategoryTree()
  
  // 创建虚拟根节点
  const rootNode: CategoryQueryModel = {
    id: '',          // 空字符串表示根节点
    parentId: '',
    name: '根',
    code: 'root',
    sort: 0,
    status: 'active',
    children: data,  // 后端返回的数据作为子节点
    createdAt: '',
    updatedAt: ''
  }
  
  treeData.value = [rootNode]
}
```

**为什么需要虚拟根节点？**
- 统一操作：所有一级分类也可以点击"添加子节点"
- 简化逻辑：避免特殊处理根级别的添加操作

### 5.2 树形控件配置

```vue
<a-tree
  :data="treeData"
  :default-expand-all="true"
  :show-line="true"
  class="category-tree"
>
  <template #title="nodeData">
    <div class="tree-node">
      <div class="node-info">
        <span class="node-name">{{ nodeData.name }}</span>
        <a-tag>{{ nodeData.code }}</a-tag>
      </div>
      <div class="node-actions">
        <!-- 操作按钮 -->
      </div>
    </div>
  </template>
</a-tree>
```

**关键属性：**
- `default-expand-all`: 默认展开所有节点
- `show-line`: 显示连接线
- `#title` 插槽：自定义节点渲染

### 5.3 节点操作按钮

```vue
<div class="node-actions">
  <!-- 所有节点都可以添加子节点 -->
  <a-button
    size="mini"
    type="primary"
    @click.stop="handleAdd(nodeData)"
  >
    添加子节点
  </a-button>
  
  <!-- 除了根节点，其他节点可以编辑 -->
  <a-button
    v-if="nodeData.id !== ''"
    size="mini"
    type="primary"
    @click.stop="handleEdit(nodeData)"
  >
    编辑
  </a-button>
  
  <!-- 除了根节点，没有子节点的节点可以删除 -->
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
```

**按钮显示规则：**
1. **添加子节点**：所有节点都显示
2. **编辑**：`id !== ''`（排除虚拟根节点）
3. **删除**：`id !== ''` 且 `children.length === 0`（只有叶子节点）

**重要：** 使用 `@click.stop` 阻止事件冒泡，避免触发树节点的展开/收起

### 5.4 删除确认

```typescript
const handleDelete = (node: CategoryQueryModel) => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除分类"${node.name}"吗？此操作不可恢复。`,
    onOk: async () => {
      await deleteCategory(node.id)
      Message.success('删除成功')
      loadTreeData()  // 刷新数据
    }
  })
}
```

### 5.5 扁平化树形数据

用于生成所有节点的扁平列表（供父节点选择使用）：

```typescript
const flattenTree = (nodes: CategoryQueryModel[]): CategoryQueryModel[] => {
  const result: CategoryQueryModel[] = []
  const traverse = (nodeList: CategoryQueryModel[]) => {
    nodeList.forEach(node => {
      result.push(node)
      if (node.children && node.children.length > 0) {
        traverse(node.children)
      }
    })
  }
  traverse(nodes)
  return result
}
```

## 六、对话框组件开发

### 6.1 组件Props

```typescript
const props = defineProps<{
  visible: boolean
  mode: 'add' | 'edit'
  parentNode: CategoryQueryModel | null  // 添加模式时的父节点
  editData: CategoryQueryModel | null    // 编辑模式时的数据
  allNodes: CategoryQueryModel[]         // 所有节点（用于父节点选择）
}>()
```

### 6.2 父节点选择逻辑

```typescript
const parentOptions = computed(() => {
  if (props.mode === 'add') {
    // 添加模式：只显示当前父节点（不可选）
    return props.parentNode ? [props.parentNode] : []
  } else {
    // 编辑模式：显示根节点和所有节点（排除自己和自己的子孙节点）
    const editId = props.editData?.id
    return props.allNodes.filter(node => {
      // 排除自己
      if (node.id === editId) return false
      // 排除自己的子孙节点
      if (editId && isDescendant(props.editData!, node)) return false
      return true
    })
  }
})
```

### 6.3 检查子孙节点

```typescript
const isDescendant = (parent: CategoryQueryModel, node: CategoryQueryModel): boolean => {
  if (!parent.children || parent.children.length === 0) return false
  
  for (const child of parent.children) {
    if (child.id === node.id) return true
    if (isDescendant(child, node)) return true
  }
  
  return false
}
```

**为什么要排除子孙节点？**
- 避免循环引用：如果A是B的父节点，B不能成为A的父节点
- 保证树形结构的完整性

### 6.4 表单字段

```vue
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

<a-form-item label="分类名称" field="name">
  <a-input v-model="formData.name" />
</a-form-item>

<a-form-item label="分类编码" field="code">
  <a-input v-model="formData.code" />
</a-form-item>

<a-form-item label="排序" field="sort">
  <a-input-number v-model="formData.sort" />
</a-form-item>

<a-form-item label="状态" field="status">
  <a-select v-model="formData.status">
    <a-option value="active">启用</a-option>
    <a-option value="inactive">禁用</a-option>
  </a-select>
</a-form-item>
```

**父节点字段的关键点：**
- 添加模式：`disabled="true"`，固定为当前父节点
- 编辑模式：可选择，但排除自己和子孙节点

## 七、Mock数据开发

### 7.1 树形数据结构

```typescript
const categories = [
  {
    id: '1',
    parentId: '',
    name: '电子产品',
    code: 'electronics',
    children: [
      {
        id: '1-1',
        parentId: '1',
        name: '手机',
        code: 'phone',
        children: [
          {
            id: '1-1-1',
            parentId: '1-1',
            name: 'iPhone',
            code: 'iphone'
          }
        ]
      }
    ]
  }
]
```

### 7.2 辅助函数

```typescript
// 扁平化树形数据
function flattenTree(nodes: any[]): any[] {
  const result: any[] = []
  const traverse = (nodeList: any[]) => {
    nodeList.forEach(node => {
      const { children, ...rest } = node
      result.push(rest)
      if (children) traverse(children)
    })
  }
  traverse(nodes)
  return result
}

// 根据ID查找节点
function findNodeById(nodes: any[], id: string): any | null {
  for (const node of nodes) {
    if (node.id === id) return node
    if (node.children) {
      const found = findNodeById(node.children, id)
      if (found) return found
    }
  }
  return null
}

// 删除节点
function deleteNodeById(nodes: any[], id: string): boolean {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id === id) {
      nodes.splice(i, 1)
      return true
    }
    if (nodes[i].children) {
      if (deleteNodeById(nodes[i].children, id)) return true
    }
  }
  return false
}

// 添加节点到指定父节点
function addNodeToParent(nodes: any[], parentId: string, newNode: any): boolean {
  if (parentId === '') {
    nodes.push(newNode)
    return true
  }
  
  for (const node of nodes) {
    if (node.id === parentId) {
      if (!node.children) node.children = []
      node.children.push(newNode)
      return true
    }
    if (node.children && addNodeToParent(node.children, parentId, newNode)) {
      return true
    }
  }
  return false
}
```

### 7.3 Mock接口

```typescript
export default [
  // 获取分类树
  {
    url: '/api/categories/tree',
    method: 'get',
    response: () => categories
  },

  // 获取扁平列表
  {
    url: '/api/categories/list',
    method: 'get',
    response: () => flattenTree(categories)
  },

  // 创建分类
  {
    url: '/api/categories',
    method: 'post',
    response: ({ body }: any) => {
      const newNode = {
        ...body,
        id: Date.now().toString(),
        createdAt: new Date().toLocaleString(),
        updatedAt: new Date().toLocaleString()
      }
      addNodeToParent(categories, body.parentId, newNode)
      return { success: true }
    }
  },

  // 修改分类
  {
    url: '/api/categories/:id',
    method: 'put',
    response: ({ query, body }: any) => {
      updateNode(categories, query.id, body)
      return { success: true }
    }
  },

  // 删除分类
  {
    url: '/api/categories/:id',
    method: 'delete',
    response: ({ query }: any) => {
      deleteNodeById(categories, query.id)
      return { success: true }
    }
  }
]
```

## 八、开发清单

### 8.1 API层
- [ ] 定义查询模型（带children）
- [ ] 定义命令模型（不带children）
- [ ] 实现获取树形数据接口
- [ ] 实现CRUD接口
- [ ] 实现获取扁平列表接口

### 8.2 页面层
- [ ] 创建树形列表页
- [ ] 实现虚拟根节点包装
- [ ] 配置树形控件
- [ ] 实现节点自定义渲染
- [ ] 添加操作按钮（添加/编辑/删除）
- [ ] 实现扁平化数据函数

### 8.3 对话框组件
- [ ] 创建对话框组件
- [ ] 实现父节点选择逻辑
- [ ] 实现子孙节点检查函数
- [ ] 区分添加/编辑模式
- [ ] 实现表单验证

### 8.4 Mock层
- [ ] 创建树形Mock数据
- [ ] 实现辅助函数（查找/删除/添加/更新）
- [ ] 实现Mock接口

### 8.5 路由和菜单
- [ ] 添加路由配置
- [ ] 添加菜单项
- [ ] 注册Mock路由

## 九、关键技术点

### 9.1 虚拟根节点
- 使用空字符串作为根节点ID
- 将后端返回的数据作为虚拟根节点的children
- 统一操作逻辑，简化代码

### 9.2 父节点选择
- 添加模式：固定父节点，不可修改
- 编辑模式：可选择，但排除自身及子孙节点
- 使用递归检查子孙关系

### 9.3 删除限制
- 只有叶子节点（无children或children为空）可以删除
- 使用Modal.confirm进行二次确认
- 删除成功后刷新整个树

### 9.4 递归操作
- 扁平化：递归遍历所有节点
- 查找：递归搜索指定ID的节点
- 删除：递归查找并删除节点
- 添加：递归查找父节点并添加子节点

## 十、常见问题

### Q1: 为什么需要虚拟根节点？
**A:** 为了统一操作。如果没有虚拟根节点，一级分类的添加需要特殊处理。有了虚拟根节点后，所有节点的操作逻辑都一致。

### Q2: 如何避免循环引用？
**A:** 在编辑节点时，父节点选择要排除自己和自己的所有子孙节点。使用递归函数`isDescendant`检查节点关系。

### Q3: 为什么只有叶子节点可以删除？
**A:** 为了保证数据完整性。如果允许删除有子节点的节点，需要同时删除所有子孙节点，或者重新分配子节点的父节点，逻辑复杂且容易出错。

### Q4: 如何处理大量数据？
**A:** 
- 后端实现懒加载：只加载展开的节点
- 前端使用虚拟滚动：如arco-design的virtual-list
- 限制树的层级深度

### Q5: 父节点修改后如何更新树？
**A:** Mock中实现了节点移动逻辑：先从原位置删除，再添加到新位置。保持子节点不变。

## 十一、扩展功能

可选的扩展功能：

1. **拖拽排序**：使用`draggable`属性实现节点拖拽
2. **批量操作**：添加checkbox，支持批量删除
3. **搜索过滤**：根据关键词过滤树节点
4. **懒加载**：点击展开时才加载子节点
5. **右键菜单**：右键显示操作菜单
6. **图标配置**：为不同类型节点配置不同图标

## 十二、最佳实践

1. **统一数据模型**：区分查询模型（带children）和命令模型（不带children）
2. **虚拟根节点**：简化操作逻辑，统一处理
3. **递归操作**：封装通用的递归函数（查找、删除、添加）
4. **类型安全**：使用TypeScript确保类型安全
5. **用户体验**：删除前二次确认，操作成功后刷新数据
6. **性能优化**：大数据量时考虑懒加载和虚拟滚动

## 十三、总结

树状数据CRUD是一个典型的层级数据管理场景，核心要点：

1. **数据结构**：查询模型带children，命令模型不带
2. **虚拟根节点**：统一操作逻辑
3. **父节点选择**：排除自身及子孙节点
4. **删除限制**：只允许删除叶子节点
5. **递归操作**：查找、删除、添加都需要递归处理

掌握这些要点后，可以快速开发各类树形数据管理功能，如分类管理、组织架构、菜单管理、地区选择等。
