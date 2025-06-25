<template>
  <scroll-view scroll-y class="container">
    <!-- 甲乙双方信息 -->
    <view class="section">
      <view class="section-title">甲乙双方信息</view>
      <view class="parties-container">
        <view class="party-info">
          <view class="sub-section-title">甲方信息</view>
          <view class="info-item"><text class="label">公司：</text>{{partyAName}}</view>
          <view class="info-item"><text class="label">地址：</text>{{partyAAddress}}</view>
          <view class="info-item"><text class="label">账户：</text><text class="highlight-number">{{partyAAccount}}</text></view>
          <view class="info-item"><text class="label">开户行：</text>{{ partyABank }}</view>
          <view class="info-item"><text class="label">税号：</text>{{ partyATaxId }}</view>
          <view class="info-item"><text class="label">电话：</text><text class="highlight-number">{{ partyAPhone }}</text></view>
          <view class="info-item"><text class="label">签约代表：</text>{{ partyARepresentative }}</view>
          <view class="info-item"><text class="label">签约时间：</text>{{ partyAContractDate }}</view>
        </view>

        <view class="party-info">
          <view class="sub-section-title">乙方信息</view>
          <view class="info-item"><text class="label">公司：</text>{{ partyBName }}</view>
		  <view class="info-item"><text class="label">地址：</text>{{partyBAddress}}</view>
          <view class="info-item"><text class="label">账户：</text><text class="highlight-number">{{ partyBAccount }}</text></view>
          <view class="info-item"><text class="label">开户行：</text>{{ partyBBank }}</view>
		  <view class="info-item"><text class="label">税号：</text>{{ partyBTaxId }}</view>
          <view class="info-item"><text class="label">电话：</text><text class="highlight-number">{{ partyBPhone }}</text></view>
          <view class="info-item"><text class="label">签约代表：</text>{{ partyBRepresentative }}</view>
		  <view class="info-item"><text class="label">签约时间：</text>{{ partyBContractDate }}</view>
        </view>
      </view>
    </view>
	
    <!-- 合同概要 -->
    <view class="section">
      <view class="section-title">合同概要</view>
      <view class="info-grid">
        <view v-for="(item, index) in contractSummary" :key="index" class="info-item">
          <text class="label">{{ item.label }}：</text>
          <text class="value" :class="{
            'highlight-number': isNumber(item.value),
            'highlight-date': isDate(item.value),
            'highlight-money': isMoney(item.value)
          }">{{ item.value }}</text>
		  <button v-if="item.label === '合同编号'" size="mini" @click="cliCopy">复制</button>
        </view>
      </view>
    </view>

    <!-- 订单数据 -->
    <view class="section">
      <view class="section-title">订单明细</view>
      <view v-for="(order, index) in orders" :key="index" class="order-card">
        <view class="order-row"><text class="label">药品ID：</text><text class="highlight-id">{{ order.productId }}</text></view>
        <view class="order-row"><text class="label">药品名称：</text>{{ order.drugName }}</view>
        <view class="order-row"><text class="label">生产厂家：</text>{{ order.manufacturer }}</view>
        <view class="order-row"><text class="label">规格：</text>{{ order.specification }}</view>
        <view class="order-row"><text class="label">单位：</text>{{ order.unit }}</view>
        <view class="order-row"><text class="label">数量：</text><text class="highlight-number">{{ order.quantity }}</text></view>
        <view class="order-row"><text class="label">补差：</text><text class="highlight-money">{{ order.supplementDiff}}</text></view>
        <view class="order-row"><text class="label">备注：</text>{{ order.remarks}}</view>
      </view>
    </view>

    <!-- 底部按钮区 -->
    <view class="footer-btns">
      <!-- 审核订单按钮 -->
      <view class="audit-btn" @click="handleAudit" v-if="isShowApproval">
        <text>审核订单</text>
      </view>
    
      <!-- 查看附件按钮 -->
      <view class="attachment-btn" @click="showAttachment = true">
        <text>查看合同附件</text>
        <image src="/static/icon-preview.png" mode="aspectFit" class="preview-icon"></image>
      </view>
    </view>
	
    <!-- 附件图片蒙版 -->
    <view class="attachment-mask" v-if="showAttachment" @click="showAttachment = false">
      <view class="attachment-content" @click.stop>
        <image :src="picURL" mode="widthFix" class="attachment-image"></image>
        <view class="close-btn" @click="showAttachment = false">×</view>
      </view>
    </view>
  </scroll-view>
</template>

<script setup>
import { ref, computed } from 'vue'
import {onLoad} from '@dcloudio/uni-app'
import requestFast from '@/utils/requestFast.js'
import { API_BASE_URL_STATIC } from '@/utils/config'
import { checkLogin } from '../../utils/auth'

const partyAName = ref(null)
const partyAAddress = ref(null)
const partyATaxId = ref(null)
const partyABank = ref(null)
const partyAAccount = ref(null)
const partyAPhone = ref(null)
const partyARepresentative = ref(null)
const partyAContractDate = ref(null)

const partyBName = ref(null)
const partyBAddress = ref(null)
const partyBTaxId = ref(null)
const partyBBank = ref(null)
const partyBAccount = ref(null)
const partyBPhone = ref(null)
const partyBRepresentative = ref(null)
const partyBContractDate = ref(null)
const isKeyProject = ref(false)
const isShowApproval = ref(false)
const isShowType = ref(false)
const isShowStatus = ref(false)
const approvalType = ref('')
const approvalStatus = ref([])

onLoad(async(opt) => {
	fm.value = opt.fromNumber
	await detail(fm.value)
	await findApprovalStatusByUserId(fm.value)
})

const contractSummary1 = [
  { label: '库存数量', value: '500盒' },
  { label: '购进政策', value: '买五赠一' },
  { label: '终端政策', value: '送展示柜' },
  { label: '业务奖励', value: '季度返现' },
  { label: '购进单位', value: '广东医药有限公司' },
  { label: '返利单位', value: '转账' },
  { label: '承诺支付日期', value: '2025-06-01' },
  { label: '承诺支付截止日期', value: '2025-06-01' },
  { label: '政策执行方式', value: '先执行后返现' },
  { label: '政策类型', value: '常规促销' },
  { label: '活动起始时间', value: '2025-06-01' },
  { label: '活动结束时间', value: '2025-08-31' },
  { label: '签约金额', value: '¥1,200,000' },
  { label: '合同编号', value: 'jq' },
]

const contractSummary = ref([])
const orders = ref([])
const picURL = ref(null)
const fm = ref(null)

const cliCopy = () => {
	uni.setClipboardData({
		data:fm.value,
		success() {
			uni.showToast({
				icon:'none',
				title:'复制成功'
			})
		}
	})
}

const findApprovalStatusByUserId = async(fromNumber) => {
	const res = await requestFast.post('/public/store/view/mod/findApprovalStatusByUserId', {fm: fromNumber})
	if (res.code === 200) {
		var _res = res.data
		isShowApproval.value = _res.isShowApproval
		isShowType.value = _res.isShowType
		isShowStatus.value = _res.isShowStatus
		approvalType.value = _res.approvalType
		approvalStatus.value = _res.approvalStatus
	}
}

const detail = async(fromNumber) => {
	const res = await requestFast.post('/public/store/view/mod/contractOrderDetail', {keyword: fromNumber})
	if (!res === 200) return
	
	orders.value = res.submissionDateDetailList
	picURL.value = API_BASE_URL_STATIC + '/' + res.filePath
	
	partyAName.value = res.partyAName
	partyAAddress.value = res.partyAAddress
	partyATaxId.value = res.partyATaxId
	partyABank.value = res.partyABank
	partyAAccount.value = res.partyAAccount
	partyAPhone.value = res.partyAPhone
	partyARepresentative.value = res.partyARepresentative
	partyAContractDate.value = res.partyAContractDate
	
	partyBName.value = res.partyBName
	partyBAddress.value = res.partyBAddress
	partyBTaxId.value = res.partyBTaxId
	partyBBank.value = res.partyBBank
	partyBAccount.value = res.partyBAccount
	partyBPhone.value = res.partyBPhone
	partyBRepresentative.value = res.partyBRepresentative
	partyBContractDate.value = res.partyBContractDate
	auditStatus.value = res.auditStatus
	isKeyProject.value = res.isKeyProject
	
	contractSummary.value.push({ label: '库存数量', value: res.inventoryQuantity })
	contractSummary.value.push({ label: '购进政策', value: res.purchasePolicy})
	contractSummary.value.push({ label: '终端政策', value: res.terminalPolicy })
	contractSummary.value.push({ label: '业务奖励', value: res.businessReward},)
	contractSummary.value.push({ label: '购进单位', value: res.purchaseUnit })
	contractSummary.value.push({ label: '返利单位', value: res.rebateMethod })
	contractSummary.value.push({ label: '承诺支付日期', value: res.commitmentPaymentDate })
	contractSummary.value.push({ label: '承诺支付截止日期', value: res.commitmentPaymentDateEnd })
	contractSummary.value.push({ label: '政策执行方式', value: res.policyExecutionMethod })
	contractSummary.value.push({ label: '政策类型', value: res.policyType })
	contractSummary.value.push({ label: '活动起始时间', value: res.activityStartDate })
	contractSummary.value.push({ label: '活动结束时间', value: res.activityEndDate })
	contractSummary.value.push({ label: '签约金额', value: res.totalPurchaseAmount })
	contractSummary.value.push({ label: '合同编号', value: fm.value })
}

const showAttachment = ref(false)

const isNumber = (value) => {
  return /^\d+$/.test(value) || /^\d+盒$/.test(value) || /^\d+片$/.test(value);
}

const isDate = (value) => {
  return /\d{4}-\d{2}-\d{2}/.test(value) || /至/.test(value);
}

const isMoney = (value) => {
  return /¥|元/.test(value);
}

// 审核状态
const auditStatus = ref(null);

const canAudit = computed(() => auditStatus.value === '未审核');
const canCancelAudit = computed(() => auditStatus.value === '已审核');
const canVoid = computed(() => auditStatus.value !== '已作废' && auditStatus.value !== '未审核');

const handleAudit = async() => {
  const itemList = [];
  for (var i = 0; i < approvalStatus.value.length; i++) {
	var title = approvalStatus.value[i]
	if (title === '未审核') {
		itemList.push('弃审')
		continue
	}
	itemList.push(title.substring(1,3))
  }
  if (isShowType.value) {
	  itemList.push(approvalType.value === '重点合同' ? '标记为重点合同' : '标记为普通合同')
  }

  if (itemList.length === 0) {
    uni.showToast({
      title: '当前状态不可操作',
      icon: 'none'
    });
    return;
  }

  uni.showActionSheet({
    itemList,
    success: (res) => {
      const action = itemList[res.tapIndex];
      if (action === '审核') confirmAudit('已审核');
      else if (action === '弃审') confirmAudit('未审核');
      else if (action === '作废') confirmAudit('已作废');
      else if (action === '标记为普通合同') confirmAudit('普通合同');
      else if (action === '标记为重点合同') confirmAudit('重点合同');
    },
    fail: () => {}
  });
};

const confirmAudit = (newStatus) => {
	var contents = ''
	if (newStatus === '普通合同') {
		contents = '转普通合同'
	} else if (newStatus === '重点合同') {
		contents = '转重点合同'
	} else {
		contents = newStatus
	}
  uni.showModal({
    title: `确认${newStatus}`,
    content: `您确定要将订单标记为【${newStatus}】吗？`,
    success: async (res) => {
      if (res.confirm) {
        auditStatus.value = newStatus;
		const res = await requestFast.post('/public/store/view/mod/editAuditStatus', {fm: fm.value, auditStatus: newStatus})
		console.log(res)
		if (res.code === 200) {
			await detail(fm.value)
		}
        uni.showToast({
          title: res.code === 200 ? `${contents}成功` : `${contents}失败`,
          icon: res.code === 200 ? 'success' : 'fail'
        });
      }
    }
  });
};
</script>

<style scoped>
/* 底部按钮容器 */
.footer-btns {
  position: fixed;
  bottom: 40rpx;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  gap: 24rpx; /* 按钮之间间距 */
  z-index: 99;
}

/* 审核按钮 */
.audit-btn {
  background-color: #34c38f; /* 绿色，偏柔和 */
  color: #ffffff;
  padding: 16rpx 32rpx;
  border-radius: 24rpx; /* 圆角但不过度 */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  box-shadow: 0 2rpx 8rpx rgba(52, 195, 143, 0.3);
  min-width: 180rpx; /* 最小宽度，保持按钮均匀 */
}

.container {
  padding: 32rpx;
  background-color: #f5f7fa;
  box-sizing: border-box;
  padding-bottom: 120rpx; /* 为底部按钮留出空间 */
}

.section {
  background-color: #ffffff;
  border-radius: 20rpx;
  padding: 32rpx;
  margin-bottom: 32rpx;
  box-shadow: 0 6rpx 10rpx rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
}

.section-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 20rpx;
  border-left: 10rpx solid #007aff;
  padding-left: 20rpx;
  box-sizing: border-box;
}

.sub-section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #007aff;
  margin: 20rpx 0 12rpx;
  padding-left: 10rpx;
  box-sizing: border-box;
}

.parties-container {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.party-info {
  width: 48%;
  min-width: 300rpx;
}

.info-grid {
  display: flex;
  flex-direction: column;
  padding: 0 10rpx;
  box-sizing: border-box;
}

.info-item {
  margin-bottom: 16rpx;
  font-size: 28rpx;
  color: #333;
  padding: 0 10rpx;
  box-sizing: border-box;
}

.label {
  color: #666;
  min-width: 180rpx;
  display: inline-block;
}

.value {
  color: #222;
  font-weight: 500;
}

/* 数字高亮样式 */
.highlight-number {
  color: #339933;
  font-weight: bold;
}

/* 日期高亮样式 */
.highlight-date {
  color: #0066cc;
  font-weight: bold;
}

/* 金额高亮样式 */
.highlight-money {
  color: #ff6600;
  font-weight: bold;
}

/* ID高亮样式 */
.highlight-id {
  color: #663399;
  font-weight: bold;
}

.order-card {
  background-color: #fdfdfd;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
  border: 1rpx solid #e0e0e0;
  box-sizing: border-box;
}

.order-row {
  font-size: 28rpx;
  margin-bottom: 12rpx;
  padding: 0 10rpx;
  box-sizing: border-box;
}

/* 查看附件按钮 */
.attachment-btn {
  background-color: #4e8ef7; /* 蓝色，柔和 */
  color: #ffffff;
  padding: 16rpx 32rpx;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  box-shadow: 0 2rpx 8rpx rgba(78, 142, 247, 0.3);
  min-width: 180rpx;
}

.preview-icon {
  width: 28rpx;
  height: 28rpx;
  margin-left: 8rpx;
}

/* 附件蒙版 */
.attachment-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.attachment-content {
  position: relative;
  width: 90%;
  max-width: 700rpx;
  max-height: 80vh; /* 新增：限制容器最大高度 */
  background-color: #fff;
  border-radius: 20rpx;
  padding: 20rpx;
  box-sizing: border-box;
  display: flex; /* 新增 */
  flex-direction: column; /* 新增 */
  /* 新增：防止内容溢出 */
  /* overflow: hidden; */
}

.attachment-image {
  width: 100%;
  max-height: calc(80vh - 80rpx); /* 计算值：容器高度减去padding和关闭按钮空间 */
  border-radius: 10rpx;
  object-fit: contain; /* 保持图片比例 */
}

.close-btn {
  position: absolute;
  top: -40rpx;
  right: -10rpx;
  width: 60rpx;
  height: 60rpx;
  background-color: #ff3b30;
  color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 40rpx;
  font-weight: bold;
}
</style>