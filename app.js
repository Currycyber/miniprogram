// app.js
App({
  globalData: {
    openid: null,
    userInfo: null,
    // 当前演示角色：student / monitor / counselor / admin / dorm / youthLeague
    role: 'student',
    // 管理员登录态（账号密码登录后写入）
    adminToken: null,
    adminUser: null
  },

  onLaunch() {
    // 读取本地缓存的用户信息
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.globalData.userInfo = userInfo
    }

    // 读取管理员登录态（如已登录则恢复）
    const adminToken = wx.getStorageSync('adminToken')
    const adminUser = wx.getStorageSync('adminUser')
    if (adminToken) {
      this.globalData.adminToken = adminToken
      this.globalData.adminUser = adminUser || null
    }

    // 初始化演示数据（正式项目此处调用云函数 login 获取 openid）
    this.initMockLogin()
  },

  // 模拟登录：正式项目用 wx.cloud.callFunction({ name: 'login' })
  initMockLogin() {
    this.globalData.openid = 'mock-openid-' + Date.now()
  },

  // 切换演示角色（方便答辩时演示不同端的页面）
  switchRole(role) {
    this.globalData.role = role
  },

  // 写入管理员登录态
  setAdminSession(token, user) {
    this.globalData.adminToken = token
    this.globalData.adminUser = user
    wx.setStorageSync('adminToken', token)
    wx.setStorageSync('adminUser', user)
  },

  // 清除管理员登录态
  clearAdminSession() {
    this.globalData.adminToken = null
    this.globalData.adminUser = null
    wx.removeStorageSync('adminToken')
    wx.removeStorageSync('adminUser')
  }
})