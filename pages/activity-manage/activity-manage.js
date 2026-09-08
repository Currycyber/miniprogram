const { showToast } = require('../../utils/request.js')

Page({
  data: {
    activities: [
      { title: '民族团结联谊活动', location: '新泉社区1 · 1号楼大厅', time: '3月20日 19:00', registered: 82, capacity: 100, signed: 71, points: 2, percent: 82 },
      { title: '红色歌曲传唱展演', location: '高台校区礼堂', time: '3月25日 15:00', registered: 156, capacity: 200, signed: 120, points: 1, percent: 78 }
    ],
    form: {
      title: '',
      type: '讲座',
      points: 2
    }
  },

  onTitleInput(e) {
    this.setData({ 'form.title': e.detail.value })
  },

  onPointsInput(e) {
    this.setData({ 'form.points': e.detail.value })
  },

  selectType(e) {
    this.setData({ 'form.type': e.currentTarget.dataset.type })
  },

  publish() {
    if (!this.data.form.title) {
      showToast('请填写活动名称')
      return
    }
    showToast('活动已发布', 'success')
  }
})
