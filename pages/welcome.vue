<template>
  <view class="welcome-container">
    <!-- Logo 区域 -->
    <view class="logo-container">
      <image class="logo" src="https://zy.gdjqyy.cn:8022/static/logo-index.png" mode="scaleToFill"></image>
    </view>
    
    <!-- 按钮区域 -->
    <view class="button-group">
      <button class="btn supplier-btn" @click="navigateToSupplier">供应商入口</button>
      <button class="btn enterprise-btn" @click="navigateToEnterprise">企业入口</button>
    </view>
  </view>
</template>

<script setup>
	import {ref} from 'vue'
	import {onShow } from '@dcloudio/uni-app'
	import requestFast from '../utils/requestFast'
	const isCheck = ref(false)
	
	onShow(async() => {
		const res = await requestFast.post('/public/store/view/mod/checkToken')
		if (res.code === 200) {
			isCheck.value = true
		}
	})
	
	
	const navigateToSupplier = () => {
		uni.redirectTo({
			url:'/pages/purchDept/index'
		})
	}
	const navigateToEnterprise = () => {
		uni.navigateTo({
			url: isCheck.value ? '/pages/index' : '/pages/login'
		})
	}
</script>

<style lang="scss">
.welcome-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: white; /* 浅灰色背景，商务风格 */
  padding: 0 40rpx;
}

.logo-container {
  margin-bottom: 80rpx;
  text-align: center;
}

.logo {
  width: 380rpx;
  height: 300rpx;
}

.button-group {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 30rpx; /* 按钮间距 */
}

.btn {
  width: 100%;
  height: 90rpx;
  line-height: 90rpx;
  border-radius: 18rpx;
  font-size: 32rpx;
  font-weight: 500;
  border: none;
  color: #fff;
  transition: all 0.3s;
  
  &:active {
    opacity: 0.8;
    transform: scale(0.98);
  }
}

.supplier-btn {
  background-color: #409eff; /* 蓝色 - 供应商按钮 */
  box-shadow: 0 4rpx 12rpx rgba(64, 158, 255, 0.3);
}

.enterprise-btn {
  background-color: #67c23a; /* 绿色 - 企业按钮 */
  box-shadow: 0 4rpx 12rpx rgba(103, 194, 58, 0.3);
}
</style>