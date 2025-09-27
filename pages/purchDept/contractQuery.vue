<template>
  <view class="page">
    <view class="container">
      <view class="header">
        <text class="title">合同查询</text>
        
        <!-- 单一搜索（未登录用户） -->
        <view v-if="!isToken" class="single-search-area">
          <view class="search-item">
            <text class="search-label">合同编号:</text>
            <uni-easyinput v-model="formNumber" placeholder="请输入合同编号" />
          </view>
          <view class="search-buttons">
            <button class="search-btn search-submit-btn" @click="search">搜索</button>
          </view>
        </view>

        <!-- 多条件搜索（已登录用户） -->
        <view v-else class="multi-search-header">
          <view class="search-header">
            <text class="search-title">多条件搜索</text>
            <button class="toggle-btn" @click="toggleSearch">
              {{ isSearchCollapsed ? '展开' : '收起' }}
            </button>
          </view>

          <view class="multi-search-area" v-show="!isSearchCollapsed">
            <view class="search-item">
              <text class="search-label">甲方:</text>
              <uni-easyinput v-model="partyA" placeholder="请输入甲方名称" />
            </view>
            <view class="search-item">
              <text class="search-label">商品ID:</text>
              <uni-easyinput type="number" v-model="productId" placeholder="请输入商品ID" />
            </view>
            <view class="search-item">
              <text class="search-label">合同创建时间:</text>
              <uni-datetime-picker 
                type="range"
                v-model="contractDateRange" 
                placeholder="请选择合同创建日期范围"
              />
            </view>
            <view class="search-item">
              <text class="search-label">承诺支付时间:</text>
              <uni-datetime-picker 
                type="range"
                v-model="paymentDateRange" 
                placeholder="请选择承诺支付日期范围"
              />
            </view>
            <view class="search-item">
              <text class="search-label">采购员:</text>
              <uni-easyinput v-model="submitter" placeholder="请输入采购员姓名" />
            </view>
            <view class="search-item">
              <text class="search-label">甲方签约代表:</text>
              <uni-easyinput v-model="partyARepresentative" placeholder="请输入签约代表姓名" />
            </view>
            <view class="search-item">
              <text class="search-label">排序类型:</text>
              <uni-data-checkbox 
                v-model="sortType" 
                :localdata="[{ text: '升序', value: 'asc' }, { text: '降序', value: 'desc' }]"
              ></uni-data-checkbox>
            </view>
            <view class="search-item">
              <text class="search-label">审批状态:</text>
              <uni-data-checkbox 
                v-model="auditStatus" 
                :localdata="[{ text: '已审核', value: '已审核' }, { text: '未审核', value: '未审核' }]"
              ></uni-data-checkbox>
            </view>
            <view class="search-item">
              <text class="search-label">每页数量:</text>
              <uni-easyinput type="number" v-model="pageSize" placeholder="请输入每页数量" />
            </view>
            <view class="search-buttons">
              <button class="search-btn reset-btn" @click="resetSearch">重置</button>
              <button class="search-btn search-submit-btn" @click="search">搜索</button>
            </view>
          </view>
        </view>
      </view>

      <view class="summary-info" v-if="totalPages > 0">
        <text class="info-text">总数量: {{ totalElements }}</text>
        <text class="info-text">总页数: {{ totalPages }}</text>
      </view>

      <view class="contract-list">
        <view 
          v-for="contract in contracts" 
          :key="contract.formNumber" 
          class="contract-item" 
          @click="isBatchMode ? toggleContractSelection(contract.formNumber) : contractInfo(contract.formNumber)">
          
          <view v-if="isBatchMode" class="checkbox-container">
            <checkbox 
              :value="contract.formNumber" 
              :checked="selectedContracts.includes(contract.formNumber)"
            />
          </view>
          
          <view class="item-content-wrapper">
            <view class="item-header">
              <text class="contract-name">{{ contract.partAName }}</text>
              <text class="amount">{{ formatAmount(contract.totalPurchaseAmount) }}</text>
            </view>
            
            <view class="item-footer">
              <view class="info-group">
                <text class="info-label">采购员:</text>
                <text class="info-value">{{ contract.submitter }}</text>
                <text class="info-label">日期:</text>
                <text class="info-value">{{ contract.submitTime.replace("T", " ") }}</text>
              </view>
              <view class="status-and-action-group">
                <view class="status-group">
                  <text v-if="contract.isKeyProject" class="status-badge status-pending">
                    重点合同
                  </text>
                  <text class="status-badge" :class="getAuditStatusClass(contract.auditStatus)">
                    {{ contract.auditStatus }}
                  </text>
                  <text class="status-badge" :class="getCurrentApprovalStatusClass(contract.currentApprovalStatus)">
                    当前审批: {{ contract.currentApprover || '未知' }} {{ contract.currentApprovalStatus || '待处理' }}
                  </text>
                </view>
                <button 
                  v-if="!isBatchMode"
                  class="approval-details-btn" 
                  @click.stop="showApprovalDetails(contract.formNumber)"
                >
                  审批详情
                </button>
              </view>
            </view>
          </view>
        </view>
        <view v-if="contracts.length === 0">
          <text>暂无数据</text>
        </view>
      </view>

      <view class="pagination-container" v-if="totalPages > 0">
        <view v-if="!pagesToShow.includes(1)" class="pagination-item" @click="goToPage(1)">1</view>
        <text v-if="!pagesToShow.includes(1)">...</text>
        <view
          v-for="p in pagesToShow"
          :key="p"
          :class="['pagination-item', { active: p === currentPage }]"
          @click="goToPage(p)"
        >
          {{ p }}
        </view>
        <text v-if="!pagesToShow.includes(totalPages)">...</text>
        <view v-if="!pagesToShow.includes(totalPages)" class="pagination-item" @click="goToPage(totalPages)">{{ totalPages }}</view>
      </view>
      
      <view class="batch-button-container" v-if="showBatch">
        <button class="batch-float-btn" @click="toggleBatchMode">{{ isBatchMode ? '取消' : '批量' }}</button>
      </view>

      <view v-if="showActionButtons" class="action-float-btn-container">
        <button class="action-button audit-button" @click="auditSelectedContracts">一键审核</button>
        <button class="action-button delete-button" @click="deleteSelectedContracts">批量删除</button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import requestFast from '@/utils/requestFast';
import { API_BASE_URL } from '../../utils/config';

// ------------------- 响应式变量 -------------------
const contracts = ref([]);
const currentPage = ref(1);
const pageSize = ref(10); // 默认每页10条
const totalPages = ref(0);
const totalElements = ref(0); // 总数量
const isToken = ref(false);
const level = ref(0);
const isPrint = ref(false);
const showBatch = ref(false);
const isSearchCollapsed = ref(true);

// 批量操作相关变量
const isBatchMode = ref(false);
const selectedContracts = ref([]); // 确保初始化为数组

// 多条件搜索变量
const partyA = ref(null);
const productId = ref(null);
const contractDateRange = ref(null); 
const paymentDateRange = ref(null);
const submitter = ref(null);
const partyARepresentative = ref(null);
const sortType = ref('asc');
const auditStatus = ref(null);

// 单条件搜索变量
const formNumber = ref(null);

// ------------------- 生命周期钩子 -------------------
onShow(async () => {
  await tokenValid();
  await showBatchs();
  await fetchContracts();
});

// ------------------- 数据监听 -------------------
watch(contractDateRange, (newRange) => {
  if (newRange && newRange.length === 1) {
    newRange[1] = null;
  }
}, { deep: true });

watch(paymentDateRange, (newRange) => {
  if (newRange && newRange.length === 1) {
    newRange[1] = null;
  }
}, { deep: true });

// 监听 pageSize 变化，当它改变时自动回到第一页并重新请求数据
watch(pageSize, (newValue) => {
  if (!newValue || newValue <= 0) {
    pageSize.value = 10;
    return;
  }
  currentPage.value = 1;
  fetchContracts();
});

// 监听 selectedContracts 变化，调试用
watch(selectedContracts, (newValue) => {});

// ------------------- 交互逻辑 -------------------
const toggleSearch = () => {
  isSearchCollapsed.value = !isSearchCollapsed.value;
};

// 批量操作的按钮点击事件
const toggleBatchMode = () => {
  isBatchMode.value = !isBatchMode.value;
  // 退出批量模式时清空已选列表
  if (!isBatchMode.value) {
    selectedContracts.value = [];
  }
};

// 切换选中状态
const toggleContractSelection = (formNumber) => {
  const index = selectedContracts.value.indexOf(formNumber);
  if (index > -1) {
    selectedContracts.value.splice(index, 1);
  } else {
    selectedContracts.value.push(formNumber);
  }
};

// 一键审核选中合同
const auditSelectedContracts = async () => {
  if (selectedContracts.value.length === 0) {
    uni.showToast({
      title: '请选择至少一个合同',
      icon: 'none'
    });
    return;
  }
  
  uni.showLoading({ title: '审核中...' });
  console.log('开始一键审核以下合同:', selectedContracts.value.toString());
  setTimeout(() => {
    uni.hideLoading();
    uni.showToast({ title: '模拟审核成功！', icon: 'success' });
    toggleBatchMode();
    fetchContracts();
  }, 1000);
};

// 批量删除选中合同
const deleteSelectedContracts = async () => {
  if (selectedContracts.value.length === 0) {
    uni.showToast({
      title: '请选择至少一个合同',
      icon: 'none'
    });
    return;
  }
  
  uni.showLoading({ title: '删除中...' });
  console.log('开始批量删除以下合同:', selectedContracts.value);
  setTimeout(() => {
    uni.hideLoading();
    uni.showToast({ title: '模拟删除成功！', icon: 'success' });
    toggleBatchMode();
    fetchContracts();
  }, 1000);
};

// 显示审批详情
const showApprovalDetails = (formNumber) => {
  uni.navigateTo({
    url: `/pages/purchDept/approvalDetails?formNumber=${formNumber}`,
  });
};

// 检查是否显示一键审核和批量删除按钮
const showActionButtons = computed(() => {
  return isBatchMode.value && selectedContracts.value.length > 0;
});

// 获取用户是否有一键批量功能
const showBatchs = async () => {
  const res = await requestFast.get('/public/store/view/mod/UserBatchs');
  if (res.code === 200) {
    showBatch.value = res.data;
  }
};

// ------------------- 分页与搜索逻辑 -------------------
const pagesToShow = computed(() => {
  const pages = [];
  const maxVisiblePages = 3; 
  let startPage = Math.max(1, currentPage.value - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages.value, startPage + maxVisiblePages - 1);
  
  if (endPage - startPage + 1 < maxVisiblePages && totalPages.value >= maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  return pages;
});

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    fetchContracts();
  }
};

const fetchContracts = async () => {
  const url = isToken.value ? '/public/store/view/mod/contractOrderList' : '/public/store/view/mod/noTokenContractOrderList';
  const params = isToken.value ? {
    page: currentPage.value,
    size: pageSize.value, 
    partyA: partyA.value || undefined,
    productId: productId.value || undefined,
    contractDateStart: contractDateRange.value && contractDateRange.value.length > 0 ? contractDateRange.value[0] : undefined,
    contractDateEnd: contractDateRange.value && contractDateRange.value.length > 1 ? contractDateRange.value[1] : undefined,
    paymentDateStart: paymentDateRange.value && paymentDateRange.value.length > 0 ? paymentDateRange.value[0] : undefined,
    paymentDateEnd: paymentDateRange.value && paymentDateRange.value.length > 1 ? paymentDateRange.value[1] : undefined,
    submitter: submitter.value || undefined,
    partyARepresentative: partyARepresentative.value || undefined,
    sortType: sortType.value || undefined,
    auditStatus: auditStatus.value || undefined,
  } : {
    page: currentPage.value,
    size: pageSize.value,
    formNumber: formNumber.value || undefined,
  };

  try {
    const res = await requestFast.post(url, params);
    if (res.code === 200) {
      contracts.value = res.contracts.map(item => ({
        ...item,
        formNumber: String(item.formNumber || `temp_${Date.now()}_${Math.random()}`), // 确保 formNumber 是唯一字符串
      })) || [];
      totalPages.value = res.totalPages || 0;
      totalElements.value = res.totalElements || 0; 
      if (totalPages.value === 0 && currentPage.value !== 1) {
        currentPage.value = 1;
      }
      // 清理 selectedContracts 中不存在的 formNumber
      selectedContracts.value = selectedContracts.value.filter(formNumber =>
        contracts.value.some(contract => contract.formNumber === formNumber)
      );
    } else {
      contracts.value = [];
      totalPages.value = 0;
      totalElements.value = 0;
      selectedContracts.value = [];
    }
  } catch (error) {
    console.error('Failed to fetch contracts:', error);
    contracts.value = [];
    totalPages.value = 0;
    totalElements.value = 0;
    selectedContracts.value = [];
  }
};

const search = async () => {
  currentPage.value = 1;
  const url = isToken.value ? '/public/store/view/mod/contractOrderList/bylogin' : '/public/store/view/mod/noTokenContractOrderList';
  const params = isToken.value ? {
    page: currentPage.value,
    size: pageSize.value, 
    partyA: partyA.value || undefined,
    productId: productId.value || undefined,
    contractDateStart: contractDateRange.value && contractDateRange.value.length > 0 ? contractDateRange.value[0] : undefined,
    contractDateEnd: contractDateRange.value && contractDateRange.value.length > 1 ? contractDateRange.value[1] : undefined,
    paymentDateStart: paymentDateRange.value && paymentDateRange.value.length > 0 ? paymentDateRange.value[0] : undefined,
    paymentDateEnd: paymentDateRange.value && paymentDateRange.value.length > 1 ? paymentDateRange.value[1] : undefined,
    submitter: submitter.value || undefined,
    partyARepresentative: partyARepresentative.value || undefined,
    sortType: sortType.value || undefined,
    auditStatus: auditStatus.value || undefined,
  } : {
    page: currentPage.value,
    size: pageSize.value,
    formNumber: formNumber.value || undefined,
  };
  try {
    const res = await requestFast.post(url, params);
    if (res.code === 200) {
      contracts.value = res.contracts.map(item => ({
        ...item,
        formNumber: String(item.formNumber || `temp_${Date.now()}_${Math.random()}`), // 确保 formNumber 是唯一字符串
      })) || [];
      totalPages.value = res.totalPages || 0;
      totalElements.value = res.totalElements || 0;
      selectedContracts.value = selectedContracts.value.filter(formNumber =>
        contracts.value.some(contract => contract.formNumber === formNumber)
      );
    } else {
      contracts.value = [];
      totalPages.value = 0;
      totalElements.value = 0;
      selectedContracts.value = [];
    }
  } catch (error) {
    console.error('Failed to search contracts:', error);
    contracts.value = [];
    totalPages.value = 0;
    totalElements.value = 0;
    selectedContracts.value = [];
  }
};

const resetSearch = () => {
  if (isToken.value) {
    partyA.value = null;
    productId.value = null;
    contractDateRange.value = null;
    paymentDateRange.value = null;
    submitter.value = null;
    partyARepresentative.value = null;
    sortType.value = 'asc';
    auditStatus.value = null;
    pageSize.value = 10;
  } else {
    formNumber.value = null;
  }
  currentPage.value = 1;
  fetchContracts();
};

const tokenValid = async () => {
  const token = uni.getStorageSync('token');
  if (token) {
    const res = await requestFast.post('/public/store/view/mod/checkToken');
    if (res.code === 200) {
      isToken.value = true;
      level.value = res.Level;
      isPrint.value = res.isPrint;
    }
  }
};

const contractInfo = (fm) => {
  uni.navigateTo({
    url: `/pages/purchDept/contractDateail?fromNumber=${fm}`,
  });
};

const formatAmount = (amount) => {
  try {
    return `¥${amount.toLocaleString()}`;
  } catch (error) {
    return `¥0`;
  }
};

function getAuditStatusClass(status) {
  switch (status) {
    case '已通过': return 'status-approved';
    case '重点': return 'status-pending';
    case '未通过': return 'status-rejected';
    case '已作废': return 'status-unsubmitted';
    default: return '';
  }
}

function getCurrentApprovalStatusClass(status) {
  switch (status) {
    case '已审核': return 'status-approved';
    case '首次录入': return 'status-pending';
    case '未审核': return 'status-rejected';
    case '合同驳回': return 'status-rejected';
    default: return 'status-unsubmitted';
  }
}
</script>

<style scoped>
/* 全局样式 */
.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
  position: relative;
}
.container {
  flex: 1;
  padding: 20px;
  box-sizing: border-box;
  font-family: Arial, sans-serif;
}

/* 头部样式 */
.header { margin-bottom: 20px; }
.title {
  font-size: 25px;
  color: #2c3e50;
  font-weight: bold;
}
.multi-search-header {
  border-bottom: 1px solid #eee;
  margin-bottom: 10px;
}
.search-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
}
.search-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}
.toggle-btn {
  background-color: #007aff;
  color: white;
  border: none;
  border-radius: 15px;
  padding: 0px 20px;
  font-size: 12px;
  min-width: auto;
  text-align: center;
  cursor: pointer;
  margin-left: auto;
}
.single-search-area, .multi-search-area {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 20px;
}
.search-item {
  display: flex;
  align-items: center;
}
.search-label {
  font-size: 14px;
  color: #555;
  width: 100px;
  flex-shrink: 0;
}
.search-buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}
.search-btn {
  width: 48%;
  border-radius: 35rpx;
  padding: 5rpx 36rpx;
  font-size: 25rpx;
  border: none;
}
.reset-btn {
  background-color: #95a5a6;
  color: white;
}
.search-submit-btn {
  background-color: #007aff;
  color: white;
}

/* 列表和卡片样式 */
.summary-info {
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
  padding: 10px;
  background-color: #eaf6ff;
  border-radius: 5px;
  border: 1px solid #cce7ff;
}
.info-text {
  font-size: 14px;
  color: #333;
}
.contract-list { 
  margin-top: 10px; 
}
.contract-item {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: flex-start;
  min-height: 100px;
}
.item-content-wrapper {
  flex: 1; 
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.contract-name {
  font-size: 18px;
  font-weight: bold;
  color: #34495e;
}
.amount {
  font-size: 18px;
  font-weight: bold;
  color: #27ae60;
}
.item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap; 
}
.info-group {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  font-size: 14px;
}
.info-label {
  color: #7f8c8d;
}
.info-value {
  color: #2980b9;
  font-weight: bold;
  margin-right: 10px;
}
.status-and-action-group {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}
.status-group {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
  max-width: 200px;
}
.status-badge {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 12px;
  font-weight: 500;
  display: inline-block;
  white-space: nowrap; 
}
.status-approved { background-color: #e8f5e9; color: #27ae60; }
.status-pending { background-color: #e3f2fd; color: #2980b9; }
.status-rejected { background-color: #ffebee; color: #e74c3c; }
.status-unsubmitted { background-color: #f5f5f5; color: #7f8c8d; }

/* 审批详情按钮样式 */
.approval-details-btn {
  background-color: #4dabf7;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 3px 8px;
  font-size: 11px;
  font-weight: 500;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  white-space: nowrap;
  min-width: 60px;
}
.approval-details-btn:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
}

/* 分页样式 */
.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 10px;
}
.pagination-item {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  background-color: #fff;
  transition: all 0.3s;
}
.pagination-item.active {
  background-color: #007aff;
  color: #fff;
  border-color: #007aff;
}
.pagination-item:hover {
  background-color: #f0f0f0;
}

/* 悬浮按钮样式 */
.batch-button-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 100;
}
.batch-float-btn {
  background-color: #3498db;
  color: white;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  font-size: 14px;
  min-width: 0;
  padding: 0;
}
.action-float-btn-container {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 99;
  display: flex;
  gap: 15px;
}
.action-button {
  width: 90px;
  height: 40px;
  border-radius: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  font-size: 14px;
  color: white;
  min-width: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.audit-button {
  background-color: #2ecc71;
}
.delete-button {
  background-color: #e74c3c;
}
/* 复选框样式调整 */
.checkbox-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  flex-shrink: 0;
  padding: 5px;
}
.checkbox-container checkbox .wx-checkbox-input {
  width: 20px;
  height: 20px;
  border-radius: 50%;
}
</style>