<template>
  <view class="container">
    <!-- 顶部区域 -->
    <view class="header">
      <text class="section-title">部门公告</text>
      <swiper class="announcement-swiper" vertical autoplay circular interval="3000">
        <swiper-item v-for="(item, index) in announcements" :key="index">
          <view class="announcement-item" @click="navigateTo(item.path)">
            <text class="announcement-title">{{ item.title }}</text>
            <text class="announcement-info">{{ item.info }}</text>
          </view>
        </swiper-item>
      </swiper>
    </view>

    <!-- 导航区域 -->
    <view class="navigation">
      <text class="section-title">功能导航</text>
      <view class="navigation-grid">
        <view class="navigation-item" v-for="(module, index) in navigationModules" :key="index" @click="navigateTo(module.path)">
          <view class="module-icon" :style="{ backgroundColor: module.color }">
            <uni-icons :type="module.icon" size="30" color="#fff"></uni-icons>
          </view>
          <text class="module-name">{{ module.name }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

// 公告信息
const announcements = ref([
  { title: '部门活动通知', info: '活动将在本月末举行，敬请参与', path: '/pages/announcement-detail' },
  { title: '重要通知', info: '请尽快完成本季度的财务报告', path: '/pages/announcement-detail' },
  { title: '设备维护', info: '服务器将在今晚进行维护，影响登录操作', path: '/pages/announcement-detail' },
])

// 导航模块
const navigationModules = ref([
  { name: '财务管理', icon: 'money-filled', color: '#FF9800', path: '/pages/finance' },
  { name: '人员管理', icon: 'group-filled', color: '#2196F3', path: '/pages/people-management' },
  { name: '审批流程', icon: 'checkmark-filled', color: '#4CAF50', path: '/pages/approval' },
  { name: '项目管理', icon: 'folder-filled', color: '#FF5722', path: '/pages/project-management' },
  { name: '客户关系', icon: 'people-filled', color: '#9C27B0', path: '/pages/customer-relationship' },
  { name: '数据分析', icon: 'analytics-filled', color: '#FFC107', path: '/pages/data-analysis' },
  { name: '库存管理', icon: 'inventory-filled', color: '#673AB7', path: '/pages/inventory' },
  { name: '日常任务', icon: 'task-filled', color: '#607D8B', path: '/pages/daily-tasks' },
  { name: '团队协作', icon: 'team-filled', color: '#8BC34A', path: '/pages/team-collaboration' },
])

// 导航至功能模块
const navigateTo = (path) => {
  uni.navigateTo({
    url: path
  })
}
</script>

<style scoped>
.container {
  background-color: #f5f5f5; /* 统一背景颜色 */
  display: flex;
  flex-direction: column;
  height: 100%; /* 充满整个页面 */
}

.header {
  background-color: #ffffff;
  padding: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px; /* 控制顶部区域与导航区域的间距 */
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.announcement-swiper {
  height: 100px;
}

.announcement-item {
  padding: 10px;
  border-bottom: 1px solid #f5f5f5;
}

.announcement-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.announcement-info {
  font-size: 12px;
  color: #888;
}

.navigation {
  background-color: #ffffff;
  padding: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  flex-grow: 1; /* 让导航区域填充剩余空间 */
}

.navigation-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.navigation-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  border-radius: 8px;
  background-color: #fafafa;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
}

.navigation-item:hover {
  background-color: #f0f0f0;
  transform: translateY(-5px);
}

.module-icon {
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  margin-bottom: 8px;
}

.module-name {
  font-size: 14px;
  color: #333;
}
</style>
