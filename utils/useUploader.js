// useUploader.js
import { ref } from 'vue'

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

  const uploadFile = async () => {
    if (!fileObj.value) {
      alert('请选择文件')
      return null
    }

    const formData = new FormData()
    formData.append(fieldName, fileObj.value)

    try {
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData
      })
      return await response.json()
    } catch (error) {
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
