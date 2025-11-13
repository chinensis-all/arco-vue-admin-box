<template>
  <div class="tabbar">
    <div v-for="(t,i) in tabs" :key="t.path + i" class="tab" :class="{ active: t.path === route.fullPath }" @click="go(t.path)">
      <span class="title">{{ t.title }}</span>
      <span class="close" @click.stop="close(i, t.path)">×</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
const route = useRoute(); const router = useRouter();
const tabs = ref<{path:string,title:string}[]>(JSON.parse(localStorage.getItem('tabs') || '[]'));
function sync(){ tabs.value = JSON.parse(localStorage.getItem('tabs') || '[]'); }
onMounted(() => { window.addEventListener('storage', sync); });
function go(path:string){ router.push(path); }
function close(index:number, path:string){
  const arr = JSON.parse(localStorage.getItem('tabs') || '[]');
  arr.splice(index,1); localStorage.setItem('tabs', JSON.stringify(arr)); sync();
  if (route.fullPath === path) { const t = arr[index-1] || arr[index] || { path: '/' }; router.push(t.path); }
}
</script>

<style scoped>
.tabbar { height: 36px; display:flex; align-items:center; gap:8px; padding: 0 12px; border-top:1px solid rgba(0,0,0,.06); border-bottom:1px solid rgba(0,0,0,.06); background: var(--header-bg); }
.tab { display:flex; align-items:center; gap:8px; padding:0 10px; height:26px; border:1px solid #999; border-radius: 4px; cursor: pointer; background:#fff; color: #999; }
.tab.active { border-color: #16a34a; color: #16a34a; }
.title{ font-size:12px; }
.close{ font-weight:700; line-height:1; cursor:pointer; }
</style>
