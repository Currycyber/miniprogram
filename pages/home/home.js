const mock = require('../../utils/mock-data.js')
const announceStorage = require('../../utils/announce-storage.js')

Page({
  data: {
    student: {},
    result: {},
    dormRating: {},
    activities: [],
    wuyuTop: [],
    wuyuBottom: [],
    // 公告相关
    topAnnouncements: [],   // 顶部展示前 2 条
    unreadCount: 0
  },

  onLoad() {
    const { student, scoreResult, dormRating, activities, mockAnnouncements } = mock

    // 已发布公告按时间倒序，附是否已读
    const published = mockAnnouncements
      .filter(a => a.status === 'published')
      .sort((a, b) => (b.publishedAt || '').localeCompare(a.publishedAt || ''))
    const unreadCount = announceStorage.countUnread(published)
    const top = published.slice(0, 2).map(a => ({
      ...a,
      read: announceStorage.isRead(a.id)
    }))

    this.setData({
      student,
      result: scoreResult,
      dormRating,
      activities,
      topAnnouncements: top,
      unreadCount,
      wuyuTop: [
        { name: '德育', value: scoreResult.moral.total, color: '#085041' },
        { name: '智育', value: scoreResult.intellectual.total, color: '#0C447C' },
        { name: '体育', value: scoreResult.physical.total, color: '#993C1D' }
      ],
      wuyuBottom: [
        { name: '美育', value: scoreResult.aesthetic.total, color: '#3C3489' },
        { name: '劳育', value: scoreResult.labor.total, color: '#854F0B' }
      ]
    })
  },

  // 每次回到首页都重算未读（详情页标记已读后回到这里能看到红点消失）
  onShow() {
    const { mockAnnouncements } = mock
    const published = mockAnnouncements
      .filter(a => a.status === 'published')
      .sort((a, b) => (b.publishedAt || '').localeCompare(a.publishedAt || ''))
    const unreadCount = announceStorage.countUnread(published)
    const top = published.slice(0, 2).map(a => ({
      ...a,
      read: announceStorage.isRead(a.id)
    }))
    this.setData({ unreadCount, topAnnouncements: top })
  },

  gotoApply() {
    wx.navigateTo({ url: '/pages/score-apply/score-apply' })
  },

  gotoReport() {
    wx.switchTab({ url: '/pages/report/report' })
  },

  gotoDorm() {
    wx.switchTab({ url: '/pages/dorm/dorm' })
  },

  gotoAdminLogin() {
    wx.navigateTo({ url: '/pages/admin-login/admin-login' })
  },

  gotoAnnounces() {
    wx.navigateTo({ url: '/pages/student-announces/student-announces' })
  },

  // 点击顶部公告摘要 → 跳到详情页
  onAnnounceTap(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({ url: `/pages/student-announce-detail/student-announce-detail?id=${id}` })
  }
})
