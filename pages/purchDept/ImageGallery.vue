```vue
<template>
  <view class="image-gallery">
    <!-- 页面标题 -->
    <view class="page-title">附件图片</view>
    <!-- 返回按钮 -->
    <!-- <view class="back-btn" @click="goBack">
      <text>返回</text>
    </view> -->
    <!-- 图片区域 -->
    <view class="gallery-section">
      <view class="masonry-grid" v-if="images.length > 0">
        <view
          v-for="(image, index) in images"
          :key="index"
          class="image-card"
          @click="showImagePreview(index)"
        >
          <image :src="image.url" mode="widthFix" class="image" />
          <text class="image-title">{{ image.title }}</text>
        </view>
      </view>
	  
    </view>
    <!-- 添加图片悬浮按钮 -->
    <view class="add-btn" @click="chooseFile">
      <text>+</text>
    </view>
    <!-- 图片预览弹窗 -->
    <uni-popup ref="imagePopup" type="center">
      <view class="popup-content">
        <text class="popup-title">{{ previewImage.title }}</text>
        <image :src="previewImage.url" mode="scaleToFill" class="preview-image" />
        <view class="popup-close" @click="popupClose">关闭</view>
        <view class="popup-close" @click="removePicFile">删除</view>
        <view class="popup-close" @click="inputDialogToggle">更改图片名称</view>
        <view class="popup-close" @click="savePic">保存文件</view>
      </view>
    </uni-popup>
	<view>
		<uni-popup ref="inputDialog" type="dialog">
			<uni-popup-dialog ref="inputClose"  mode="input" title="输入内容" value="对话框预置提示内容!"
				:placeholder="UrlTitle" @confirm="editPicName">
			</uni-popup-dialog>
		</uni-popup>
	</view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import {onLoad} from '@dcloudio/uni-app';
import requestFast from '../../utils/requestFast';
import { useUploader } from '../../utils/useUploader';
import { showModal } from '../../utils/showModal';
import { showToast } from '../../utils/showToast';
import { watch } from 'vue';
import { API_BASE_URL } from '../../utils/config';
import { downloadFile } from '../../utils/downloadUtil';

const fm = ref(null)
const UrlName = ref(null)
const UrlTitle = ref(null)
const inputDialog = ref(null)
const allUri = ref(null)
const picFileName = ref(null)

onLoad(async(opt) => {
	fm.value = opt.fm
	await startup()
})

const { chooseFile, uploadFile, fileName } = useUploader(`${API_BASE_URL}/public/store/view/mod/uploadFile`, 'file');



const startup = async() => {
	await getPicList()
}

watch(fileName, async (newFile) => {
	  if (!newFile) return
	  const res = await showModal({ title: '是否上传？', content: `上传文件 ${fileName.value} 吗？` })
	  if (res) {
	    const _res = await uploadFile({fm:fm.value})
	    if (_res.code === 200) {
	      showToast({ title: '上传成功' })
	      await startup()
	    } else {
	      showToast({ title: '上传失败' })
	    }
	  }
	})

const getPicList = async() => {
	const res = await requestFast.post('/public/store/view/mod/getUserPicURIList', {fm: fm.value})
	if (res.code === 200) {
		images.value = []
		images.value = res.data
	}
}

const uploadPic = async() => {
	await chooseFile()
	watch(fileObj, async (newFile) => {
	  if (!newFile) return
	  const res = await showModal({ title: '是否上传？', content: `上传文件 ${fileName.value} 吗？` })
	  if (res) {
	    const _res = await uploadFile()
	    if (_res.code === 200) {
	      await showToast({ title: '上传成功' })
	      await startup()
	    } else {
	      showToast({ title: '上传失败' })
	    }
	  }
	})
}

// 模拟图片数据
const images = ref([
  
]);

// 弹窗
const imagePopup = ref(null);
const previewImage = ref({ url: '', title: '' });

const showImagePreview = (index) => {
  previewImage.value = images.value[index];
  
  var url = images.value[index].url
  UrlTitle.value = images.value[index].title
  allUri.value = url
  const prefix = '/static/'
  const indexs = url.indexOf(prefix)
  let baseUrl = ''
  if (indexs !== -1) {
    baseUrl = url.substring(indexs + prefix.length)
	UrlName.value = baseUrl
  }
  picFileName.value = baseUrl.split('/').pop()
  imagePopup.value.open();
};

const removePicFile = async() => {
	const res = await showModal({content: '确认删除此照片?'})
	if (!res) return;
	const _res = await requestFast.post('/public/store/view/mod/deleteUserPic', {name: UrlName.value})
	if (_res.code === 200) {
		await startup()
		imagePopup.value.close()
	}
}

const editPicName = async(e) => {
	const res = await requestFast.post('/public/store/view/mod/editUserPic', {uri: UrlName.value, name: e})
	if (res.code === 200) {
		showModal({content: '更改成功', showCancel: false})
		await startup()
		imagePopup.value.close()
	}
}

const savePic = async() => {
	await downloadFile(allUri.value, picFileName.value)
}

const popupClose = () => {
  imagePopup.value.close();
};

const inputDialogToggle = () => {
	inputDialog.value.open()
}

// 添加图片
const addImage = () => {
  
};

// 返回
const goBack = () => {
  uni.navigateBack();
};
</script>

<style>
.image-gallery {
  padding: 20rpx;
  background: #f5f5f5;
  min-height: 100vh;
}
.page-title {
  font-size: 40rpx;
  color: #333333;
  font-weight: bold;
  text-align: left;
  margin-bottom: 20rpx;
  position: relative;
  animation: fadeInTitle 0.6s ease-in;
}
.page-title::after {
  content: '';
  position: absolute;
  bottom: -4rpx;
  left: 0;
  width: 80rpx;
  height: 2rpx;
  background: linear-gradient(to right, #333333, transparent);
}
.back-btn {
  width: 120rpx;
  padding: 10rpx;
  background: #f8f8f8;
  border-radius: 8rpx;
  text-align: center;
  font-size: 26rpx;
  color: #666;
  margin-bottom: 20rpx;
  transition: background-color 0.2s ease, transform 0.2s ease;
}
.back-btn:active {
  background-color: #e0e0e0;
  transform: scale(0.95);
}
.add-btn {
  position: fixed;
  bottom: 40rpx;
  right: 40rpx;
  width: 100rpx;
  height: 100rpx;
  background: #f8f8f8;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  color: #2ecc71;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
  z-index: 1000;
  transition: background-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
  animation: float 2s ease-in-out infinite;
}
.add-btn:hover {
  box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.2);
}
.add-btn:active {
  background-color: #e0e0e0;
  transform: scale(0.95);
}
.gallery-section {
  background: #fff;
  border: 1rpx solid #e0e0e0;
  border-radius: 12rpx;
  padding: 20rpx;
  padding-bottom: 120rpx; /* 避免按钮遮挡 */
}
.masonry-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}
@media (min-width: 750rpx) {
  .masonry-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
.image-card {
  background: #fff;
  border-radius: 10rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.12);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  animation: fadeIn 0.5s ease-in;
}
.image-card:hover {
  transform: translateY(-4rpx);
  box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.15);
}
.image-card:active {
  transform: scale(0.98);
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
}
.image {
  width: 100%;
  display: block;
}
.image-title {
  font-size: 24rpx;
  color: #333;
  text-align: center;
  padding: 10rpx;
}
.popup-content {
  background: #fff;
  padding: 50rpx;
  border-radius: 10rpx;
  min-width: 70vw;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
}
.popup-title {
  font-size: 32rpx;
  color: #333;
  font-weight: bold;
  margin-bottom: 20rpx;
  position: relative;
}
.popup-title::after {
  content: '';
  position: absolute;
  bottom: -4rpx;
  left: 0;
  width: 100%;
  height: 1rpx;
  background: linear-gradient(to right, transparent, #2ecc71 20%, #2ecc71 80%, transparent);
}
.preview-image {
  width: 100%;
  max-height: 60vh;
  object-fit: contain;
  margin-bottom: 20rpx;
}
.popup-close {
  text-align: center;
  padding: 20rpx;
  color: #2ecc71;
  font-size: 26rpx;
  transition: transform 0.2s ease;
}
.popup-close:active {
  transform: scale(0.95);
}

/* 标题淡入动画 */
@keyframes fadeInTitle {
  from {
    opacity: 0;
    transform: translateY(10rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 卡片淡入动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 按钮悬浮动画 */
@keyframes float {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10rpx);
  }
  100% {
    transform: translateY(0);
  }
}
</style>
```