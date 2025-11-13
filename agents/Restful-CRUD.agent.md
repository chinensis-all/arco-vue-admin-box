# 通用CRUD开发Agent规则

## 概述
本规则指导AI助手根据接口定义，参考用户管理示例页面，快速开发完整的CRUD前端页面。

## 参考示例路径

### 1. API定义层（`src/api/`）
- **共享类型定义**: `src/api/shared.ts`
  - `Page`: 分页请求参数
  - `Pagination<T>`: 泛型分页响应
  - `Option`: 通用选项模型
  - `DateRange`: 时间范围
  - `NumberRange`: 数值范围

- **资源API定义**: `src/api/user.ts`（参考模板）
  - 命令模型: `{Resource}Model` - 用于创建和修改
  - 查询模型: `{Resource}QueryModel` - 用于显示（包含值对象）
  - 搜索参数: `{Resource}SearchData` - 承载搜索条件
  - 选项模型: `{Resource}OptionModel` - 用于其他页面的下拉选择
  - 分页类型: `{Resource}Pagination` = `Pagination<{Resource}QueryModel>`

- **角色API定义**: `src/api/role.ts`（辅助资源示例）

### 2. Mock数据层（`mock/`）
- **Mock实现**: `mock/user.ts`
  - 完整的CRUD操作Mock
  - 搜索过滤逻辑
  - 分页处理
  - 状态管理（激活/禁用）

- **路由注册**: `mock/routes.ts`
  ```typescript
  import userMocks from './user'
  export default [...userMocks, ...]
  ```

### 3. 页面视图层（`src/views/{resource}/`）

#### 主页面 `index.vue`
**布局结构**：
1. **页面头部** (`.page-header`)
   - 面包屑导航 (`a-breadcrumb`)
   - 加入快捷菜单按钮

2. **内容卡片** (`a-card`)
   - 卡片标题即页面名称

3. **搜索表单** (`.search-form`)
   - 包装在 `a-form` 中，`layout="inline"`
   - 搜索按钮放在右侧
   - 涵盖多种搜索类型（参考示例）：
     * **文本关键词**: `a-input` + `allow-clear` + `@press-enter`
     * **单选下拉**: `a-select` + `allow-clear`
     * **多选下拉**: `a-select` + `multiple` + `allow-clear`
     * **单选按钮**: `a-radio-group`
     * **数值范围**: 两个 `a-input-number` + 中间横杠
     * **时间范围**: `a-range-picker` + `show-time`
     * **远程数据下拉**: `a-select` + `:loading` + API获取选项

4. **工具栏** (`.toolbar`)
   - **左侧**: "添加新XX" 按钮 (`:disabled="!hasButton('{resource}:add')"`)
   - **右侧**: 
     * 刷新图标按钮 (`icon-refresh`)
     * 列设置按钮 (`a-popover` + `a-checkbox-group`)

5. **数据表格** (`a-table`)
   - `:columns="displayColumns"` - 动态显示列
   - `:data="userList"` - 数据源
   - `:loading="loading"` - 加载状态
   - `:pagination="false"` - 禁用内置分页
   - `:bordered="{ cell: true }"` - 单元格边框
   - `row-key="id"` - 行标识
   
   **列插槽示例**:
   - 状态列: `<a-tag :color="...">`
   - 值对象列: 访问 `.code` 或 `.name`
   - 数组列: `v-for` + `a-space`
   - 操作列: 固定在右侧 (`fixed: 'right'`)

6. **分页组件** (`.pagination`)
   ```vue
   <a-pagination
     :current="pagination.page"
     :page-size="pagination.pageSize"
     :total="pagination.total"
     show-total
     show-jumper
     show-page-size
     :page-size-options="[10, 20, 50, 100]"
     @change="handlePageChange"
     @page-size-change="handlePageSizeChange"
   />
   ```

**操作按钮** (表格最后一列):
- **编辑**: `type="text"` + `status="normal"` + `:disabled="!hasButton('{resource}:modify')"`
- **禁用**: `status="danger"` + `v-if="record.status === 'active'"` + `:disabled="!hasButton('{resource}:forbid')"`
- **激活**: `status="success"` + `v-else` + `:disabled="!hasButton('{resource}:activate')"`
- **其他操作**: 根据业务需求添加（如"分配角色"）

**权限控制函数**:
```typescript
const hasButton = (buttonCode: string): boolean => {
  const buttons = (route.meta?.buttons as string[]) || []
  return buttons.includes(buttonCode)
}
```

#### 组合式函数 `composables/useUserList.ts`
**职责**: 封装列表的搜索、分页、刷新逻辑

**导出内容**:
- `loading`: 加载状态
- `searchForm`: 响应式搜索表单
- `pagination`: 分页信息
- `userList`: 数据列表
- `loadUserList`: 加载列表方法
- `handleSearch`: 搜索（page重置为1）
- `handleReset`: 重置搜索
- `handleRefresh`: 刷新当前页
- `handlePageChange`: 页码变化
- `handlePageSizeChange`: 每页条数变化

#### 详情抽屉 `components/DetailDrawer.vue`
**Props**:
- `visible`: 是否显示
- `action`: `'add' | 'edit'`
- `{resource}Id`: 资源ID（编辑时）

**功能**:
1. 根据 `action` 判断添加/编辑模式
2. 编辑时调用 `get{Resource}(id)` 获取查询模型，转换为命令模型
3. 添加时重置表单
4. 使用 `a-drawer` 组件，确认按钮文本改为"提交"
5. 提交成功后 `emit('success')` 并关闭抽屉

**表单验证规则覆盖**:
- **必填**: `{ required: true, message: '...' }`
- **长度**: `{ minLength: 3, message: '...' }`, `{ maxLength: 20, message: '...' }`
- **范围**: `{ type: 'number', min: 18, message: '...' }`
- **正则**: `{ match: /^[a-zA-Z0-9_]+$/, message: '...' }`

**表单组件覆盖**:
- `a-input`: 文本输入 + `:max-length` + `show-word-limit`
- `a-input-number`: 数字输入 + `:min` + `:max`
- `a-select`: 下拉选择
- `a-radio-group`: 单选组
- `a-textarea`: 多行文本 + `:auto-size`

#### 其他对话框组件 `components/{Feature}Dialog.vue`
例如 `RoleDialog.vue` 演示了：
- 使用 `a-modal` 而非抽屉
- 动态加载远程数据（角色选项）
- `a-checkbox-group` 多选
- 提交调用特定API（如 `modifyUserRoles`）

### 4. 路由配置（`src/router/index.ts`）
```typescript
{
  path: '/system/user',
  name: 'user',
  component: () => import('@/views/user/index.vue'),
  meta: {
    title: '用户管理',
    buttons: [
      'user:add',
      'user:modify',
      'user:forbid',
      'user:activate',
      'user:modify-role'
    ]
  }
}
```

### 5. 菜单配置（`src/views/layout/MainLayout.vue`）
在 `<a-menu>` 中添加：
```vue
<a-sub-menu key="system">
  <template #icon><icon-settings /></template>
  <template #title>系统管理</template>
  <a-menu-item key="/system/user">用户管理</a-menu-item>
</a-sub-menu>
```

## 开发步骤

### 第1步：分析接口定义
1. 识别资源名称（如 `User`）
2. 确认模型类型：
   - 命令模型（`{Resource}Model`）
   - 查询模型（`{Resource}QueryModel`）
   - 搜索模型（`{Resource}SearchData`）
3. 列出所有API函数：
   - 创建: `create{Resource}(data)`
   - 修改: `modify{Resource}(id, data)`
   - 删除/禁用/激活: `destroy{Resource}(id)` / `forbid{Resource}(id)` / `activate{Resource}(id)`
   - 获取详情: `get{Resource}(id)`
   - 分页查询: `get{Resource}Pagination(params, pager)`
   - 选项查询: `get{Resource}Options(params)`

### 第2步：创建API定义文件
- 路径: `src/api/{resource}.ts`
- 参考 `src/api/user.ts` 的结构
- 定义所有接口模型和函数
- 注意CQRS模式：查询模型返回值对象，命令模型使用code

### 第3步：创建Mock数据
- 路径: `mock/{resource}.ts`
- 模拟至少5条测试数据
- 实现所有API的Mock响应
- 在 `mock/routes.ts` 中导入并展开

### 第4步：创建目录结构
```
src/views/{resource}/
├── index.vue
├── components/
│   ├── DetailDrawer.vue
│   └── {Feature}Dialog.vue (可选)
└── composables/
    └── use{Resource}List.ts
```

### 第5步：开发组合式函数
- 参考 `src/views/user/composables/useUserList.ts`
- 封装搜索、分页、刷新逻辑
- 返回所有必要的状态和方法

### 第6步：开发详情抽屉
- 参考 `src/views/user/components/DetailDrawer.vue`
- 实现添加/编辑双模式
- 完善表单验证规则
- 查询模型到命令模型的转换

### 第7步：开发主页面
- 参考 `src/views/user/index.vue`
- 完整实现5层结构（头部、搜索、工具栏、表格、分页）
- 集成组合式函数
- 实现所有操作按钮的逻辑
- 确认对话框使用 `Modal.confirm`

### 第8步：路由和菜单配置
- 在 `src/router/index.ts` 添加路由
- 配置 `meta.buttons` 权限
- 在 `src/views/layout/MainLayout.vue` 添加菜单项

### 第9步：测试验证
- 搜索功能（所有搜索条件）
- 添加/编辑功能
- 删除/禁用/激活功能
- 分页功能
- 列显示隐藏
- 权限按钮控制

## 命名规范

### TypeScript类型
- 命令模型: `{Resource}Model`
- 查询模型: `{Resource}QueryModel`
- 搜索参数: `{Resource}SearchData`
- 选项模型: `{Resource}OptionModel`
- 分页类型: `{Resource}Pagination`
- 值对象: `{Field}Value`

### API函数
- 创建: `create{Resource}(data: {Resource}Model)`
- 修改: `modify{Resource}(id: string, data: {Resource}Model)`
- 禁用: `forbid{Resource}(id: string)`
- 激活: `activate{Resource}(id: string)`
- 删除: `destroy{Resource}(id: string)`（通常注释掉）
- 详情: `get{Resource}(id: string)`
- 分页: `get{Resource}Pagination(params: {Resource}SearchData, pager: Page)`
- 选项: `get{Resource}Options(params: {Resource}SearchData)`

### 组件
- 主页面: `src/views/{resource}/index.vue`
- 详情抽屉: `src/views/{resource}/components/DetailDrawer.vue`
- 其他对话框: `src/views/{resource}/components/{Feature}Dialog.vue`
- 组合函数: `src/views/{resource}/composables/use{Resource}List.ts`

### Mock文件
- Mock数据: `mock/{resource}.ts`
- 导出数组: `export default [...] as MockMethod[]`

### 路由
- 路径: `/system/{resource}` 或 `/{module}/{resource}`
- 名称: `{resource}`
- 按钮权限: `{resource}:add`, `{resource}:modify`, `{resource}:forbid`, `{resource}:activate`

## 组件使用规则

### 搜索表单组件映射
| 搜索类型 | 组件 | 关键属性 |
|---------|------|---------|
| 文本关键词 | `a-input` | `allow-clear`, `@press-enter` |
| 本地单选下拉 | `a-select` | `allow-clear`, `<a-option>` |
| 本地多选下拉 | `a-select` | `multiple`, `allow-clear` |
| 远程数据下拉 | `a-select` | `:loading`, 动态`:options` |
| 单选按钮组 | `a-radio-group` | `<a-radio>` |
| 数值范围 | `a-input-number` × 2 | `:min`, `:max` |
| 时间范围 | `a-range-picker` | `show-time`, `format` |

### 表单输入组件映射
| 数据类型 | 组件 | 验证规则示例 |
|---------|------|-------------|
| 短文本 | `a-input` | `required`, `minLength`, `maxLength`, `match` |
| 数字 | `a-input-number` | `required`, `min`, `max` |
| 长文本 | `a-textarea` | `maxLength`, `:auto-size` |
| 单选 | `a-radio-group` | `required` |
| 下拉 | `a-select` | `required` |
| 多选 | `a-select` + `multiple` | - |
| 复选 | `a-checkbox-group` | - |

### 表格列渲染规则
- **普通字段**: 直接使用 `dataIndex`
- **值对象**: 使用插槽访问 `.code` 或 `.name`
- **枚举映射**: 定义 `map` 对象，插槽中映射
- **标签显示**: `<a-tag>` + 动态 `color`
- **数组**: `<a-space>` + `v-for`
- **操作列**: `slotName: 'action'`, `fixed: 'right'`

## 注意事项

1. **CQRS模式**：
   - 查询模型返回值对象（如 `scope: { code: 'admin', name: '管理员' }`）
   - 命令模型只需code（如 `scope: 'admin'`）
   - 编辑时需转换：`scope: user.scope.code`

2. **权限控制**：
   - 所有操作按钮必须检查权限
   - 使用 `:disabled="!hasButton('{resource}:{action}')"`
   - 在路由 `meta.buttons` 中定义权限列表

3. **分页逻辑**：
   - 搜索时重置 `page = 1`
   - 修改 `pageSize` 时重置 `page = 1`
   - 刷新时保持当前页

4. **确认对话框**：
   - 删除/禁用/激活操作使用 `Modal.confirm`
   - 提供清晰的确认信息
   - 成功后刷新列表

5. **表单验证**：
   - 覆盖常见验证场景（必填、长度、范围、正则）
   - 提供友好的错误提示
   - 提交前调用 `formRef.value?.validate()`

6. **样式规范**：
   - 使用 Scoped SCSS
   - 遵循已有的样式变量
   - 保持与示例一致的间距和布局

7. **国际化预留**：
   - 硬编码中文文本
   - 可在后续版本中替换为 `$t('...')`

8. **Mock数据真实性**：
   - 提供至少5条测试数据
   - 包含不同状态的记录
   - 搜索过滤逻辑完整

## 快速开始模板

当收到新的CRUD开发需求时，按以下模板执行：

```
1. 资源名称: {Resource}
2. 模块名称: {Module}
3. 路由路径: /{module}/{resource}
4. 权限前缀: {resource}:{action}

执行步骤:
- 创建 src/api/{resource}.ts
- 创建 mock/{resource}.ts 并在 mock/routes.ts 导入
- 创建 src/views/{resource}/ 目录及子目录
- 创建 composables/use{Resource}List.ts
- 创建 components/DetailDrawer.vue
- 创建 index.vue
- 更新 src/router/index.ts
- 更新 src/views/layout/MainLayout.vue
```

## 示例对照表

| 功能 | 用户管理示例路径 | 说明 |
|-----|----------------|------|
| 共享类型 | `src/api/shared.ts` | 分页、选项等通用类型 |
| API定义 | `src/api/user.ts` | 完整的CRUD接口定义 |
| Mock数据 | `mock/user.ts` | 完整的Mock实现 |
| 主页面 | `src/views/user/index.vue` | 5层结构完整示例 |
| 详情抽屉 | `src/views/user/components/DetailDrawer.vue` | 添加/编辑表单 |
| 对话框 | `src/views/user/components/RoleDialog.vue` | 额外操作对话框 |
| 组合函数 | `src/views/user/composables/useUserList.ts` | 列表逻辑复用 |
| 路由配置 | `src/router/index.ts` | 路由和权限配置 |
| 菜单配置 | `src/views/layout/MainLayout.vue` | 菜单项添加 |

---

**版本**: v1.0
**最后更新**: 2025-11-13
**适用范围**: 基于 Arco Design Vue 的管理系统CRUD页面开发

