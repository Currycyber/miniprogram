const { showToast } = require('../../utils/request.js')

Page({
  data: {},

  publishAll() {
    showToast('全院公示已发布', 'success')
  },

  reportToParty() {
    showToast('已报党委学生工作部备案', 'success')
  }
})
