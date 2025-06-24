import { defineStore } from 'pinia';

export const useCounterStore = defineStore('counter', {
	state: () => ({
		storageName: '请选择查询门店',
		storageId: '',
		placepointid: '',
		username: '',
		Token: '',
		startDate: '请选择起始时间',
		endDate: '请选择结束时间',
		isToken: false
	})
})