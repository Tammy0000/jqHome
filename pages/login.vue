<template>
  <view class="login-container">
    <!-- 动态视频背景 -->
    <video
      class="bg-video"
      :src="bgVideoPath"
      autoplay
      loop
      muted
      :show-play-btn="false"
      :controls="false"
      objectFit="cover"
    ></video>
    
    <!-- 半透明遮罩层 -->
    <view class="video-overlay"></view>
    
    <!-- 登录框 -->
    <view class="login-box">
      <!-- 公司Logo -->
      <image class="logo" :src="logoPath" mode="aspectFit"></image>
      
      <!-- 公司名称 -->
      <text class="company-name">广东济群药业有限公司</text>
      
      <!-- 登录表单 -->
      <view class="form">
        <view class="input-group">
          <input
            class="input"
            type="text"
            v-model="form.username"
            placeholder="请输入用户ID"
            placeholder-class="placeholder"
          />
        </view>
        
        <view class="input-group">
          <input
            class="input"
            type="password"
            v-model="form.password"
            placeholder="请输入密码"
            placeholder-class="placeholder"
            @confirm="handleLogin"
          />
        </view>
        
        <button class="login-btn" @click="handleLogin" :loading="loading">登 录</button>
        <button class="login-btn" @click="handleLoginExit">退 出</button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import requestFast from '@/utils/requestFast';
// 静态资源路径
const bgVideoPath = ref('/static/login-bg.mp4') // 请替换为您的视频路径
const logoPath = ref('https://zy.gdjqyy.cn:8022/static/logo.png') // 请替换为您的Logo路径

// 表单数据
const form = reactive({
  username: '',
  password: ''
})

// 加载状态
const loading = ref(false)

// 登录方法
const handleLogin = async () => {
  if (!form.username.trim()) {
    uni.showToast({
      title: '请输入用户ID',
      icon: 'none'
    })
    return
  }
  
  if (!form.password) {
    uni.showToast({
      title: '请输入密码',
      icon: 'none'
    })
    return
  }
  
  loading.value = true
  
  const res = await requestFast.post('/public/store/view/mod/login', {userId:form.username, passWord:form.password})
  if (res) {
	if (res.code === 200) {
		uni.setStorageSync('token', res.token)
		uni.showToast({
			icon:'success',
			title:res.msg,
			success() {
				uni.reLaunch({
					url:'/pages/index'
				})
			}
		})
		loading.value = false
		return
	}
	uni.showToast({
		icon:'error',
		title:res.msg
	})
	loading.value = false
  }
}

const handleLoginExit = () => {
	uni.navigateBack({
		delta:1
	})
}


// 页面加载时检查登录状态（可选）
onLoad(() => {
  const token = uni.getStorageSync('token')
  if (token) {
    uni.reLaunch({ url: '/pages/index/index' })
  }
})
</script>

<style>
/* 全局样式 */
page {
  height: 100%;
  overflow: hidden;
}

/* 容器样式 */
.login-container {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 视频背景样式 */
.bg-video {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
  object-fit: cover;
}

/* 视频遮罩层 */
.video-overlay {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
  background-color: rgba(0, 0, 0, 0.3);
}

/* 登录框样式 */
.login-box {
  width: 80%;
  max-width: 500rpx;
  background-color: rgba(255, 255, 255, 0.92);
  border-radius: 16rpx;
  padding: 60rpx 40rpx;
  box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.15);
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
}

/* Logo样式 */
.logo {
  width: 140rpx;
  height: 140rpx;
  margin-bottom: 30rpx;
}

/* 公司名称样式 */
.company-name {
  font-size: 34rpx;
  color: #333;
  font-weight: bold;
  margin-bottom: 60rpx;
  letter-spacing: 1rpx;
}

/* 表单样式 */
.form {
  width: 100%;
}

/* 输入框组样式 */
.input-group {
  margin-bottom: 40rpx;
  position: relative;
}

/* 输入框样式 */
.input {
  width: 100%;
  height: 80rpx;
  border-bottom: 1rpx solid #e0e0e0;
  font-size: 30rpx;
  padding: 10rpx 0;
  color: #333;
  transition: border-color 0.3s;
}

.input:focus {
  border-bottom-color: #007AFF;
}

/* 占位符样式 */
.placeholder {
  color: #aaa;
  font-size: 28rpx;
}

/* 登录按钮样式 */
.login-btn {
  width: 100%;
  height: 90rpx;
  line-height: 90rpx;
  background-color: #007AFF;
  color: #fff;
  font-size: 34rpx;
  border-radius: 45rpx;
  margin-top: 50rpx;
  transition: all 0.3s;
  border: none;
}

.login-btn:active {
  opacity: 0.9;
  transform: scale(0.98);
}

.login-btn[loading] {
  opacity: 0.8;
}

/* 响应式调整 */
@media (min-width: 768px) {
  .login-box {
    max-width: 400rpx;
    padding: 80rpx 50rpx;
  }
  
  .company-name {
    font-size: 36rpx;
  }
  
  .input {
    font-size: 32rpx;
  }
}
</style>