<template>
  <div class="full-height flex-row" :style="{ background: 'var(--body-bg)', color: 'var(--body-fg)'}">
    <aside :style="siderStyle" class="flex-col" :class="[{collapsed}]">
      <div class="sider-top flex-fixed">
        <div class="logo">
          <img class="logo-img" src="@/assets/logo.svg" alt="logo" />
          <span v-if="!collapsed" class="logo-title">{{ appName }}</span>
        </div>
      </div>
      <div class="sider-menu flex-1">
        <a-scrollbar style="height:100%">
          <a-menu :collapsed="collapsed" :style="{ width: collapsed ? '64px' : '242px', background: 'transparent' }" :selected-keys="[activeKey]" :default-open-keys="['dash', 'system']" :accordion="true" @menu-item-click="go">
            <a-sub-menu key="dash">
              <template #icon><icon-apps :class="collapsed ? 'icon-22' : 'icon-16'" /></template>
              <template #title>仪表盘</template>
              <a-menu-item key="/">主页</a-menu-item>
            </a-sub-menu>
            <a-sub-menu key="system">
              <template #icon><icon-settings :class="collapsed ? 'icon-22' : 'icon-16'" /></template>
              <template #title>Agent参考示例</template>
              <a-menu-item key="/system/user">Restful CRUD</a-menu-item>
              <a-menu-item key="/profile">个人资料</a-menu-item>
              <a-menu-item key="/complex-form">复杂分步表单</a-menu-item>
              <a-menu-item key="/group-form">复杂分组表单</a-menu-item>
              <a-menu-item key="/tree-crud">树状数据CRUD</a-menu-item>
            </a-sub-menu>
          </a-menu>
        </a-scrollbar>
      </div>
    </aside>

    <section class="main-section flex-col flex-1">
      <header class="header flex-fixed">
        <div class="header-inner">
          <div class="left">
            <a-button type="text" class="collapse-btn" @click="collapsed = !collapsed">
              <icon-menu-unfold v-if="collapsed" class="icon-22" />
              <icon-menu-fold v-else class="icon-22" />
            </a-button>

            <a-input-search :placeholder="$t('app.search') as string" allow-clear style="width: 280px" />
            <div class="quick-menu">
              <span class="qm-label">快捷菜单：</span>
              <template v-for="(m,i) in quickMenus" :key="i"><a-link :href="m.key">{{m.name}}</a-link></template>
            </div>
          </div>
          <div class="right" style="padding-right: 12px;">
            <a-space :size="10" align="center">
              <a-select :model-value="lang" style="width:120px" @change="onLang">
                <a-option value="zh">中文</a-option>
                <a-option value="en">English</a-option>
              </a-select>
              <a-switch v-model="isDark" @change="toggleDark">
                <template #checked><icon-moon-fill class="icon-15" /></template>
                <template #unchecked><icon-sun-fill class="icon-15" /></template>
              </a-switch>
              <a-button type="text" @click="toggleFullscreen"><icon-fullscreen v-if="!fullscreen" class="icon-16" /><icon-fullscreen-exit v-else class="icon-15" /></a-button>
              <a-button type="text" @click="settingsVisible = true"><icon-settings class="icon-16" /></a-button>
              <a-badge :count="inboxCount" :dot="false"><a-button type="text" @click="openInbox"><icon-notification class="icon-16" /></a-button></a-badge>
              <a-badge :count="mailCount" :dot="false" style="margin-right: 12px"><a-button type="text" @click="openMails"><icon-email class="icon-16" /></a-button></a-badge>
              <a-dropdown trigger="click">
                <a-avatar style="cursor:pointer">A</a-avatar>
                <template #content>
                  <div class="avatar-menu">
                    <a-doption @click="goProfile">{{ $t('header.profile') }}</a-doption>
                    <a-doption @click="logout">{{ $t('header.logout') }}</a-doption>
                  </div>
                </template>
              </a-dropdown>
            </a-space>
          </div>
        </div>
        <TabBar style="padding: 18px 42px" />
      </header>

      <div class="body-scroll-container">
        <div class="body-content-wrapper">
          <main class="content">
            <router-view />
          </main>
          <footer class="footer">
            <div class="footer-inner">
              <div class="left">© 2025 <a href="https://mayanshe.com">码研社</a> V1.0.0</div>
              <div class="right"><a-space><a-link href="https://zhangxihai.cn">关于我们</a-link><a-link href="https://github.com/chinensis-all/arco-vue-admin-box" target="_blank">代码仓库</a-link><a-link href="https://github.com/chinensis-all/arco-vue-admin-box/issues" target="_blank">Issues</a-link></a-space></div>
            </div>
          </footer>
        </div>
      </div>
    </section>

    <a-drawer :width="420" :visible="settingsVisible" unmount-on-close @ok="settingsVisible=false" @cancel="settingsVisible=false">
      <template #title>配置</template>
      <div class="theme-grid">
        <div v-for="(t,i) in themes" :key="i" class="theme-swatch" :style="{ background: t.preview }" @click="applyThemeIdx(i)" :title="'主题 ' + (i+1) + (i===deepBlueIdx?'（深蓝默认）':'')"></div>
      </div>
    </a-drawer>

    <a-drawer :width="420" :visible="inboxVisible" unmount-on-close @ok="inboxVisible=false" @cancel="inboxVisible=false">
      <template #title>站内信</template>
      <a-tabs default-active-key="notice">
        <a-tab-pane key="notice" title="通知"><a-list :data="notices"><template #item="{item}"><a-list-item>{{ item.title }}</a-list-item></template></a-list></a-tab-pane>
        <a-tab-pane key="alert" title="报警"><a-list :data="alerts"><template #item="{item}"><a-list-item>{{ item.title }}</a-list-item></template></a-list></a-tab-pane>
        <a-tab-pane key="chat" title="对话"><a-list :data="chats"><template #item="{item}"><a-list-item>{{ item.title }}</a-list-item></template></a-list></a-tab-pane>
      </a-tabs>
    </a-drawer>

    <a-drawer :width="480" :visible="mailsVisible" unmount-on-close @ok="mailsVisible=false" @cancel="mailsVisible=false">
      <template #title>邮件</template>
      <a-list :data="mails"><template #item="{item}"><a-list-item><a-list-item-meta :title="item.subject" :description="item.date" /></a-list-item></template></a-list>
      <div style="text-align:center;margin-top:12px"><a-button type="outline">更多</a-button></div>
    </a-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import TabBar from '@/components/TabBar.vue';
import {
  IconHome, IconSettings, IconShareExternal, IconApps, IconMenuFold, IconMenuUnfold,
  IconFullscreen, IconFullscreenExit, IconMoonFill, IconSunFill, IconNotification, IconEmail
} from '@arco-design/web-vue/es/icon';
import { themes, applyTheme, persistThemeIndex, loadPersistedThemeIndex, DEEP_BLUE_INDEX } from '@/utils/theme';

const router = useRouter();
const route = useRoute();

const appName = 'Arco Vue Admin';
const collapsed = ref(false);
const activeKey = computed(() => route.path);

const quickMenus = ref(JSON.parse(localStorage.getItem('quickMenus') || '[]'));
window.addEventListener('storage', () => { quickMenus.value = JSON.parse(localStorage.getItem('quickMenus') || '[]'); });

const { locale } = useI18n(); const lang = computed(() => locale.value); function onLang(v:string){ locale.value = v; }

const isDark = ref(false);
function setThemeMode(mode:'light'|'dark'){ document.documentElement.setAttribute('data-theme', mode); }
const deepBlueIdx = DEEP_BLUE_INDEX;
function toggleDark(v: boolean | string | number){
  const dark = typeof v === 'boolean' ? v : !!v;
  if(dark){
    isDark.value = true; setThemeMode('dark');
    const blackIdx = themes.findIndex(t => t.preview === '#000000'); const idx = blackIdx >= 0 ? blackIdx : 12;
    applyTheme(themes[idx]); persistThemeIndex(idx);
  } else {
    isDark.value = false; setThemeMode('light');
    applyTheme(themes[deepBlueIdx]); persistThemeIndex(deepBlueIdx);
  }
}

const fullscreen = ref(false);
function toggleFullscreen(){ if (!document.fullscreenElement) { document.documentElement.requestFullscreen(); fullscreen.value = true; } else { document.exitFullscreen(); fullscreen.value = false; } }

const settingsVisible = ref(false);
const inboxVisible = ref(false);
const mailsVisible = ref(false);
const inboxCount = ref(3);
const mailCount = ref(12);
function openInbox(){ inboxVisible.value = true; inboxCount.value = 0; }
function openMails(){ mailsVisible.value = true; mailCount.value = 0; }

const notices = ref([{title:'23:00 服务器维护'}]);
const alerts = ref([{title:'node-3 CPU 使用率过高'}]);
const chats = ref([{title:'Alice：请审核 PR'}]);
const mails = ref([{subject:'欢迎使用系统', date:'2025-11-01'}]);

function go(key:string){ if (key) router.push(key); }
function goProfile(){}
function logout(){ localStorage.removeItem('token'); router.push('/login'); }

const siderStyle = computed(()=> ({ background: 'var(--sider-bg)', color: 'var(--sider-fg)', width: collapsed.value ? '64px' : '242px' }));

function applyThemeIdx(idx: number) {
  applyTheme(themes[idx]);
  persistThemeIndex(idx);
  isDark.value = (themes[idx].preview === '#000000');
}

onMounted(()=>{
  setThemeMode('light');
  const persisted = loadPersistedThemeIndex();
  const idx = (persisted == null) ? deepBlueIdx : persisted;
  applyTheme(themes[idx]);
  isDark.value = (themes[idx].preview === '#000000');
});
</script>

<style scoped lang="scss">
aside { display:flex; flex-direction:column; height:100vh; box-shadow: 2px 0 0 rgba(0,0,0,.02);
  .sider-top { height:56px; padding: 8px 12px; display:flex; align-items:center; padding-top: 24px; }
  .logo { display:flex; align-items:center; gap:10px; color: var(--sider-fg); font-weight:600;  }
  .logo-img { height: 32px; width: 32px; border-radius: 6px; }
  .logo-title { white-space:nowrap; overflow:hidden; text-overflow: ellipsis; font-size: 17px; }
  .sider-menu { overflow:auto; padding-top: 12px }
}
aside.collapsed .logo-title { display:none; }

:deep(.arco-menu){ background: transparent !important; color: var(--sider-fg); font-size: 15px; }
:deep(.arco-menu-inline-header), :deep(.arco-menu-item){ color: var(--sider-fg); background: transparent !important; }
:deep(.arco-menu-inner){ background: transparent !important; }
:deep(.arco-menu-pop){ background: transparent !important; }
:deep(.arco-menu-inline-content){ background: transparent !important; }
:deep(.arco-menu-inline-content .arco-menu-item){ padding-left: 24px !important; color: #f4f7f9 !important; }
:deep(.arco-menu-item:hover), :deep(.arco-menu-inline-header:hover){ background: color-mix(in srgb, #ffffff 18%, var(--sider-bg)) !important; }
:deep(.arco-menu-inline-header.arco-menu-selected){ background: transparent !important; }
:deep(.arco-menu-inline-content .arco-menu-item.arco-menu-selected){ background: color-mix(in srgb, #ffffff 12%, var(--sider-bg)) !important; color: rgba(255, 255, 255, 0.6) !important; }

aside.collapsed {
  :deep(.arco-menu) {
    margin-left: 2px;
  }
}

.header { position: sticky; top: 0; z-index: 100; background: var(--header-bg); color: var(--header-fg); border-bottom: 1px solid rgba(0,0,0,.06); box-shadow: 0 2px 0 rgba(0,0,0,.02);
  .header-inner { height: 56px; display:flex; align-items:center; justify-content:space-between; padding: 0 12px; gap: 12px; }
  .left { display:flex; align-items:center; gap: 12px; font-size: 12px; }
  .right { display:flex; align-items:center; font-size: 12px; }
  .collapse-btn { color: var(--header-fg); }
  .quick-menu { display:flex; align-items:center; gap: 10px; margin-left: 12px; }
  .qm-label { color: var(--header-fg); opacity: .7;  font-size: 14px;}
}
.icon-15 { font-size: 15px; }

.icon-16 { font-size: 16px; }

.icon-18 { font-size: 18px; }

.icon-22 { font-size: 22px; }

.icon-24 { font-size: 24px; }

.main-section { 
  display: flex; 
  flex-direction: column; 
  height: 100vh; 
  overflow: hidden;
}

.body-scroll-container {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0;
}

.body-content-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

.content { 
  flex: 1;
  background: transparent; 
  color: var(--content-fg); 
  display: flex; 
  flex-direction: column;
  padding: 0 22px;
}

.content-inner {
  padding: 16px;
}

.footer { background: var(--footer-bg); color: var(--footer-fg); }
.footer .footer-inner { height:56px; display:flex; align-items:center; justify-content:space-between; padding: 0 16px; }

.theme-grid{ display:grid; grid-template-columns: repeat(6, 1fr); gap: 10px 12px; padding: 12px; }
.theme-swatch{ height:28px; border-radius:2px; cursor:pointer; box-shadow: 0 0 0 1px rgba(0,0,0,.06) inset; }

.avatar-menu { width: 160px; padding: 6px; }
</style>
