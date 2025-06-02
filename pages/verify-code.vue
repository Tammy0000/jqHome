<template>
  <view class="container">
    <view class="card">
      <text class="title">请输入验证码</text>
      <uni-easyinput
        v-model="code"
        placeholder="请输入6位验证码"
        :inputBorder="false"
        class="input"
        maxlength="6"
      />
      <button class="confirm-btn" @click="verifyCode">确认</button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const code = ref('')
const correctCode = '123456' // 这里可替换为从后端返回的验证码

const verifyCode = () => {
  if (code.value.trim() === correctCode) {
    uni.showToast({
      title: '验证成功',
      icon: 'success'
    })
    setTimeout(() => {
      uni.navigateTo({
        url: '/pages/next-page/next-page' // 替换为你跳转的页面路径
      })
    }, 1000)
  } else {
    uni.showToast({
      title: '验证码错误',
      icon: 'none'
    })
  }
}
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f6f7fa;
  padding: 40rpx;
}

.card {
  width: 100%;
  max-width: 600rpx;
  background-color: #ffffff;
  border-radius: 20rpx;
  padding: 60rpx 40rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  text-align: center;
  margin-bottom: 40rpx;
  color: #333;
}

.input {
  font-size: 30rpx;
  margin-bottom: 40rpx;
}

.confirm-btn {
  background-color: #007aff;
  color: white;
  font-size: 26rpx;
  padding: 16rpx 0;
  border-radius: 12rpx;
  box-shadow: 0 4rpx 8rpx rgba(0, 122, 255, 0.2);
  transition: background-color 0.3s, transform 0.2s;
  width: 60%;
  margin: 32rpx auto 0;
}

.confirm-btn:active {
  background-color: #005fc1;
  transform: scale(0.96);
}

</style>
