// pages/admin-login/admin-login.js
// 管理员登录（独立入口，账号密码）

const { login } = require('../../utils/auth.js')

Page({
  data: {
    username: '',
    password: '',
    showPwd: false,
    submitting: false
  },

  onUsernameInput(e) {
    this.setData({ username: e.detail.value })
  },

  onPasswordInput(e) {
    this.setData({ password: e.detail.value })
  },

  togglePwd() {
    this.setData({ showPwd: !this.data.showPwd })
  },

  async onSubmit() {
    const { username, password } = this.data
    if (!username.trim()) {
      wx.showToast({ title: '请输入账号', icon: 'none' })
      return
    }
    if (!password) {
      wx.showToast({ title: '请输入密码', icon: 'none' })
      return
    }

    this.setData({ submitting: true })
    const res = await login(username.trim(), password)
    this.setData({ submitting: false })

    if (res.ok) {
      wx.showToast({ title: '登录成功', icon: 'success' })
      setTimeout(() => {
        wx.redirectTo({ url: '/pages/admin-dashboard/admin-dashboard' })
      }, 600)
    } else {
      wx.showToast({ title: res.msg || '登录失败', icon: 'none' })
    }
  },

  // 填充演示账号（仅开发用）
  fillDemo() {
    this.setData({ username: 'admin', password: 'admin123' })
  },

  goBack() {
    wx.navigateBack({ fail: () => wx.switchTab({ url: '/pages/home/home' }) })
  }
})