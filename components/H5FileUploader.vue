<template>
  <view class="upload-container">
    <view>
		<button 
		@click="chooseFile" 
		size="mini"
		style="
		    border-radius: 25rpx;
		    padding: 10rpx 36rpx;
		    background-color: #007aff;
		    color: white;
		    font-size: 28rpx;
		    border: none;
		    box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.15);
		    transition: background-color 0.3s;
		  "
		>{{ buttonText }}</button>
		<view v-if="fileName">已选择文件：{{ fileName }}</view>
	</view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  uploadUrl: {
    type: String,
    required: true
  },
  fieldName: {
    type: String,
    default: 'file'
  },
  buttonText: {
    type: String,
    default: '选择文件'
  },
})

const emits = defineEmits(['upload-success', 'upload-fail'])

const fileObj = ref(null)
const fileName = ref('')

// 选择文件（仅 H5 有效）
const chooseFile = () => {
  // #ifdef H5
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '*/*'
  input.onchange = (event) => {
    const file = event.target.files[0]
    if (file) {
      fileObj.value = file
      fileName.value = file.name
    }
  }
  input.click()
  // #endif
}

// 上传文件
const uploadFile = () => {
  if (!fileObj.value) return alert('请选择文件')

  const formData = new FormData()
  formData.append(props.fieldName, fileObj.value)

  fetch(props.uploadUrl, {
    method: 'POST',
    body: formData,
  })
    .then(res => res.json())
    .then(data => {
      emits('upload-success', data)
    })
    .catch(err => {
      emits('upload-fail', err)
    })
}
</script>

<style scoped>
.upload-container {
  padding: 16px;
}
/* button {
  margin: 8px 0;
} */
</style>
