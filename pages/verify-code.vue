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
import { onShow } from '@dcloudio/uni-app'
import requestFast from '../utils/requestFast'

const code = ref('')
const correctCode = '123456' // 这里可替换为从后端返回的验证码

onShow(async() => {
	// const userid = uni.getStorageSync('userId')
	// if (userid) {
	// 	const res = await getCodeRes(userid)
	// 	if (res) {
	// 		uni.reLaunch({
	// 			url:'/pages/index'
	// 		})
	// 	}
	// }
})


const verifyCode = async () => {
  if (code === '') {
	  uni.showToast({
	  	title:'请输入工号!'
	  })
  }
  const res = await getCodeRes(code.value)
  if (res) {
	  await uni.showToast({
	  	title:'登录成功!',
		icon:'success',
	  })
	  await uni.reLaunch({
	  	url:'/pages/index'
	  })
	  return
  }
  await uni.showToast({
  	title:'工号不正确，请输入正确的采购员工号',
	icon:'none'
  })
}

const getCodeRes = async(userId) => {
	const res = await requestFast.post('/public/store/view/mod/verifyCode', {userId: userId})
	if (res.code === 200) {
		uni.setStorageSync('userId', userId)
		return true
	}
	return false
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
