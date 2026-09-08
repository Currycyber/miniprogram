// utils/auth.js
// 管理员登录态管理（学生端走微信授权，不走这里）

const ADMIN_TOKEN_KEY = 'adminToken'
const ADMIN_USER_KEY = 'adminUser'

// 演示账号清单（正式项目：调用 wx.cloud.callFunction 验证用户名密码 + 加密 token）
const ADMIN_ACCOUNTS = [
  { username: 'admin', password: 'admin123', name: '系统管理员', role: 'admin' },
  { username: 'xgb', password: 'xgb123', name: '学工部', role: 'admin' }
]

/**
 * 登录校验（演示用，本地校验）
 * @returns {Promise<{ok: boolean, user?: object, msg?: string}>}
 */
function login(username, password) {
  return new Promise(resolve => {
    setTimeout(() => {
      const found = ADMIN_ACCOUNTS.find(
        a => a.username === username && a.password === password
      )
      if (found) {
        const token = 'admin-' + username + '-' + Date.now()
        const user = { username: found.username, name: found.name, role: found.role }
        wx.setStorageSync(ADMIN_TOKEN_KEY, token)
        wx.setStorageSync(ADMIN_USER_KEY, user)
        resolve({ ok: true, user, token })
      } else {
        resolve({ ok: false, msg: '账号或密码错误' })
      }
    }, 300)
  })
}

/** 退出登录 */
function logout() {
  wx.removeStorageSync(ADMIN_TOKEN_KEY)
  wx.removeStorageSync(ADMIN_USER_KEY)
}

/** 取当前登录态 */
function getSession() {
  const token = wx.getStorageSync(ADMIN_TOKEN_KEY)
  const user = wx.getStorageSync(ADMIN_USER_KEY)
  return { token: token || null, user: user || null }
}

/** 是否已登录 */
function isLoggedIn() {
  return !!wx.getStorageSync(ADMIN_TOKEN_KEY)
}

module.exports = {
  login,
  logout,
  getSession,
  isLoggedIn
}