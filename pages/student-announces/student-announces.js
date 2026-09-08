// pages/student-announces/student-announces.js
// 学生端公告列表页：4 状态 tab（全部/未读/紧急/普通）+ 标记已读 + 全部已读

const mock = require('../../utils/mock-data.js')
const announceStorage = require('../../utils/announce-storage.js')

const TYPE_META = {
  notice:  { label: '通知', color: '#1989fa', icon: '通' },
  urgent:  { label: '紧急', color: '#FF3B30', icon: '急' },
  system:  { label: '系统', color: '#534ab7', icon: '系' }
}

Page({
  data: {
    filter: 'all',           // all / unread / urgent / normal
    list: [],
    counts: { all: 0, unread: 0, urgent: 0, normal: 0 }
  },

  onLoad() {
    this._render()
  },

  onShow() {
    this._render()
  },

  _render() {
    const { mockAnnouncements } = mock
    const published = mockAnnouncements
      .filter(a => a.status === 'published')
      .sort((a, b) => (b.publishedAt || '').localeCompare(a.publishedAt || ''))

    // 统计
    const counts = { all: published.length, unread: 0, urgent: 0, normal: 0 }
    published.forEach(a => {
      if (!announceStorage.isRead(a.id)) counts.unread++
      if (a.type === 'urgent') counts.urgent++
      else counts.normal++
    })

    // 当前 filter
    let list = published
    if (this.data.filter === 'unread') list = list.filter(a => !announceStorage.isRead(a.id))
    else if (this.data.filter === 'urgent') list = list.filter(a => a.type === 'urgent')
    else if (this.data.filter === 'normal') list = list.filter(a => a.type !== 'urgent')

    // 附加 meta
    list = list.map(a => ({
      ...a,
      read: announceStorage.isRead(a.id),
      typeMeta: TYPE_META[a.type] || TYPE_META.notice
    }))

    this.setData({ list, counts, filter: this.data.filter })
  },

  onFilterChange(e) {
    this.setData({ filter: e.currentTarget.dataset.key })
    this._render()
  },

  onItemTap(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({ url: `/pages/student-announce-detail/student-announce-detail?id=${id}` })
  },

  onMarkAllRead() {
    const { mockAnnouncements } = mock
    const published = mockAnnouncements.filter(a => a.status === 'published')
    announceStorage.markAllRead(published)
    this._render()
    wx.showToast({ title: '已全部标记为已读', icon: 'success' })
  }
})
