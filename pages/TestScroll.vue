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
              @confirm="search"
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
        <view v-for="(contract, index) in contracts" :key="index" class="contract-item">
          <view class="contract-details">
            <text class="contract-name">{{ contract.name }}</text>
            <text class="contract-date">{{ contract.date }}</text>
          </view>
          <view class="contract-amount">
            <text class="amount">{{ formatAmount(contract.amount) }}</text>
          </view>
          <view class="purchaser">
            <text class="purchaser-label">采购员: </text>
            <text class="purchaser-name">{{ contract.purchaser }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';

const contracts = ref([
  { name: '广东白云山制药', date: '2023-01-15', amount: 120000, purchaser: '张三' },
  { name: '合同B', date: '2023-02-20', amount: 150000, purchaser: '李四' },
  { name: '合同C', date: '2023-03-25', amount: 95000, purchaser: '王五' },
]);

const formatAmount = (amount) => {
  return `¥${amount.toLocaleString()}`;
};

const search = () => {
  // TODO: 添加搜索逻辑
  console.log('搜索执行');
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
