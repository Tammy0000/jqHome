import { API_BASE_URL } from "./config";
import { getHeader } from './getHeader';  // 引入 getHeader 函数

// 请求封装
const request = (url, method = 'GET', data = {}, header = {}, showLoading = true) => {

  // 获取默认请求头并与自定义头合并
  const defaultHeader = getHeader(header);

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
      data: method === 'GET' ? data : JSON.stringify(data),
      header: defaultHeader,
      success: (res) => {
        uni.hideLoading();

        // 如果返回 403，表示 token 无效，跳转到登录页
        if (res.statusCode === 403) {
          uni.showToast({
            title: 'Token 无效，请重新登录',
            icon: 'none',
          });
          setTimeout(() => {
            uni.reLaunch({ url: '/pages/index/index' });  // 跳转到登录页
          }, 800);
          reject('Token 无效');
          return;
        }

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
          title: '服务器开小差了，稍后再试',
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
