<template>
  <div class="profile-page">
    <!-- 页面导航 -->
    <div class="page-header">
      <a-breadcrumb>
        <a-breadcrumb-item>Agent参考示例</a-breadcrumb-item>
        <a-breadcrumb-item>个人资料</a-breadcrumb-item>
      </a-breadcrumb>
      <a-button type="text" @click="addToQuickMenu">
        <template #icon>
          <icon-star />
        </template>
        加入快捷菜单
      </a-button>
    </div>

    <a-spin :loading="loading" style="width: 100%">
      <!-- 顶部卡片 - 头像和基本信息 -->
      <a-card class="profile-header-card">
        <div class="profile-header">
          <div class="avatar-section">
            <a-avatar :size="120" class="user-avatar">
              <img v-if="userInfo?.avatar" :src="userInfo.avatar" alt="avatar" />
              <template v-else>
                <icon-user />
              </template>
            </a-avatar>
            <a-button type="text" size="small" class="change-avatar-btn" @click="handleChangeAvatar">
              <icon-camera />
              更换头像
            </a-button>
          </div>
          
          <div class="header-info">
            <div class="name-section">
              <h1 class="user-name">{{ userInfo?.realName || '未设置' }}</h1>
              <a-tag :color="userInfo?.status === 'active' ? 'green' : 'red'">
                {{ userInfo?.status === 'active' ? '激活' : '禁用' }}
              </a-tag>
            </div>
            <div class="user-meta">
              <span class="meta-item">
                <icon-user />
                @{{ userInfo?.username }}
              </span>
              <span class="meta-item">
                <icon-apps />
                {{ userInfo?.scope?.name }}
              </span>
              <span class="meta-item">
                <icon-calendar />
                加入于 {{ formatDate(userInfo?.createdAt) }}
              </span>
            </div>
            <div class="user-roles" v-if="userInfo?.roles && userInfo.roles.length > 0">
              <a-space>
                <span class="roles-label">角色：</span>
                <a-tag v-for="role in userInfo.roles" :key="role.id" color="arcoblue">
                  {{ role.name }}
                </a-tag>
              </a-space>
            </div>
          </div>
        </div>
      </a-card>

      <!-- 内容区域 -->
      <a-row :gutter="16" class="profile-content">
        <!-- 左侧列 -->
        <a-col :span="12">
          <!-- 基础信息卡片 -->
          <a-card title="基础信息" class="info-card" :bordered="false">
            <template #extra>
              <a-button type="text" size="small" @click="handleEditBasicInfo">
                <icon-edit />
                编辑
              </a-button>
            </template>
            <div class="info-list">
              <div class="info-item">
                <span class="info-label">真实姓名</span>
                <span class="info-value">{{ userInfo?.realName || '-' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">性别</span>
                <span class="info-value">{{ genderMap[userInfo?.gender || 'other'] }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">年龄</span>
                <span class="info-value">{{ userInfo?.age || '-' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">部门</span>
                <span class="info-value">{{ userInfo?.department || '-' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">职位</span>
                <span class="info-value">{{ userInfo?.position || '-' }}</span>
              </div>
              <div class="info-item full-width">
                <span class="info-label">个人简介</span>
                <span class="info-value">{{ userInfo?.description || '暂无简介' }}</span>
              </div>
            </div>
          </a-card>

          <!-- 联系方式卡片 -->
          <a-card title="联系方式" class="info-card" :bordered="false">
            <template #extra>
              <a-button type="text" size="small" @click="handleEditContactInfo">
                <icon-edit />
                编辑
              </a-button>
            </template>
            <div class="info-list">
              <div class="info-item">
                <span class="info-label">
                  <icon-email />
                  邮箱
                </span>
                <span class="info-value">{{ userInfo?.email || '-' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">
                  <icon-phone />
                  手机号
                </span>
                <span class="info-value">{{ userInfo?.phone || '-' }}</span>
              </div>
            </div>
          </a-card>
        </a-col>

        <!-- 右侧列 -->
        <a-col :span="12">
          <!-- 账号安全卡片 -->
          <a-card title="账号安全" class="info-card" :bordered="false">
            <div class="security-list">
              <div class="security-item">
                <div class="security-info">
                  <icon-lock class="security-icon" />
                  <div class="security-content">
                    <div class="security-title">登录密码</div>
                    <div class="security-desc">定期修改密码可以提高账号安全性</div>
                  </div>
                </div>
                <a-button type="outline" size="small" @click="handleChangePassword">
                  修改密码
                </a-button>
              </div>
              
              <div class="security-item">
                <div class="security-info">
                  <icon-safe class="security-icon" />
                  <div class="security-content">
                    <div class="security-title">账号状态</div>
                    <div class="security-desc">
                      {{ userInfo?.status === 'active' ? '账号正常，可以正常使用' : '账号已被禁用' }}
                    </div>
                  </div>
                </div>
                <a-tag :color="userInfo?.status === 'active' ? 'green' : 'red'">
                  {{ userInfo?.status === 'active' ? '正常' : '禁用' }}
                </a-tag>
              </div>
              
              <div class="security-item">
                <div class="security-info">
                  <icon-lock class="security-icon" style="color: #f77234" />
                  <div class="security-content">
                    <div class="security-title">IP锁定</div>
                    <div class="security-desc">开启后仅允许指定IP地址登录系统</div>
                  </div>
                </div>
                <a-switch size="small" :default-checked="false" />
              </div>
            </div>
          </a-card>

          <!-- 统计信息卡片 -->
          <a-card title="账号统计" class="info-card" :bordered="false">
            <div class="stats-grid">
              <div class="stat-item">
                <div class="stat-value">{{ userInfo?.roles?.length || 0 }}</div>
                <div class="stat-label">拥有角色</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ daysSinceJoined }}</div>
                <div class="stat-label">加入天数</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ userInfo?.scope?.name || '-' }}</div>
                <div class="stat-label">用户类型</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ formatDate(userInfo?.updatedAt) }}</div>
                <div class="stat-label">最后更新</div>
              </div>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </a-spin>

    <!-- 头像编辑对话框 -->
    <AvatarDialog 
      v-model:visible="avatarDialogVisible" 
      :current-avatar="userInfo?.avatar"
      @success="loadProfile"
    />

    <!-- 基础信息编辑对话框 -->
    <BasicInfoDialog
      v-model:visible="basicInfoDialogVisible"
      :user-info="userInfo"
      @success="loadProfile"
    />

    <!-- 联系方式编辑对话框 -->
    <ContactInfoDialog
      v-model:visible="contactInfoDialogVisible"
      :user-info="userInfo"
      @success="loadProfile"
    />

    <!-- 修改密码对话框 -->
    <PasswordDialog
      v-model:visible="passwordDialogVisible"
      @success="handlePasswordChanged"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Message } from '@arco-design/web-vue'
import {
  IconUser,
  IconCamera,
  IconEdit,
  IconApps,
  IconCalendar,
  IconEmail,
  IconPhone,
  IconLock,
  IconSafe,
  IconStar
} from '@arco-design/web-vue/es/icon'
import { getCurrentUserProfile, type UserQueryModel } from '@/api/user'
import AvatarDialog from './components/AvatarDialog.vue'
import BasicInfoDialog from './components/BasicInfoDialog.vue'
import ContactInfoDialog from './components/ContactInfoDialog.vue'
import PasswordDialog from './components/PasswordDialog.vue'

// 用户信息
const userInfo = ref<UserQueryModel>()
const loading = ref(false)

// 性别映射
const genderMap: Record<string, string> = {
  male: '男',
  female: '女',
  other: '其他'
}

// 对话框状态
const avatarDialogVisible = ref(false)
const basicInfoDialogVisible = ref(false)
const contactInfoDialogVisible = ref(false)
const passwordDialogVisible = ref(false)

// 加入天数
const daysSinceJoined = computed(() => {
  if (!userInfo.value?.createdAt) return 0
  const created = new Date(userInfo.value.createdAt)
  const now = new Date()
  const diff = now.getTime() - created.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
})

// 格式化日期
const formatDate = (dateStr?: string) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN')
}

// 加载个人资料
const loadProfile = async () => {
  try {
    loading.value = true
    const { data } = await getCurrentUserProfile()
    userInfo.value = data
  } catch (error) {
    console.error('加载个人资料失败:', error)
    Message.error('加载个人资料失败')
  } finally {
    loading.value = false
  }
}

// 处理更换头像
const handleChangeAvatar = () => {
  avatarDialogVisible.value = true
}

// 处理编辑基础信息
const handleEditBasicInfo = () => {
  basicInfoDialogVisible.value = true
}

// 处理编辑联系方式
const handleEditContactInfo = () => {
  contactInfoDialogVisible.value = true
}

// 处理修改密码
const handleChangePassword = () => {
  passwordDialogVisible.value = true
}

// 加入快捷菜单
const addToQuickMenu = () => {
  const list = JSON.parse(localStorage.getItem('quickMenus') || '[]')
  const titleText = '个人资料'
  const current = { key: '/profile', name: titleText }
  
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

// 密码修改成功
const handlePasswordChanged = () => {
  Message.success('密码修改成功，请重新登录')
  // 可以在这里添加跳转到登录页的逻辑
}

onMounted(() => {
  loadProfile()
})
</script>

<style scoped lang="scss">
.profile-page {
  padding: 20px;
  
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }
}

.profile-header-card {
  margin-bottom: 16px;
  
  :deep(.arco-card-body) {
    padding: 32px;
  }
}

.profile-header {
  display: flex;
  gap: 32px;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  
  .user-avatar {
    border: 4px solid #f0f5ff;
    box-shadow: 0 4px 12px rgba(22, 93, 255, 0.15);
    
    :deep(img) {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  
  .change-avatar-btn {
    color: #165dff;
    
    &:hover {
      background: #f0f5ff;
    }
  }
}

.header-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.name-section {
  display: flex;
  align-items: center;
  gap: 12px;
  
  .user-name {
    margin: 0;
    font-size: 28px;
    font-weight: 600;
    color: #1d2129;
  }
}

.user-meta {
  display: flex;
  gap: 24px;
  
  .meta-item {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #4e5969;
    font-size: 14px;
    
    .arco-icon {
      font-size: 16px;
      color: #86909c;
    }
  }
}

.user-roles {
  .roles-label {
    color: #86909c;
    font-size: 14px;
  }
}

.profile-content {
  .info-card {
    margin-bottom: 16px;
    
    :deep(.arco-card-header) {
      border-bottom: 1px solid #e5e6eb;
      padding: 16px 20px;
    }
    
    :deep(.arco-card-body) {
      padding: 20px;
    }
    
    :deep(.arco-card-header-title) {
      font-size: 16px;
      font-weight: 600;
    }
  }
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid #f2f3f5;
  
  &:last-child {
    border-bottom: none;
  }
  
  &.full-width {
    flex-direction: column;
    gap: 8px;
  }
  
  .info-label {
    color: #86909c;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 6px;
    
    .arco-icon {
      font-size: 16px;
    }
  }
  
  .info-value {
    color: #1d2129;
    font-size: 14px;
    font-weight: 500;
    text-align: right;
  }
}

.security-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.security-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f7f8fa;
  border-radius: 8px;
}

.security-info {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  
  .security-icon {
    font-size: 24px;
    color: #165dff;
    margin-top: 4px;
  }
}

.security-content {
  .security-title {
    font-size: 15px;
    font-weight: 600;
    color: #1d2129;
    margin-bottom: 4px;
  }
  
  .security-desc {
    font-size: 13px;
    color: #86909c;
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.stat-item {
  text-align: center;
  padding: 20px;
  background: linear-gradient(135deg, #f0f5ff 0%, #e8f3ff 100%);
  border-radius: 8px;
  
  .stat-value {
    font-size: 24px;
    font-weight: 600;
    color: #165dff;
    margin-bottom: 8px;
  }
  
  .stat-label {
    font-size: 13px;
    color: #4e5969;
  }
}

@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .user-meta {
    flex-direction: column;
    gap: 8px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
