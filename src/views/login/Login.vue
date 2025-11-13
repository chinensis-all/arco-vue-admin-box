<template>
  <div class="login-wrap">
    <div class="left">
      <div class="ad-panel">
        <a-carousel :auto-play="true" indicator-type="slider">
          <a-carousel-item>
            <div class="ad-slide">
              <div class="pattern-wrapper">
                <svg width="360" height="360" viewBox="0 0 240 240">
                  <!-- 外层复杂圆环 -->
                  <circle cx="120" cy="120" r="100" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="0.5"/>
                  <circle cx="120" cy="120" r="90" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="1" stroke-dasharray="5,3"/>
                  <circle cx="120" cy="120" r="75" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1.5"/>
                  <circle cx="120" cy="120" r="60" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="1" stroke-dasharray="3,2"/>
                  <circle cx="120" cy="120" r="45" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="2"/>
                  <!-- 放射线 -->
                  <line x1="120" y1="20" x2="120" y2="50" stroke="rgba(255,255,255,0.4)" stroke-width="1.5"/>
                  <line x1="120" y1="190" x2="120" y2="220" stroke="rgba(255,255,255,0.4)" stroke-width="1.5"/>
                  <line x1="20" y1="120" x2="50" y2="120" stroke="rgba(255,255,255,0.4)" stroke-width="1.5"/>
                  <line x1="190" y1="120" x2="220" y2="120" stroke="rgba(255,255,255,0.4)" stroke-width="1.5"/>
                  <!-- 对角线 -->
                  <line x1="45" y1="45" x2="70" y2="70" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>
                  <line x1="195" y1="45" x2="170" y2="70" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>
                  <line x1="45" y1="195" x2="70" y2="170" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>
                  <line x1="195" y1="195" x2="170" y2="170" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>
                  <!-- 内部菱形网格 -->
                  <path d="M120,75 L145,120 L120,165 L95,120 Z" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="2"/>
                  <path d="M120,90 L135,120 L120,150 L105,120 Z" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1.5"/>
                  <!-- 旋转三角形 -->
                  <path d="M120,65 L155,140 L85,140 Z" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="1" stroke-dasharray="4,2"/>
                  <!-- 中心光点和小圆 -->
                  <circle cx="120" cy="120" r="12" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="2"/>
                  <circle cx="120" cy="120" r="6" fill="rgba(255,255,255,0.5)"/>
                  <circle cx="120" cy="120" r="2" fill="rgba(255,255,255,0.9)"/>
                </svg>
                <div class="quote">"创新是从根本上打开增长之锁的钥匙。" — 马化腾</div>
              </div>
            </div>
          </a-carousel-item>
          <a-carousel-item>
            <div class="ad-slide">
              <div class="pattern-wrapper">
                <svg width="360" height="360" viewBox="0 0 240 240">
                  <!-- 复杂六边形网络 -->
                  <polygon points="120,20 210,70 210,170 120,220 30,170 30,70" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
                  <polygon points="120,40 190,80 190,160 120,200 50,160 50,80" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="1.5"/>
                  <polygon points="120,60 170,90 170,150 120,180 70,150 70,90" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1" stroke-dasharray="5,2"/>
                  <polygon points="120,80 150,100 150,140 120,160 90,140 90,100" fill="none" stroke="rgba(255,255,255,0.45)" stroke-width="2"/>
                  <!-- 连接线网络 -->
                  <line x1="120" y1="20" x2="120" y2="220" stroke="rgba(255,255,255,0.25)" stroke-width="1" stroke-dasharray="4,3"/>
                  <line x1="30" y1="70" x2="210" y2="170" stroke="rgba(255,255,255,0.25)" stroke-width="1" stroke-dasharray="4,3"/>
                  <line x1="30" y1="170" x2="210" y2="70" stroke="rgba(255,255,255,0.25)" stroke-width="1" stroke-dasharray="4,3"/>
                  <line x1="30" y1="120" x2="210" y2="120" stroke="rgba(255,255,255,0.25)" stroke-width="1" stroke-dasharray="4,3"/>
                  <line x1="75" y1="45" x2="165" y2="195" stroke="rgba(255,255,255,0.2)" stroke-width="0.5"/>
                  <line x1="165" y1="45" x2="75" y2="195" stroke="rgba(255,255,255,0.2)" stroke-width="0.5"/>
                  <!-- 节点圆点 -->
                  <circle cx="120" cy="20" r="3" fill="rgba(255,255,255,0.6)"/>
                  <circle cx="210" cy="70" r="3" fill="rgba(255,255,255,0.6)"/>
                  <circle cx="210" cy="170" r="3" fill="rgba(255,255,255,0.6)"/>
                  <circle cx="120" cy="220" r="3" fill="rgba(255,255,255,0.6)"/>
                  <circle cx="30" cy="170" r="3" fill="rgba(255,255,255,0.6)"/>
                  <circle cx="30" cy="70" r="3" fill="rgba(255,255,255,0.6)"/>
                  <!-- 中心星形 -->
                  <path d="M120,100 L125,115 L140,115 L128,123 L133,138 L120,130 L107,138 L112,123 L100,115 L115,115 Z" fill="rgba(255,255,255,0.4)" stroke="rgba(255,255,255,0.6)" stroke-width="1"/>
                </svg>
                <div class="quote">"梦想还是要有的，万一实现了呢？" — 马云</div>
              </div>
            </div>
          </a-carousel-item>
          <a-carousel-item>
            <div class="ad-slide">
              <div class="pattern-wrapper">
                <svg width="360" height="360" viewBox="0 0 240 240">
                  <!-- 螺旋曲线 -->
                  <path d="M120,120 Q150,90 180,90 T210,120" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1.5"/>
                  <path d="M120,120 Q150,150 180,150 T210,120" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1.5"/>
                  <path d="M120,120 Q90,150 60,150 T30,120" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1.5"/>
                  <path d="M120,120 Q90,90 60,90 T30,120" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1.5"/>
                  <!-- 花瓣形状 -->
                  <path d="M120,40 Q140,80 120,120 Q100,80 120,40" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="2"/>
                  <path d="M200,120 Q160,140 120,120 Q160,100 200,120" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="2"/>
                  <path d="M120,200 Q100,160 120,120 Q140,160 120,200" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="2"/>
                  <path d="M40,120 Q80,100 120,120 Q80,140 40,120" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="2"/>
                  <!-- 对角花瓣 -->
                  <path d="M160,60 Q140,90 120,120 Q150,100 160,60" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="1.5"/>
                  <path d="M180,160 Q150,140 120,120 Q150,150 180,160" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="1.5"/>
                  <path d="M60,180 Q90,150 120,120 Q90,150 60,180" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="1.5"/>
                  <path d="M60,60 Q90,90 120,120 Q90,90 60,60" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="1.5"/>
                  <!-- 装饰圆环 -->
                  <circle cx="120" cy="120" r="80" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="0.5" stroke-dasharray="2,4"/>
                  <circle cx="120" cy="120" r="60" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="1" stroke-dasharray="3,3"/>
                  <circle cx="120" cy="120" r="40" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1.5"/>
                  <!-- 端点装饰 -->
                  <circle cx="120" cy="40" r="4" fill="rgba(255,255,255,0.5)"/>
                  <circle cx="200" cy="120" r="4" fill="rgba(255,255,255,0.5)"/>
                  <circle cx="120" cy="200" r="4" fill="rgba(255,255,255,0.5)"/>
                  <circle cx="40" cy="120" r="4" fill="rgba(255,255,255,0.5)"/>
                  <!-- 中心 -->
                  <circle cx="120" cy="120" r="15" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="2"/>
                  <circle cx="120" cy="120" r="8" fill="rgba(255,255,255,0.4)"/>
                </svg>
                <div class="quote">"不要等待机会，而要创造机会。" — 乔布斯</div>
              </div>
            </div>
          </a-carousel-item>
          <a-carousel-item>
            <div class="ad-slide">
              <div class="pattern-wrapper">
                <svg width="360" height="360" viewBox="0 0 240 240">
                  <!-- 多层旋转方形 -->
                  <rect x="40" y="40" width="160" height="160" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="1" transform="rotate(0 120 120)"/>
                  <rect x="50" y="50" width="140" height="140" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1.5" transform="rotate(15 120 120)"/>
                  <rect x="60" y="60" width="120" height="120" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="1.5" transform="rotate(30 120 120)"/>
                  <rect x="70" y="70" width="100" height="100" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="2" transform="rotate(45 120 120)"/>
                  <rect x="80" y="80" width="80" height="80" fill="none" stroke="rgba(255,255,255,0.45)" stroke-width="1.5" transform="rotate(60 120 120)"/>
                  <rect x="90" y="90" width="60" height="60" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="1" transform="rotate(75 120 120)" stroke-dasharray="3,2"/>
                  <!-- 圆形装饰层 -->
                  <circle cx="120" cy="120" r="85" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="0.5" stroke-dasharray="5,5"/>
                  <circle cx="120" cy="120" r="70" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>
                  <circle cx="120" cy="120" r="55" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="0.5" stroke-dasharray="3,3"/>
                  <!-- 交叉十字线 -->
                  <line x1="40" y1="120" x2="200" y2="120" stroke="rgba(255,255,255,0.3)" stroke-width="1" stroke-dasharray="6,4"/>
                  <line x1="120" y1="40" x2="120" y2="200" stroke="rgba(255,255,255,0.3)" stroke-width="1" stroke-dasharray="6,4"/>
                  <line x1="60" y1="60" x2="180" y2="180" stroke="rgba(255,255,255,0.25)" stroke-width="0.5" stroke-dasharray="4,4"/>
                  <line x1="180" y1="60" x2="60" y2="180" stroke="rgba(255,255,255,0.25)" stroke-width="0.5" stroke-dasharray="4,4"/>
                  <!-- 角落装饰 -->
                  <circle cx="40" cy="40" r="3" fill="rgba(255,255,255,0.5)"/>
                  <circle cx="200" cy="40" r="3" fill="rgba(255,255,255,0.5)"/>
                  <circle cx="200" cy="200" r="3" fill="rgba(255,255,255,0.5)"/>
                  <circle cx="40" cy="200" r="3" fill="rgba(255,255,255,0.5)"/>
                  <!-- 中心复杂结构 -->
                  <polygon points="120,100 130,110 130,130 120,140 110,130 110,110" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="2"/>
                  <circle cx="120" cy="120" r="20" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1" stroke-dasharray="2,2"/>
                  <circle cx="120" cy="120" r="8" fill="rgba(255,255,255,0.5)"/>
                  <circle cx="120" cy="120" r="3" fill="rgba(255,255,255,0.9)"/>
                </svg>
                <div class="quote">"唯一不变的是变化本身。" — 赫拉克利特</div>
              </div>
            </div>
          </a-carousel-item>
        </a-carousel>
      </div>
    </div>
    <div class="right">
      <div class="login-card">
        <h2>{{ $t('login.title') }}</h2>
        <a-tabs v-model:active-key="tab">
          <a-tab-pane :title="$t('login.account')" key="account">
            <a-form @submit="onAccountLogin" :model="accountForm" layout="vertical">
              <a-form-item :label="$t('login.username')"><a-input v-model="accountForm.username" placeholder="请输入用户名/手机号/邮箱"/></a-form-item>
              <a-form-item :label="$t('login.password')"><a-input-password v-model="accountForm.password" placeholder="请输入密码"/></a-form-item>
              <div class="row"><a-checkbox v-model="rememberAccount">记住我</a-checkbox></div>
              <a-button type="primary" html-type="submit" long>{{ $t('login.login') }}</a-button>
            </a-form>
          </a-tab-pane>
          <a-tab-pane :title="$t('login.mobile')" key="mobile">
            <a-form @submit="onMobileLogin" :model="mobileForm" layout="vertical">
              <a-form-item :label="$t('login.mobileNo')"><a-input v-model="mobileForm.mobile" placeholder="请输入手机号/邮箱" /></a-form-item>
              <a-form-item :label="$t('login.captcha')">
                <a-space fill>
                  <a-input v-model="mobileForm.code" placeholder="请输入验证码" />
                  <a-button @click="sendCode">{{ $t('login.sendCode') }}</a-button>
                </a-space>
              </a-form-item>
              <div class="row"><a-checkbox v-model="rememberMobile">记住我</a-checkbox></div>
              <a-button type="primary" html-type="submit" long>{{ $t('login.login') }}</a-button>
            </a-form>
          </a-tab-pane>
          <a-tab-pane :title="$t('login.scanLogin')" key="scan">
            <div class="center" style="height:260px"><div class="qr">QR</div></div>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';
import http from '@/utils/http';
import { themes, applyTheme, DEEP_BLUE_INDEX } from '@/utils/theme';
const tab = ref('account');
const accountForm = reactive({ username: '', password: '' });
const mobileForm = reactive({ mobile: '', code: '' });
const rememberAccount = ref(false); const rememberMobile = ref(false);
onMounted(() => {
  // 应用默认主题
  applyTheme(themes[DEEP_BLUE_INDEX]);
  const acc = localStorage.getItem('rememberAccount'); if (acc) { Object.assign(accountForm, JSON.parse(acc)); rememberAccount.value = true; }
  const mob = localStorage.getItem('rememberMobile'); if (mob) { Object.assign(mobileForm, JSON.parse(mob)); rememberMobile.value = true; }
});
async function onAccountLogin() {
  const resp = await http.post('/login', accountForm);
  if (resp.data.code === 0) {
    if (rememberAccount.value) localStorage.setItem('rememberAccount', JSON.stringify(accountForm)); else localStorage.removeItem('rememberAccount');
    localStorage.setItem('token', resp.data.data.token); localStorage.setItem('userName', accountForm.username || '管理员'); window.location.href = '/';
  }
}
async function onMobileLogin() {
  const resp = await http.post('/login-mobile', mobileForm);
  if (resp.data.code === 0) {
    if (rememberMobile.value) localStorage.setItem('rememberMobile', JSON.stringify(mobileForm)); else localStorage.removeItem('rememberMobile');
    localStorage.setItem('token', resp.data.data.token); localStorage.setItem('userName', '手机用户'); window.location.href = '/';
  }
}
async function sendCode() { await http.post('/send-code', { mobile: mobileForm.mobile }); }
</script>

<style scoped lang="scss">
.login-wrap { height: 100vh; display: grid; grid-template-columns: 60% 40%;
  .left { background: #102542; display:flex; align-items:center; justify-content:center;
    .ad-panel { width: 76%; max-width: 760px;
      :deep(.arco-carousel) { height: 480px; }
      :deep(.arco-carousel-indicator-wrapper) { bottom: 10px; }
    }
    .ad-slide { height: 480px; border-radius: 12px; background: rgba(255,255,255,.08); display:flex; align-items:center; justify-content:center; box-shadow: none; }
    .pattern-wrapper { display: flex; flex-direction: column; align-items: center; gap: 16px; }
    .quote { color: rgba(255,255,255,0.85); font-size: 15px; text-align: center; font-style: italic; max-width: 500px; padding: 0 20px; line-height: 1.6; }
  }
  .right { display:flex; align-items:center; justify-content:center; background: var(--body-bg);
    .login-card { width: 460px; background: var(--content-bg); color: var(--content-fg); border-radius: 2px; padding: 24px; box-shadow: 0 8px 32px rgba(0,0,0,.08); }
  }
}
.qr { width: 200px; height: 200px; background: #fff; border-radius: 6px; display:grid; place-items:center; color:#333; }
.row { margin: 6px 0 12px; }
</style>
<style scoped>
:deep(.arco-btn-primary){ background-color: #102542 !important; border-color: #102542 !important; }
:deep(a){ color: #102542 !important; }
</style>
