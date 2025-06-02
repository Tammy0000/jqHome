// utils.js
export function showModal(options) {
  return new Promise((resolve, reject) => {
    uni.showModal({
      title: options.title || '',
      content: options.content || '',
      showCancel: options.showCancel !== undefined ? options.showCancel : true,
      cancelText: options.cancelText || '取消',
      confirmText: options.confirmText || '确定',
      success: (res) => {
        if (res.confirm) {
          resolve(true);
        } else if (res.cancel) {
          resolve(false);
        }
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
}
