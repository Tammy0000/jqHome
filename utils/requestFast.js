import { API_BASE_URL } from "./config";

// 请求封装
const request = (url, method = 'GET', data = {}, header = {}, showLoading = true) => {
  // 设置默认请求头
  const defaultHeader = {
    'Content-Type': 'application/json',
	'Authorization': uni.getStorageSync('token'),
    ...header,
  };

  // 显示加载提示
  if (showLoading) {
    uni.showLoading({
      title: '加载中...',
    });
  }

  return new Promise((resolve, reject) => {
    uni.request({
      url: `${API_BASE_URL}${url}`,
      method: method,
      data: method === 'GET' ? data : JSON.stringify(data), // 如果是GET请求，直接传递参数；POST请求转换为JSON字符串
      header: defaultHeader,
      success: (res) => {
        // 请求成功后隐藏加载提示
        uni.hideLoading();

        // 判断接口返回状态
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(res);
          uni.showToast({
            title: res.data.message || '服务器开小差了，稍后再试!',
            icon: 'none',
          });
        }
      },
      fail: (err) => {
        uni.hideLoading();
        reject(err);
        uni.showToast({
          title: '请求失败，请检查网络连接',
          icon: 'none',
        });
      },
    });
  });
};

// 导出封装的请求工具
export default {
  get(url, data = {}, header = {}, showLoading = true) {
    return request(url, 'GET', data, header, showLoading);
  },
  post(url, data = {}, header = {}, showLoading = true) {
    return request(url, 'POST', data, header, showLoading);
  },
};
