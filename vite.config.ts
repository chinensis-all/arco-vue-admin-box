import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { viteMockServe } from 'vite-plugin-mock';

export default defineConfig(({ command }) => ({
  plugins: [
    vue(),
    viteMockServe({
      mockPath: 'mock',
      enable: command === 'serve'
    })
  ],
  resolve: { alias: { '@': '/src' } },
  css: { preprocessorOptions: { scss: { additionalData: `@use "@/styles/variables.scss" as *;` } } },
  server: { port: 5173 }
}));
