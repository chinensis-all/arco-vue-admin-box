<template>
  <div class="p-24">
    <a-card bordered>
      <h3>按钮权限示例（基于 v-permission 指令）</h3>
      <a-space>
        <a-button type="primary" v-permission="'user.create'">新增用户</a-button>
        <a-button v-permission="'user.edit'">编辑用户</a-button>
        <a-button status="danger" v-permission="'user.delete'">删除用户</a-button>
      </a-space>
      <p style="margin-top:12px">在 localStorage.permissions 中设置：["user.create","user.edit"] 等。</p>
    </a-card>
  </div>
</template>
<script setup lang="ts"></script>
<style scoped>.p-24{padding:24px;}</style>
