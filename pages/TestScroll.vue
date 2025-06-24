<template>
  <view class="container">
    <!-- 顶部标题和搜索 -->
    <view class="header">
      <text class="title">销售采购数据看板</text>
      <text class="subtitle">实时数据监控与分析</text>
      <uni-search-bar 
        placeholder="输入关键词搜索..." 
        @confirm="onSearch"
        radius="100"
        clearButton="always"
        bgColor="#f8f8f8"
      ></uni-search-bar>
    </view>
    
    <!-- 选项卡切换 -->
    <uni-segmented-control 
      :current="currentTab" 
      :values="['销售数据', '采购数据']" 
      @clickItem="onTabChange"
      style-type="button"
      active-color="#5a7dff"
      class="segmented-control"
    ></uni-segmented-control>
    
    <!-- 销售数据内容 -->
    <view v-if="currentTab === 0" class="content">
      <view class="sales-section">
        <!-- 外部销售 -->
        <uni-collapse accordion>
          <uni-collapse-item 
            title="外部销售" 
            :open="collapseStatus.externalSales" 
            class="external-sales-collapse"
          >
            <template v-slot:title>
              <view class="collapse-title external-sales-title">
                <uni-icons type="shop" size="18" color="#5a7dff"></uni-icons>
                <text class="collapse-title-text">汇总V1</text>
                <text class="collapse-summary">总额 ¥{{ formatNumber(totalSales.external) }}</text>
              </view>
            </template>
            <view class="collapse-content">
              <uni-list :border="false">
                <uni-list-item 
                  v-for="item in externalSales" 
                  :key="item.type"
                  :title="item.name" 
				  clickable="true"
                  :show-arrow="true"
                  @click="showSalesDetail(item.type)"
                  class="sales-item"
                >
                  <template v-slot:footer>
                    <view class="sales-value">
                      <text class="sales-amount">¥{{ formatNumber(item.amount) }}</text>
                      <text :class="['sales-trend', item.trend > 0 ? 'up' : 'down']">
                        {{ item.trend > 0 ? '↑' : '↓' }}{{ Math.abs(item.trend) }}%
                      </text>
                    </view>
                  </template>
                </uni-list-item>
              </uni-list>
            </view>
          </uni-collapse-item>
          
          <!-- 内部销售 -->
          <uni-collapse-item 
            title="内部销售" 
            :open="collapseStatus.internalSales" 
            class="internal-sales-collapse"
          >
            <template v-slot:title>
              <view class="collapse-title internal-sales-title">
                <uni-icons type="home" size="18" color="#ff7d5a"></uni-icons>
                <text class="collapse-title-text">汇总V2</text>
                <!-- <text class="collapse-summary">总额 ¥{{ formatNumber(totalSales.internal) }}</text> -->
              </view>
            </template>
            <view class="collapse-content">
              <uni-list :border="false">
                <uni-list-item 
                  v-for="item in internalSales" 
                  :key="item.type"
                  :title="item.name" 
                  :show-arrow="true"
				  clickable="true"
                  @click="showSalesDetail(item.type)"
                  class="sales-item"
                >
                  <template v-slot:footer>
                    <view class="sales-value">
                      <text class="sales-amount">¥{{ formatNumber(item.amount) }}</text>
                      <text :class="['sales-trend', item.trend > 0 ? 'up' : 'down']">
                        {{ item.trend > 0 ? '↑' : '↓' }}{{ Math.abs(item.trend) }}%
                      </text>
                    </view>
                  </template>
                </uni-list-item>
              </uni-list>
            </view>
          </uni-collapse-item>
        </uni-collapse>
        
        <!-- 销售数据表格展示 -->
        <view class="data-card">
          <view class="card-header">
            <text class="card-title">销售数据明细</text>
            <uni-date-format 
              :date="currentDate" 
              format="yyyy-MM-dd" 
              class="card-date"
            ></uni-date-format>
          </view>
          <uni-table border stripe emptyText="暂无数据" class="data-table">
            <uni-tr>
              <uni-th width="150" align="center" class="table-header">终端数据</uni-th>
              <uni-th width="150" align="center" class="table-header">调拨数据</uni-th>
              <uni-th width="150" align="center" class="table-header">医院数据</uni-th>
              <uni-th width="150" align="center" class="table-header">门店数据</uni-th>
            </uni-tr>
            <uni-tr v-for="(item, index) in salesData" :key="index" class="table-row">
              <uni-td align="center" class="table-data highlight">{{ item.terminal }}</uni-td>
              <uni-td align="center" class="table-data">{{ item.transfer }}</uni-td>
              <uni-td align="center" class="table-data">{{ item.hospital }}</uni-td>
              <uni-td align="center" class="table-data">{{ item.store }}</uni-td>
            </uni-tr>
          </uni-table>
        </view>
      </view>
    </view>
    
    <!-- 采购数据内容 -->
    <view v-if="currentTab === 1" class="content">
      <view class="purchase-section">
        <!-- 时间选择器 -->
        <view class="filter-card">
          <view class="filter-header">
            <uni-icons type="calendar" size="18" color="#666"></uni-icons>
            <text class="filter-title">时间筛选</text>
          </view>
          <uni-datetime-picker 
            type="daterange" 
            start="2023-01-01" 
            end="2023-12-31"
            @change="onDateChange"
            class="date-picker"
          ></uni-datetime-picker>
        </view>
        
        <!-- 采购分类 -->
        <uni-collapse accordion>
          <uni-collapse-item title="外部采购明细" :open="collapseStatus.externalPurchase" class="purchase-collapse">
            <template v-slot:title>
              <view class="purchase-title">
                <uni-icons type="cart" size="18" color="#5a7dff"></uni-icons>
                <text class="purchase-title-text">明细V1</text>
                <text class="purchase-summary">共 {{ purchaseData.external.order.length }} 笔订单</text>
              </view>
            </template>
            
            <view class="sub-card">
              <view class="sub-card-header">
                <text class="sub-card-title">采购订单情况</text>
                <text class="sub-card-total">总额 ¥{{ formatNumber(calculateTotal(purchaseData.external.order)) }}</text>
              </view>
              <uni-table border stripe emptyText="暂无数据" class="purchase-table">
                <uni-tr>
                  <uni-th width="100" align="center" class="purchase-header">商品ID</uni-th>
                  <uni-th width="150" align="center" class="purchase-header">商品名称</uni-th>
                  <uni-th width="120" align="center" class="purchase-header">规格</uni-th>
                  <uni-th width="150" align="center" class="purchase-header">厂家</uni-th>
                  <uni-th width="100" align="center" class="purchase-header">制单人</uni-th>
                  <uni-th width="80" align="center" class="purchase-header">数量</uni-th>
                  <uni-th width="100" align="center" class="purchase-header">金额</uni-th>
                </uni-tr>
                <uni-tr v-for="(item, index) in purchaseData.external.order" :key="index" class="purchase-row">
                  <uni-td align="center" class="purchase-data">{{ item.id }}</uni-td>
                  <uni-td align="center" class="purchase-data">{{ item.name }}</uni-td>
                  <uni-td align="center" class="purchase-data">{{ item.spec }}</uni-td>
                  <uni-td align="center" class="purchase-data">{{ item.manufacturer }}</uni-td>
                  <uni-td align="center" class="purchase-data">{{ item.creator }}</uni-td>
                  <uni-td align="center" class="purchase-data">{{ item.quantity }}</uni-td>
                  <uni-td align="center" class="purchase-data highlight">¥{{ item.amount }}</uni-td>
                </uni-tr>
              </uni-table>
            </view>
            
            <view class="sub-card">
              <view class="sub-card-header">
                <text class="sub-card-title">销售发货情况</text>
                <text class="sub-card-total">总额 ¥{{ formatNumber(calculateTotal(purchaseData.external.delivery)) }}</text>
              </view>
              <uni-table border stripe emptyText="暂无数据" class="purchase-table">
                <uni-tr>
                  <uni-th width="100" align="center" class="purchase-header">商品ID</uni-th>
                  <uni-th width="150" align="center" class="purchase-header">商品名称</uni-th>
                  <uni-th width="120" align="center" class="purchase-header">规格</uni-th>
                  <uni-th width="150" align="center" class="purchase-header">厂家</uni-th>
                  <uni-th width="100" align="center" class="purchase-header">制单人</uni-th>
                  <uni-th width="80" align="center" class="purchase-header">数量</uni-th>
                  <uni-th width="100" align="center" class="purchase-header">金额</uni-th>
                </uni-tr>
                <uni-tr v-for="(item, index) in purchaseData.external.delivery" :key="index" class="purchase-row">
                  <uni-td align="center" class="purchase-data">{{ item.id }}</uni-td>
                  <uni-td align="center" class="purchase-data">{{ item.name }}</uni-td>
                  <uni-td align="center" class="purchase-data">{{ item.spec }}</uni-td>
                  <uni-td align="center" class="purchase-data">{{ item.manufacturer }}</uni-td>
                  <uni-td align="center" class="purchase-data">{{ item.creator }}</uni-td>
                  <uni-td align="center" class="purchase-data">{{ item.quantity }}</uni-td>
                  <uni-td align="center" class="purchase-data highlight">¥{{ item.amount }}</uni-td>
                </uni-tr>
              </uni-table>
            </view>
          </uni-collapse-item>
          
          <uni-collapse-item title="内部采购明细" :open="collapseStatus.internalPurchase" class="purchase-collapse">
            <template v-slot:title>
              <view class="purchase-title">
                <uni-icons type="refreshempty" size="18" color="#ff7d5a"></uni-icons>
                <text class="purchase-title-text">明细V2</text>
                <text class="purchase-summary">月度趋势分析</text>
              </view>
            </template>
            <view class="chart-card">
              <canvas canvas-id="internalPurchaseChart" style="width: 100%; height: 400rpx;"></canvas>
              <view class="chart-legend">
                <view class="legend-item">
                  <view class="legend-color" style="background-color: #5a7dff;"></view>
                  <text class="legend-text">内部采购额</text>
                </view>
              </view>
            </view>
          </uni-collapse-item>
          
          <uni-collapse-item title="中西药采购明细" :open="collapseStatus.medicinePurchase" class="purchase-collapse">
            <template v-slot:title>
              <view class="purchase-title">
                <uni-icons type="medal" size="18" color="#6ac144"></uni-icons>
                <text class="purchase-title-text">终端中西药情况</text>
                <text class="purchase-summary">对比分析</text>
              </view>
            </template>
            
            <view class="sub-card">
              <view class="sub-card-header">
                <text class="sub-card-title">终端中药情况</text>
                <text class="sub-card-total">总额 ¥{{ formatNumber(calculateMedicineTotal('chinese')) }}</text>
              </view>
              <uni-table border stripe emptyText="暂无数据" class="medicine-table">
                <uni-tr>
                  <uni-th width="120" align="center" class="medicine-header">金额</uni-th>
                  <uni-th width="100" align="center" class="medicine-header">客户数</uni-th>
                  <uni-th width="100" align="center" class="medicine-header">客单数</uni-th>
                  <uni-th width="100" align="center" class="medicine-header">品规数</uni-th>
                  <uni-th width="100" align="center" class="medicine-header">毛利率</uni-th>
                </uni-tr>
                <uni-tr v-for="(item, index) in purchaseData.medicine.chinese" :key="index" class="medicine-row">
                  <uni-td align="center" class="medicine-data highlight">¥{{ item.amount }}</uni-td>
                  <uni-td align="center" class="medicine-data">{{ item.customers }}</uni-td>
                  <uni-td align="center" class="medicine-data">{{ item.orders }}</uni-td>
                  <uni-td align="center" class="medicine-data">{{ item.items }}</uni-td>
                  <uni-td align="center" class="medicine-data" :style="{color: getProfitColor(item.profit)}">{{ item.profit }}</uni-td>
                </uni-tr>
              </uni-table>
            </view>
            
            <view class="sub-card">
              <view class="sub-card-header">
                <text class="sub-card-title">终端西药和GML情况</text>
                <text class="sub-card-total">总额 ¥{{ formatNumber(calculateMedicineTotal('western')) }}</text>
              </view>
              <uni-table border stripe emptyText="暂无数据" class="medicine-table">
                <uni-tr>
                  <uni-th width="120" align="center" class="medicine-header">金额</uni-th>
                  <uni-th width="100" align="center" class="medicine-header">客户数</uni-th>
                  <uni-th width="100" align="center" class="medicine-header">客单数</uni-th>
                  <uni-th width="100" align="center" class="medicine-header">品规数</uni-th>
                  <uni-th width="100" align="center" class="medicine-header">毛利率</uni-th>
                </uni-tr>
                <uni-tr v-for="(item, index) in purchaseData.medicine.western" :key="index" class="medicine-row">
                  <uni-td align="center" class="medicine-data highlight">¥{{ item.amount }}</uni-td>
                  <uni-td align="center" class="medicine-data">{{ item.customers }}</uni-td>
                  <uni-td align="center" class="medicine-data">{{ item.orders }}</uni-td>
                  <uni-td align="center" class="medicine-data">{{ item.items }}</uni-td>
                  <uni-td align="center" class="medicine-data" :style="{color: getProfitColor(item.profit)}">{{ item.profit }}</uni-td>
                </uni-tr>
              </uni-table>
            </view>
          </uni-collapse-item>
        </uni-collapse>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// 当前选项卡状态
const currentTab = ref(0)

// 折叠面板状态
const collapseStatus = ref({
  externalSales: true,
  internalSales: false,
  externalPurchase: true,
  internalPurchase: false,
  medicinePurchase: false
})

// 当前日期
const currentDate = ref(new Date())

// 外部销售数据
const externalSales = ref([
  { type: 'customerSales', name: '客户销售情况', amount: 125680, trend: 5.2 },
  { type: 'productSales', name: '货品销售情况', amount: 98450, trend: -2.3 },
  { type: 'storeSales', name: '健寿堂情况', amount: 76320, trend: 3.7 }
])

// 内部销售数据
const internalSales = ref([
  { type: 'internalStoreSales', name: '济群情况', amount: 45670, trend: 1.8 },
  { type: 'selfSales', name: '健寿堂', amount: 32890, trend: 4.5 }
])

// 销售总额计算
const totalSales = computed(() => {
  return {
    external: externalSales.value.reduce((sum, item) => sum + item.amount, 0),
    internal: internalSales.value.reduce((sum, item) => sum + item.amount, 0)
  }
})

// 销售详细数据
const salesData = ref([
  { terminal: '125,680', transfer: '45,230', hospital: '78,450', store: '56,780' },
  { terminal: '118,450', transfer: '42,560', hospital: '72,340', store: '54,670' },
  { terminal: '132,780', transfer: '48,910', hospital: '82,560', store: '61,230' },
  { terminal: '108,340', transfer: '39,870', hospital: '68,920', store: '49,560' }
])

// 采购数据
const purchaseData = ref({
  external: {
    order: [
      { id: 'P001', name: '药品A', spec: '10mg*20', manufacturer: 'XX制药', creator: '张三', quantity: 100, amount: '5,000' },
      { id: 'P002', name: '药品B', spec: '5mg*50', manufacturer: 'YY制药', creator: '李四', quantity: 200, amount: '8,000' },
      { id: 'P003', name: '药品C', spec: '20mg*10', manufacturer: 'ZZ制药', creator: '王五', quantity: 150, amount: '6,500' },
      { id: 'P004', name: '药品D', spec: '50mg*5', manufacturer: 'AA制药', creator: '赵六', quantity: 80, amount: '4,800' }
    ],
    delivery: [
      { id: 'P001', name: '药品A', spec: '10mg*20', manufacturer: 'XX制药', creator: '张三', quantity: 95, amount: '4,750' },
      { id: 'P002', name: '药品B', spec: '5mg*50', manufacturer: 'YY制药', creator: '李四', quantity: 180, amount: '7,200' },
      { id: 'P003', name: '药品C', spec: '20mg*10', manufacturer: 'ZZ制药', creator: '王五', quantity: 140, amount: '6,100' }
    ]
  },
  medicine: {
    chinese: [
      { amount: '25,680', customers: 45, orders: 78, items: 56, profit: '32.5%' },
      { amount: '22,450', customers: 38, orders: 65, items: 48, profit: '30.8%' }
    ],
    western: [
      { amount: '38,450', customers: 62, orders: 105, items: 78, profit: '28.7%' },
      { amount: '42,780', customers: 68, orders: 118, items: 85, profit: '26.5%' },
      { amount: '35,670', customers: 58, orders: 92, items: 72, profit: '29.2%' }
    ]
  }
})

// 格式化数字
const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// 计算采购总额
const calculateTotal = (items) => {
  return items.reduce((sum, item) => sum + parseInt(item.amount.replace(/,/g, '')), 0)
}

// 计算药品采购总额
const calculateMedicineTotal = (type) => {
  return purchaseData.value.medicine[type].reduce((sum, item) => sum + parseInt(item.amount.replace(/,/g, '')), 0)
}

// 获取毛利率颜色
const getProfitColor = (profit) => {
  const value = parseFloat(profit)
  if (value > 30) return '#52c41a'
  if (value > 25) return '#faad14'
  return '#ff4d4f'
}

// 选项卡切换
const onTabChange = (e) => {
  currentTab.value = e.currentIndex
}

// 日期变化处理
const onDateChange = (e) => {
  console.log('日期变化:', e)
  uni.showToast({
    title: `已选择 ${e}`,
    icon: 'none'
  })
}

// 搜索处理
const onSearch = (e) => {
  console.log('搜索:', e.value)
  uni.showToast({
    title: `搜索: ${e.value}`,
    icon: 'none'
  })
}

// 显示销售详情
const showSalesDetail = (type) => {
  uni.showToast({
    title: `查看${getSalesTypeName(type)}详情`,
    icon: 'none'
  })
}

// 获取销售类型名称
const getSalesTypeName = (type) => {
  const names = {
    'customerSales': '客户销售',
    'productSales': '货品销售',
    'storeSales': '门店销售',
    'internalStoreSales': '门店内部销售',
    'selfSales': '自营内部销售'
  }
  return names[type] || type
}

// 绘制图表
const drawChart = () => {
  setTimeout(() => {
    if (typeof uCharts === 'undefined') {
      console.warn('uCharts未引入')
      return
    }
    
    new uCharts({
      $this: this,
      canvasId: 'internalPurchaseChart',
      type: 'column',
      categories: ['1月', '2月', '3月', '4月', '5月', '6月'],
      series: [{
        name: '内部采购额',
        data: [35, 28, 42, 38, 45, 40],
        color: '#5a7dff'
      }],
      width: uni.upx2px(700),
      height: uni.upx2px(400),
      animation: true,
      background: '#FFFFFF',
      xAxis: {
        disableGrid: true,
        fontColor: '#666'
      },
      yAxis: {
        gridType: 'dash',
        dashLength: 2,
        splitNumber: 5,
        fontColor: '#666'
      },
      extra: {
        column: {
          width: 20
        }
      }
    })
  }, 300)
}

// 页面加载完成后绘制图表
onMounted(() => {
  drawChart()
})
</script>

<style>
page {
  background-color: #f8f8f8;
  font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
}

.container {
  padding: 20rpx 24rpx;
}

.header {
  margin-bottom: 24rpx;
}

.title {
  font-size: 40rpx;
  font-weight: 600;
  display: block;
  margin-bottom: 8rpx;
  color: #333;
  letter-spacing: 0.5rpx;
}

.subtitle {
  font-size: 26rpx;
  color: #999;
  display: block;
  margin-bottom: 24rpx;
}

.segmented-control {
  margin-bottom: 24rpx;
}

/* 外部销售折叠面板样式 */
.external-sales-collapse {
  margin-bottom: 24rpx;
  border-radius: 12rpx !important;
  overflow: hidden;
  box-shadow: 0 4rpx 12rpx rgba(90, 125, 255, 0.1);
  transition: all 0.3s ease;
}

.external-sales-title {
  background-color: #f0f5ff !important;
  border-left: 6rpx solid #5a7dff !important;
  padding: 24rpx !important;
}

.external-sales-title:active {
  background-color: #e6efff !important;
}

/* 内部销售折叠面板样式 */
.internal-sales-collapse {
  margin-bottom: 24rpx;
  border-radius: 12rpx !important;
  overflow: hidden;
  box-shadow: 0 4rpx 12rpx rgba(255, 125, 90, 0.1);
  transition: all 0.3s ease;
}

.internal-sales-title {
  background-color: #fff0ed !important;
  border-left: 6rpx solid #ff7d5a !important;
  padding: 24rpx !important;
}

.internal-sales-title:active {
  background-color: #ffe6e0 !important;
}

/* 折叠面板内容区域样式 */
.collapse-content {
  background-color: #fff !important;
  padding: 0 24rpx;
  transition: all 0.3s ease;
}

/* 折叠面板标题通用样式 */
.collapse-title {
  display: flex;
  align-items: center;
}

.collapse-title-text {
  font-size: 30rpx;
  font-weight: 500;
  color: #333;
  margin-left: 12rpx;
}

.collapse-summary {
  margin-left: auto;
  font-size: 26rpx;
  font-weight: 500;
}

.external-sales-title .collapse-summary {
  color: #5a7dff;
}

.internal-sales-title .collapse-summary {
  color: #ff7d5a;
}

/* 销售项样式 */
.sales-item {
  padding: 20rpx 24rpx !important;
  border-bottom: 1rpx solid #f0f0f0 !important;
}

.sales-item:last-child {
  border-bottom: none !important;
}

.sales-value {
  display: flex;
  align-items: center;
}

.sales-amount {
  font-size: 28rpx;
  font-weight: 500;
  color: #333;
}

.sales-trend {
  font-size: 24rpx;
  margin-left: 16rpx;
  padding: 4rpx 12rpx;
  border-radius: 20rpx;
}

.sales-trend.up {
  background-color: rgba(82, 196, 26, 0.1);
  color: #52c41a;
}

.sales-trend.down {
  background-color: rgba(255, 77, 79, 0.1);
  color: #ff4d4f;
}

/* 卡片样式 */
.data-card, .filter-card, .sub-card, .chart-card {
  background-color: #fff;
  border-radius: 12rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.card-title {
  font-size: 30rpx;
  font-weight: 500;
  color: #333;
}

.card-date {
  font-size: 26rpx;
  color: #999;
}

/* 表格样式 */
.data-table, .purchase-table, .medicine-table {
  margin-top: 16rpx;
  transition: all 0.3s ease;
}

.table-header, .purchase-header, .medicine-header {
  font-size: 26rpx !important;
  font-weight: 500 !important;
  color: #666 !important;
  background-color: #fafafa !important;
}

.table-data, .purchase-data, .medicine-data {
  font-size: 26rpx !important;
  color: #666 !important;
  padding: 20rpx 8rpx !important;
}

.highlight {
  color: #5a7dff !important;
  font-weight: 500 !important;
}

.table-row, .purchase-row, .medicine-row {
  &:nth-child(odd) {
    background-color: #fafafa;
  }
}

/* 采购折叠面板 */
.purchase-collapse {
  margin-bottom: 24rpx;
  border-radius: 12rpx !important;
  overflow: hidden;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.purchase-title {
  display: flex;
  align-items: center;
  padding: 24rpx !important;
  background-color: #fff !important;
}

.purchase-title-text {
  font-size: 30rpx;
  font-weight: 500;
  color: #333;
  margin-left: 12rpx;
}

.purchase-summary {
  margin-left: auto;
  font-size: 26rpx;
  color: #999;
}

/* 子卡片头部 */
.sub-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.sub-card-title {
  font-size: 28rpx;
  font-weight: 500;
  color: #333;
}

.sub-card-total {
  font-size: 26rpx;
  color: #5a7dff;
  font-weight: 500;
}

/* 图表卡片 */
.chart-card {
  padding-bottom: 0;
}

.chart-legend {
  display: flex;
  justify-content: center;
  padding: 20rpx 0;
}

.legend-item {
  display: flex;
  align-items: center;
  margin: 0 20rpx;
}

.legend-color {
  width: 24rpx;
  height: 24rpx;
  border-radius: 4rpx;
  margin-right: 8rpx;
}

.legend-text {
  font-size: 26rpx;
  color: #666;
}

/* 日期选择器 */
.date-picker {
  margin-top: 16rpx;
}

.filter-header {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
}

.filter-title {
  font-size: 28rpx;
  color: #333;
  margin-left: 12rpx;
}

/* 动画效果 */
.uni-collapse-item__wrap {
  transition: all 0.3s ease;
}

/* 悬停效果增强 */
.external-sales-collapse:active {
  transform: translateY(2rpx);
  box-shadow: 0 2rpx 8rpx rgba(90, 125, 255, 0.2);
}

.internal-sales-collapse:active {
  transform: translateY(2rpx);
  box-shadow: 0 2rpx 8rpx rgba(255, 125, 90, 0.2);
}

.data-card:active, .sub-card:active {
  transform: translateY(2rpx);
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}
</style>