import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    isLogin: false,
    userInfo: {
      avatar: '/static/avatars/default-avatar.jpg',
      username: '用户昵称',
      userId: '123456789',
      phone: '138****8888'
    }
  }),
  getters: {
    // 检查用户是否登录
    isAuthenticated: (state) => state.isLogin
  },
  actions: {
    // 登录方法
    login(userData) {
      this.isLogin = true;
      this.userInfo = userData;
    },
    // 登出方法
    logout() {
      this.isLogin = false;
      this.userInfo = {
        avatar: '/static/avatars/default-avatar.jpg',
        username: '用户昵称',
        userId: '123456789',
        phone: '138****8888'
      };
    },
    // 更新用户信息
    updateUserInfo(newUserInfo) {
      this.userInfo = { ...this.userInfo, ...newUserInfo };
    }
  }
});
