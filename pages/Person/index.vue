<template>
  <view class="personal-center">
    <!-- 用户信息区域 -->
    <view class="user-info-section">
      <view>
		  <text class="username">用户名: {{ userInfo.username }}</text>
	  </view>
      <view>
		  <text class="user-id">ID: {{ userInfo.userId }}</text>
	  </view>
    </view>

    <!-- 修改密码区域 -->
    <view class="change-password-section">
      <view class="section-header">
        <text class="section-title">修改密码</text>
      </view>

      <!-- 使用 ref 引用表单 -->
      <uni-forms ref="passwordForm" :modelValue="formValues" :rules="passwordRules" @update:modelValue="updatePasswordForm">
        <uni-forms-item name="oldPassword">
          <uni-easyinput 
            type="password"
            v-model="formValues.oldPassword"
            placeholder="请输入当前密码"
            prefixIcon="locked"
          />
        </uni-forms-item>

        <uni-forms-item name="newPassword">
          <uni-easyinput 
            type="password"
            v-model="formValues.newPassword"
            placeholder="请输入新密码"
            prefixIcon="locked"
          />
        </uni-forms-item>

        <uni-forms-item name="confirmPassword">
          <uni-easyinput 
            type="password"
            v-model="formValues.confirmPassword"
            placeholder="请确认新密码"
            prefixIcon="locked"
          />
        </uni-forms-item>
      </uni-forms>

      <view class="form-actions">
        <button class="btn-cancel" @click="handleCancel">取消</button>
        <button class="btn-confirm" @click="handleChangePassword">确认修改</button>
      </view>
    </view>
  
	<view class="admin-context" v-if="userInfo.level > 1">
	  <view class="section-header">
	    <text>账号管理</text>
	  </view>
	  <!-- 新增采购部成员 -->
	  <view style="margin: 20rpx 0; border-bottom: 1rpx solid #e0e0e0;">
	    <text>新增采购部成员</text>
	    <view style="display: flex;">
	      <text style="flex: 1; align-self: center;">账号:</text>
	      <uni-easyinput style="flex: 6; margin-top: 20rpx;" placeholder="请输入英克ID" type="number" v-model="registerUser.userId"></uni-easyinput>
	    </view>
	    <view style="display: flex;">
	      <text style="flex: 1; align-self: center; padding-top: 2rpx;">姓名:</text>
	      <uni-easyinput style="flex: 6; margin-top: 20rpx;" placeholder="请输入姓名" v-model="registerUser.userName"></uni-easyinput>
	    </view>
		<view style="margin-top: 20rpx;">
			<text>打印权限</text>
			<uni-data-checkbox :localdata="printData" style="margin-top: 20rpx;" v-model="registerUser.isPrint"></uni-data-checkbox>
		</view>
		<view style="width: 100%; display: flex; margin: 20rpx 0; justify-content: flex-end;">
			<view style="display: flex; align-content: center;">
				<button size="mini" style=" transform: scale(0.98); background-color: green; color: white;" @click="register">新增</button>
			</view>
		</view>
	  </view>
	  <view style="margin: 20rpx 0; ">
		<text style="color: #4a90e2;">账号状态设置</text>
		<view style="margin: 20rpx 0;" class="input-admin">
			<text style="align-self: center; margin-right: 20rpx;">账号:</text>
			<uni-easyinput placeholder="输入英克ID" type="number"></uni-easyinput>
			<button style="background-color: #4a90e2; color: white; border-radius: 25rpx; " size="mini">检查</button>
		</view>
		<view>
			<text class="account-info">账号：</text>
			<text class="account-info">用户名：</text>
			<view style="display: flex; width: 100%; align-items: center;">
				<text class="account-info" style="margin-top: 8rpx; flex: 0.5;">打印权限：{{userInfo.print}}</text>
				<button size="mini" style="background-color: #4a90e2; color: white; border-radius: 25rpx; padding: 0 25rpx;">更改状态</button>
			</view>
			<view style="display: flex; width: 100%; align-items: center;">
				<text class="account-info" style="margin-top: 8rpx; flex: 0.4;">密码重置：</text>
				<button size="mini" style="background-color: #4a90e2; color: white; border-radius: 25rpx; padding: 0 25rpx;">重置</button>
			</view>
			<view style="display: flex; width: 100%; flex-direction: column;">
				<text class="account-info" style="margin-top: 8rpx;">用户组：{{userInfo.userRole}}</text>
				<view>
					<uni-data-checkbox :multiple="false" :localdata="useRole"></uni-data-checkbox>
				</view>
				<button size="mini" style="color: white; background-color: #4a90e2; border-radius: 25rpx; padding: 0 15rpx; ">更改用户组</button>
			</view>
		</view>
	  </view>
	</view>
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue';
import requestFast from '@/utils/requestFast.js'
import {onShow} from '@dcloudio/uni-app'
import {showModal} from '@/utils/showModal.js'
import {showToast} from '@/utils/showToast.js'

const printStatus = ref(0)
const printData = [{text: '是', value: 1}, {text: '否', value: 0}]
const useRole = ref([{text: '采购员', value: 1}, {text: '初级审核', value: 2}, {text: '中级审核', value: 3}, {text: '高级审核', value: 4}])

onShow(async() => {
	await loading()
})

// 用户信息（模拟）
const userInfo = ref({
  username: '未登录用户',  // 用户名
  userId: '123456789', // 用户ID
  print: '否', //打印权限
  userRole: '采购员', //角色组
  level: 0 //权限等级
});

const registerUser = ref({
	userName: '',
	isPrint: 0,
	userId: ''
})

// 表单数据：避免循环引用，使用 reactive 或 shallowReactive
const formValues = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
});

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
          if (value !== formValues.newPassword) {
            callback('两次输入的密码不一致');
          }
          return true;
        }
      }
    ]
  }
};

// 获取表单引用
const passwordForm = ref(null);

//注册
const register = async() => {
	if (registerUser.value.userId === '') {
		showToast({title: '用户ID不能为空'})
		return
	}
	if (registerUser.value.userName === '') {
		showToast({title: '用户名不能为空'})
		return
	}
	const res = await requestFast.post('/public/store/view/mod/register', {
		userName: registerUser.value.userName,
		userId: registerUser.value.userId,
		isPrint: registerUser.value.isPrint
	})
	uni.showModal({
		showCancel:false,
		content:res.msg
	})
}

// 修改密码处理
const handleChangePassword = async () => {
  try {
    // 校验表单
    if (passwordForm.value) {
      await passwordForm.value.validate(); // 只在表单有效时调用
    } 

    const res = await requestFast.post('/public/store/view/mod/editPassWord', {oldPassWord: formValues.oldPassword, newPassWord: formValues.newPassword})
	
	if (res.code === 500) {
		uni.showModal({
			title:'密码修改失败',
			content:res.msg
		})
		return
	}
	
	if (res.code === 200) {
		uni.showModal({
			title:'密码修改',
			content:`密码修改成功，请牢记你的新密码，新密码是：${formValues.newPassword}`
		})
	}

    // 清空表单
    formValues.oldPassword = '';
    formValues.newPassword = '';
    formValues.confirmPassword = '';
  } catch (e) {
    console.error('密码修改失败', e);
  }
};

const loading = async() => {
	const res = await requestFast.get('/public/store/view/mod/getUserInfoV2')
	console.log(res.Level)
	if (res.code === 200) {
		userInfo.value.username = res.Name
		userInfo.value.userId = res.userId
		userInfo.value.level = res.Level
	}
}

// 取消修改密码
const handleCancel = () => {
  formValues.oldPassword = '';
  formValues.newPassword = '';
  formValues.confirmPassword = '';
};

// 更新表单值：避免直接修改原始数据，使用浅拷贝
const updatePasswordForm = (newFormValues) => {
  formValues.oldPassword = newFormValues.oldPassword;
  formValues.newPassword = newFormValues.newPassword;
  formValues.confirmPassword = newFormValues.confirmPassword;
};
</script>

<style lang="scss" scoped>
//账号信息
.account-info {
	display: block;
	margin-bottom: 20rpx;
}

//输入框区域
.input-admin {
	display: flex;
	width: 100%;
}

//管理员设置区域
.admin-context {
	background: white;
	border-radius: 15rpx;
	margin-top: 20rpx;
	padding: 20rpx;
}
	
.personal-center {
  padding: 20rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
}

/* 用户信息区域 */
.user-info-section {
  background-color: #ffffff;
  padding: 20rpx;
  border-radius: 8rpx;
  margin-bottom: 20rpx;
}

.username {
  font-size: 30rpx;
  color: #4a90e2;
  font-weight: bold;
  margin-bottom: 8rpx;
}

.user-id {
  font-size: 26rpx;
  color: #333;
  font-style: italic;
}

/* 修改密码区域 */
.change-password-section {
  background-color: #ffffff;
  padding: 20rpx;
  border-radius: 8rpx;
}

.section-header {
  border-bottom: 1rpx solid #ddd;
  padding-bottom: 10rpx;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 30rpx;
  color: #333;
}

/* 按钮样式 */
.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20rpx;
}

button {
  padding: 8rpx 25rpx;
  border-radius: 20rpx;
  font-size: 26rpx;
  margin-left: 15rpx;
  transition: all 0.2s ease;
}

.btn-cancel {
  background-color: #f0f0f0;
  color: #999;
}

.btn-cancel:hover {
  background-color: #e0e0e0;
  transform: scale(1.03);
}

.btn-confirm {
  background-color: #4a90e2;
  color: #fff;
}

.btn-confirm:hover {
  background-color: #3578b5;
  transform: scale(1.03);
}

.btn-cancel:active, .btn-confirm:active {
  transform: scale(0.98);
}
</style>
