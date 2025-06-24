// utils/auth.js
import requestFast from "./requestFast"

export async function checkLogin(isNaviBack = false) {
  const token = uni.getStorageSync('token')  // 获取本地存储的 token
  
  if (!token) {
	  return false
  }

  const res = await requestFast.post('/public/store/view/mod/checkToken')
  if (res.code === 200) {
	  return true
  }

  return false
}
