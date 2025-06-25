<template>
	<view class="context">
		<view style="width: 85vw;">
			<view class="title">
				<view>
					<text>广东济群药业有限公司</text>
				</view>
				<view>
					<text>合同编号: JQ</text>
				</view>
			</view>
			<view >
				<view style="display: grid; grid-template-columns: auto 1fr; align-items: center; width: 80%;">
					<view>
						<text>甲方：</text>
					</view>
					<view>
						<uni-easyinput placeholder="请输入甲方公司" v-model="partyAName"></uni-easyinput>
					</view>
				</view>
				<view style="margin: 20rpx 0;">
					<text>乙方: 责任采购</text>
				</view>
				<view>
					<text>甲，乙双方本着互惠互利的原则，并结合医药行业实际情况，达成一下协议:</text>
				</view>
			</view>
			<view style="margin: 20rpx 0; ">
				<view>
					<text>1. 药品名称，规则，单位，数量，单价，金额</text>
				</view>
				<view style="display: grid; grid-auto-flow: column; width: 100%; overflow-x: auto; gap: 10rpx;">
					<view style="display: grid; place-items: center;" v-for="(value, index) in lists" :key="index">
						<view style="margin: 20rpx 0; width: 90vw">
							<view class="in-data">
								<view>
									<text>商品ID: </text>
								</view>
								<view>
									<uni-easyinput placeholder="请输入商品ID" v-model="value.productId"></uni-easyinput>
								</view>
							</view>
							<view class="in-data">
								<view>
									<text>药品名称：</text>
								</view>
								<view>
									<uni-easyinput placeholder="请输入药品名称" v-model="value.drugName"></uni-easyinput>
								</view>
							</view>
							<view class="in-data">
								<view>
									<text>生产厂家：</text>
								</view>
								<view>
									<uni-easyinput placeholder="请输入生产厂家" v-model="value.manufacturer"></uni-easyinput>
								</view>
							</view>
							<view class="in-data">
								<view>
									<text>规格：</text>
								</view>
								<view>
									<uni-easyinput placeholder="请输入规格" v-model="value.specification"></uni-easyinput>
								</view>
							</view>
							<view class="in-data">
								<view>
									<text>单位：</text>
								</view>
								<view>
									<uni-easyinput placeholder="请输入单位" v-model="value.unit"></uni-easyinput>
								</view>
							</view>
							<view class="in-data">
								<view>
									<text>数量：</text>
								</view>
								<view>
									<uni-easyinput placeholder="请输入数量" type="number" v-model="value.quantity"></uni-easyinput>
								</view>
							</view>
							<view class="in-data">
								<view>
									<text>补差/盒：</text>
								</view>
								<view>
									<uni-easyinput placeholder="请输入补差/盒" type="number" v-model="value.supplementDiff"></uni-easyinput>
								</view>
							</view>
							<view class="in-data">
								<view>
									<text>备注：</text>
								</view>
								<view>
									<uni-easyinput placeholder="请输入备注" v-model="value.remarks"></uni-easyinput>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view style="margin-top: 20rpx; display: grid; justify-content: end; align-items: center; margin-bottom: 20rpx;">
					<view style="display: grid; grid-auto-flow: column;">
						<view style="width: 200rpx;">
							<button size="mini" style="background-color: aliceblue; border-radius: 15rpx;" @click="changelistadd">新增</button>
						</view>
						<view style="width: 200rpx;">
							<button size="mini" style="background-color: aliceblue; border-radius: 15rpx;" @click="changelistsub">删除</button>
						</view>
					</view>
				</view>
				<view style="padding-left: 30rpx;">
					<view style="margin-bottom: 10rpx; display: grid; grid-auto-flow: column; align-items: center;">
						<text>合计人民币 （小写）：</text>
						<uni-easyinput type="number" placeholder="请输入金额" @input="changeCh" v-model="totalPurchaseAmount"></uni-easyinput>
					</view>
					<view>
						<text>合计人民币 （大写）：{{chNum}}</text>
					</view>
				</view>
			</view>
			<view class="many">
				<view>
					<text>2. 购进政策：</text>
				</view>
				<view style="margin-top: 10rpx;">
					<uni-easyinput type="textarea" placeholder="请输入购进政策" v-model="purchasePolicy"></uni-easyinput>
				</view>
			</view>
			<view class="many">
				<view>
					<text>3. 终端政策：</text>
				</view>
				<view style="margin-top: 10rpx;">
					<uni-easyinput type="textarea" placeholder="请输入终端政策" v-model="terminalPolicy"></uni-easyinput>
				</view>
			</view>
			<view class="many">
				<view>
					<text>4. 业务奖励：</text>
				</view>
				<view style="margin-top: 10rpx;">
					<uni-easyinput type="textarea" placeholder="请输入业务奖励" v-model="businessReward"></uni-easyinput>
				</view>
			</view>
			<view class="many">
				<view>
					<text>5. 库存数量：</text>
				</view>
				<view style="margin-top: 10rpx;">
					<uni-easyinput type="number" placeholder="请输入库存数量" v-model="inventoryQuantity"></uni-easyinput>
				</view>
			</view>
			<view class="many">
				<view>
					<text>6. 购进单位：</text>
				</view>
				<view style="margin-top: 10rpx;">
					<uni-easyinput type="textarea" placeholder="请输入购进单位" v-model="purchaseUnit"></uni-easyinput>
				</view>
			</view>
			<view class="many">
				<view>
					<text>7. 返现方式：</text>
				</view>
				<view style="margin-top: 10rpx;">
					<uni-data-checkbox :localdata="range"  @change="rebateMethodcb"></uni-data-checkbox>
				</view>
				<view style="margin-top: 10rpx;" v-if="showData1">
					<uni-easyinput type="textarea" placeholder="请输入返现方式" v-model="rebateMethod"></uni-easyinput>
				</view>
			</view>
			<view class="many">
				<view>
					<text>8. 承诺支付日期：</text>
				</view>
				<view style="margin-top: 10rpx;">
					<uni-datetime-picker placeholder="选择支付日期" type="date" v-model="commitmentPaymentDate"></uni-datetime-picker>
				</view>
			</view>
			<view class="many">
				<view>
					<text>9. 政策执行方式：</text>
				</view>
				<view style="margin-top: 10rpx;">
					<uni-data-checkbox :localdata="range1" @change="policyExecutionMethodcb"></uni-data-checkbox>
				</view>
				<view style="margin-top: 10rpx;" v-if="showData">
					<uni-easyinput type="textarea" placeholder="请输入政策执行方式" v-model="policyExecutionMethod"></uni-easyinput>
				</view>
			</view>
			<view class="many">
				<view>
					<text>10. 政策类型：</text>
				</view>
				<view style="margin-top: 10rpx;">
					<uni-data-checkbox :localdata="range2" @change="policyTypecb"></uni-data-checkbox>
				</view>
				<view style="margin-top: 10rpx;" v-if="showData2">
					<uni-easyinput type="textarea" placeholder="请输入政策类型" v-model="policyType"></uni-easyinput>
				</view>
			</view>
			<view class="many">
				<view>
					<text>11. 活动时间：</text>
				</view>
				<view style="margin-top: 10rpx;">
					<uni-datetime-picker placeholder="选择起始时间" type="date" v-model="activityStartDate"></uni-datetime-picker>
					<uni-datetime-picker placeholder="选择结束时间" type="date" v-model="activityEndDate"></uni-datetime-picker>
				</view>
			</view>
			<view class="many">
				<view>
					<text>12. 本协议一式两份，乙方留存一份，甲方执一份，自双方代表签字盖章之日起生效，具有同等效力</text>
				</view>
				<view style="padding: 0 20rpx;">
					<view>
						<view class="in-data" style="margin-top: 15rpx;">
							<view>
								<text>甲方：</text>
							</view>
							<view>
								<uni-easyinput placeholder="甲方" v-model="partyAName"></uni-easyinput>
							</view>
						</view>
						<view class="in-data" style="margin-top: 15rpx;">
							<view>
								<text>地址：</text>
							</view>
							<view>
								<uni-easyinput placeholder="地址" v-model="partyAAddress"></uni-easyinput>
							</view>
						</view>
						<view class="in-data" style="margin-top: 15rpx;">
							<view>
								<text>税号：</text>
							</view>
							<view>
								<uni-easyinput placeholder="税号" v-model="partyATaxId"></uni-easyinput>
							</view>
						</view>
						<view class="in-data" style="margin-top: 15rpx;">
							<view>
								<text>开户行：</text>
							</view>
							<view>
								<uni-easyinput placeholder="开户行" v-model="partyABank"></uni-easyinput>
							</view>
						</view>
						<view class="in-data" style="margin-top: 15rpx;">
							<view>
								<text>账号：</text>
							</view>
							<view>
								<uni-easyinput placeholder="账号" v-model="partyAAccount"></uni-easyinput>
							</view>
						</view>
						<view class="in-data" style="margin-top: 15rpx;">
							<view>
								<text>电话：</text>
							</view>
							<view>
								<uni-easyinput placeholder="电话" v-model="partyAPhone"></uni-easyinput>
							</view>
						</view>
						<view class="in-data" style="margin-top: 15rpx;">
							<view>
								<text>签约代表：</text>
							</view>
							<view>
								<uni-easyinput placeholder="甲方签约代表" v-model="partyARepresentative"></uni-easyinput>
							</view>
						</view>
						<view class="in-data" style="margin-top: 15rpx;">
							<view>
								<text>签约日期：</text>
							</view>
							<view>
								<uni-datetime-picker type="date" placeholder="签约日期" v-model="partyAContractDate"></uni-datetime-picker>
							</view>
						</view>
					</view>
				</view>
				<view style="padding: 0 20rpx;">
					<view style="margin-top: 15rpx;">
						<view>
							<text>乙方：责任采购</text>
						</view>
					</view>
					<view style="margin-top: 15rpx;">
						<view>
							<text>地址：化州市鉴江开发区旺龙南路1-8号</text>
						</view>
					</view>
					<view style="margin-top: 15rpx;">
						<view>
							<text>税号：914409827314839581</text>
						</view>
					</view>
					<view style="margin-top: 15rpx;">
						<view>
							<text>开户行：工商银行化州市支行</text>
						</view>
					</view>
					<view style="margin-top: 15rpx;">
						<view>
							<text>账号：2016 0721 1920 0054 053</text>
						</view>
					</view>
					<view style="margin-top: 15rpx;">
						<view>
							<text>电话：0668-7290186</text>
						</view>
					</view>
					<view class="in-data" style="margin-top: 15rpx;">
						<view>
							<text>签约代表：</text>
						</view>
						<view>
							<uni-easyinput placeholder="乙方签约代表" v-model="partyBRepresentative"></uni-easyinput>
						</view>
					</view>
					<view class="in-data" style="margin-top: 15rpx;">
						<view>
							<text>签约日期：</text>
						</view>
						<view>
							<uni-datetime-picker type="date" placeholder="签约日期" v-model="partyBContractDate"></uni-datetime-picker>
						</view>
					</view>
					<view class="in-data" style="margin-top: 15rpx;">
						<view>
							<text>采购员：</text>
						</view>
						<view>
							<uni-easyinput placeholder="请输入采购员编号" v-model="submitter"></uni-easyinput>
						</view>
					</view>
				</view>
			</view>
			<view class="many" style="display: grid; place-items: center;">
				<view style="display: grid; grid-auto-flow: column; margin-bottom: 35rpx;">
					<view>
						<button size="mini" style="border-radius: 25rpx; color: azure; background-color: aquamarine;">上传图片/文件</button>
					</view>
					<view style="margin-left: 25rpx;">
						<button size="mini" style="border-radius: 25rpx; color: azure; background-color: aquamarine;" @click="sub">提交</button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { ref } from 'vue';
	import { showToast } from '../utils/showToast';
	import { showModal } from '../utils/showModal.js';
import requestFast from '../utils/requestFast';
	
	
	const showData = ref(false)
	const showData1 = ref(false)
	const showData2 = ref(false)
	const lists = ref([{productId: '', drugName: '', manufacturer: '', specification: '', unit: '', quantity: 0, remarks: '', supplementDiff: 0}])
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
	const inventoryQuantity = ref(0)
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
	const totalPurchaseAmount = ref(0)
	
	const range = [
		{"value": 0,"text": "票折"},{"value": 1,"text": "返现"},{"value": 2,"text": "其他"}
	]
	const range1 = [
		{"value": 0,"text": "购进返利"},{"value": 1,"text": "销售流向"},{"value": 2,"text": "其他"}
	]
	const range2 = [
		{"value": 0,"text": "购进政策"},{"value": 1,"text": "终端政策"},{"value": 2,"text": "库存处理"},{"value": 3,"text": "活动赞助"},{"value": 4,"text": "其他"}
	]
	
	const changelistadd = () => {
		lists.value.push({productId: '', drugName: '', manufacturer: '', specification: '', unit: '', quantity: 0, remarks: '', supplementDiff: 0})
	}
	const changelistsub = () => {
		if (lists.value.length === 1) return
		lists.value.pop()
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
	const changeCh = (e) => {
		console.log(e)
		if (e === '') {
			chNum.value = ''
			return
		}
		chNum.value = numberToChinese(e)
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
			submissionDateDetailList: lists.value
		}
		
		uni.showModal({
			content:'是否提交数据？',
			showCancel:true,
			success: async (res) => {
				if (res.confirm) {
					//此处提交数据上去
					var test = {pid: '123456'}
					const res = await requestFast.post('/public/store/view/modules', data)
				}
			}
		})
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
	.many {
		margin-bottom: 20rpx;
	}
	.in-data {
		width: 85%;
		display: grid;
		align-items: center;
		grid-template-columns: auto 1fr;
		margin-bottom: 20rpx;
	}
	.title {
		width: 100%;
		display: grid;
		height: 150rpx;
		place-content: center;
	}
	.context {
		width: 100vw;
		display: grid;
		place-items: center;
	}
</style>
