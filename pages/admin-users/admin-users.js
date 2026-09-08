// pages/admin-users/admin-users.js
// 用户与角色管理：列表 + 搜索 + 角色筛选 + 启停

const mock = require('../../utils/mock-data.js')

// 角色筛选配置
const ROLE_FILTERS = [
  { key: 'all', label: '全部' },
  { key: 'student', label: '学生' },
  { key: 'monitor', label: '班委' },
  { key: 'counselor', label: '辅导员' },
  { key: 'college', label: '学院' },
  { key: 'dorm', label: '宿管' }
]

// 状态筛选配置
const STATUS_FILTERS = [
  { key: 'all', label: '全部' },
  { key: 'active', label: '启用' },
  { key: 'disabled', label: '停用' }
]

Page({
  data: {
    roleFilters: ROLE_FILTERS,
    statusFilters: STATUS_FILTERS,
    roleIdx: 0,         // 当前角色 tab
    statusIdx: 0,       // 当前状态 tab
    keyword: '',        // 搜索关键词
    users: [],          // 完整列表（首次从 mock 加载）
    filtered: [],       // 过滤后列表
    totalActive: 0,     // 启用数
    totalDisabled: 0    // 停用数
  },

  onLoad() {
    const users = mock.mockUsers
    const totalActive = users.filter(u => u.status === 'active').length
    const totalDisabled = users.filter(u => u.status === 'disabled').length
    this.setData({
      users,
      filtered: users,
      totalActive,
      totalDisabled
    })
  },

  // 角色筛选切换
  onRoleFilter(e) {
    const idx = e.currentTarget.dataset.idx
    this.setData({ roleIdx: idx })
    this._applyFilter()
  },

  // 状态筛选切换
  onStatusFilter(e) {
    const idx = e.currentTarget.dataset.idx
    this.setData({ statusIdx: idx })
    this._applyFilter()
  },

  // 搜索框输入
  onKeywordInput(e) {
    this.setData({ keyword: e.detail.value })
    this._applyFilter()
  },

  // 清空搜索
  onClearKeyword() {
    this.setData({ keyword: '' })
    this._applyFilter()
  },

  // 综合过滤
  _applyFilter() {
    const { users, roleIdx, statusIdx, keyword } = this.data
    const roleKey = ROLE_FILTERS[roleIdx].key
    const statusKey = STATUS_FILTERS[statusIdx].key
    const kw = keyword.trim().toLowerCase()

    const filtered = users.filter(u => {
      if (roleKey !== 'all' && u.role !== roleKey) return false
      if (statusKey !== 'all' && u.status !== statusKey) return false
      if (kw) {
        const text = (u.name + u.identifier + u.college).toLowerCase()
        if (!text.includes(kw)) return false
      }
      return true
    })
    this.setData({ filtered })
  },

  // 切换启停
  onToggleStatus(e) {
    const id = e.currentTarget.dataset.id
    const users = this.data.users.map(u => {
      if (u.id !== id) return u
      return { ...u, status: u.status === 'active' ? 'disabled' : 'active' }
    })
    const totalActive = users.filter(u => u.status === 'active').length
    const totalDisabled = users.filter(u => u.status === 'disabled').length
    this.setData({ users, totalActive, totalDisabled })
    this._applyFilter()
    wx.showToast({
      title: '状态已更新',
      icon: 'success',
      duration: 1200
    })
  },

  // 返回看板
  goBack() {
    wx.navigateBack({ delta: 1, fail: () => {
      wx.redirectTo({ url: '/pages/admin-dashboard/admin-dashboard' })
    } })
  },

  // 查看详情（弹层）
  onViewDetail(e) {
    const id = e.currentTarget.dataset.id
    const user = this.data.users.find(u => u.id === id)
    if (!user) return
    wx.showModal({
      title: user.name + '（' + user.roleLabel + '）',
      content:
        '学号/工号：' + user.identifier +
        '\n所属学院：' + user.college +
        '\n联系电话：' + user.phone +
        '\n加入时间：' + user.joinedAt +
        '\n当前状态：' + (user.status === 'active' ? '启用' : '停用'),
      showCancel: false,
      confirmText: '关闭'
    })
  }
})