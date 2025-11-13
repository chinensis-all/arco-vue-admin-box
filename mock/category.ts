import type { MockMethod } from 'vite-plugin-mock'

// 模拟分类数据
const categories = [
  {
    id: '1',
    parentId: '',
    name: '电子产品',
    code: 'electronics',
    sort: 1,
    description: '各类电子产品分类',
    status: 'active',
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
        status: 'active',
        createdAt: '2024-01-01 10:00:00',
        updatedAt: '2024-01-01 10:00:00',
        children: [
          {
            id: '1-1-1',
            parentId: '1-1',
            name: 'iPhone',
            code: 'iphone',
            sort: 1,
            status: 'active',
            createdAt: '2024-01-01 10:00:00',
            updatedAt: '2024-01-01 10:00:00'
          },
          {
            id: '1-1-2',
            parentId: '1-1',
            name: 'Android',
            code: 'android',
            sort: 2,
            status: 'active',
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
        status: 'active',
        createdAt: '2024-01-01 10:00:00',
        updatedAt: '2024-01-01 10:00:00',
        children: [
          {
            id: '1-2-1',
            parentId: '1-2',
            name: '笔记本',
            code: 'laptop',
            sort: 1,
            status: 'active',
            createdAt: '2024-01-01 10:00:00',
            updatedAt: '2024-01-01 10:00:00'
          },
          {
            id: '1-2-2',
            parentId: '1-2',
            name: '台式机',
            code: 'desktop',
            sort: 2,
            status: 'active',
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
        status: 'active',
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
    status: 'active',
    createdAt: '2024-01-01 10:00:00',
    updatedAt: '2024-01-01 10:00:00',
    children: [
      {
        id: '2-1',
        parentId: '2',
        name: '技术',
        code: 'tech',
        sort: 1,
        status: 'active',
        createdAt: '2024-01-01 10:00:00',
        updatedAt: '2024-01-01 10:00:00',
        children: [
          {
            id: '2-1-1',
            parentId: '2-1',
            name: '编程',
            code: 'programming',
            sort: 1,
            status: 'active',
            createdAt: '2024-01-01 10:00:00',
            updatedAt: '2024-01-01 10:00:00'
          },
          {
            id: '2-1-2',
            parentId: '2-1',
            name: '设计',
            code: 'design',
            sort: 2,
            status: 'active',
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
        status: 'active',
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
    status: 'inactive',
    createdAt: '2024-01-01 10:00:00',
    updatedAt: '2024-01-01 10:00:00'
  }
]

// 辅助函数：扁平化树形数据
function flattenTree(nodes: any[]): any[] {
  const result: any[] = []
  const traverse = (nodeList: any[]) => {
    nodeList.forEach(node => {
      const { children, ...rest } = node
      result.push(rest)
      if (children && children.length > 0) {
        traverse(children)
      }
    })
  }
  traverse(nodes)
  return result
}

// 辅助函数：根据ID查找节点
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

// 辅助函数：删除节点
function deleteNodeById(nodes: any[], id: string): boolean {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id === id) {
      nodes.splice(i, 1)
      return true
    }
    if (nodes[i].children) {
      if (deleteNodeById(nodes[i].children, id)) {
        return true
      }
    }
  }
  return false
}

// 辅助函数：添加节点到指定父节点
function addNodeToParent(nodes: any[], parentId: string, newNode: any): boolean {
  if (parentId === '') {
    // 添加到根节点
    nodes.push(newNode)
    return true
  }
  
  for (const node of nodes) {
    if (node.id === parentId) {
      if (!node.children) {
        node.children = []
      }
      node.children.push(newNode)
      return true
    }
    if (node.children) {
      if (addNodeToParent(node.children, parentId, newNode)) {
        return true
      }
    }
  }
  return false
}

// 辅助函数：更新节点（可能需要移动位置）
function updateNode(nodes: any[], id: string, data: any): boolean {
  const node = findNodeById(nodes, id)
  if (!node) return false
  
  // 如果父节点改变了，需要先删除再添加到新位置
  if (node.parentId !== data.parentId) {
    const children = node.children || []
    deleteNodeById(nodes, id)
    const newNode = { ...data, id, children, createdAt: node.createdAt, updatedAt: new Date().toLocaleString() }
    addNodeToParent(nodes, data.parentId, newNode)
  } else {
    // 父节点没变，直接更新
    Object.assign(node, data, { updatedAt: new Date().toLocaleString() })
  }
  
  return true
}

export default [
  // 获取分类树
  {
    url: '/api/categories/tree',
    method: 'get',
    response: () => {
      return categories
    }
  },

  // 获取所有分类（扁平列表）
  {
    url: '/api/categories/list',
    method: 'get',
    response: () => {
      return flattenTree(categories)
    }
  },

  // 获取单个分类
  {
    url: '/api/categories/:id',
    method: 'get',
    response: ({ query }: any) => {
      const node = findNodeById(categories, query.id)
      return node || { error: 'Not found' }
    }
  },

  // 创建分类
  {
    url: '/api/categories',
    method: 'post',
    response: ({ body }: any) => {
      console.log('[创建分类]', body)
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
      console.log('[修改分类]', query.id, body)
      updateNode(categories, query.id, body)
      return { success: true }
    }
  },

  // 删除分类
  {
    url: '/api/categories/:id',
    method: 'delete',
    response: ({ query }: any) => {
      console.log('[删除分类]', query.id)
      deleteNodeById(categories, query.id)
      return { success: true }
    }
  }
] as MockMethod[]
