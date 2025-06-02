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
        <uni-easyinput placeholder="请输入甲方公司" v-model="partyAName" :clearable="false"></uni-easyinput>
      </view>
      <view class="party-info">
        <text>乙方: 责任采购</text>
      </view>
      <view class="agreement-text">
        <text>甲，乙双方本着互惠互利的原则，并结合医药行业实际情况，达成一下协议:</text>
      </view>
    </view>

    <view class="section products-section">
      <text class="section-title">1. 药品名称，规则，单位，数量，单价，金额</text>
      
      <scroll-view scroll-x class="products-scroll">
        <view class="product-card" v-for="(value, index) in lists" :key="index">
          <view class="product-field">
            <text class="field-label">商品ID: </text>
            <uni-easyinput placeholder="请输入商品ID" v-model="value.productId" :clearable="false"></uni-easyinput>
          </view>
          <view class="product-field">
            <text class="field-label">药品名称：</text>
            <uni-easyinput placeholder="请输入药品名称" v-model="value.drugName" :clearable="false"></uni-easyinput>
          </view>
          <view class="product-field">
            <text class="field-label">生产厂家：</text>
            <uni-easyinput placeholder="请输入生产厂家" v-model="value.manufacturer" :clearable="false"></uni-easyinput>
          </view>
          <view class="product-field">
            <text class="field-label">规格：</text>
            <uni-easyinput placeholder="请输入规格" v-model="value.specification" :clearable="false"></uni-easyinput>
          </view>
          <view class="product-field">
            <text class="field-label">单位：</text>
            <uni-easyinput placeholder="请输入单位" v-model="value.unit" :clearable="false"></uni-easyinput>
          </view>
          <view class="product-field">
            <text class="field-label">数量：</text>
            <uni-easyinput placeholder="请输入数量" type="number" v-model="value.quantity" :clearable="false"></uni-easyinput>
          </view>
          <view class="product-field">
            <text class="field-label">补差/盒：</text>
            <uni-easyinput placeholder="请输入补差/盒" type="number" v-model="value.supplementDiff" :clearable="false"></uni-easyinput>
          </view>
          <view class="product-field">
            <text class="field-label">备注：</text>
            <uni-easyinput placeholder="请输入备注" v-model="value.remarks" :clearable="false"></uni-easyinput>
          </view>
        </view>
      </scroll-view>

      <view class="product-actions">
        <button class="action-btn" size="mini" @click="changelistadd">新增</button>
        <button class="action-btn" size="mini" @click="changelistsub">删除</button>
      </view>

      <view class="total-amount">
        <view class="amount-input">
          <text class="label">合计人民币 （小写）：</text>
          <uni-easyinput type="number" placeholder="请输入金额" @input="changeCh" v-model="totalPurchaseAmount" :clearable="false"></uni-easyinput>
        </view>
        <view class="amount-chinese">
          <text>合计人民币 （大写）：{{chNum}} 元</text>
        </view>
      </view>
    </view>

    <!-- 政策部分 2-11 -->
    <view class="section policy-section">
      <text class="section-title">2. 购进政策：</text>
      <uni-easyinput type="textarea" placeholder="请输入购进政策" v-model="purchasePolicy" :clearable="false"></uni-easyinput>
    </view>

    <view class="section policy-section">
      <text class="section-title">3. 终端政策：</text>
      <uni-easyinput type="textarea" placeholder="请输入终端政策" v-model="terminalPolicy" :clearable="false"></uni-easyinput>
    </view>

    <view class="section policy-section">
      <text class="section-title">4. 业务奖励：</text>
      <uni-easyinput type="textarea" placeholder="请输入业务奖励" v-model="businessReward" :clearable="false"></uni-easyinput>
    </view>

    <view class="section policy-section">
      <text class="section-title">5. 库存数量：</text>
      <uni-easyinput type="number" placeholder="请输入库存数量" v-model="inventoryQuantity" :clearable="false"></uni-easyinput>
    </view>

    <view class="section policy-section">
      <text class="section-title">6. 购进单位：</text>
      <uni-easyinput type="textarea" placeholder="请输入购进单位" v-model="purchaseUnit" :clearable="false"></uni-easyinput>
    </view>

    <view class="section policy-section">
      <text class="section-title">7. 返现方式：</text>
      <uni-data-checkbox :localdata="range" @change="rebateMethodcb"></uni-data-checkbox>
      <view v-if="showData1" class="conditional-field">
        <uni-easyinput type="textarea" placeholder="请输入返现方式" v-model="rebateMethod" :clearable="false"></uni-easyinput>
      </view>
    </view>

    <view class="section policy-section">
      <text class="section-title">8. 承诺支付日期：</text>
      <uni-datetime-picker placeholder="选择支付日期" type="date" v-model="commitmentPaymentDate"></uni-datetime-picker>
    </view>

    <view class="section policy-section">
      <text class="section-title">9. 政策执行方式：</text>
      <uni-data-checkbox :localdata="range1" @change="policyExecutionMethodcb"></uni-data-checkbox>
      <view v-if="showData" class="conditional-field">
        <uni-easyinput type="textarea" placeholder="请输入政策执行方式" v-model="policyExecutionMethod"></uni-easyinput>
      </view>
    </view>

    <view class="section policy-section">
      <text class="section-title">10. 政策类型：</text>
      <uni-data-checkbox :localdata="range2" @change="policyTypecb"></uni-data-checkbox>
      <view v-if="showData2" class="conditional-field">
        <uni-easyinput type="textarea" placeholder="请输入政策类型" v-model="policyType" :clearable="false"></uni-easyinput>
      </view>
    </view>

    <view class="section policy-section">
      <text class="section-title">11. 活动时间：</text>
      <view class="date-range">
        <uni-datetime-picker placeholder="选择起始时间" type="date" v-model="activityStartDate" :clearable="false"></uni-datetime-picker>
        <text class="date-separator">至</text>
        <uni-datetime-picker placeholder="选择结束时间" type="date" v-model="activityEndDate" :clearable="false"></uni-datetime-picker>
      </view>
    </view>

    <view class="section signature-section">
      <text class="section-title">12. 本协议一式两份，乙方留存一份，甲方执一份，自双方代表签字盖章之日起生效，具有同等效力</text>
      
      <view class="party-details">
        <view class="party-info">
          <text class="party-title">甲方：{{partyAName}}</text>
          <view class="party-fields">
            <view class="detail-field">
              <text class="label">地址：</text>
              <uni-easyinput placeholder="地址" v-model="partyAAddress" :clearable="false"></uni-easyinput>
            </view>
            <view class="detail-field">
              <text class="label">税号：</text>
              <uni-easyinput placeholder="税号" v-model="partyATaxId" :clearable="false"></uni-easyinput>
            </view>
            <view class="detail-field">
              <text class="label">开户行：</text>
              <uni-easyinput placeholder="开户行" v-model="partyABank" :clearable="false"></uni-easyinput>
            </view>
            <view class="detail-field">
              <text class="label">账号：</text>
              <uni-easyinput placeholder="账号" v-model="partyAAccount" :clearable="false"></uni-easyinput>
            </view>
            <view class="detail-field">
              <text class="label">电话：</text>
              <uni-easyinput placeholder="电话" v-model="partyAPhone" :clearable="false"></uni-easyinput>
            </view>
            <view class="detail-field">
              <text class="label">签约代表：</text>
              <uni-easyinput placeholder="甲方签约代表" v-model="partyARepresentative" :clearable="false"></uni-easyinput>
            </view>
            <view class="detail-field">
              <text class="label">签约日期：</text>
              <uni-datetime-picker type="date" placeholder="签约日期" v-model="partyAContractDate" :clearable="false"></uni-datetime-picker>
            </view>
          </view>
        </view>

        <view class="party-info">
          <text class="party-title">乙方：责任采购</text>
          <view class="party-fields">
            <view class="detail-field">
              <text class="label">地址：</text>
              <text>化州市鉴江开发区旺龙南路1-8号</text>
            </view>
            <view class="detail-field">
              <text class="label">税号：</text>
              <text>914409827314839581</text>
            </view>
            <view class="detail-field">
              <text class="label">开户行：</text>
              <text>工商银行化州市支行</text>
            </view>
            <view class="detail-field">
              <text class="label">账号：</text>
              <text>2016 0721 1920 0054 053</text>
            </view>
            <view class="detail-field">
              <text class="label">电话：</text>
              <text>0668-7290186</text>
            </view>
            <view class="detail-field">
              <text class="label">签约代表：</text>
              <uni-easyinput placeholder="乙方签约代表" v-model="partyBRepresentative" :clearable="false"></uni-easyinput>
            </view>
            <view class="detail-field">
              <text class="label">签约日期：</text>
              <uni-datetime-picker type="date" placeholder="签约日期" v-model="partyBContractDate"></uni-datetime-picker>
            </view>
            <view class="detail-field">
              <text class="label">采购员：</text>
              <uni-easyinput placeholder="请输入采购员编号" v-model="submitter" :clearable="false"></uni-easyinput>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="section submit-section">
      <!-- <H5FileUploaderVue></H5FileUploaderVue> -->
      <button class="submit-btn" @click="chooseFile">选择文件</button>
	  <view v-if="fileName" class="file-name">已选择文件：{{ fileName }}</view>
      <button class="submit-btn" @click="sub">提交</button>
    </view>
  </view>
</template>

<script setup>
	import { ref } from 'vue';
	import { showToast } from '../utils/showToast';
	import { showModal } from '../utils/showModal.js';
	import requestFast from '../utils/requestFast';
	import H5FileUploaderVue from '../components/H5FileUploader.vue';
	import { useUploader } from '../utils/useUploader.js'
	import { API_BASE_URL } from "../utils/config.js";
	
	const showData = ref(false)
	const showData1 = ref(false)
	const showData2 = ref(false)
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
	const rebateMethod = ref(null)
	//承诺支付日期
	const commitmentPaymentDate = ref(null)
	//政策执行方式
	const policyExecutionMethod = ref(null)
	//政策类型
	const policyType = ref(null)
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
	
	const range = [
		{"value": 0,"text": "票折"},{"value": 1,"text": "返现"},{"value": 2,"text": "其他"}
	]
	const range1 = [
		{"value": 0,"text": "购进返利"},{"value": 1,"text": "销售流向"},{"value": 2,"text": "其他"}
	]
	const range2 = [
		{"value": 0,"text": "购进政策"},{"value": 1,"text": "终端政策"},{"value": 2,"text": "库存处理"},{"value": 3,"text": "活动赞助"},{"value": 4,"text": "其他"}
	]
	
	const NaviQuery = () => {
		uni.navigateTo({
			url:'/pages/contractQuery'
		})
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
		const index = e.detail.value
		if (index === 2) {
			policyExecutionMethod.value = null
			showData.value = true
			return
		}
		policyExecutionMethod.value = range1[index].text
		showData.value = false
	}
	//政策类型回调
	const policyTypecb = (e) => {
		const index = e.detail.value
		if (index === 4) {
			policyType.value = null
			showData2.value = true
			return
		}
		policyType.value = range2[index].text
		showData2.value = false
	}
	//返现方式回调
	const rebateMethodcb = (e) => {
		const index = e.detail.value
		if (index === 2) {
			showData1.value = true
			rebateMethod.value = null
			return
		}
		rebateMethod.value = range[index].text
		showData1.value = false
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
	
	const sub = async() => {
		if (partyAName.value == null || partyAName.value == '') {
			showToast({'title': '公司名称不能为空!'})
			return
		}
		
		if (totalPurchaseAmount.value == null || totalPurchaseAmount.value == 0) {
			showToast({'title': '金额不能为0或者留空!'})
			return
		}
		
		if (purchasePolicy.value == null || purchasePolicy.value == '') {
			showToast({'title': '请填写购进政策!'})
			return
		}
		
		if (terminalPolicy.value == null || terminalPolicy.value == '') {
			showToast({'title': '请填写终端政策!'})
			return
		}
		
		if (businessReward.value == null || businessReward.value == '') {
			showToast({'title': '请填写业务奖励!'})
			return
		}
		
		if (inventoryQuantity.value == null || inventoryQuantity.value == 0) {
			showToast({'title': '库存数量不能为0或者留空!'})
			return
		}
		
		
		if (purchaseUnit.value == null || purchaseUnit.value == '') {
			showToast({'title': '请填写购进单位!'})
			return
		}
		
		if (rebateMethod.value == null || rebateMethod.value == '') {
			showToast({'title': '请选择返现方式!'})
			return
		}
		
		if (commitmentPaymentDate.value == null || commitmentPaymentDate.value == '') {
			showToast({'title': '请选择承诺支付日期!'})
			return
		}
		
		
		if (policyExecutionMethod.value == null || policyExecutionMethod.value == '') {
			showToast({'title': '请选择政策执行方式'})
			return
		}
		
		if (policyType.value == null || policyType.value == '') {
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
			showToast({'title': '请输入采购员编号'})
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
				rebateMethod: rebateMethod.value,
				commitmentPaymentDate: commitmentPaymentDate.value,
				policyExecutionMethod: policyExecutionMethod.value,
				policyType: policyType.value,
				activityStartDate: activityStartDate.value,
				activityEndDate: activityEndDate.value,
				submitter: submitter.value,
				submissionDateDetailList: lists.value,
				filePath: filePath.value
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

<style>
.contract-container {
  padding: 20rpx;
  background-color: #f8f8f8;
  min-height: 100vh;
}

.contract-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
  padding-bottom: 20rpx;
  border-bottom: 1px solid #eee;
}

.company-name {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.contract-number {
  font-size: 28rpx;
  color: #666;
}

.section {
  background-color: #fff;
  border-radius: 12rpx;
  padding: 24rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
  display: block;
}

.party-input {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.label {
  font-size: 28rpx;
  color: #333;
  min-width: 120rpx;
}

.party-info {
  font-size: 28rpx;
  color: #333;
  margin: 20rpx 0;
}

.agreement-text {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
}

.products-scroll {
  width: 100%;
  white-space: nowrap;
  margin: 20rpx 0;
}

.product-card {
  display: inline-block;
  width: 90vw;
  padding: 20rpx;
  background-color: #f9f9f9;
  border-radius: 8rpx;
  margin-right: 20rpx;
  vertical-align: top;
}

.product-field {
  margin-bottom: 20rpx;
}

.field-label {
  font-size: 26rpx;
  color: #666;
  margin-bottom: 8rpx;
  display: block;
}

.product-actions {
  display: flex;
  justify-content: flex-end;
  gap: 20rpx;
  margin: 20rpx 0;
}

.action-btn {
  border-radius: 25rpx;
  padding: 6rpx 36rpx;
  background-color: #007aff;
  color: white;
  font-size: 28rpx;
  border: none;
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1);
}

.total-amount {
  margin-top: 30rpx;
}

.amount-input {
  display: flex;
  align-items: center;
  margin-bottom: 15rpx;
}

.amount-chinese {
  font-size: 28rpx;
  color: #333;
}

.policy-section {
  margin-top: 30rpx;
}

.date-range {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-top: 20rpx;
  flex-wrap: wrap;
}

.date-separator {
  font-size: 28rpx;
  color: #666;
}

.conditional-field {
  margin-top: 20rpx;
  padding-top: 20rpx;
  border-top: 1px dashed #eee;
}

.party-details {
  display: flex;
  flex-direction: column;
  gap: 30rpx;
  margin-top: 30rpx;
}

.party-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
  display: block;
}

.party-fields {
  display: flex;
  flex-direction: column;
  gap: 15rpx;
}

.detail-field {
  display: flex;
  align-items: center;
}

.submit-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30rpx;
  padding: 30rpx;
}

.submit-btn {
  width: 200rpx;
  border-radius: 25rpx;
  padding: 8rpx 36rpx;
  background-color: #007aff;
  color: white;
  font-size: 20rpx;
  border: none;
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1);
}

.button-container {
  display: grid;
  justify-content: end;
  margin: 24rpx 0;
}

.search-button {
  background-color: #2b7cff;
  color: #fff;
  font-size: 26rpx;
  padding: 12rpx 28rpx;
  border-radius: 8rpx;
  border: none;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.1);
}

.search-button:active {
  background-color: #1a5fd0;
}

</style>