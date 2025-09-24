```vue
<template>
  <view class="advanced-search">
    <!-- 页面标题 -->
    <view class="page-title">高级搜索</view>
    <!-- 返回按钮 -->
    <view class="back-btn" @click="goBack">
      <text>返回</text>
    </view>
    <!-- 搜索条件区域 -->
    <view class="search-section">
      <view class="section-title">搜索条件</view>
      <view class="search-form">
        <!-- 采购员 -->
        <view class="form-item">
          <text class="form-label purchaser-label">采购员</text>
          <uni-data-select
            v-model="filters.purchaser"
            :localdata="purchasers"
            placeholder="请选择采购员"
            @change="handleFilterChange"
          ></uni-data-select>
        </view>
        <!-- 企业活动内容 -->
        <view class="form-item">
          <text class="form-label event-content-label">企业活动内容</text>
          <input v-model="filters.eventContent" placeholder="请输入活动内容" @input="handleFilterChange" />
        </view>
        <!-- 活动品种 -->
        <view class="form-item">
          <text class="form-label activity-type-label">活动品种</text>
          <input v-model="filters.activityType" placeholder="请输入活动品种" @input="handleFilterChange" />
        </view>
        <!-- 审批状态 -->
        <view class="form-item">
          <text class="form-label status-label">审批状态</text>
          <radio-group @change="e => { filters.status = e.detail.value; handleFilterChange(); }">
            <view class="radio-group">
              <view v-for="status in statuses" :key="status" class="radio-item">
                <radio :value="status" :checked="filters.status === status" />
                <text>{{ status }}</text>
              </view>
            </view>
          </radio-group>
        </view>
        <!-- 提交时间 -->
        <view class="form-item">
          <text class="form-label submit-time-label">提交时间</text>
          <uni-datetime-picker v-model="filters.submitTime" rangeSeparator="至" @change="handleFilterChange" />
        </view>
        <!-- 活动起始时间 -->
        <view class="form-item">
          <text class="form-label activity-start-time-label">活动起始时间</text>
          <uni-datetime-picker
            v-model="filters.activityStartTime"
            type="date"
            :end="filters.activityEndTime || ''"
            @change="handleFilterChange"
          />
        </view>
        <!-- 活动结束时间 -->
        <view class="form-item">
          <text class="form-label activity-end-time-label">活动结束时间</text>
          <uni-datetime-picker
            v-model="filters.activityEndTime"
            type="date"
            :start="filters.activityStartTime || ''"
            @change="handleFilterChange"
          />
        </view>
        <!-- 按钮 -->
        <view class="form-buttons">
          <view class="search-btn" @click="handleSearch">
            <text>搜索</text>
          </view>
          <view class="reset-btn" @click="resetFilters">
            <text>重置</text>
          </view>
        </view>
      </view>
    </view>
    <!-- 分隔线 -->
    <view class="divider"></view>
    <!-- 搜索结果区域 -->
    <view class="result-section">
      <view class="section-title">搜索结果</view>
      <view v-if="paginatedResults.length === 0" class="no-results">
        <text>暂无结果</text>
      </view>
      <view v-else class="result-list">
        <view
          v-for="(item, index) in paginatedResults"
          :key="item.id"
          class="result-card"
          @click="showDetailModal(index)"
        >
          <view class="result-item">
            <text class="field-label cell-1">厂家</text>
            <text class="field-value">{{ item.manufacturer }}</text>
          </view>
          <view class="result-item">
            <text class="field-label cell-2">采购员</text>
            <text class="field-value">{{ item.purchaser }}</text>
          </view>
          <view class="result-item">
            <text class="field-label cell-3">审批状态</text>
            <text class="field-value">{{ item.status }}</text>
          </view>
          <view class="result-item">
            <text class="field-label cell-4">活动品种</text>
            <text class="field-value">{{ item.activityType }}</text>
          </view>
          <view class="result-item">
            <text class="field-label cell-5">活动时间</text>
            <text class="field-value">{{ item.activityStartTime }} - {{ item.activityEndTime }}</text>
          </view>
        </view>
      </view>
      <!-- 分页 -->
      <view class="pagination" v-if="paginatedResults.length > 0">
        <view class="page-btn" :class="{ disabled: currentPage === 1 }" @click="prevPage">
          <text>上一页</text>
        </view>
        <text class="page-info">{{ currentPage }} / {{ totalPages }}</text>
        <view class="page-btn" :class="{ disabled: currentPage === totalPages }" @click="nextPage">
          <text>下一页</text>
        </view>
      </view>
    </view>
    <!-- 详情弹窗 -->
    <uni-popup ref="detailPopup" type="center">
      <view class="popup-content">
        <text class="popup-title">记录详情</text>
        <view v-for="(field, i) in popupData.fields" :key="i" class="popup-field">
          <text class="popup-field-name">{{ field.name }}：</text>
          <text class="popup-field-value">{{ field.value }}</text>
        </view>
        <view class="popup-close" @click="popupClose">关闭</view>
      </view>
    </uni-popup>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';

// 采购员选项
const purchasers = ref([
  { value: '张三', text: '张三' },
  { value: '李四', text: '李四' },
  { value: '王五', text: '王五' },
]);

// 审批状态选项
const statuses = ref(['已审核', '未审核', '作废']);

// 模拟数据
const data = ref([
  {
    id: '1',
    manufacturer: '厂家A',
    purchaser: '张三',
    status: '已审核',
    activityType: '产品A',
    activityStartTime: '2025-07-01',
    activityEndTime: '2025-07-01',
    eventContent: '促销',
    submitTime: '2025-06-28',
  },
  {
    id: '2',
    manufacturer: '厂家B',
    purchaser: '李四',
    status: '未审核',
    activityType: '产品B',
    activityStartTime: '2025-07-02',
    activityEndTime: '2025-07-02',
    eventContent: '会议',
    submitTime: '2025-06-29',
  },
  {
    id: '3',
    manufacturer: '厂家C',
    purchaser: '王五',
    status: '作废',
    activityType: '产品C',
    activityStartTime: '2025-07-03',
    activityEndTime: '2025-07-03',
    eventContent: '培训',
    submitTime: '2025-06-30',
  },
  {
    id: '4',
    manufacturer: '厂家A',
    purchaser: '张三',
    status: '已审核',
    activityType: '产品A',
    activityStartTime: '2025-07-04',
    activityEndTime: '2025-07-04',
    eventContent: '促销',
    submitTime: '2025-07-01',
  },
]);

// 过滤条件
const filters = ref({
  purchaser: '',
  eventContent: '',
  activityType: '',
  status: '',
  submitTime: ['2025-06-01', '2025-07-24'],
  activityStartTime: '',
  activityEndTime: '',
});

// 过滤结果
const filteredResults = computed(() => {
  return data.value.filter(item => {
    const matchPurchaser = !filters.value.purchaser || item.purchaser === filters.value.purchaser;
    const matchEvent = !filters.value.eventContent || item.eventContent.toLowerCase().includes(filters.value.eventContent.toLowerCase());
    const matchActivityType = !filters.value.activityType || item.activityType.toLowerCase().includes(filters.value.activityType.toLowerCase());
    const matchStatus = !filters.value.status || item.status === filters.value.status;
    const matchSubmitTime =
      !filters.value.submitTime ||
      (filters.value.submitTime[0] <= item.submitTime && item.submitTime <= filters.value.submitTime[1]);
    const matchActivityStartTime = !filters.value.activityStartTime || item.activityStartTime >= filters.value.activityStartTime;
    const matchActivityEndTime = !filters.value.activityEndTime || item.activityEndTime <= filters.value.activityEndTime;
    return matchPurchaser && matchEvent && matchActivityType && matchStatus && matchSubmitTime && matchActivityStartTime && matchActivityEndTime;
  });
});

// 分页
const currentPage = ref(1);
const pageSize = 10;
const totalPages = computed(() => Math.ceil(filteredResults.value.length / pageSize));
const paginatedResults = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredResults.value.slice(start, start + pageSize);
});

const prevPage = () => {
  if (currentPage.value > 1) {
    uni.showLoading({ title: '加载中...' });
    setTimeout(() => {
      currentPage.value--;
      uni.hideLoading();
    }, 300);
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    uni.showLoading({ title: '加载中...' });
    setTimeout(() => {
      currentPage.value++;
      uni.hideLoading();
    }, 300);
  }
};

// 弹窗
const detailPopup = ref(null);
const popupData = ref({ fields: [] });

const showDetailModal = (index) => {
  const item = paginatedResults.value[index];
  popupData.value = {
    fields: Object.entries(item).map(([name, value]) => ({ name, value })),
  };
  detailPopup.value.open();
};

const popupClose = () => {
  detailPopup.value.close();
};

// 搜索和重置
const handleSearch = () => {
  if (validateTime()) {
    uni.showLoading({ title: '加载中...' });
    setTimeout(() => {
      currentPage.value = 1;
      uni.hideLoading();
    }, 500);
  }
};

const handleFilterChange = () => {
  if (validateTime()) {
    currentPage.value = 1; // 输入或时间变化时重置到第一页
  }
};

const validateTime = () => {
  const { activityStartTime, activityEndTime } = filters.value;
  if (activityStartTime && activityEndTime && activityStartTime > activityEndTime) {
    uni.showToast({
      title: '起始时间不能晚于结束时间',
      icon: 'error',
      duration: 2000,
    });
    return false;
  }
  return true;
};

const resetFilters = () => {
  filters.value = {
    purchaser: '',
    eventContent: '',
    activityType: '',
    status: '',
    submitTime: ['2025-06-01', '2025-07-24'],
    activityStartTime: '',
    activityEndTime: '',
  };
  currentPage.value = 1;
};

// 返回
const goBack = () => {
  uni.navigateBack();
};
</script>

<style>
.advanced-search {
  padding: 20rpx;
  background: #f5f5f5;
}
.page-title {
  font-size: 40rpx;
  color: #333333;
  font-weight: bold;
  text-align: left;
  margin-bottom: 20rpx;
  position: relative;
  animation: fadeInTitle 0.6s ease-in;
}
.page-title::after {
  content: '';
  position: absolute;
  bottom: -4rpx;
  left: 0;
  width: 80rpx;
  height: 2rpx;
  background: linear-gradient(to right, #333333, transparent);
}
.back-btn {
  width: 120rpx;
  padding: 10rpx;
  background: #f8f8f8;
  border-radius: 8rpx;
  text-align: center;
  font-size: 26rpx;
  color: #666;
  margin-bottom: 20rpx;
  transition: background-color 0.2s ease, transform 0.2s ease;
}
.back-btn:active {
  background-color: #e0e0e0;
  transform: scale(0.95);
}
.search-section {
  background: #fff;
  border: 1rpx solid #e0e0e0;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 30rpx;
}
.result-section {
  background: #f4f9ff;
  border: 1rpx solid #e0e0e0;
  border-radius: 12rpx;
  padding: 20rpx;
}
.section-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #3498db;
  text-align: center;
  margin-bottom: 20rpx;
  position: relative;
}
.section-title::after {
  content: '';
  position: absolute;
  bottom: -4rpx;
  left: 50%;
  width: 60rpx;
  height: 2rpx;
  background: linear-gradient(to right, transparent, #3498db, transparent);
  transform: translateX(-50%);
}
.divider {
  height: 1rpx;
  background: linear-gradient(to right, #ddd, #bbb, #ddd);
  margin: 40rpx 0;
}
.search-form {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  padding: 0 20rpx; /* 左右边距 */
}
.form-item {
  display: flex;
  flex-direction: column;
}
.form-label {
  font-size: 28rpx;
  margin-bottom: 10rpx;
}
.purchaser-label {
  color: #9b59b6; /* 采购员 */
}
.event-content-label {
  color: #1abc9c; /* 企业活动内容 */
}
.activity-type-label {
  color: #f1c40f; /* 活动品种 */
}
.status-label {
  color: #e74c3c; /* 审批状态 */
}
.submit-time-label {
  color: #e67e22; /* 提交时间 */
}
.activity-start-time-label,
.activity-end-time-label {
  color: #3498db; /* 活动起始/结束时间 */
}
input {
  height: 60rpx;
  padding: 10rpx;
  border: 1rpx solid #ddd;
  border-radius: 8rpx;
  font-size: 26rpx;
  background: #fff;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
  margin: 0 20rpx; /* 左右边距 */
  animation: fadeInPicker 0.3s ease-in;
}
input:focus {
  border-color: #2ecc71;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.15);
}
uni-data-select {
  margin: 0 20rpx; /* 左右边距 */
  border: 1rpx solid #ddd;
  border-radius: 8rpx;
  font-size: 26rpx;
  background: #fff;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
  animation: fadeInPicker 0.3s ease-in;
}
uni-data-select:focus {
  border-color: #2ecc71;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.15);
}
.radio-group {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
  margin: 0 20rpx; /* 左右边距 */
  animation: fadeIn 0.5s ease-in;
}
.radio-item {
  display: flex;
  align-items: center;
  gap: 10rpx;
}
radio {
  transform: scale(0.8);
}
radio text {
  font-size: 26rpx;
  color: #666;
}
radio[checked] text {
  color: #2ecc71;
}
uni-datetime-picker {
  margin: 0 20rpx; /* 左右边距 */
  background: #fff;
  border: 1rpx solid #ddd;
  border-radius: 8rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
  animation: fadeInPicker 0.3s ease-in;
}
.form-buttons {
  display: flex;
  gap: 20rpx;
  justify-content: center;
}
.search-btn,
.reset-btn {
  width: 150rpx;
  padding: 15rpx;
  background: #f8f8f8;
  border-radius: 8rpx;
  text-align: center;
  font-size: 26rpx;
  transition: background-color 0.2s ease, transform 0.2s ease;
}
.search-btn {
  color: #2ecc71;
}
.reset-btn {
  color: #666;
}
.search-btn:active,
.reset-btn:active {
  background-color: #e0e0e0;
  transform: scale(0.95);
}
.no-results {
  text-align: center;
  font-size: 28rpx;
  color: #666;
  padding: 40rpx 0;
}
.result-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}
.result-card {
  background: #fff;
  border-radius: 10rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.12);
  padding: 20rpx;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  animation: fadeIn 0.5s ease-in;
}
.result-card:hover {
  transform: translateY(-4rpx);
  box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.15);
}
.result-card:active {
  transform: scale(0.98);
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
}
.result-item {
  display: flex;
  justify-content: space-between;
  padding: 10rpx 0;
  border-bottom: 1rpx solid #eee;
}
.result-item:last-child {
  border-bottom: none;
}
.field-label {
  font-size: 26rpx;
  font-weight: bold;
}
.field-value {
  font-size: 26rpx;
  color: #333;
}
.cell-1 {
  color: #2ecc71; /* 厂家 */
}
.cell-2 {
  color: #9b59b6; /* 采购员 */
}
.cell-3 {
  color: #e74c3c; /* 审批状态 */
}
.cell-4 {
  color: #f1c40f; /* 活动品种 */
}
.cell-5 {
  color: #3498db; /* 活动时间 */
}
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20rpx 0;
}
.page-btn {
  padding: 10rpx 20rpx;
  background: #f8f8f8;
  border-radius: 8rpx;
  font-size: 26rpx;
  color: #666;
  margin: 0 10rpx;
  transition: background-color 0.2s ease, transform 0.2s ease;
}
.page-btn:active {
  background-color: #e0e0e0;
  transform: scale(0.95);
}
.page-btn.disabled {
  background: #eee;
  color: #ccc;
  pointer-events: none;
}
.page-info {
  font-size: 26rpx;
  color: #333;
}
.popup-content {
  background: #fff;
  padding: 20rpx;
  border-radius: 10rpx;
  width: 80%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
}
.popup-title {
  font-size: 32rpx;
  color: #333;
  font-weight: bold;
  margin-bottom: 20rpx;
  position: relative;
}
.popup-title::after {
  content: '';
  position: absolute;
  bottom: -4rpx;
  left: 0;
  width: 100%;
  height: 1rpx;
  background: linear-gradient(to right, transparent, #2ecc71 20%, #2ecc71 80%, transparent);
}
.popup-field {
  display: flex;
  justify-content: space-between;
  padding: 10rpx 0;
  border-bottom: 1rpx solid #eee;
}
.popup-field:last-child {
  border-bottom: none;
}
.popup-field-name {
  font-size: 26rpx;
  color: #666;
}
.popup-field-value {
  font-size: 26rpx;
  color: #333;
}
.popup-close {
  text-align: center;
  padding: 20rpx;
  color: #2ecc71;
  font-size: 26rpx;
  transition: transform 0.2s ease;
}
.popup-close:active {
  transform: scale(0.95);
}

/* 标题淡入动画 */
@keyframes fadeInTitle {
  from {
    opacity: 0;
    transform: translateY(10rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 卡片和单选淡入动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 输入框、下拉、时间选择器淡入动画 */
@keyframes fadeInPicker {
  from {
    opacity: 0;
    transform: translateY(5rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
```