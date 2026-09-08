const mock = require('../../utils/mock-data.js')

Page({
  data: {
    rating: {}
  },

  onLoad() {
    this.setData({ rating: mock.dormRating })
  }
})
