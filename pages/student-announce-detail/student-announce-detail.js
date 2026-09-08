// pages/student-announce-detail/student-announce-detail.js
// 学生端公告详情页：取 URL id 参数查公告 + 进入时自动标记已读

const mock = require('../../utils/mock-data.js')
const announceStorage = require('../../utils/announce-storage.js')

const TYPE_META = {
  notice:  { label: '通知', color: '#1989fa' },
  urgent:  { label: '紧急', color: '#FF3B30' },
  system:  { label: '系统', color: '#534ab7' }
}

Page({
  data: {
    item: null,
    read: false
  },

  onLoad(query) {
    const id = query.id
    const found = mock.mockAnnouncements.find(a => a.id === id)
    if (!found) {
      wx.showToast({ title: '公告不存在', icon: 'none' })
      setTimeout(() => wx.navigateBack(), 800)
      return
    }
    // 进入即标记已读
    announceStorage.markRead(id)
    const typeMeta = TYPE_META[found.type] || TYPE_META.notice
    this.setData({
      item: { ...found, typeMeta },
      read: true
    })
    // 动态修改标题
    wx.setNavigationBarTitle({ title: found.typeLabel || '公告详情' })
  },

  onShareAppMessage() {
    if (!this.data.item) return {}
    return {
      title: this.data.item.title,
      path: `/pages/student-announce-detail/student-announce-detail?id=${this.data.item.id}`
    }
  }
})
