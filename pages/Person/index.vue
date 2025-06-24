<template>
  <view class="personal-center">
    <!-- 用户信息区 -->
    <view class="user-section bg-gradient-blue">
      <image class="avatar" :src="userInfo.avatar" mode="aspectFill"></image>
      <view class="user-info">
        <text class="username">{{ userInfo.username }}</text>
        <text class="user-id">ID: {{ userInfo.userId }}</text>
      </view>
    </view>

    <!-- 账户安全区 -->
    <view class="card-container">
      <view class="section-header">
        <image src="/static/icons/shield.png" class="section-icon"></image>
        <text class="section-title">账户安全</text>
      </view>

      <!-- 修改密码 - 使用uni-collapse实现折叠 -->
      <uni-collapse accordion>
        <uni-collapse-item title="修改密码" thumb="/static/icons/lock.png" :open="activeCollapse === 'password'">
          <template v-slot:title>
            <view class="collapse-header">
              <image src="/static/icons/lock.png" class="collapse-icon"></image>
              <text class="collapse-title">修改密码</text>
            </view>
          </template>
          
          <view class="form-container">
            <uni-forms ref="passwordForm" :modelValue="passwordForm" :rules="passwordRules">
              <uni-forms-item name="oldPassword">
                <uni-easyinput 
                  type="password"
                  v-model="passwordForm.oldPassword"
                  placeholder="请输入当前密码"
                  prefixIcon="locked"
                />
              </uni-forms-item>
              <uni-forms-item name="newPassword">
                <uni-easyinput 
                  type="password"
                  v-model="passwordForm.newPassword"
                  placeholder="请输入新密码(6-20位)"
                  prefixIcon="locked"
                />
              </uni-forms-item>
              <uni-forms-item name="confirmPassword">
                <uni-easyinput 
                  type="password"
                  v-model="passwordForm.confirmPassword"
                  placeholder="请确认新密码"
                  prefixIcon="locked"
                />
              </uni-forms-item>
            </uni-forms>
            
            <view class="form-actions">
              <button class="btn-cancel" @click="handleCancel('password')">取消</button>
              <button class="btn-confirm" @click="handleChangePassword">确认修改</button>
            </view>
          </view>
        </uni-collapse-item>

        <!-- 修改手机号 -->
        <uni-collapse-item title="修改手机号" thumb="/static/icons/phone.png" :open="activeCollapse === 'phone'">
          <template v-slot:title>
            <view class="collapse-header">
              <image src="/static/icons/phone.png" class="collapse-icon"></image>
              <text class="collapse-title">修改手机号</text>
              <text class="current-value">{{ userInfo.phone }}</text>
            </view>
          </template>
          
          <view class="form-container">
            <uni-forms ref="phoneForm" :modelValue="phoneForm" :rules="phoneRules">
              <uni-forms-item name="newPhone">
                <uni-easyinput 
                  v-model="phoneForm.newPhone"
                  placeholder="请输入新手机号"
                  prefixIcon="phone"
                />
              </uni-forms-item>
              <uni-forms-item name="verificationCode">
                <view class="code-input-container">
                  <uni-easyinput 
                    v-model="phoneForm.verificationCode"
                    placeholder="请输入验证码"
                    prefixIcon="compose"
                  />
                  <button 
                    class="btn-send-code" 
                    :class="{ 'disabled': countdown > 0 }"
                    @click="handleSendCode"
                    :disabled="countdown > 0"
                  >
                    {{ countdown > 0 ? `${countdown}s后重发` : '获取验证码' }}
                  </button>
                </view>
              </uni-forms-item>
            </uni-forms>
            
            <view class="form-actions">
              <button class="btn-cancel" @click="handleCancel('phone')">取消</button>
              <button class="btn-confirm" @click="handleChangePhone">确认修改</button>
            </view>
          </view>
        </uni-collapse-item>
      </uni-collapse>
    </view>

    <!-- 通用设置区 -->
    <view class="card-container">
      <view class="section-header">
        <image src="/static/icons/settings.png" class="section-icon"></image>
        <text class="section-title">通用设置</text>
      </view>
      
      <uni-list>
        <uni-list-item 
          title="消息通知" 
          thumb="/static/icons/bell.png"
          showArrow
          @click="navigateTo('notification')"
        />
        <uni-list-item 
          title="清除缓存" 
          thumb="/static/icons/trash.png"
          :note="cacheSize"
          showArrow
          @click="handleClearCache"
        />
      </uni-list>
    </view>

    <!-- 退出登录 -->
    <view class="logout-container">
      <button class="btn-logout" @click="handleLogout">退出登录</button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
// import { useUserStore } from '@/stores/user';

// const userStore = useUserStore();

// 用户信息
const userInfo = ref({
  avatar: '/static/avatars/default-avatar.jpg',
  username: '用户昵称',
  userId: '123456789',
  phone: '138****8888'
});

// 当前展开的折叠面板
const activeCollapse = ref('');

// 缓存大小
const cacheSize = ref('0.0MB');

// 修改密码表单
const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
});
// const passwordForm = ref(null);

// 修改手机号表单
const phoneForm = ref({
  newPhone: '',
  verificationCode: ''
});
// const phoneForm = ref(null);
const countdown = ref(0);

// 密码验证规则
const passwordRules = {
  oldPassword: {
    rules: [{ required: true, errorMessage: '请输入当前密码' }]
  },
  newPassword: {
    rules: [
      { required: true, errorMessage: '请输入新密码' },
      { minLength: 6, maxLength: 20, errorMessage: '密码长度6-20个字符' }
    ]
  },
  confirmPassword: {
    rules: [
      { required: true, errorMessage: '请确认新密码' },
      {
        validateFunction: (rule, value, data, callback) => {
          if (value !== passwordForm.value.newPassword) {
            callback('两次输入的密码不一致');
          }
          return true;
        }
      }
    ]
  }
};

// 手机号验证规则
const phoneRules = {
  newPhone: {
    rules: [
      { required: true, errorMessage: '请输入手机号' },
      { pattern: /^1[3-9]\d{9}$/, errorMessage: '手机号格式不正确' }
    ]
  },
  verificationCode: {
    rules: [
      { required: true, errorMessage: '请输入验证码' },
      { length: 6, errorMessage: '验证码为6位数字' }
    ]
  }
};

// 页面显示时加载数据
onShow(() => {
  loadUserInfo();
  calculateCacheSize();
});

// 加载用户信息
const loadUserInfo = () => {
  if (userStore.isLogin) {
    userInfo.value = {
      ...userInfo.value,
      ...userStore.userInfo
    };
  }
};

// 计算缓存大小
const calculateCacheSize = () => {
  // 实际项目中这里应该是计算缓存大小的逻辑
  const size = (Math.random() * 5).toFixed(1);
  cacheSize.value = `${size}MB`;
};

// 清除缓存
const handleClearCache = () => {
  uni.showLoading({ title: '清理中...' });
  
  setTimeout(() => {
    cacheSize.value = '0.0MB';
    uni.hideLoading();
    uni.showToast({
      title: '缓存已清除',
      icon: 'success'
    });
  }, 1000);
};

// 发送验证码
const handleSendCode = async () => {
  try {
    // 先验证手机号
    await phoneForm.value.validateField('newPhone');
    
    // 开始倒计时
    countdown.value = 60;
    const timer = setInterval(() => {
      countdown.value--;
      if (countdown.value <= 0) {
        clearInterval(timer);
      }
    }, 1000);
    
    // 模拟发送验证码
    uni.showToast({
      title: '验证码已发送',
      icon: 'none'
    });
    
  } catch (e) {
    console.error('手机号验证失败:', e);
  }
};

// 修改密码
const handleChangePassword = async () => {
  try {
    await passwordForm.value.validate();
    
    uni.showLoading({ title: '提交中...' });
    
    // 模拟API请求
    setTimeout(() => {
      uni.hideLoading();
      uni.showToast({
        title: '密码修改成功',
        icon: 'success'
      });
      activeCollapse.value = '';
      passwordForm.value.resetFields();
    }, 1500);
    
  } catch (e) {
    console.error('表单验证失败:', e);
  }
};

// 修改手机号
const handleChangePhone = async () => {
  try {
    await phoneForm.value.validate();
    
    uni.showLoading({ title: '提交中...' });
    
    // 模拟API请求
    setTimeout(() => {
      userInfo.value.phone = phoneForm.value.newPhone;
      uni.hideLoading();
      uni.showToast({
        title: '手机号修改成功',
        icon: 'success'
      });
      activeCollapse.value = '';
      phoneForm.value.resetFields();
      countdown.value = 0;
    }, 1500);
    
  } catch (e) {
    console.error('表单验证失败:', e);
  }
};

// 取消操作
const handleCancel = (type) => {
  activeCollapse.value = '';
  if (type === 'password') {
    passwordForm.value.resetFields();
  } else {
    phoneForm.value.resetFields();
    countdown.value = 0;
  }
};

// 退出登录
const handleLogout = () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        userStore.logout();
        uni.reLaunch({
          url: '/pages/login/login'
        });
      }
    }
  });
};
</script>

<style lang="scss">
.personal-center {
  background-color: #f5f6f7;
  min-height: 100vh;
  padding-bottom: 40rpx;
  
  /* 用户信息区 */
  .user-section {
    display: flex;
    align-items: center;
    padding: 60rpx 40rpx 40rpx;
    
    .avatar {
      width: 120rpx;
      height: 120rpx;
      border-radius: 50%;
      border: 4rpx solid rgba(255, 255, 255, 0.3);
      margin-right: 30rpx;
    }
    
    .user-info {
      flex: 1;
      
      .username {
        font-size: 36rpx;
        font-weight: bold;
        color: #fff;
        margin-bottom: 8rpx;
        display: block;
      }
      
      .user-id {
        font-size: 24rpx;
        color: rgba(255, 255, 255, 0.8);
      }
    }
  }
  
  .bg-gradient-blue {
    background: linear-gradient(135deg, #4a90e2, #5f7af0);
  }
  
  /* 卡片容器 */
  .card-container {
    background-color: #fff;
    border-radius: 16rpx;
    margin: 20rpx;
    overflow: hidden;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.04);
    
    .section-header {
      display: flex;
      align-items: center;
      padding: 24rpx 30rpx;
      border-bottom: 1rpx solid #f0f0f0;
      
      .section-icon {
        width: 36rpx;
        height: 36rpx;
        margin-right: 16rpx;
      }
      
      .section-title {
        font-size: 30rpx;
        font-weight: 500;
        color: #333;
      }
    }
  }
  
  /* 折叠面板样式 */
  .uni-collapse {
    border-top: none;
    border-bottom: none;
    
    .uni-collapse-item__title {
      padding: 0;
      height: auto;
    }
    
    .uni-collapse-item__content {
      padding: 0;
    }
    
    .collapse-header {
      display: flex;
      align-items: center;
      padding: 24rpx 30rpx;
      
      .collapse-icon {
        width: 36rpx;
        height: 36rpx;
        margin-right: 16rpx;
      }
      
      .collapse-title {
        flex: 1;
        font-size: 28rpx;
        color: #333;
      }
      
      .current-value {
        font-size: 26rpx;
        color: #999;
        margin-right: 20rpx;
      }
    }
  }
  
  /* 表单容器 */
  .form-container {
    padding: 0 30rpx 30rpx;
    
    .code-input-container {
      position: relative;
      
      .btn-send-code {
        position: absolute;
        right: 0;
        top: 0;
        height: 100%;
        padding: 0 20rpx;
        font-size: 24rpx;
        color: #4a90e2;
        background-color: transparent;
        
        &.disabled {
          color: #ccc;
        }
        
        &::after {
          border: none;
        }
      }
    }
    
    .form-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 30rpx;
      
      button {
        height: 70rpx;
        line-height: 70rpx;
        padding: 0 40rpx;
        border-radius: 35rpx;
        font-size: 28rpx;
        margin-left: 20rpx;
        
        &::after {
          border: none;
        }
      }
      
      .btn-cancel {
        background-color: #f5f5f5;
        color: #666;
      }
      
      .btn-confirm {
        background-color: #4a90e2;
        color: #fff;
      }
    }
  }
  
  /* 退出登录 */
  .logout-container {
    margin: 40rpx 30rpx 0;
    
    .btn-logout {
      background-color: #fff;
      color: #ff4d4f;
      border: 1rpx solid #ff4d4f;
      border-radius: 50rpx;
      font-size: 30rpx;
      height: 80rpx;
      line-height: 80rpx;
      
      &::after {
        border: none;
      }
      
      &:active {
        background-color: #fff2f0;
      }
    }
  }
}
</style>