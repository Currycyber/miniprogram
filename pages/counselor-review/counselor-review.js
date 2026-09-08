const mock = require('../../utils/mock-data.js')
const { showToast } = require('../../utils/request.js')

Page({
  data: {
    reviews: [],
    pendingCount: 0
  },

  onLoad() {
    this.setData({
      reviews: mock.pendingReviews,
      pendingCount: mock.pendingReviews.length
    })
  },

  pass(e) {
    const id = e.currentTarget.dataset.id
    const reviews = this.data.reviews.filter(r => r.id !== id)
    this.setData({ reviews, pendingCount: reviews.length })
    showToast('已通过', 'success')
  },

  reject(e) {
    const id = e.currentTarget.dataset.id
    const reviews = this.data.reviews.filter(r => r.id !== id)
    this.setData({ reviews, pendingCount: reviews.length })
    showToast('已驳回')
  }
})
