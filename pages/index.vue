<template>
  <view class="container">
    <!-- 顶部公司信息 - 缩小版 -->
    <view class="header" :style="{background: 'linear-gradient(to right, #FFC46B, #FFD699)'}">
      <image class="logo" src="/static/logo.png" mode="aspectFit"></image>
      <text class="company-name">济群药业有限公司</text>
	  <text class="welcome" @click="userMenu">{{userName}} {{getCurrentTime()}}</text>
    </view>
    
    <!-- 公告信息栏 -->
    <view class="announcement" @click="navigateTo('/pages/announcements/index')">
      <uni-icons type="notification" size="18" color="#FF9800"></uni-icons>
      <swiper class="announcement-swiper" vertical autoplay circular interval="3000">
        <swiper-item v-for="(item, index) in announcements" :key="index">
          <text class="announcement-text">{{item}}</text>
        </swiper-item>
      </swiper>
      <uni-icons type="arrowright" size="16" color="#999"></uni-icons>
    </view>
    
    <!-- 快捷功能入口 -->
    <view class="quick-actions">
      <text class="section-title">快捷入口</text>
      <view class="action-grid">
        <view class="action-item" v-for="(action, index) in quickActions" :key="index" @click="navigateTo(action.path)">
          <view class="action-icon" :style="{backgroundColor: action.color}">
            <uni-icons :type="action.icon" size="26" color="#fff"></uni-icons>
          </view>
          <text class="action-text">{{action.name}}</text>
        </view>
      </view>
    </view>
    
    <!-- 主要业务模块 -->
    <view class="main-modules">
      <text class="section-title">业务模块</text>
      <view class="module-list">
        <view class="module-card" 
              v-for="(module, index) in mainModules" 
              :key="index" 
              :style="{borderLeft: '4px solid '+module.color}"
              @click="navigateTo(module.path)">
          <view class="module-content">
            <uni-icons :type="module.icon" size="22" :color="module.color"></uni-icons>
            <text class="module-name">{{module.name}}</text>
          </view>
          <uni-icons type="arrowright" size="18" color="#999"></uni-icons>
        </view>
      </view>
    </view>
    
    <!-- 合作伙伴 -->
    <view class="partners">
      <text class="section-title">商务合作</text>
      <scroll-view class="partner-scroll" scroll-x>
        <view class="partner-item" v-for="(partner, index) in partners" :key="index" @click="viewPartner(partner.id)">
          <image class="partner-logo" :src="partner.logo" mode="aspectFit"></image>
          <text class="partner-name">{{partner.name}}</text>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad, onReady, onShow } from '@dcloudio/uni-app'
import requestFast from '../utils/requestFast'

// 主色调
const primaryColor = ref('#FFB74D') // 浅橙色
const secondaryColor = ref('#4CAF50') // 绿色

// 用户信息
const userName = ref('未登录用户')

// 公告信息
const announcements = ref([])

// 快捷入口
const quickActions = ref([])

// 主要业务模块
const mainModules = ref([])

// 合作伙伴
const partners = ref([])

// 方法
const getCurrentTime = () => {
  const now = new Date()
  const hours = now.getHours()
  if (hours < 6) return '凌晨好'
  if (hours < 9) return '早上好'
  if (hours < 12) return '上午好'
  if (hours < 14) return '中午好'
  if (hours < 18) return '下午好'
  return '晚上好'
}

const userMenu = async() => {
	if (userName.value === '未登录用户') {
		uni.showModal({
			content:'是否要登录吗?',
			confirmText:'登录',
			success (res) {
				if (res.confirm) {
					uni.navigateTo({
						url:'/pages/login'
					})
				}
			}
		})
		return
	}
	uni.showActionSheet({
		itemList:['个人中心', '退出登录'],
		success (res) {
			var index = res.tapIndex
			if (index === 0) {
				uni.navigateTo({
					url:'/pages/verify-code'
				})
			} else if (index === 1) {
				logout()
			}
		}
	})
}

const logout = async () => {
	uni.showModal({
		confirmText:'退出',
		content:'是否退出？',
		success: async(res) => {
			if (res.confirm) {
				const _res = await requestFast.get('/public/store/view/mod/logout')
				if (_res.code === 200) {
					uni.removeStorageSync('token')
					uni.showToast({
						icon:'success',
						title:'用户退出成功!',
						success() {
							uni.reLaunch({
								url:'/pages/index'
							})
						}
					})
				}
			}
		}
	})
}

const navigateTo = (path) => {
  uni.navigateTo({
    url: path
  })
}

const viewPartner = (id) => {
  uni.navigateTo({
    url: `/pages/partner/detail?id=${id}`
  })
}

const initData = () => {
  // 初始化公告数据
  announcements.value = [
    '2025年度优秀员工评选开始报名',
    '冬季中药材采购优惠活动进行中',
    '集团新版GSP管理制度已发布',
    '与同仁堂达成战略合作，采购享9折优惠',
    '质量部开展中药材鉴别培训',
	'健寿堂门店业绩增长'
  ]
  
  // 初始化快捷入口
  quickActions.value = [
    { name: '日报', icon: 'compose', color: '#FF9800', path: '/pages/daily-report/index' },
    { name: '审批', icon: 'checkbox-filled', color: '#4CAF50', path: '/pages/approval/index' },
    { name: '用户登录', icon: 'person-filled', color: '#2196F3', path: '/pages/login' },
    { name: '通知', icon: 'notification-filled', color: '#9C27B0', path: '/pages/notifications/index' },
    { name: '库存', icon: 'shop-filled', color: '#F44336', path: '/pages/inventory/index' },
    { name: '订单', icon: 'cart-filled', color: '#673AB7', path: '/pages/orders/index' }
  ]
  
  // 初始化主要业务模块
  mainModules.value = [
    { name: '集团管理', icon: 'staff-filled', color: '#FFB74D', path: '/pages/Dept/index' },
    { name: '采购合作', icon: 'handshake-filled', color: '#4CAF50', path: '/pages/purchDept/index' },
    { name: '药材采购', icon: 'leaf-filled', color: '#8BC34A', path: '/pages/herb-purchase/index' },
    { name: '生产管理', icon: 'settings-filled', color: '#607D8B', path: '/pages/production/index' },
    { name: '质量管理', icon: 'medal-filled', color: '#009688', path: '/pages/quality/index' },
    { name: '销售统计', icon: 'bar-chart-filled', color: '#3F51B5', path: '/pages/sales/index' },
    { name: '财务中心', icon: 'money-filled', color: '#FFC107', path: '/pages/finance/index' },
    { name: '人力资源', icon: 'team-filled', color: '#E91E63', path: '/pages/hr/index' }
  ]
  
  // 初始化合作伙伴
  partners.value = [
    { id: 1, name: '同仁堂药业', logo: '/static/partner1.png' },
    { id: 2, name: '云南白药', logo: '/static/partner2.png' },
    { id: 3, name: '广药集团', logo: '/static/partner3.png' },
    { id: 4, name: '天士力医药', logo: '/static/partner4.png' },
    { id: 5, name: '康美药业', logo: '/static/partner5.png' }
  ]
}

// 生命周期
onLoad(async() => {
  // 页面加载时初始化数据
  initData()
})

onShow(async() => {
	const res = await requestFast.get('/public/store/view/mod/getUserInfo')
	if (res.code === 200) {
		userName.value = res.Name
	}
})

</script>

<style scoped>
/* 保持原有的样式不变 */
.container {
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 20px;
}

.welcome {
    font-size: 14px;
    opacity: 0.9;
  }

.header {
  padding: 10px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  border-radius: 0 0 15px 15px;
  box-shadow: 0 2px 8px rgba(255, 180, 0, 0.1);
  margin-bottom: 12px;
}

.logo {
  width: 60px;
  height: 60px;
  margin-bottom: 5px;
}

.company-name {
  font-size: 18px;
  font-weight: bold;
}

.announcement {
  display: flex;
  align-items: center;
  background-color: white;
  margin: 0 15px 15px;
  padding: 10px 15px;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
}

.announcement-swiper {
  height: 20px;
  flex: 1;
  margin: 0 10px;
}

.announcement-text {
  font-size: 13px;
  color: #666;
  line-height: 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.section-title {
  display: block;
  font-size: 16px;
  font-weight: bold;
  margin: 15px 15px 10px;
  color: #333;
}

.quick-actions {
  background-color: white;
  margin: 0 15px 15px;
  border-radius: 10px;
  padding: 12px 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  margin-top: 8px;
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  padding: 0 12px;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.action-icon {
  width: 46px;
  height: 46px;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 5px;
}

.action-text {
  font-size: 12px;
  color: #666;
}

.main-modules {
  background-color: white;
  margin: 0 15px 15px;
  border-radius: 10px;
  padding: 12px 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.module-list {
  padding: 0 12px;
}

.module-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 8px;
  margin-bottom: 6px;
  background-color: #fafafa;
  border-radius: 5px;
}

.module-content {
  display: flex;
  align-items: center;
}

.module-name {
  margin-left: 8px;
  font-size: 14px;
}

.partners {
  background-color: white;
  margin: 0 15px;
  border-radius: 10px;
  padding: 12px 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.partner-scroll {
  white-space: nowrap;
  padding: 0 12px;
}

.partner-item {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  margin-right: 15px;
}

.partner-logo {
  width: 55px;
  height: 55px;
  border-radius: 8px;
  background-color: #f5f5f5;
}

.partner-name {
  font-size: 11px;
  margin-top: 4px;
  color: #666;
}
</style>