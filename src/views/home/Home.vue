<template>
  <div class="home-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <a-breadcrumb>
        <a-breadcrumb-item>仪表盘</a-breadcrumb-item>
        <a-breadcrumb-item>主页</a-breadcrumb-item>
      </a-breadcrumb>
      <a-button type="text" @click="addToQuickMenu">
        <template #icon>
          <icon-star />
        </template>
        加入快捷菜单
      </a-button>
    </div>

    <!-- 仪表盘内容 -->
    <div class="dashboard">
    <a-row :gutter="16" class="mb-16">
      <a-col :span="24">
        <a-card :bordered="false" class="welcome-card">
          <div class="welcome">
            <div class="left">
              <h2>欢迎回来，{{ userName }}</h2>
              <p>上次登录 IP：{{ lastLogin.ip }}　上次登录时间：{{ lastLogin.time }}</p>
            </div>
            <div class="right">
              <icon-face-smile-fill class="welcome-icon" />
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="16" class="mb-16">
      <a-col :span="6" v-for="k in kpis" :key="k.title">
        <a-card hoverable>
          <div class="kpi">
            <div class="kpi-title">{{ k.title }}</div>
            <div class="kpi-value">{{ k.value }}</div>
            <div class="kpi-trend" :class="k.up ? 'up' : 'down'">
              <span>{{ k.up ? '↑' : '↓' }} {{ k.trend }}</span>
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="16" class="mb-16">
      <a-col :span="12">
        <a-card title="本月热销商品" extra="Top 5" class="fixed-height-card">
          <a-space direction="vertical" :size="12" style="width: 100%">
            <div v-for="(item, index) in topProducts" :key="index" class="product-item">
              <div class="product-rank">{{ index + 1 }}</div>
              <div class="product-info">
                <div class="product-name">{{ item.name }}</div>
                <div class="product-sales">销量: {{ item.sales }}</div>
              </div>
              <div class="product-trend" :class="item.up ? 'trend-up' : 'trend-down'">
                {{ item.up ? '↑' : '↓' }} {{ item.trend }}
              </div>
            </div>
          </a-space>
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card title="本月销售区域占比" class="fixed-height-card">
          <v-chart :option="pieOption" style="height:300px" autoresize />
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="16" class="mb-16">
      <a-col :span="24">
        <a-card title="销售趋势（本月）">
          <v-chart :option="lineBarOption" style="height:380px" autoresize />
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="16" class="mb-16">
      <a-col :span="12">
        <a-card title="品类销售排行" extra="前 6 名" class="fixed-height-card-2">
          <a-space direction="vertical" :size="12" style="width: 100%">
            <div v-for="(item, index) in topCategories" :key="index" class="category-item">
              <div class="category-rank">{{ index + 1 }}</div>
              <div class="category-info">
                <div class="category-name">{{ item.name }}</div>
                <div class="category-amount">¥{{ item.amount.toLocaleString() }}</div>
              </div>
              <div class="category-percent" :style="{width: item.percent + '%'}">
                <span>{{ item.percent }}%</span>
              </div>
            </div>
          </a-space>
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card title="系统信息" class="fixed-height-card-2">
          <a-descriptions :column="2" bordered size="small">
            <a-descriptions-item label="系统版本">v1.0.0</a-descriptions-item>
            <a-descriptions-item label="运行时">Vue 3 + Vite 5</a-descriptions-item>
            <a-descriptions-item label="UI 框架">Arco Design Vue</a-descriptions-item>
            <a-descriptions-item label="图表">ECharts</a-descriptions-item>
            <a-descriptions-item label="最近构建">2025-11-12</a-descriptions-item>
            <a-descriptions-item label="节点数">3</a-descriptions-item>
          </a-descriptions>
          <a-divider />
          <a-timeline reverse>
            <a-timeline-item>09:00 同步销量数据</a-timeline-item>
            <a-timeline-item>08:20 清理历史日志</a-timeline-item>
            <a-timeline-item>08:00 系统启动</a-timeline-item>
          </a-timeline>
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="16" class="mb-16">
      <a-col :span="12" v-for="n in 2" :key="'extra-'+n">
        <a-card :title="'通知公告 #' + n">
          <a-list :data="notices">
            <template #item="{ item }">
              <a-list-item>{{ item }}</a-list-item>
            </template>
          </a-list>
        </a-card>
      </a-col>
    </a-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { IconFaceSmileFill, IconStar } from '@arco-design/web-vue/es/icon';
import { Message } from '@arco-design/web-vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart, BarChart, LineChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components';
import VChart from 'vue-echarts';
import http from '@/utils/http';
use([CanvasRenderer, PieChart, BarChart, LineChart, TitleComponent, TooltipComponent, LegendComponent, GridComponent]);

// 加入快捷菜单
const addToQuickMenu = () => {
  const list = JSON.parse(localStorage.getItem('quickMenus') || '[]');
  const titleText = '主页';
  const current = { key: '/', name: titleText };
  
  const existed = list.findIndex((x: any) => x.key === current.key);
  if (existed >= 0) {
    Message.info('已经在快捷菜单中');
    return;
  }
  
  list.unshift(current);
  while (list.length > 3) {
    list.pop();
  }
  
  localStorage.setItem('quickMenus', JSON.stringify(list));
  window.dispatchEvent(new Event('storage'));
  Message.success('已加入快捷菜单');
};

const userName = ref(localStorage.getItem('userName') || '管理员');
const lastLogin = ref({ ip: '203.0.113.12', time: '2025-11-11 22:18:31' });

const kpis = ref([
  { title: '用户总数', value: '12,432', trend: '12%', up: true },
  { title: '新增订单', value: '1,203', trend: '5.6%', up: true },
  { title: '本月收入', value: '¥58,700', trend: '8.1%', up: true },
  { title: '系统告警', value: '2', trend: '60%', up: false },
]);

const topProducts = ref([
  { name: 'iPhone 15 Pro Max', sales: 2845, trend: '15.2%', up: true },
  { name: '华为 Mate 60 Pro', sales: 2356, trend: '13.8%', up: true },
  { name: '小米 14 Ultra', sales: 1987, trend: '12.4%', up: true },
  { name: 'MacBook Pro M3', sales: 1654, trend: '11.0%', up: true },
  { name: '索尼 WH-1000XM5', sales: 1423, trend: '9.6%', up: true }
]);

const topCategories = ref([
  { name: '智能手机', amount: 128500, percent: 100 },
  { name: '笔记本电脑', amount: 96800, percent: 75 },
  { name: '平板电脑', amount: 78600, percent: 61 },
  { name: '智能穿戴', amount: 65400, percent: 51 },
  { name: '音频设备', amount: 54200, percent: 42 },
  { name: '家用电器', amount: 48900, percent: 38 }
]);

const hotProducts = ref<any[]>([]);

const monthlySales = ref<any[]>([]);

const pieOption = ref({
  tooltip: { trigger: 'item' },
  legend: { top: 'bottom' },
  series: [{
    type: 'pie', radius: ['40%', '65%'], label: { formatter: '{b}: {d}%' },
    data: [
      { value: 40, name: '华东' }, { value: 22, name: '华北' }, { value: 18, name: '华南' }, { value: 12, name: '西南' }, { value: 8, name: '其他' },
    ]
  }]
});

const days = Array.from({length: 30}).map((_,i)=> i+1);
const lineBarOption = ref({
  tooltip: { trigger: 'axis' },
  legend: { data: ['销售额', '新增用户'] },
  grid: { left: 40, right: 20, bottom: 30, top: 30 },
  xAxis: { type: 'category', data: days.map(d=> String(d)) },
  yAxis: [{ type: 'value', name: '销售额' }, { type: 'value', name: '新增用户' }],
  series: [
    { name: '销售额', type: 'bar', data: days.map(()=> Math.floor(Math.random()*120 + 30)) },
    { name: '新增用户', type: 'line', yAxisIndex: 1, smooth: true, data: days.map(()=> Math.floor(Math.random()*60 + 10)) }
  ]
});

const notices = ref(['双 11 活动复盘会议 15:00 开始','生产数据库将于 23:00 进行备份','新版本 v1.0.0 已发布']);

onMounted(async () => {
  try { 
    const hp = await http.get('/home/hot-products'); 
    if (hp?.data?.data) hotProducts.value = hp.data.data;
  } catch (e) {
    console.error('获取热销商品失败:', e);
  }
  try { 
    const ms = await http.get('/home/monthly-sales'); 
    if (ms?.data?.data) monthlySales.value = ms.data.data;
  } catch (e) {
    console.error('获取销量排序失败:', e);
  }
});
</script>

<style scoped lang="scss">
.home-page {
  padding: 20px;

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }
}

.dashboard { padding: 4px 0; }
.mb-16 { margin-bottom: 16px; }
.welcome-card { 
  background: linear-gradient(135deg, 
    rgba(var(--primary-6), 0.12) 0%, 
    rgba(var(--primary-6), 0.08) 100%);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100%;
    background-image: 
      repeating-linear-gradient(
        90deg,
        transparent,
        transparent 50px,
        rgba(var(--primary-6), 0.05) 50px,
        rgba(var(--primary-6), 0.05) 100px
      );
    mask-image: url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,60 Q25,20 50,60 T100,60 T150,60 T200,60 T250,60 T300,60 T350,60 T400,60 T450,60 T500,60 T550,60 T600,60 T650,60 T700,60 T750,60 T800,60 T850,60 T900,60 T950,60 T1000,60 T1050,60 T1100,60 T1150,60 T1200,60 T1250,60 T1300,60 T1350,60 T1400,60 T1450,60 T1500,60 T1550,60 T1600,60 T1650,60 T1700,60 T1750,60 T1800,60 T1850,60 T1900,60 T1950,60 T2000,60 L2000,120 L0,120 Z' fill='white' /%3E%3C/svg%3E");
    mask-size: 100px 120px;
    mask-repeat: repeat-x;
    mask-position: bottom;
    pointer-events: none;
    opacity: 0.6;
  }
  
  :deep(.arco-card-body) {
    position: relative;
    z-index: 1;
  }
}
.welcome { display:flex; align-items:center; justify-content:space-between; min-height: 120px; }
.welcome .left h2 { margin: 0 0 8px 0; font-weight: 700; }
.welcome .left p { margin: 0; opacity: .8; }
.welcome .right .welcome-icon { font-size: 48px; color: var(--primary-color); }
.kpi { display:flex; align-items:center; justify-content:space-between; }
.kpi-title { color: #64748b; }
.kpi-value { font-size: 24px; font-weight: 700; }
.kpi-trend { font-weight: 600; }
.kpi-trend.up { color: #16a34a; }
.kpi-trend.down { color: #ef4444; }

.product-item, .category-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.02);
  transition: all 0.2s;
  &:hover { background: rgba(0, 0, 0, 0.04); }
}

.product-rank, .category-rank {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary-color);
  color: white;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.product-info, .category-info {
  flex: 1;
  min-width: 0;
}

.product-name, .category-name {
  font-weight: 500;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-sales, .category-amount {
  font-size: 12px;
  color: #64748b;
}

.product-trend {
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
  &.trend-up { color: #16a34a; }
  &.trend-down { color: #ef4444; }
}

.category-percent {
  height: 20px;
  background: linear-gradient(90deg, var(--primary-color), rgba(var(--primary-6), 0.6));
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 8px;
  min-width: 60px;
  span {
    color: white;
    font-size: 11px;
    font-weight: 600;
  }
}

.fixed-height-card {
  :deep(.arco-card-body) {
    height: 390px;
    overflow-y: auto;
  }
}

.fixed-height-card-2 {
  :deep(.arco-card-body) {
    height: 390px;
    overflow: hidden;
  }
}
</style>
