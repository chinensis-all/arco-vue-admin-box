import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { Notification } from '@arco-design/web-vue';
import router from '@/router';

const instance: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 10000
});

instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    (config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

instance.interceptors.response.use(
  (resp: AxiosResponse) => {
    console.log('[HTTP Response]', resp.config.url, resp.data);
    return resp;
  },
  (error) => {
    console.error('HTTP error:', error);
    
    const status = error.response?.status;
    const message = error.response?.data?.message || '请求失败';
    
    if (status === 404) {
      // 跳转到404页面
      router.push('/404');
    } else if (status === 401) {
      // 跳转到登录页面
      router.push('/login');
    } else if (status && (status >= 400 && status < 600)) {
      // 其他400/500错误
      Notification.error({
        title: 'Error',
        content: message
      });
    }
    
    return Promise.reject(error);
  }
);

export default instance;
