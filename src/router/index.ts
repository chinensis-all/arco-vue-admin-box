import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import http from '@/utils/http';

const localRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'root',
    component: () => import('@/views/layout/MainLayout.vue'),
    children: [
      { path: '', name: 'home', component: () => import('@/views/home/Home.vue'), meta: { title: '主页' } },
      {
        path: '/system/user',
        name: 'user',
        component: () => import('@/views/user/index.vue'),
        meta: {
          title: 'Restful CRUD',
          buttons: ['user:add', 'user:modify', 'user:forbid', 'user:activate', 'user:modify-role']
        }
      },
      {
        path: '/profile',
        name: 'profile',
        component: () => import('@/views/profile/index.vue'),
        meta: { title: '个人资料' }
      },
      {
        path: '/complex-form',
        name: 'complexForm',
        component: () => import('@/views/complex-form/index.vue'),
        meta: {
          title: '复杂分步表单',
          buttons: ['user:add', 'user:modify', 'user:forbid', 'user:activate']
        }
      },
      {
        path: '/complex-form/:action/:id?',
        name: 'complexFormEdit',
        component: () => import('@/views/complex-form/form.vue'),
        meta: {
          title: '表单编辑'
        }
      },
      {
        path: '/group-form',
        name: 'groupForm',
        component: () => import('@/views/group-form/index.vue'),
        meta: {
          title: '复杂分组表单',
          buttons: ['user:add', 'user:modify', 'user:forbid', 'user:activate']
        }
      },
      {
        path: '/group-form/:action/:id?',
        name: 'groupFormEdit',
        component: () => import('@/views/group-form/form.vue'),
        meta: {
          title: '表单编辑'
        }
      },
      {
        path: '/tree-crud',
        name: 'treeCrud',
        component: () => import('@/views/tree-crud/index.vue'),
        meta: {
          title: '树状数据CRUD'
        }
      }
    ]
  },
  { path: '/login', name: 'login', component: () => import('@/views/login/Login.vue'), meta: { title: '登录' } },
  { path: '/404', name: 'notFound', component: () => import('@/views/error/NotFound.vue'), meta: { title: '页面未找到' } },
  { path: '/:pathMatch(.*)*', redirect: '/404' }
];

const router = createRouter({ history: createWebHistory(), routes: localRoutes });

export async function initRemoteRoutes() {
  try {
    const resp = await http.get('/routes');
    const list = (resp.data && resp.data.data) || [];
    const toAdd: RouteRecordRaw[] = list.map((r: any) => ({
      path: r.path, name: r.name, component: () => import('@/views/remote/RemotePage.vue'), meta: r.meta || {}
    }));
    toAdd.forEach(rt => { if (!router.hasRoute(rt.name as string)) router.addRoute('root', rt); });
  } catch (e) { console.warn('获取远程路由失败:', e); }
}

router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('token');
  if (!token && to.path !== '/login') next('/login');
  else next();
});

router.afterEach((to) => {
  if (to.path === '/login') return;
  
  let title = (to.meta && (to.meta as any).title) || to.name || to.path;
  
  // 特殊处理：复杂表单的动态标题
  if (to.name === 'complexFormEdit') {
    if (to.params.action === 'add') {
      title = '添加新用户';
    } else if (to.params.action === 'edit') {
      title = `编辑用户: ${to.params.id}`;
    }
  }
  
  // 特殊处理：分组表单的动态标题
  if (to.name === 'groupFormEdit') {
    if (to.params.action === 'add') {
      title = '添加新用户';
    } else if (to.params.action === 'edit') {
      title = `编辑用户: ${to.params.id}`;
    }
  }
  
  document.title = String(title) + ' - Arco Vue Admin Box';
  const tabs = JSON.parse(localStorage.getItem('tabs') || '[]');
  // 使用path进行去重判断
  const existingIndex = tabs.findIndex((t:any)=> t.path === to.fullPath);
  if (existingIndex === -1) {
    tabs.push({ path: to.fullPath, title: String(title) });
  } else {
    // 如果已存在，更新标题
    tabs[existingIndex].title = String(title);
  }
  localStorage.setItem('tabs', JSON.stringify(tabs));
  window.dispatchEvent(new Event('storage'));
});

export default router;
