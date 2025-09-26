<template>
  <view class="page">
    <view class="container">
      <!-- 标题 -->
      <view class="header">
        <text class="title">审批详情</text>
      </view>

      <!-- 合同基本信息 -->
      <view class="info-card">
        <view class="info-item">
          <text class="info-label">甲方公司:</text>
          <text class="info-value partA">{{ contract.partAName || '未知' }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">采购员:</text>
          <text class="info-value submitter">{{ contract.submitter || '未知' }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">合同创建时间:</text>
          <text class="info-value submitTime">{{ formatTime(contract.submitTime) }}</text>
        </view>
      </view>

      <!-- 审批流程列表 -->
      <view class="approval-list">
        <text class="section-title">审批流程</text>
        <view v-if="approvalHistory.length > 0" class="approval-list-content">
          <view
            v-for="(item, index) in approvalHistory"
            :key="index"
            class="approval-item"
          >
            <view class="approval-item-content">
              <view class="approval-header">
                <text class="approver">{{ item.approver || '未知' }}</text>
                <text class="status-badge" :class="getStatusClass(item.status)">
                  {{ item.status || '待处理' }}
                </text>
              </view>
              <view class="approval-footer">
                <view class="info-group">
                  <text class="info-label">审批时间:</text>
                  <text class="info-value">{{ formatTime(item.time) }}</text>
                  <text class="info-label">备注:</text>
                  <text class="info-value">{{ item.comment || '无' }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
        <view v-else class="no-data">
          <text>暂无审批记录</text>
        </view>
      </view>

      <!-- 返回按钮 -->
      <view class="action-buttons">
        <button class="return-btn" @click="goBack">返回</button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import requestFast from '@/utils/requestFast';

// ------------------- 响应式变量 -------------------
const contract = ref({
  partAName: '',
  submitter: '',
  submitTime: '',
});
const approvalHistory = ref([]);

// ------------------- 示例数据 -------------------
const mockData = {
  partAName: '示例科技有限公司',
  submitter: '张三',
  submitTime: '2025-09-24T10:00:00',
  approvalHistory: [
    {
      approver: '李四',
      status: '已审核',
      time: '2025-09-24T12:00:00',
      comment: '合同条款符合要求，已通过',
    },
    {
      approver: '王五',
      status: '待审核',
      time: '2025-09-24T14:00:00',
      comment: '等待进一步确认',
    },
  ],
};

// ------------------- 生命周期钩子 -------------------
onLoad((options) => {
  const formNumber = options.formNumber;
  if (formNumber) {
    fetchApprovalDetails(formNumber);
  } else {
    uni.showToast({
      title: '无效的合同编号',
      icon: 'error',
    });
    // 使用示例数据展示
    contract.value = {
      partAName: mockData.partAName,
      submitter: mockData.submitter,
      submitTime: mockData.submitTime,
    };
    approvalHistory.value = mockData.approvalHistory;
  }
});

// ------------------- 数据获取 -------------------
const fetchApprovalDetails = async (formNumber) => {
  uni.showLoading({ title: '加载中...' });
  try {
    // 占位符 API，需替换为实际接口
    const res = await requestFast.get(`/public/store/view/mod/approvalDetails/${formNumber}`);
    if (res.code === 200) {
      contract.value = {
        partAName: res.data.partAName || '',
        submitter: res.data.submitter || '',
        submitTime: res.data.submitTime || '',
      };
      approvalHistory.value = res.data.approvalHistory || [];
    } else {
      uni.showToast({
        title: '加载失败，使用示例数据',
        icon: 'none',
      });
      // 失败时使用示例数据
      contract.value = {
        partAName: mockData.partAName,
        submitter: mockData.submitter,
        submitTime: mockData.submitTime,
      };
      approvalHistory.value = mockData.approvalHistory;
    }
  } catch (error) {
    console.error('Failed to fetch approval details:', error);
    uni.showToast({
      title: '请求失败，使用示例数据',
      icon: 'none',
    });
    // 错误时使用示例数据
    contract.value = {
      partAName: mockData.partAName,
      submitter: mockData.submitter,
      submitTime: mockData.submitTime,
    };
    approvalHistory.value = mockData.approvalHistory;
  } finally {
    uni.hideLoading();
  }
};

// ------------------- 工具函数 -------------------
const formatTime = (time) => {
  if (!time) return '未知';
  return time.replace('T', ' ');
};

const getStatusClass = (status) => {
  switch (status) {
    case '已审核': return 'status-approved';
    case '待审核': return 'status-pending';
    case '未审核': return 'status-rejected';
    case '已拒绝': return 'status-rejected';
    default: return 'status-unsubmitted';
  }
};

// ------------------- 交互逻辑 -------------------
const goBack = () => {
  uni.navigateBack();
};
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
.header {
  margin-bottom: 20px;
}
.title {
  font-size: 25px;
  color: #2c3e50;
  font-weight: bold;
}

/* 合同信息卡片 */
.info-card {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.info-label {
  font-size: 14px;
  color: #7f8c8d; /* 灰色标签，与 contractQuery.vue 一致 */
  width: 100px;
  flex-shrink: 0;
}
.info-value {
  font-size: 14px;
  font-weight: bold;
}
.info-value.partA {
  color: #2980b9; /* 蓝色，甲方公司 */
}
.info-value.submitter {
  color: #27ae60; /* 绿色，采购员 */
}
.info-value.submitTime {
  color: #34495e; /* 深蓝色，合同创建时间 */
}

/* 审批流程列表 */
.approval-list {
  margin-top: 20px;
}
.section-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}
.approval-list-content {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.approval-item {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.approval-item-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.approval-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.approver {
  font-size: 16px;
  font-weight: bold;
  color: #34495e;
}
.status-badge {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 12px;
  font-weight: 500;
  display: inline-block;
  white-space: nowrap;
}
.status-approved {
  background-color: #e8f5e9;
  color: #27ae60;
}
.status-pending {
  background-color: #e3f2fd;
  color: #2980b9;
}
.status-rejected {
  background-color: #ffebee;
  color: #e74c3c;
}
.status-unsubmitted {
  background-color: #f5f5f5;
  color: #7f8c8d;
}
.approval-footer {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  font-size: 14px;
}
.approval-footer .info-label {
  color: #7f8c8d;
}
.approval-footer .info-value {
  color: #2980b9;
  font-weight: bold;
  margin-right: 10px;
}
.no-data {
  text-align: center;
  font-size: 14px;
  color: #7f8c8d;
  padding: 20px;
}

/* 返回按钮 */
.action-buttons {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
.return-btn {
  background-color: #4dabf7; /* 浅蓝色，与 contractQuery.vue 的 approval-details-btn 一致 */
  color: white;
  border: none;
  border-radius: 10px;
  padding: 5px 20px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}
.return-btn:hover {
  background-color: #66b1ff; /* 更浅的蓝色，hover 效果 */
}
</style>