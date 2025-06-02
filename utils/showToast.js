// 封装的 showToast 方法
export const showToast = ({ 
  title = '', // 提示内容
  icon = 'none', // 图标类型, 默认为 none: 不显示图标, 可选值有 success, error, loading, none
  duration = 1500, // 持续时间，单位 ms，默认为1500ms
  mask = false // 是否显示透明蒙层，防止触摸穿透，默认为 false
} = {}) => {
  uni.showToast({
    title,
    icon,
    duration,
    mask
  });
};