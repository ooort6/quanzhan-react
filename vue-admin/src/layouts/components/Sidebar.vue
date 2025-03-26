<template>
  <div class="sidebar">
    <el-menu
      :default-active="activeMenu"
      :collapse="isCollapse"
      class="sidebar-menu"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
      router
    >
      <el-menu-item index="/dashboard">
        <el-icon><HomeFilled /></el-icon>
        <span>控制台</span>
      </el-menu-item>

      <el-menu-item index="/todo">
        <el-icon><List /></el-icon>
        <span>待办事项</span>
      </el-menu-item>

      <el-menu-item index="/notes">
        <el-icon><Document /></el-icon>
        <span>笔记管理</span>
      </el-menu-item>

      <el-menu-item index="/calendar">
        <el-icon><Calendar /></el-icon>
        <span>日程安排</span>
      </el-menu-item>

      <el-menu-item index="/categories">
        <el-icon><Folder /></el-icon>
        <span>分类管理</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import {
  HomeFilled,
  Document,
  Calendar,
  Folder,
  List,
} from "@element-plus/icons-vue";

const route = useRoute();
const activeMenu = computed(() => route.path);

// 从父组件接收折叠状态
const props = defineProps<{
  isCollapse: boolean;
}>();
</script>

<style scoped>
.sidebar {
  height: 100%;
  background-color: #304156;
}

.sidebar-menu {
  height: 100%;
  border-right: none;
}

.sidebar-menu:not(.el-menu--collapse) {
  width: 200px;
}

:deep(.el-menu-item) {
  &:hover {
    background-color: #263445 !important;
  }

  &.is-active {
    background-color: #263445 !important;
  }
}
</style>
