<template>
  <view class="department-container">
    <!-- 顶部区域 -->
    <view class="top-section">
      <!-- 搜索栏 -->
      <view class="search-bar">
        <uni-search-bar 
          placeholder="搜索部门或人员" 
          radius="20"
          bgColor="#fff"
          clearButton="always"
          @confirm="searchDepartment"
        ></uni-search-bar>
      </view>
      
      <!-- 统计卡片 -->
      <view class="stats-overview">
        <view 
          class="stat-card" 
          v-for="(stat, index) in statsData" 
          :key="index" 
          :style="{background: stat.background}"
        >
          <text class="stat-value">{{stat.value}}</text>
          <text class="stat-label">{{stat.label}}</text>
          <view class="stat-icon">
            <uni-icons :type="stat.icon" size="20" color="#fff"></uni-icons>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 主体内容 -->
    <view class="content-section">
      <!-- 背景纹理 -->
      <view class="background-pattern"></view>
      
      <!-- 部门分类导航 -->
      <view class="department-categories">
        <scroll-view class="category-scroll" scroll-x shows-scrollbar="false">
          <view 
            class="category-item" 
            v-for="(category, index) in categories" 
            :key="index"
            :class="{active: activeCategory === index}"
            @click="changeCategory(index)"
          >
            {{category}}
            <view class="indicator" v-if="activeCategory === index"></view>
          </view>
        </scroll-view>
      </view>
      
      <!-- 部门列表 -->
      <view class="department-list">
        <view 
          class="department-card" 
          v-for="(department, index) in filteredDepartments" 
          :key="index"
          @click="viewDepartment(department.id)"
        >
          <view class="card-left-border" :style="{background: departmentColors[index % departmentColors.length]}"></view>
          <view class="department-content">
            <view class="department-header">
              <text class="department-name">{{department.name}}</text>
              <view class="employee-count">
                <uni-icons type="person-filled" size="14" color="#FF9800"></uni-icons>
                <text>{{department.employeeCount}}人</text>
              </view>
            </view>
            <view class="department-info-line">
              <uni-icons type="contact-filled" size="14" color="#666"></uni-icons>
              <text class="department-info-text">负责人: {{department.manager}}</text>
            </view>
            <view class="department-info-line">
              <uni-icons type="location-filled" size="14" color="#666"></uni-icons>
              <text class="department-info-text">位置: {{department.location}}</text>
            </view>
          </view>
          <uni-icons type="arrowright" size="16" color="#999"></uni-icons>
        </view>
        
        <!-- 空状态 -->
        <view class="empty-state" v-if="filteredDepartments.length === 0">
          <image src="/static/empty-department.png" class="empty-image"></image>
          <text class="empty-text">暂无部门数据</text>
          <text class="empty-subtext">点击下方按钮添加新部门</text>
        </view>
      </view>
    </view>
    
    <!-- 悬浮操作按钮 -->
    <view class="floating-action-button" @click="navigateTo('/pages/department/add')">
      <uni-icons type="plus" size="20" color="#fff"></uni-icons>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

// 部门颜色方案
const departmentColors = [
  '#FFB74D', '#4CAF50', '#2196F3', 
  '#9C27B0', '#F44336', '#673AB7'
]

// 统计数据
const statsData = ref([
  { 
    value: '23', 
    label: '部门总数', 
    background: 'linear-gradient(135deg, #FFE0B2, #FFCC80)',
    icon: 'home-filled'
  },
  { 
    value: '486', 
    label: '员工总数', 
    background: 'linear-gradient(135deg, #C8E6C9, #A5D6A7)',
    icon: 'person-filled'
  },
  { 
    value: '8', 
    label: '直属子公司', 
    background: 'linear-gradient(135deg, #BBDEFB, #90CAF9)',
    icon: 'shop-filled'
  }
])

// 部门分类
const categories = ref(['全部', '管理部门', '生产部门', '研发部门', '销售部门', '支持部门'])
const activeCategory = ref(0)

// 部门数据
const departments = ref([
  { id: 1, name: '集团总部', category: '管理部门', employeeCount: 45, manager: '张总经理', location: '总部大楼8层' },
  { id: 2, name: '药材采购部', category: '生产部门', employeeCount: 32, manager: '李总监', location: '生产区A栋2层' },
  { id: 3, name: '研发中心', category: '研发部门', employeeCount: 68, manager: '王博士', location: '研发大楼' },
  { id: 4, name: '质量检测部', category: '生产部门', employeeCount: 28, manager: '赵主任', location: '质检中心' },
  { id: 5, name: '市场营销部', category: '销售部门', employeeCount: 56, manager: '周经理', location: '总部大楼5层' },
  { id: 6, name: '人力资源部', category: '管理部门', employeeCount: 18, manager: '吴主管', location: '总部大楼3层' },
  { id: 7, name: '财务部', category: '管理部门', employeeCount: 22, manager: '郑总监', location: '总部大楼4层' },
  { id: 8, name: 'IT支持部', category: '支持部门', employeeCount: 15, manager: '钱工程师', location: '总部大楼6层' }
])

// 搜索关键词
const searchKeyword = ref('')

// 计算属性 - 筛选后的部门
const filteredDepartments = computed(() => {
  let result = departments.value
  
  // 按分类筛选
  if (activeCategory.value > 0) {
    const category = categories.value[activeCategory.value]
    result = result.filter(dept => dept.category.includes(category.replace('部门', '')))
  }
  
  // 按关键词筛选
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(dept => 
      dept.name.toLowerCase().includes(keyword) || 
      dept.manager.toLowerCase().includes(keyword) ||
      dept.location.toLowerCase().includes(keyword))
  }
  
  return result
})

// 方法 - 切换分类
const changeCategory = (index) => {
  activeCategory.value = index
}

// 方法 - 搜索部门
const searchDepartment = (e) => {
  searchKeyword.value = e.value
}

// 方法 - 查看部门详情
const viewDepartment = (id) => {
  uni.navigateTo({
    url: `/pages/department/detail?id=${id}`
  })
}

// 方法 - 导航
const navigateTo = (path) => {
  uni.navigateTo({
    url: path
  })
}

// 生命周期
onLoad(() => {
  console.log('部门管理页面加载')
})
</script>

<style scoped>
/* 基础样式 */
.department-container {
  min-height: 100vh;
  background-color: #f8f9fa;
  padding-bottom: 80px;
}

/* 顶部区域 */
.top-section {
  padding: 15px;
  background: linear-gradient(to bottom, #ffffff, #f8f9fa);
}

.search-bar {
  margin-bottom: 15px;
}

/* 背景纹理设计 */
.background-pattern {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 10% 20%, rgba(255,184,77,0.03) 0%, transparent 20%),
    radial-gradient(circle at 90% 30%, rgba(76,175,80,0.03) 0%, transparent 20%),
    radial-gradient(circle at 50% 80%, rgba(33,150,243,0.03) 0%, transparent 20%);
  z-index: 0;
  pointer-events: none;
}

/* 内容区域 */
.content-section {
  position: relative;
  z-index: 1;
  padding: 0 15px;
}

/* 统计卡片 */
.stats-overview {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  gap: 10px;
}

.stat-card {
  flex: 1;
  padding: 15px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  background: linear-gradient(135deg, var(--start-color), var(--end-color));
  border: 1px solid rgba(255,255,255,0.2);
}

.stat-card:nth-child(1) {
  --start-color: #FFE0B2;
  --end-color: #FFCC80;
}

.stat-card:nth-child(2) {
  --start-color: #C8E6C9;
  --end-color: #A5D6A7;
}

.stat-card:nth-child(3) {
  --start-color: #BBDEFB;
  --end-color: #90CAF9;
}

.stat-value {
  font-size: 22px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
  z-index: 2;
}

.stat-label {
  font-size: 13px;
  color: #333;
  opacity: 0.9;
  z-index: 2;
}

.stat-icon {
  position: absolute;
  right: 15px;
  bottom: 15px;
  opacity: 0.2;
  z-index: 1;
}

/* 分类导航 */
.department-categories {
  margin-bottom: 20px;
  position: relative;
}

.category-scroll {
  white-space: nowrap;
  width: 100%;
  padding-bottom: 5px;
}

.category-item {
  display: inline-flex;
  flex-direction: column;
  padding: 8px 18px;
  margin-right: 8px;
  border-radius: 16px;
  background-color: #fff;
  color: #666;
  font-size: 14px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  position: relative;
  backdrop-filter: blur(5px);
  background-color: rgba(255,255,255,0.8);
  border: 1px solid rgba(0,0,0,0.05);
}

.category-item.active {
  background-color: rgba(255,152,0,0.9);
  color: white;
  font-weight: 500;
}

.indicator {
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 3px;
  background-color: #FF9800;
  border-radius: 3px;
}

.category-item.active .indicator {
  background-color: white;
}

/* 部门卡片 */
.department-list {
  margin-bottom: 15px;
}

.department-card {
  display: flex;
  align-items: center;
  background-color: rgba(255,255,255,0.9);
  margin-bottom: 12px;
  border-radius: 12px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.05);
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
  backdrop-filter: blur(2px);
  border: 1px solid rgba(0,0,0,0.03);
}

.department-card:active {
  transform: scale(0.98);
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.card-left-border {
  width: 6px;
  height: 100%;
  position: absolute;
  left: 0;
}

.department-content {
  flex: 1;
  padding: 16px;
}

.department-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.department-name {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.employee-count {
  display: flex;
  align-items: center;
  font-size: 13px;
  color: #FF9800;
}

.employee-count text {
  margin-left: 4px;
}

.department-info-line {
  display: flex;
  align-items: center;
  margin-bottom: 6px;
}

.department-info-text {
  font-size: 13px;
  color: #666;
  margin-left: 6px;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 0;
  background-color: rgba(255,255,255,0.7);
  border-radius: 12px;
  margin-top: 20px;
  backdrop-filter: blur(3px);
}

.empty-image {
  width: 120px;
  height: 120px;
  opacity: 0.6;
  margin-bottom: 15px;
}

.empty-text {
  font-size: 16px;
  color: #999;
  margin-bottom: 8px;
}

.empty-subtext {
  font-size: 13px;
  color: #aaa;
}

/* 悬浮按钮 */
.floating-action-button {
  position: fixed;
  right: 25px;
  bottom: 25px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FF9800, #F57C00);
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 15px rgba(255, 152, 0, 0.3);
  z-index: 10;
  transition: all 0.3s ease;
  border: 1px solid rgba(255,255,255,0.2);
}

.floating-action-button:active {
  transform: scale(0.95);
  box-shadow: 0 2px 8px rgba(255, 152, 0, 0.4);
}
</style>