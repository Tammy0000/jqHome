<template>
  <view class="contract-container">
    <view class="contract-header">
      <text class="company-name">广东济群药业有限公司</text>
      <text class="contract-number">合同编号: JQ</text>
    </view>
		<view class="button-container" >
		  <button class="search-button" size="mini" @click="NaviQuery">查询合同</button>
		</view>
    <view class="section parties-section">
      <view class="party-input">
        <text class="label">甲方：</text>
        <uni-easyinput placeholder="请输入甲方公司" v-model="partyAName" :clearable="false" @input="onInputChange"></uni-easyinput>
      </view>
	  <!-- 搜索结果列表 -->
	  <view v-if="filteredResults.length > 0" class="search-results">
	  		<view 
	  		  class="result-item" 
	  		  v-for="(item, index) in filteredResults" 
	  		  :key="index"
	  		  @click="selectResult(item)"
	  		>
	  		  {{ item }}
	  		</view>
	  </view>
      <view class="party-info">
        <text class="section-title">乙方: 责任采购</text>
      </view>
      <view class="agreement-text">
        <text class="section-title">甲，乙双方本着互惠互利的原则，并结合医药行业实际情况，达成一下协议:</text>
      </view>
    </view>

    <view class="section products-section">
      <text class="section-title">药品名称，规则，单位，数量，单价，金额</text>
      
      <!-- 横向滚动容器 -->
          <scroll-view scroll-x class="scroll-container" enable-flex>
            <!-- 循环渲染卡片 -->
            <view 
              class="card" 
              v-for="(item, index) in lists" 
              :key="index"
            >
              <!-- 商品ID -->
              <view class="field">
                <text class="label">商品ID</text>
                <uni-easyinput
                  v-model="item.productId"
                  placeholder="请输入ID"
                  :inputBorder="false"
                  :styles="inputStyle"
                  placeholder-style="color: #aaa; font-size: 26rpx"
                />
              </view>
      
              <!-- 药品名称 -->
              <view class="field">
                <text class="label">药品名称</text>
                <uni-easyinput
                  v-model="item.drugName"
                  placeholder="请输入名称"
                  :inputBorder="false"
                  :styles="inputStyle"
                  placeholder-style="color: #aaa; font-size: 26rpx"
                />
              </view>
      
              <!-- 生产厂家 -->
              <view class="field">
                <text class="label">生产厂家</text>
                <uni-easyinput
                  v-model="item.manufacturer"
                  placeholder="请输入厂家"
                  :inputBorder="false"
                  :styles="inputStyle"
                  placeholder-style="color: #aaa; font-size: 26rpx"
                />
              </view>
      
              <!-- 规格 -->
              <view class="field">
                <text class="label">规格</text>
                <uni-easyinput
                  v-model="item.specification"
                  placeholder="请输入规格"
                  :inputBorder="false"
                  :styles="inputStyle"
                  placeholder-style="color: #aaa; font-size: 26rpx"
                />
              </view>
      
              <!-- 单位 -->
              <view class="field">
                <text class="label">单位</text>
                <uni-easyinput
                  v-model="item.unit"
                  placeholder="请输入单位"
                  :inputBorder="false"
                  :styles="inputStyle"
                  placeholder-style="color: #aaa; font-size: 26rpx"
                />
              </view>
      
              <!-- 数量 -->
              <view class="field">
                <text class="label">数量</text>
                <uni-easyinput
                  type="number"
                  v-model="item.quantity"
                  placeholder="请输入数量"
                  :inputBorder="false"
                  :styles="inputStyle"
                  placeholder-style="color: #aaa; font-size: 26rpx"
                />
              </view>
      
              <!-- 补差/盒 -->
              <view class="field">
                <text class="label">补差/盒</text>
                <uni-easyinput
                  type="number"
                  v-model="item.supplementDiff"
                  placeholder="请输入金额"
                  :inputBorder="false"
                  :styles="inputStyle"
                  placeholder-style="color: #aaa; font-size: 26rpx"
                />
              </view>
      
              <!-- 备注 -->
              <view class="field">
                <text class="label">备注</text>
                <uni-easyinput
                  v-model="item.remarks"
                  placeholder="请输入备注"
                  :inputBorder="false"
                  :styles="inputStyle"
                  placeholder-style="color: #aaa; font-size: 26rpx"
                />
              </view>
            </view>
          </scroll-view>

      <view class="product-actions">
        <button class="action-btn" size="mini" @click="changelistadd">新增</button>
        <button class="action-btn" size="mini" @click="changelistsub" style="margin-left: 15rpx;">删除</button>
      </view>

      <view class="total-amount">
        <view class="amount-input">
          <text class="label section-title-none">合计人民币 （小写）：</text>
          <uni-easyinput type="number" placeholder="请输入金额" @input="changeCh" v-model="totalPurchaseAmount" :clearable="false"></uni-easyinput>
        </view>
        <view class="amount-chinese">
          <text>合计人民币 （大写）：{{chNum}} 元</text>
        </view>
      </view>
    </view>
	
	<view class="section policy-section">
	  <text class="section-title">政策类型：</text>
	  <uni-data-checkbox :localdata="range2" @change="policyTypecb" multiple></uni-data-checkbox>
	  <view v-if="showData2" class="conditional-field">
	    <uni-easyinput type="textarea" placeholder="请输入政策类型" v-model="showData2other" :clearable="false"></uni-easyinput>
	  </view>
	</view>
	
    <!-- 政策部分 2-11 -->
    <view class="section policy-section" v-if="showPurchasePolicy">
      <text class="section-title">购进政策：</text>
      <uni-easyinput type="textarea" placeholder="请输入购进政策" v-model="purchasePolicy" :clearable="false"></uni-easyinput>
    </view>

    <view class="section policy-section" v-if="showTerminalPolicy">
      <text class="section-title">终端政策：</text>
      <uni-easyinput type="textarea" placeholder="请输入终端政策" v-model="terminalPolicy" :clearable="false"></uni-easyinput>
    </view>

    <view class="section policy-section">
      <text class="section-title">业务奖励：</text>
      <uni-easyinput type="textarea" placeholder="请输入业务奖励" v-model="businessReward" :clearable="false"></uni-easyinput>
    </view>

    <view class="section policy-section">
      <text class="section-title-none">库存数量：</text>
      <uni-easyinput type="number" placeholder="请输入库存数量" v-model="inventoryQuantity" :clearable="false"></uni-easyinput>
    </view>

    <view class="section policy-section">
      <text class="section-title">购进单位：</text>
      <uni-easyinput type="textarea" placeholder="请输入购进单位" v-model="purchaseUnit" :clearable="false"></uni-easyinput>
    </view>

    <view class="section policy-section">
      <text class="section-title">返利单位：</text>
	  <text class="amount-chinese">返利单位：{{partyAName}}</text>
    </view>

    <view class="section policy-section">
      <text class="section-title">承诺支付日期：</text>
      <uni-datetime-picker placeholder="选择支付日期" type="date" v-model="commitmentPaymentDate" :clearable="false"></uni-datetime-picker>
	  <!-- <text class="date-separator">至</text>
	  <uni-datetime-picker placeholder="选择结束时间" type="date" v-model="commitmentPaymentDateEnd" :clearable="false"></uni-datetime-picker> -->
    </view>

    <view class="section policy-section">
      <text class="section-title">政策执行方式：</text>
      <uni-data-checkbox :localdata="range1" @change="policyExecutionMethodcb" multiple></uni-data-checkbox>
      <view v-if="showData" class="conditional-field">
        <uni-easyinput type="textarea" placeholder="请输入政策执行方式" v-model="showDataother"></uni-easyinput>
      </view>
    </view>
	
	<view class="section policy-section">
	  <text class="section-title">返利形式：</text>
	  <uni-data-checkbox :localdata="range4" @change="rebateTypeMethodcb" multiple></uni-data-checkbox>
	  <view v-if="showData3" class="conditional-field">
	    <uni-easyinput type="textarea" placeholder="请填写返利形式" v-model="showDatarebateType"></uni-easyinput>
	  </view>
	</view>

    <view class="section policy-section">
      <text class="section-title">活动时间：</text>
      <view class="date-range">
        <uni-datetime-picker placeholder="选择起始时间" type="date" v-model="activityStartDate" :clearable="false"></uni-datetime-picker>
        <text class="date-separator">至</text>
        <uni-datetime-picker placeholder="选择结束时间" type="date" v-model="activityEndDate" :clearable="false"></uni-datetime-picker>
      </view>
    </view>

    <view class="section signature-section">
      <text class="section-title">本协议一式两份，乙方留存一份，甲方执一份，自双方代表签字或盖章之日起生效，具有同等效力</text>
      
      <view class="party-details">
        <view class="party-info">
          <text class="party-title section-title">甲方：{{partyAName}}</text>
          <view class="party-fields">
            <view class="detail-field">
              <text class="label section-title">地址：</text>
              <uni-easyinput placeholder="地址" v-model="partyAAddress" :clearable="false"></uni-easyinput>
            </view>
            <view class="detail-field">
              <text class="label section-title">税号：</text>
              <uni-easyinput placeholder="税号" v-model="partyATaxId" :clearable="false"></uni-easyinput>
            </view>
            <view class="detail-field">
              <text class="label section-title">开户行：</text>
              <uni-easyinput placeholder="开户行" v-model="partyABank" :clearable="false"></uni-easyinput>
            </view>
            <view class="detail-field">
              <text class="label section-title">账号：</text>
              <uni-easyinput placeholder="账号" v-model="partyAAccount" :clearable="false"></uni-easyinput>
            </view>
            <view class="detail-field">
              <text class="label section-title">电话：</text>
              <uni-easyinput placeholder="电话" v-model="partyAPhone" :clearable="false"></uni-easyinput>
            </view>
            <view class="detail-field">
              <text class="label section-title">签约代表：</text>
              <uni-easyinput placeholder="甲方签约代表" v-model="partyARepresentative" :clearable="false"></uni-easyinput>
            </view>
            <view class="detail-field section-title">
              <text class="label">签约日期：</text>
              <uni-datetime-picker type="date" placeholder="签约日期" v-model="partyAContractDate" :clearable="false"></uni-datetime-picker>
            </view>
          </view>
        </view>

        <view class="party-info">
          <text class="party-title section-title">乙方：责任采购</text>
          <view class="party-fields">
            <view class="detail-field">
              <text class="label section-title">地址：化州市鉴江开发区旺龙南路1-8号</text>
            </view>
            <view class="detail-field">
              <text class="label section-title">税号：914409827314839581</text>
            </view>
            <view class="detail-field">
              <text class="label section-title">开户行：工商银行化州市支行</text>
            </view>
            <view class="detail-field">
              <text class="label section-title">账号：2016 0721 1920 0054 053</text>
            </view>
            <view class="detail-field">
              <text class="label section-title">电话：0668-7290186</text>
            </view>
            <view class="detail-field">
              <text class="label section-title">签约代表：</text>
              <uni-easyinput placeholder="乙方签约代表" v-model="partyBRepresentative" :clearable="false"></uni-easyinput>
            </view>
            <view class="detail-field">
              <text class="label section-title">签约日期：</text>
              <uni-datetime-picker type="date" placeholder="签约日期" v-model="partyBContractDate"></uni-datetime-picker>
            </view>
            <view class="detail-field">
              <text v-if="range3.length > 1" class="label section-title">采购员：</text>
              <text v-if="range3.length === 1" class="label section-title">采购员：{{range3[0].text}}</text>
			  <uni-data-select v-if="range3.length > 1" placeholder="请选择采购员" @change="purchasecb" :clear="false" :localdata="range3" placement="top"></uni-data-select>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="section submit-section">
      <view style="display: flex; gap: 20rpx;">
		  <button class="submit-btn" @click="chooseFile">选择文件</button>
		  <button class="submit-btn" @click="sub">提交</button>
	  </view>
      <view>
		  <view v-if="fileName" class="file-name">已选择文件：{{ fileName }}</view>
	  </view>
    </view>
  </view>
</template>

<script setup>
	import { ref, computed } from 'vue';
	import { showToast } from '@/utils/showToast';
	import { showModal } from '@/utils/showModal.js';
	import requestFast from '@/utils/requestFast';
	import H5FileUploaderVue from '@/components/H5FileUploader.vue';
	import { useUploader } from '@/utils/useUploader.js'
	import { API_BASE_URL } from "@/utils/config.js";
	import {onShow} from '@dcloudio/uni-app'
	
	onShow(async () => {
		const res = await requestFast.post('/public/store/view/mod/user/purchaser')
		range3.value = res.data
		//当采购员登录后，列表则为1个人，直接赋值到submitter
		if (range3.value.length === 1) {
			submitter.value = range3.value[0].text
		}
	})
	
	const showData = ref(false) 
	const showDataother = ref(null) 
	const showData1 = ref(false)
	const showData1other = ref(null)
	const showData2 = ref(false)
	const showData3 = ref(false)
	const showData2other = ref(null)
	const showData3other = ref(null)
	const lists = ref([{productId: '', drugName: '', manufacturer: '', specification: '', unit: '', quantity: null, remarks: '', supplementDiff: null}])
	const { chooseFile, uploadFile, fileName } = useUploader(`${API_BASE_URL}` + '/public/store/view/mod/uploadFile')
	const chNum = ref(null)
	
	//甲方
	const partyAName = ref(null)
	//甲方地址
	const partyAAddress = ref(null)
	//甲方税号
	const partyATaxId = ref(null)
	//甲方开户行
	const partyABank = ref(null)
	//甲方账号
	const partyAAccount = ref(null)
	//甲方电话
	const partyAPhone = ref(null)
	//甲方签约代表
	const partyARepresentative = ref(null)
	//甲方签约日期
	const partyAContractDate = ref(null)
	//乙方签约代表
	const partyBRepresentative = ref(null)
	//乙方签约日期
	const partyBContractDate = ref(null)
	//购进政策
	const purchasePolicy = ref(null)
	//终端政策
	const terminalPolicy = ref(null)
	//业务奖励
	const businessReward = ref(null)
	//库存数量
	const inventoryQuantity = ref(null)
	//购进单位
	const purchaseUnit = ref(null)
	//返现方式
	const rebateMethod = ref([])
	//承诺支付起始日期
	const commitmentPaymentDate = ref(null)
	//承诺支付结束日期
	const commitmentPaymentDateEnd = ref(null)
	//政策执行方式
	const policyExecutionMethod = ref([])
	//政策类型
	const policyType = ref([])
	//返利形式
	const rebateTypeMethod = ref([])
	//活动起始时间
	const activityStartDate = ref(null)
	//活动结束时间
	const activityEndDate = ref(null)
	//提交人
	const submitter = ref(null)
	//合计采购金额
	const totalPurchaseAmount = ref(null)
	//服务器保存的图片路径
	const filePath = ref(null)
	
	const inputStyle = {height: '72rpx',fontSize: '28rpx'}
	
	const showCustompolicyType = ref([])
	
	const showPurchasePolicy = ref(false)
	
	const showTerminalPolicy = ref(false)
	
	const showDatarebateType = ref(null)
	
	
	const range = [
		{"value": 0,"text": "票折"},{"value": 1,"text": "返现"},{"value": 2,"text": "返利单位"}
	]
	const range1 = [
		{"value": 0,"text": "购进返利"},{"value": 1,"text": "销售流向"},{"value": 2,"text": "其他"}
	]
	const range2 = [
		{"value": 0,"text": "购进政策"},{"value": 1,"text": "终端政策"},{"value": 2,"text": "库存处理"},{"value": 3,"text": "活动赞助"},{"value":4 ,"text": "季度返利"},{"value": 5,"text": "年度返利"},{"value": 6,"text": "其他"}
	]
	const range3 = ref([])
	const range4 = [
		{"value": 0,"text": "票折"},{"value": 1,"text": "现金"},{"value": 2,"text": "返货"},{"value": 3,"text": "库存"},{"value": 4,"text": "其他"}
	]
	
	const NaviQuery = () => {
		uni.navigateTo({
			url:'/pages/purchDept/contractQuery'
		})
	}
	
	const allPartyAList = [
	  '华为公司', '腾讯公司', '阿里巴巴', '百度公司', '字节跳动', '美团公司'
	]
		
	// 根据输入的甲方名称过滤数据
	const filteredResults = ref([])
	
	// 输入框变化时的回调
	const onInputChange = async (e) => {
	  if (e === '') {
		  filteredResults.value = []
		  return
	  }
	  const res = await requestFast.post('/public/store/view/mod/searchCompany', {keyword:e})
	  if (res.code === 200) {
		  filteredResults.value = []
		  filteredResults.value = res.data
	  }
	}
	
	// 选择某个搜索结果
	const selectResult = async (item) => {
	  partyAName.value = item.split(' ')[1]
	  filteredResults.value = []
	  // 可以根据选择的结果跳转页面或执行其他操作
	  await getRebateUnit(item.split(' ')[0])
	}
	const getRebateUnit = async (rebateId) => {
		const res = await requestFast.post('/public/store/view/mod/searchRebateUnitDetail', {rebateId: rebateId})
		if (res.code === 200) {
			var result = res.data
			partyAAddress.value = result.rebateUnitAddress
			partyAAccount.value = result.account
			partyATaxId.value = result.taxNumber
			partyAPhone.value = result.rebateUnitPhone
			partyARepresentative.value = result.signatory
			partyABank.value = result.openingBank
		}
		if (res.code === 500) {
			partyAAddress.value = null
			partyAAccount.value = null
			partyATaxId.value = null
			partyAPhone.value = null
			partyARepresentative.value = null
			partyABank.value = null
		}
	}
	
	//上传文件
	const onUpload = async () => {
	  try {
	    const result = await uploadFile()
		filePath.value = result.data
	    showToast({title: result.data})
	  } catch (err) {
	    console.error('上传失败：请检查上传的文件是否符合格式!')
	  }
	}
	
	const changelistadd = () => {
		lists.value.push({productId: '', drugName: '', manufacturer: '', specification: '', unit: '', quantity: null, remarks: '', supplementDiff: null})
		showToast({title: '新增成功！向左滑动即可查看新增表单'})
	}
	
	const changelistsub = () => {
		if (lists.value.length === 1) return
		uni.showModal({
			confirmText:'删除',
			confirmColor:'#dd524d',
			title:'是否删除表单?',
			success: (res) => {
				if (res.confirm) {
					lists.value.pop()
				}
			}
		})
	}
	//政策执行方式回调
	const policyExecutionMethodcb = (e) => {
		const cbList = e.detail.value
		policyExecutionMethod.value = []
		for (var i = 0; i < cbList.length; i++) {
			var index = cbList[i]
			var text = range1[index].text
			if (text !== '其他') {
				policyExecutionMethod.value.push(text)
			}
			if (cbList.includes(2)) {
				showData.value = true
			} else {
				showData.value = false
				showDataother.value = null
			}
			
		}
		if (cbList.length === 0) {
			showData.value = false
		}
	}
	
	//返利形式回调
	const rebateTypeMethodcb = (e) => {
		const cbList = e.detail.value
		rebateTypeMethod.value = []
		for (var i = 0; i < cbList.length; i++) {
			var index = cbList[i]
			var text = range4[index].text
			if (text !== '其他') {
				rebateTypeMethod.value.push(text)
			}
		}
		if (cbList.includes(4)) {
			showData3.value = true
		} else {
			showData3.value = false
			//如果没有勾到其他选项，则清空其他对象的值
			showDatarebateType.value = null
		}
		if (cbList.length === 0) {
			showData3.value = false
		}
	}
	
	
	//政策类型回调
	const policyTypecb = (e) => {
		const cbList = e.detail.value
		policyType.value = []
		showCustompolicyType.value = []
		for (var i = 0; i < cbList.length; i++) {
			var index = cbList[i]
			var text = range2[index].text
			if (text !== '其他') {
				policyType.value.push(text)
			}
			showPurchasePolicy.value = policyType.value.includes('购进政策')
			showTerminalPolicy.value = policyType.value.includes('终端政策')
		}
		
		if (cbList.includes(6)) {
			showData2.value = true
		} else {
			showData2.value = false
			showData2other.value = null
		}
		
		if (cbList.length === 0) {
			showData2.value = false
			showPurchasePolicy.value = false
			showTerminalPolicy.value = false
		}
	}
	
	//返现方式回调
	const rebateMethodcb = (e) => {
		const cbList = e.detail.value
		rebateMethod.value = []
		for (var i = 0; i < cbList.length; i++) {
			var index = cbList[i]
			var text = range[index].text
			if (text !== '返利单位') {
				showData1.value = false
				rebateMethod.value.push(text)
				//清楚绑定数据避免其他选项输入后再点击其他而忽略存在的值
				showData1other.value = null
			} else {
				showData1.value = true
			}
		}
		if (cbList.length === 0) {
			showData1.value = false
		}
	}
	
	//当前页面刷新
	const refreshPage = () => {
		const currentPages = getCurrentPages()
		const currentRoute = currentPages[currentPages.length - 1].route
		uni.reLaunch({ url: `/${currentRoute}` })  // 或者 uni.redirectTo
	}
	
	const changeCh = async (e) => {
		if (e === '') {
			chNum.value = ''
			return
		}
		const res = await requestFast.post('/public/store/view/numTochinese', {number: e})
		if (res.code === 200) {
			chNum.value = res.data
		}
	}
	
	//下拉选择采购员回调事件
	const purchasecb = (e) => {
		submitter.value = range3.value[e].text
	}
	
	const sub = async() => {
		
		if (showDataother.value != '' && showDataother.value != null) {
			policyExecutionMethod.value.push(showDataother.value)
		}
		
		if (showData1other.value != '' && showData1other.value != null) {
			rebateMethod.value.push(showData1other.value)
		}
		
		if (showData2other.value != '' && showData2other.value != null) {
			policyType.value.push(showData2other.value)
		}
		
		if (showData3other.value != '' && showData3other.value != null) {
			policyType.value.push(showData3other.value)
		}
		
		if (partyAName.value == null || partyAName.value == '') {
			showToast({'title': '甲方公司不能为空!'})
			return
		}
		
		if (showDatarebateType.value != '' && showDatarebateType.value != '') {
			rebateTypeMethod.value.push(showDatarebateType.value)
		}
		
		if (totalPurchaseAmount.value == null) {
			totalPurchaseAmount.value == 0
		}
				
		// if (purchasePolicy.value == null || purchasePolicy.value == '') {
		// 	showToast({'title': '请填写购进政策!'})
		// 	return
		// }
		
		// if (terminalPolicy.value == null || terminalPolicy.value == '') {
		// 	showToast({'title': '请填写终端政策!'})
		// 	return
		// }
		
		if (businessReward.value == null || businessReward.value == '') {
			showToast({'title': '请填写业务奖励!'})
			return
		}
		
		if (inventoryQuantity.value == null) {
			inventoryQuantity.value == 0
		}
		
		if (purchaseUnit.value == null || purchaseUnit.value == '') {
			showToast({'title': '请填写购进单位!'})
			return
		}
		
		// if (showData1other.value == null || showData1other.value == '') {
		// 	showToast({'title': '请填写返利单位'})
		// 	return
		// }
		
		if (commitmentPaymentDate.value == null || commitmentPaymentDate.value == '') {
			showToast({'title': '请选择承诺支付日期!'})
			return
		}
		
		
		if (policyExecutionMethod.value.length === 0) {
			showToast({'title': '请选择政策执行方式'})
			return
		}
		
		if (policyType.value.length === 0) {
			showToast({'title': '请选择政策类型'})
			return
		}
		
		if (activityStartDate.value == null || activityStartDate.value == '') {
			showToast({'title': '请选择活动起始时间'})
			return
		}
		
		if (activityEndDate.value == null || activityEndDate.value == '') {
			showToast({'title': '请选择活动结束时间'})
			return
		}
		
		if (partyAAddress.value == null || partyAAddress.value == '') {
			showToast({'title': '请输入甲方地址'})
			return
		}
		
		if (partyATaxId.value == null || partyATaxId.value == '') {
			showToast({'title': '请输入甲方税号'})
			return
		}
		
		if (partyABank.value == null || partyABank.value == '') {
			showToast({'title': '请输入甲方开户行'})
			return
		}
		
		if (partyAAccount.value == null || partyAAccount.value == '') {
			showToast({'title': '请输入甲方账号'})
			return
		}
		
		if (partyAPhone.value == null || partyAPhone.value == '') {
			showToast({'title': '请输入甲方电话'})
			return
		}
		
		if (partyARepresentative.value == null || partyARepresentative.value == '') {
			showToast({'title': '请输入甲方签约代表'})
			return
		}
		
		
		if (partyAContractDate.value == null || partyAContractDate.value == '') {
			showToast({'title': '请输入甲方签约时间'})
			return
		}
		
		if (partyBRepresentative.value == null || partyBRepresentative.value == '') {
			showToast({'title': '请输入乙方签约代表'})
			return
		}
		
		
		if (partyBContractDate.value == null || partyBContractDate.value == '') {
			showToast({'title': '请输入乙方签约时间'})
			return
		}
		
		if (submitter.value == null || submitter.value == '') {
			showToast({'title': '请选择采购员'})
			return
		}
				
		
		
		uni.showModal({
			content:'是否提交数据？',
			showCancel:true,
			success: async (res) => {
				if (res.confirm) {
					await pushData()
				}
			}
		})
		
		const pushData = async () => {
			//先提交文件上去获取到该文件在服务器的路径
			if (fileName.value) {
				try {
					const result = await uploadFile()
					if (result.code === 200) {
						console.log(result.data)
						filePath.value = result.data
						showToast({title: '文件上传成功！准备开始上传表单数据'})
					} else {
						showToast({title: result.msg})
						return
					}
				} catch (err) {
				  showToast({title: '上传失败！请联系管理员'})
				  return;
				}
			}
			// 生成 data对象
			const data = {
				partyAName: partyAName.value,
				partyAAddress: partyAAddress.value,
				partyATaxId: partyATaxId.value,
				partyABank: partyABank.value,
				partyAAccount: partyAAccount.value,
				partyAPhone: partyAPhone.value,
				partyARepresentative: partyARepresentative.value,
				partyAContractDate: partyAContractDate.value,
				partyBRepresentative: partyBRepresentative.value,
				partyBContractDate: partyBContractDate.value,
				totalPurchaseAmount: totalPurchaseAmount.value,
				purchasePolicy: purchasePolicy.value,
				terminalPolicy: terminalPolicy.value,
				businessReward: businessReward.value,
				inventoryQuantity: inventoryQuantity.value,
				purchaseUnit: purchaseUnit.value,
				rebateMethod: partyAName.value,
				commitmentPaymentDate: commitmentPaymentDate.value,
				commitmentPaymentDateEnd: commitmentPaymentDateEnd.value,
				policyExecutionMethod: policyExecutionMethod.value.toString(),
				policyType: policyType.value.toString(),
				activityStartDate: activityStartDate.value,
				activityEndDate: activityEndDate.value,
				submitter: submitter.value,
				submissionDateDetailList: lists.value,
				filePath: filePath.value,
				rebateForm: rebateTypeMethod.value.toString()
			}
			
			//提交数据上去
			const res = await requestFast.post('/public/store/view/modules', data)
			if (res.code === 200) {
				uni.showToast({
					icon:'success',
					title:'数据提交完成！',
				})
				//刷新当前页面
				refreshPage()
			} else {
				uni.showToast({
					icon:'fail',
					title:'数据提交失败！请联系管理员或者稍后再试'
				})
			}
		}
	}
	
	function numberToChinese(num) {
	    // 中文数字和单位的映射
	    const chineseNumbers = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
	    const chineseUnits = ['', '拾', '佰', '仟', '万', '亿'];
	
	    // 特殊情况：0
	        if (num === 0) {
	            return chineseNumbers[0];
	        }
	    
	        // 将整数部分和小数部分分开
	        let integerPart = Math.floor(num); // 整数部分
	        let decimalPart = num - integerPart; // 小数部分
	        let decimalStr = decimalPart.toFixed(2).split('.')[1]; // 保留两位小数
	    
	        let integerResult = '';
	        let unitIndex = 0;  // 单位索引
	        let zeroFlag = false;  // 用来标记是否需要加“零”
	    
	        // 处理整数部分
	        while (integerPart > 0) {
	            let digit = integerPart % 10;  // 取出当前位的数字
	            if (digit !== 0) {
	                integerResult = chineseNumbers[digit] + chineseUnits[unitIndex] + integerResult;
	                zeroFlag = false;
	            } else {
	                if (!zeroFlag) {
	                    integerResult = chineseNumbers[0] + integerResult;  // 添加“零”
	                    zeroFlag = true;
	                }
	            }
	    
	            integerPart = Math.floor(integerPart / 10);  // 去掉当前的个位数字
	            unitIndex++;
	        }
	    
	        // 特殊情况：十开头，如："一十" -> "十"
	        if (integerResult[0] === '一' && integerResult[1] === '十') {
	            integerResult = integerResult.substring(1);
	        }
	    
	        // 处理小数部分（角和分）
	        let decimalResult = '';
	        let jiao = parseInt(decimalStr[0]); // 获取角位
	        let fen = parseInt(decimalStr[1]); // 获取分位
	    
	        if (jiao !== 0) {
	            decimalResult += chineseNumbers[jiao] + '角';
	        }
	    
	        if (fen !== 0) {
	            decimalResult += chineseNumbers[fen] + '分';
	        }
	    
	        // 拼接整数部分和小数部分
	        if (decimalResult) {
	            return integerResult + '点' + decimalResult;
	        }
	    
	        return integerResult;
	}
</script>

<style scoped>
.submit-section {
	display: flex;
	gap: 10rpx;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}

/* 卡片背景色（循环色系） */
.card:nth-child(4n+1) {
  background: linear-gradient(135deg, #f5f7fa 0%, #e4edf9 100%);
}
.card:nth-child(4n+2) {
  background: linear-gradient(135deg, #f9f5ff 0%, #e8dffa 100%);
}
.card:nth-child(4n+3) {
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
}
.card:nth-child(4n+4) {
  background: linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%);
}

/* 标签文字颜色适配 */
.card:nth-child(4n+1) .label {
  color: #3b82f6;
}
.card:nth-child(4n+2) .label {
  color: #8b5cf6;
}
.card:nth-child(4n+3) .label {
  color: #10b981;
}
.card:nth-child(4n+4) .label {
  color: #f97316;
}


/* 整体容器 */
.container {
  padding: 20rpx;
  background: #f8f8f8;
}

/* 横向滚动容器 */
.scroll-container {
  width: 100%;
  white-space: nowrap;
  padding: 16rpx 0;
  /* 隐藏滚动条（可选） */
  ::-webkit-scrollbar {
    display: none;
  }
}

/* 卡片样式 */
.card {
  display: inline-block;
  width: 560rpx; /* 缩窄宽度 */
  margin-right: 20rpx;
  padding: 20rpx;
  border-radius: 16rpx;
  background: #fff;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05); /* 更柔和的阴影 */
  transition: all 0.2s ease;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.card:hover {
  transform: translateY(-4rpx);
  box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.1);
}

/* 点击反馈效果 */
.card:active {
  transform: scale(0.98);
  opacity: 0.9;
}

/* 表单项 */
.field {
  margin-bottom: 16rpx;
}

.field .label {
  display: block;
  margin-bottom: 6rpx;
  font-size: 26rpx;
  color: #555;
  font-weight: normal;
}

/* 输入框深度定制 */
.field uni-easyinput /deep/ .uni-easyinput__content {
  height: 72rpx !important;
  padding: 8rpx 12rpx !important;
  border: 1rpx solid #e5e5e5 !important;
  border-radius: 8rpx !important;
  font-size: 28rpx !important;
  background-color: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(4px);
}

.field uni-easyinput /deep/ .uni-easyinput__content:focus {
  border-color: #2979ff !important;
}

/* 添加卡片按钮 */
.add-btn {
  margin-top: 30rpx;
  background: #2979ff;
  color: white;
  border: none;
  border-radius: 8rpx;
}
	
/* 基础容器样式 */
.contract-container {
  padding: 20rpx;
  background-color: #f8f8f8;
  min-height: 100vh;
  position: relative;
  font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
}

/* 头部样式 */
.contract-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
  padding-bottom: 20rpx;
  border-bottom: 2px dashed #e0e0e0;
}

.company-name {
  font-size: 38rpx;
  font-weight: 600;
  color: #1a73e8;
  letter-spacing: 1rpx;
}

.contract-number {
  font-size: 28rpx;
  color: #666;
  background: #f0f7ff;
  padding: 6rpx 12rpx;
  border-radius: 16rpx;
}

/* 搜索区域增强样式 */
.button-container {
  display: flex;
  justify-content: flex-end;
  margin: 24rpx 0;
}

.search-button {
  background: linear-gradient(135deg, #1a73e8, #0d47a1);
  color: #fff;
  font-size: 28rpx;
  font-weight: 500;
  padding: 14rpx 32rpx;
  border-radius: 50rpx;
  border: none;
  box-shadow: 0 4rpx 12rpx rgba(26, 115, 232, 0.3);
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
}

.search-button::before {
  content: "🔍";
  margin-right: 8rpx;
  font-size: 24rpx;
}

.search-button:active {
  transform: translateY(2rpx);
  box-shadow: 0 2rpx 6rpx rgba(26, 115, 232, 0.4);
}

/* 输入框增强样式 */
.party-input {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
  position: relative;
  background: #fff;
  border-radius: 12rpx;
  padding: 8rpx 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
  border: 1px solid #e0e0e0;
}

.party-input .label {
  font-size: 28rpx;
  color: #1a73e8;
  min-width: 120rpx;
  font-weight: 500;
}

/* 搜索结果增强样式 */
.search-results {
  position: absolute;
  top: 330rpx;
  left: 43rpx;
  right: 42rpx;
  z-index: 1000;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 12rpx;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.12);
  max-height: 400rpx;
  overflow-y: auto;
}

.result-item {
  padding: 24rpx;
  font-size: 28rpx;
  color: #333;
  border-bottom: 1rpx solid #f5f5f5;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
}

.result-item:last-child {
  border-bottom: none;
}

.result-item:hover {
  background-color: #f5f9ff;
  transform: translateX(4rpx);
}

.result-item::before {
  content: "→";
  color: #1a73e8;
  margin-right: 12rpx;
  opacity: 0;
  transition: all 0.2s ease;
}

.result-item:hover::before {
  opacity: 1;
}

/* 其他部分保持原有风格但增强细节 */
.section {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 28rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
  border: 1px solid #f0f0f0;
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #1a73e8;
  margin-bottom: 24rpx;
  display: block;
  padding-bottom: 12rpx;
  border-bottom: 2px dashed #f0f0f0;
}

.section-title-none {
  font-size: 32rpx;
  font-weight: 600;
  color: black;
  margin-bottom: 24rpx;
  display: block;
  padding-bottom: 12rpx;
  border-bottom: 2px dashed #f0f0f0;
}

/* 产品卡片增强样式 */
.product-card {
  display: inline-block;  /* 关键：让卡片横向排列 */
    width: 600rpx;         /* 固定宽度，避免挤压 */
    margin-right: 20rpx;    /* 卡片间距 */
    padding: 20rpx;
    border: 1px solid #eee;
    border-radius: 10rpx;
    vertical-align: top;    /* 避免对齐问题 */
}

/* 按钮增强样式 */
.action-btn {
  border-radius: 50rpx;
  padding: 8rpx 36rpx;
  background: linear-gradient(135deg, #1a73e8, #0d47a1);
  color: white;
  font-size: 28rpx;
  font-weight: 500;
  border: none;
  box-shadow: 0 4rpx 12rpx rgba(26, 115, 232, 0.3);
  transition: all 0.2s ease;
}

.action-btn:active {
  transform: translateY(2rpx);
  box-shadow: 0 2rpx 6rpx rgba(26, 115, 232, 0.4);
}

/* 金额部分增强样式 */
.total-amount {
  margin-top: 30rpx;
  padding: 20rpx;
  background: #f5f9ff;
  border-radius: 12rpx;
}

.amount-chinese {
  font-size: 28rpx;
  color: #1a73e8;
  font-weight: 500;
  margin-top: 12rpx;
}

/* 文件上传样式增强 */
.file-name {
  font-size: 26rpx;
  color: #1a73e8;
  margin: 10rpx 0;
  padding: 12rpx;
  background: #f5f9ff;
  border-radius: 8rpx;
  border-left: 4rpx solid #1a73e8;
}

.submit-btn {
  width: 240rpx;
  border-radius: 50rpx;
  padding: 16rpx;
  background: linear-gradient(135deg, #1a73e8, #0d47a1);
  color: white;
  font-size: 28rpx;
  font-weight: 500;
  border: none;
  box-shadow: 0 4rpx 12rpx rgba(26, 115, 232, 0.3);
  transition: all 0.2s ease;
}

.submit-btn:active {
  transform: translateY(2rpx);
  box-shadow: 0 2rpx 6rpx rgba(26, 115, 232, 0.4);
}
</style>