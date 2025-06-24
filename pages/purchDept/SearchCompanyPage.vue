<template>
  <view class="container">
    <!-- 顶部搜索框 -->
    <view class="search-box">
      <uni-easyinput
        v-model="keyword"
        placeholder="请输入检索关键词"
        :inputBorder="false"
        @input="onSearchInput"
        :clearable="true"
        class="input"
      />
    </view>

    <!-- 搜索结果 -->
    <view v-if="results.length > 0" class="results">
      <view
        v-for="(item, index) in results"
        :key="index"
        class="supplier-card"
      >
        <view class="field company-name">
          <text class="label">🏢 公司名称：</text>
          <text class="value strong">{{ item.name }}</text>
        </view>
        <view class="field">
          <text class="label">税号：</text>
          <text class="value">{{ item.taxId }}</text>
        </view>
        <view class="field">
          <text class="label">电话：</text>
          <text class="value">{{ item.phone }}</text>
        </view>
        <view class="field">
          <text class="label">地址：</text>
          <text class="value">{{ item.address }}</text>
        </view>
        <view class="field">
          <text class="label">备注：</text>
          <text class="value highlight">{{ item.remark }}</text>
        </view>
        <view class="field">
          <text class="label">法人代表：</text>
          <text class="value strong">{{ item.legalPerson }}</text>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view v-else class="empty">暂无搜索结果</view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const keyword = ref('')
const results = ref([])

const mockData = [
  {
    name: '广东百胜医药有限公司',
    taxId: '91440101683456789A',
    phone: '020-12345678',
    address: '广州市天河区科技路88号',
    remark: '重点合作伙伴',
    legalPerson: '李强'
  },
  {
    name: '深圳华通制药公司',
    taxId: '91440300765432100B',
    phone: '0755-87654321',
    address: '深圳市福田区华强北路188号',
    remark: '新注册供应商',
    legalPerson: '王伟'
  }
]

const onSearchInput = () => {
  const query = keyword.value.trim()
  if (!query) {
    results.value = []
    return
  }
  results.value = mockData.filter(item =>
    item.name.includes(query)
  )
}
</script>

<style scoped>
.container {
  padding: 24rpx;
  background-color: #f6f7fa;
  min-height: 100vh;
}

.search-box {
  margin-bottom: 32rpx;
  background-color: #ffffff;
  padding: 20rpx;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.input {
  font-size: 28rpx;
}

.results {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.supplier-card {
  background-color: #ffffff;
  border-left: 8rpx solid #007aff;
  border-radius: 12rpx;
  padding: 28rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}

.field {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 18rpx;
  line-height: 1.6;
}

.label {
  font-weight: bold;
  color: #1a1a1a;
}

.value {
  color: #444;
}

.value.strong {
  font-weight: bold;
  color: #111;
}

.value.highlight {
  color: #d87c00;
  font-weight: 500;
}

.company-name {
  font-size: 30rpx;
  margin-bottom: 24rpx;
}

.empty {
  text-align: center;
  color: #999;
  font-size: 28rpx;
  margin-top: 100rpx;
}
</style>
