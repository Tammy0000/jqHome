<template>
  <view class="page">
    <view class="container">
      <view class="header">
        <text class="title">合同查询</text>
        <view class="context-search">
          <view>
            <uni-search-bar
              class="uni-mt-10"
              radius="100"
              placeholder="输入采购员编号查询"
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
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import {onShow} from '@dcloudio/uni-app'
import requestFast from '../utils/requestFast';
import { showToast } from '../utils/showToast';

const contracts = ref([]);
const submitter = ref(null)

onShow(async() => {
	const res = await requestFast.post('/public/store/view/mod/contractOrderList', {keyword: '-1'})
	if (res.code === 200) {
		contracts.value = res.data
	}
})

const contractInfo = (fm) => {
	uni.navigateTo({
		url:'/pages/contractDateail?fromNumber=' + fm
	})
}

const formatAmount = (amount) => {
  return `¥${amount.toLocaleString()}`;
};

const search = async () => {
  // TODO: 添加搜索逻辑
  const res = await requestFast.post('/public/store/view/mod/contractOrderList', {keyword: submitter.value})
  if (res.code === 200) {
  	contracts.value = res.data
  }
};
</script>

<style scoped>
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
