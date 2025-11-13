<template>
  <div class="remote-page">
    <a-card :title="pageTitle" :bordered="false">
      <div class="page-content">
        <a-empty v-if="!$route.meta.content" description="暂无内容">
          <template #image>
            <icon-file />
          </template>
        </a-empty>
        <div v-else v-html="$route.meta.content"></div>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { IconFile } from '@arco-design/web-vue/es/icon';
const route = useRoute();
const pageTitle = computed(() => (route.meta?.title as string) || route.name || '远程页面');
</script>

<style lang="scss" scoped>
.remote-page { padding: 20px;
  .page-content { min-height: 400px;
    :deep(h1), :deep(h2), :deep(h3) { margin-top: 1em; margin-bottom: 0.5em; }
    :deep(p) { margin-bottom: 1em; line-height: 1.6; }
    :deep(ul), :deep(ol) { margin-left: 2em; margin-bottom: 1em; }
  }
}
</style>
