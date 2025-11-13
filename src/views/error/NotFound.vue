<template>
  <div class="not-found-page">
    <div class="not-found-container">
      <div class="not-found-content">
        <!-- 404图标区域 -->
        <div class="error-icon">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="90" fill="#f0f5ff" />
            <text x="100" y="120" font-size="72" font-weight="bold" text-anchor="middle" fill="#165dff">404</text>
          </svg>
        </div>
        
        <!-- 错误信息 -->
        <div class="error-info">
          <h1 class="error-title">页面未找到</h1>
          <p class="error-description">
            抱歉，您访问的页面不存在或已被移除
          </p>
          <p class="error-hint">
            请检查URL是否正确，或返回首页继续浏览
          </p>
        </div>
        
        <!-- 操作按钮 -->
        <div class="error-actions">
          <a-space size="large">
            <a-button type="primary" size="large" @click="goHome">
              <template #icon>
                <icon-home />
              </template>
              返回首页
            </a-button>
            <a-button size="large" @click="goBack">
              <template #icon>
                <icon-left />
              </template>
              返回上页
            </a-button>
          </a-space>
        </div>
        
        <!-- 装饰元素 -->
        <div class="decoration-dots">
          <span class="dot dot-1"></span>
          <span class="dot dot-2"></span>
          <span class="dot dot-3"></span>
          <span class="dot dot-4"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { IconHome, IconLeft } from '@arco-design/web-vue/es/icon'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  router.back()
}
</script>

<style scoped lang="scss">
.not-found-page {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  
  // 背景动画效果
  &::before {
    content: '';
    position: absolute;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
    background-size: 50px 50px;
    animation: moveBackground 20s linear infinite;
  }
}

@keyframes moveBackground {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(50px, 50px);
  }
}

.not-found-container {
  position: relative;
  z-index: 1;
}

.not-found-content {
  background: white;
  border-radius: 24px;
  padding: 60px 80px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  text-align: center;
  position: relative;
  max-width: 600px;
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.error-icon {
  margin-bottom: 32px;
  
  svg {
    width: 200px;
    height: 200px;
    animation: bounce 2s ease-in-out infinite;
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.error-info {
  margin-bottom: 40px;
}

.error-title {
  font-size: 32px;
  font-weight: 600;
  color: #1d2129;
  margin: 0 0 16px 0;
  letter-spacing: -0.5px;
}

.error-description {
  font-size: 16px;
  color: #4e5969;
  margin: 0 0 12px 0;
  line-height: 1.6;
}

.error-hint {
  font-size: 14px;
  color: #86909c;
  margin: 0;
  line-height: 1.6;
}

.error-actions {
  :deep(.arco-btn) {
    min-width: 140px;
    height: 44px;
    font-size: 15px;
    border-radius: 8px;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(22, 93, 255, 0.3);
    }
  }
}

.decoration-dots {
  .dot {
    position: absolute;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #165dff;
    opacity: 0.2;
  }
  
  .dot-1 {
    top: 40px;
    left: 40px;
    animation: float 3s ease-in-out infinite;
  }
  
  .dot-2 {
    top: 60px;
    right: 60px;
    width: 12px;
    height: 12px;
    animation: float 4s ease-in-out infinite;
    animation-delay: 0.5s;
  }
  
  .dot-3 {
    bottom: 80px;
    left: 60px;
    width: 10px;
    height: 10px;
    animation: float 3.5s ease-in-out infinite;
    animation-delay: 1s;
  }
  
  .dot-4 {
    bottom: 60px;
    right: 40px;
    animation: float 4.5s ease-in-out infinite;
    animation-delay: 1.5s;
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px);
  }
}

// 响应式适配
@media (max-width: 768px) {
  .not-found-content {
    padding: 40px 30px;
    margin: 20px;
  }
  
  .error-icon svg {
    width: 150px;
    height: 150px;
  }
  
  .error-title {
    font-size: 24px;
  }
  
  .error-description {
    font-size: 14px;
  }
  
  .error-actions {
    :deep(.arco-space) {
      flex-direction: column;
      width: 100%;
    }
    
    :deep(.arco-btn) {
      width: 100%;
    }
  }
}
</style>
