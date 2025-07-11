<template>
  <view class="page">
    <view class="container">
      <view class="header">
        <text class="title">合同查询</text>
        <view class="context-search" v-if="level !== 1 || isPrint">
          <view>
            <uni-search-bar
              class="uni-mt-10"
              radius="100"
              :placeholder=serachTitle
              clearButton="none"
              cancelButton="none"
			  v-model="submitter"
            />
          </view>
          <view style="display: grid; place-items: center;">
            <button
              size="mini"
              style="
                border-radius: 35rpx;
                padding: 5rpx 36rpx;
                background-color: #007aff;
                color: white;
                font-size: 25rpx;
                border: none;
              "
              @click="search"
            >搜索</button>
          </view>
        </view>
      </view>

      <view class="contract-list">
        <view v-for="(contract, index) in contracts" :key="index" class="contract-item" @click="contractInfo(contract.formNumber)">
          <view class="contract-details">
            <text class="contract-name">{{ contract.partAName }}</text>
            <text class="contract-date">{{ contract.submitTime }}</text>
          </view>
          <view class="contract-amount">
            <text class="amount">{{ formatAmount(contract.totalPurchaseAmount) }}</text>
          </view>
          <view class="purchaser">
            <text class="purchaser-label">采购员: </text>
            <text class="purchaser-name">{{ contract.submitter }}</text>
          </view>
		  <!-- 审核状态 -->
		      <view class="contract-footer">
		        <text v-if="contract.isKeyProject" class="audit-status" :class="getAuditStatusClass('重点')">
		          重点合同
		        </text>
				<text class="audit-status" :class="getAuditStatusClass(contract.auditStatus)" style="margin-left: 25rpx;">
				  {{ contract.auditStatus }}
				</text>
				<text class="audit-status" 
				:class="getAuditStatusClass('下载')" 
				style="margin-left: 25rpx;"
				v-if="isPrint"
				@click.stop="dw(contract.formNumber)">
				  下载
				</text>
		      </view>
        </view>
		<view v-if="contracts.length === 0">
			<text>暂无数据</text>
		</view>
	  </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import {onShow, onLoad} from '@dcloudio/uni-app'
import requestFast from '@/utils/requestFast';
import { showToast } from '@/utils/showToast';
import { checkLogin } from '../../utils/auth';
import { downloadFile } from '@/utils/downloadUtil.js';
import { API_BASE_URL } from '../../utils/config';

const contracts = ref([]);
const submitter = ref(null)
const serachTitle = ref("输入合同编号查询")
const isToken = ref(false)
const level = ref(0)
const isPrint = ref(false)

onShow(async() => {
	await tokenValid()
	await contractOrderListByUserId()
})

const dw = async(fm) => {
	var uri = API_BASE_URL + '/public/analysis/moudle/v3/' + fm
	console.log(uri)
	await downloadFile(uri, fm + '.xlsx')
}

const contractOrderListByUserId = async () => {
	const res = await requestFast.get('/public/store/view/mod/contractOrderListByUserId')
	if (res.code === 200) {
		contracts.value = res.data
	}
} 

const tokenValid = async() => {
	const token = uni.getStorageSync('token')
	if (token) {
		const res = await requestFast.post('/public/store/view/mod/checkToken')
		if (res.code === 200) {
			serachTitle.value = '输入采购员姓名查询'
			isToken.value = true
			level.value = res.Level
			isPrint.value = res.isPrint
		}
	}
}

const contractInfo = (fm) => {
	uni.navigateTo({
		url:'/pages/purchDept/contractDateail?fromNumber=' + fm
	})
}

const formatAmount = (amount) => {
  try {
  	return `¥${amount.toLocaleString()}`;
  } catch (error) {
  	return `¥0`;
  }
};

const search = async () => {
  // TODO: 添加搜索逻辑
  const tokenSerach = '/public/store/view/mod/contractOrderList'
  const noTokenSerach = '/public/store/view/mod/noTokenContractOrderList'
  const res = await requestFast.post(isToken.value ? tokenSerach : noTokenSerach, {keyword: submitter.value})
  if (res.code === 200) {
  	contracts.value = res.data
  }
  if (res.code === 500) {
	  contracts.value = []
  }
};

function getAuditStatusClass(status) {
  switch (status) {
    case '已审核':
      return 'status-approved';
    case '重点':
      return 'status-pending';
    case '未审核':
      return 'status-rejected';
    case '已作废':
      return 'status-unsubmitted';
	case '下载':
	  return 'status-approved';
    default:
      return '';
  }
}

</script>

<style scoped>
/* Contract Footer */
.contract-footer {
  width: 100%;
  text-align: right;
  margin-top: 5px;
}

.audit-status {
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 12px;
  display: inline-block;
  font-weight: 500;
}

/* 不同状态颜色 */
.status-approved {
  background-color: #e8f5e9;
  color: #27ae60; /* 绿色 */
}

.status-pending {
  background-color: #e3f2fd;
  color: #2980b9; /* 蓝色 */
}

.status-rejected {
  background-color: #ffebee;
  color: #e74c3c; /* 红色 */
}

.status-unsubmitted {
  background-color: #f5f5f5;
  color: #7f8c8d; /* 灰色 */
}
/* 页面铺满整个屏幕 */
.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

/* Container */
.container {
  flex: 1;
  padding: 20px;
  box-sizing: border-box;
  font-family: Arial, sans-serif;
}

/* Header */
.header {
  margin-bottom: 20px;
}

.title {
  font-size: 25px;
  color: #2c3e50;
  font-weight: bold;
}

.context-search {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
  margin-top: 10px;
}

/* Contract List */
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
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
}

/* Contract Details */
.contract-details {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 10px;
}

.contract-name {
  font-size: 18px;
  color: #34495e;
  font-weight: bold;
}

.contract-date {
  font-size: 14px;
  color: #7f8c8d;
}

/* Contract Amount */
.contract-amount {
  text-align: right;
}

.amount {
  font-size: 18px;
  font-weight: bold;
  color: #27ae60;
}

/* Purchaser Information */
.purchaser {
  display: flex;
  align-items: center;
  margin-top: 10px;
}

.purchaser-label {
  font-size: 14px;
  color: #7f8c8d;
  margin-right: 5px;
}

.purchaser-name {
  font-size: 16px;
  color: #2980b9;
  font-weight: bold;
}
</style>
