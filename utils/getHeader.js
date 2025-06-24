// utils/getHeader.js
export function getHeader(customHeader = {}) {
  const token = uni.getStorageSync('token');  // 获取本地存储的 token
  
  // 默认请求头，Authorization 会自动添加 token
  const defaultHeader = {
    'Content-Type': 'application/json',
    'Authorization': token ? token : '',
  };
  
  // 将用户传入的 header 与默认 header 合并
  return { ...defaultHeader, ...customHeader };
}
