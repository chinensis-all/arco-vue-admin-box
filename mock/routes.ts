import { MockMethod } from 'vite-plugin-mock';
import userMocks from './user';
import categoryMocks from './category';

export default [
  ...userMocks,
  ...categoryMocks,
  { url: '/api/login', method: 'post', response: () => ({ code: 0, data: { token: 'token_abc' }}) },
  { url: '/api/login-mobile', method: 'post', response: () => ({ code: 0, data: { token: 'token_m_abc' }}) },
  { url: '/api/send-code', method: 'post', response: () => ({ code: 0, data: true }) },
  { url: '/api/routes', method: 'get', response: () => ({ code: 0, data: [] }) },
  // home mocks
  { url: '/api/home/hot-products', method: 'get', response: () => {
    const products = [
      { name: 'iPhone 15 Pro Max', sales: 2845 },
      { name: '华为 Mate 60 Pro', sales: 2356 },
      { name: '小米 14 Ultra', sales: 1987 },
      { name: 'MacBook Pro M3', sales: 1654 },
      { name: '索尼 WH-1000XM5', sales: 1423 },
      { name: 'iPad Air 2024', sales: 1298 },
      { name: 'Apple Watch Ultra 2', sales: 1156 },
      { name: 'AirPods Pro 3', sales: 987 },
      { name: '戴森吹风机', sales: 856 },
      { name: '罗技 MX Master 3S', sales: 745 }
    ];
    return {
      code: 0,
      data: products.map((p, i) => ({
        rank: i + 1,
        name: p.name,
        sales: p.sales,
        mom: (15 - i * 1.2 + Math.random() * 3).toFixed(1) + '%',
        momUp: i < 7
      }))
    };
  }},
  { url: '/api/home/monthly-sales', method: 'get', response: () => {
    const categories = [
      { name: '智能手机', amount: 128500 },
      { name: '笔记本电脑', amount: 96800 },
      { name: '平板电脑', amount: 78600 },
      { name: '智能穿戴', amount: 65400 },
      { name: '音频设备', amount: 54200 },
      { name: '家用电器', amount: 48900 },
      { name: '数码配件', amount: 39800 },
      { name: '摄影器材', amount: 32600 },
      { name: '游戏设备', amount: 28400 },
      { name: '智能家居', amount: 22700 }
    ];
    return {
      code: 0,
      data: categories.map((c, i) => ({
        rank: i + 1,
        name: c.name,
        amount: c.amount,
        yoy: (25 - i * 1.8 + Math.random() * 4).toFixed(1) + '%',
        yoyUp: i < 6
      }))
    };
  }}
] as MockMethod[];
