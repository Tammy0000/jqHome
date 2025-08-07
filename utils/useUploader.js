import { ref } from 'vue';
import { getHeader } from './getHeader'; 

/**
 * useUploader 封装
 * @param {string} uploadUrl 上传接口地址
 * @param {string} fieldName 文件字段名，默认 'file'
 */
export function useUploader(uploadUrl, fieldName = 'file') {
  const fileObj = ref(null)
  const fileName = ref('')

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

  /**
   * 上传文件（支持动态传入额外参数）
   * @param {Object} extraData 附加字段，如 { fm: 'xxx', userId: '123' }
   * @returns 上传结果 JSON
   */
  const uploadFile = async (extraData = {}) => {
    if (!fileObj.value) {
      alert('请选择文件')
      return null
    }

    const formData = new FormData()
    formData.append(fieldName, fileObj.value)

    // 添加额外字段
    for (const [key, value] of Object.entries(extraData)) {
      formData.append(key, value)
    }

    try {
	  const token = uni.getStorageSync('token');
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
		headers: {
			'Authorization': token ? token : ''
		}
      })
      return await response.json()
    } catch (error) {
      console.error('上传失败', error)
      throw error
    }
  }

  return {
    fileObj,
    fileName,
    chooseFile,
    uploadFile
  }
}
