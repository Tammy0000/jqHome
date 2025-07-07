// utils/download-util.js

/**
 * 通用下载方法，自动判断平台（H5 / App / 小程序）
 * @param {string} url 下载地址
 * @param {string} fileName 文件名（带扩展名）
 */
export function downloadFile(url, fileName = 'download.xlsx') {
  // #ifdef H5
    fetch(url, {
      method: 'GET',
      headers: {
        // 如果后端接口需要 token 可以加上
        // 'Authorization': 'Bearer ' + token
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('下载失败');
        }
  
        // 尝试从响应头中提取文件名（适配你的SpringBoot返回）
        const disposition = response.headers.get('Content-Disposition');
        if (disposition && disposition.indexOf('filename=') !== -1) {
          const match = disposition.match(/filename\*?=([^;]+)/);
          if (match && match[1]) {
            try {
              fileName = decodeURIComponent(match[1].replace(/utf-8''/, '').replace(/"/g, ''));
            } catch (_) {}
          }
        }
  
        return response.blob();
      })
      .then(blob => {
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(blobUrl);
      })
      .catch(err => {
        console.error('H5 下载失败:', err);
        uni.showToast({ title: '下载失败', icon: 'none' });
      });
    // #endif
  
    // #ifdef MP-WEIXIN || APP-PLUS
    uni.downloadFile({
      url,
      success: (res) => {
        if (res.statusCode === 200) {
          // #ifdef APP-PLUS
          plus.runtime.openFile(res.tempFilePath);
          // #endif
  
          // #ifdef MP-WEIXIN
          uni.saveFile({
            tempFilePath: res.tempFilePath,
            success: function(saveRes) {
              uni.showToast({ title: '已保存', icon: 'success' });
            },
            fail: function() {
              uni.showToast({ title: '保存失败', icon: 'none' });
            }
          });
          // #endif
        } else {
          uni.showToast({ title: '下载失败', icon: 'none' });
        }
      },
      fail: (err) => {
        console.error('下载失败:', err);
        uni.showToast({ title: '下载失败', icon: 'none' });
      }
    });
    // #endif
}
