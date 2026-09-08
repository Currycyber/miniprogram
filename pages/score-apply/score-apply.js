const { showToast } = require('../../utils/request.js')

Page({
  data: {
    category: 'moral',
    type: 'add',
    selectedItem: null,
    images: [],
    desc: '',
    itemOptions: [
      { name: '入党积极分子（考核合格）· 加 3 分', basis: '测评办法 第七条（二）1', score: 3 },
      { name: '中共党员（考核合格）· 加 5 分', basis: '测评办法 第七条（二）1', score: 5 },
      { name: '校（市）级表彰 · 加 10 分', basis: '测评办法 第七条（二）2', score: 10 },
      { name: '省级表彰 · 加 20 分', basis: '测评办法 第七条（二）2', score: 20 },
      { name: '思想政治理论课 90 分以上 · 加 5 分', basis: '测评办法 第七条（二）3', score: 5 }
    ]
  },

  selectCategory(e) {
    this.setData({ category: e.currentTarget.dataset.cat })
  },

  selectType(e) {
    this.setData({ type: e.currentTarget.dataset.type })
  },

  selectItem(e) {
    const idx = e.detail.value
    this.setData({ selectedItem: this.data.itemOptions[idx] })
  },

  chooseImage() {
    wx.chooseImage({
      count: 3,
      success: (res) => {
        this.setData({ images: this.data.images.concat(res.tempFilePaths) })
      }
    })
  },

  onDescInput(e) {
    this.setData({ desc: e.detail.value })
  },

  submit() {
    if (!this.data.selectedItem) {
      showToast('请选择加分项目')
      return
    }
    if (this.data.images.length === 0) {
      showToast('请上传证明材料')
      return
    }
    // 正式项目：调用云函数提交
    // wx.cloud.callFunction({ name: 'submitScore', data: {...} })
    showToast('申报已提交，等待审核', 'success')
    setTimeout(() => wx.navigateBack(), 1500)
  }
})
