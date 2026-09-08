// pages/admin-announce/admin-announce.js
// 公告发布：列表（全部/草稿/已发布/已下线）+ 状态切换 + 新建

const mock = require('../../utils/mock-data.js')

const TABS = [
  { key: 'all', label: '全部' },
  { key: 'draft', label: '草稿' },
  { key: 'published', label: '已发布' },
  { key: 'offline', label: '已下线' }
]

const TYPES = [
  { key: 'notice', label: '通知' },
  { key: 'urgent', label: '紧急' },
  { key: 'system', label: '系统' }
]

Page({
  data: {
    tabs: TABS,
    tabIdx: 0,
    types: TYPES,
    list: [],
    filtered: [],
    stats: { draft: 0, published: 0, offline: 0 }
  },

  onLoad() {
    const list = mock.mockAnnouncements
    this._updateStats(list)
    this.setData({ list, filtered: list })
  },

  // tab 切换
  onTabChange(e) {
    const idx = e.currentTarget.dataset.idx
    this.setData({ tabIdx: idx })
    this._applyFilter()
  },

  _applyFilter() {
    const { list, tabIdx } = this.data
    const key = TABS[tabIdx].key
    const filtered = key === 'all' ? list : list.filter(a => a.status === key)
    this.setData({ filtered })
  },

  _updateStats(list) {
    const stats = { draft: 0, published: 0, offline: 0 }
    list.forEach(a => { if (stats[a.status] !== undefined) stats[a.status]++ })
    this.setData({ stats })
  },

  // 发布
  onPublish(e) {
    const id = e.currentTarget.dataset.id
    const list = this.data.list.map(a => {
      if (a.id !== id) return a
      const now = this._nowStr()
      return { ...a, status: 'published', publishedAt: a.publishedAt || now }
    })
    this._updateStats(list)
    this.setData({ list })
    this._applyFilter()
    wx.showToast({ title: '已发布', icon: 'success' })
  },

  // 下线
  onOffline(e) {
    const id = e.currentTarget.dataset.id
    const list = this.data.list.map(a => a.id === id ? { ...a, status: 'offline' } : a)
    this._updateStats(list)
    this.setData({ list })
    this._applyFilter()
    wx.showToast({ title: '已下线', icon: 'success' })
  },

  // 删除（弹确认）
  onDelete(e) {
    const id = e.currentTarget.dataset.id
    const target = this.data.list.find(a => a.id === id)
    if (!target) return
    wx.showModal({
      title: '确认删除',
      content: `删除公告「${target.title}」？删除后不可恢复。`,
      confirmColor: '#e64340',
      success: (res) => {
        if (res.confirm) {
          const list = this.data.list.filter(a => a.id !== id)
          this._updateStats(list)
          this.setData({ list })
          this._applyFilter()
          wx.showToast({ title: '已删除', icon: 'success' })
        }
      }
    })
  },

  // 查看详情
  onViewDetail(e) {
    const id = e.currentTarget.dataset.id
    const a = this.data.list.find(x => x.id === id)
    if (!a) return
    const statusText = { draft: '草稿', published: '已发布', offline: '已下线' }[a.status]
    wx.showModal({
      title: a.title,
      content:
        `类型：${a.typeLabel}\n` +
        `状态：${statusText}\n` +
        `作者：${a.author}\n` +
        `创建：${a.createdAt}\n` +
        `发布：${a.publishedAt || '—'}\n\n` +
        `${a.content}`,
      showCancel: false,
      confirmText: '关闭'
    })
  },

  // 新建公告
  onNew() {
    wx.showModal({
      title: '新建公告',
      editable: true,
      placeholderText: '请输入公告标题',
      content: '',
      confirmText: '下一步',
      success: (res) => {
        if (!res.confirm || !res.content) return
        const title = res.content.trim()
        this._selectTypeAndCreate(title)
      }
    })
  },

  _selectTypeAndCreate(title) {
    wx.showActionSheet({
      itemList: TYPES.map(t => t.label),
      success: (res) => {
        const type = TYPES[res.tapIndex]
        this._inputContentAndCreate(title, type)
      }
    })
  },

  _inputContentAndCreate(title, type) {
    wx.showModal({
      title: '编辑正文',
      editable: true,
      placeholderText: '请输入公告正文（不超过 200 字）',
      content: '',
      confirmText: '发布为草稿',
      success: (res) => {
        if (!res.confirm) return
        const content = res.content.trim() || '（暂无正文）'
        const now = this._nowStr()
        const newItem = {
          id: 'a' + Date.now(),
          title,
          type: type.key,
          typeLabel: type.label,
          content: content.length > 200 ? content.slice(0, 200) + '…' : content,
          author: 'admin',
          createdAt: now,
          publishedAt: null,
          status: 'draft'
        }
        const list = [newItem, ...this.data.list]
        this._updateStats(list)
        this.setData({ list })
        this._applyFilter()
        wx.showToast({ title: '已存为草稿', icon: 'success' })
      }
    })
  },

  _nowStr() {
    const d = new Date()
    const pad = (n) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
  },

  goBack() {
    wx.navigateBack({ delta: 1, fail: () => {
      wx.redirectTo({ url: '/pages/admin-dashboard/admin-dashboard' })
    } })
  }
})