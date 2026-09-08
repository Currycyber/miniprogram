const { showToast } = require('../../utils/request.js')

Page({
  data: {
    totalStudents: 42,
    submitted: 35,
    pending: 7,
    remaining: 7,
    progressPercent: 83,
    reviews: [
      { id: 'r1', name: '阿依古丽', category: '德育加分', detail: '入党积极分子 · 加 3 分', status: 'pending' },
      { id: 'r2', name: '买买提', category: '智育加分', detail: '英语四级（二年级）· 加 4 分', status: 'done' }
    ]
  },

  pass(e) {
    const id = e.currentTarget.dataset.id
    const reviews = this.data.reviews.map(r =>
      r.id === id ? { ...r, status: 'done' } : r
    )
    this.setData({ reviews, pending: this.data.pending - 1 })
    showToast('已确认通过', 'success')
  },

  reject(e) {
    const id = e.currentTarget.dataset.id
    const reviews = this.data.reviews.filter(r => r.id !== id)
    this.setData({ reviews, pending: this.data.pending - 1 })
    showToast('已退回')
  },

  remindAll() {
    showToast('已向未提交同学发送提醒', 'success')
  },

  submitToCounselor() {
    if (this.data.pending > 0) {
      showToast('仍有待核对项目，请先核对完成')
      return
    }
    showToast('已上报辅导员审核', 'success')
  }
})
