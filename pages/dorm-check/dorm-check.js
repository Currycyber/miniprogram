const { showToast } = require('../../utils/request.js')

Page({
  data: {
    totalScore: 20,
    items: [
      {
        name: '文明安全强（20 分）',
        desc: '无大功率电器、无乱拉电线、消防合规',
        deducted: 0,
        options: [
          { label: '合规', deduct: 0 },
          { label: '有隐患', deduct: 1 },
          { label: '违禁物品', deduct: 5 }
        ]
      },
      {
        name: '卫生环境优（15 分）',
        desc: '地面整洁、物品摆放、卧具叠放',
        deducted: 0,
        options: [
          { label: '整洁', deduct: 0 },
          { label: '一般', deduct: 2 },
          { label: '脏乱', deduct: 4 }
        ]
      },
      {
        name: '思想品德强（20 分）',
        desc: '尊敬师长、服从管理、无不良影响',
        deducted: 0,
        options: [
          { label: '良好', deduct: 0 },
          { label: '一般', deduct: 1 },
          { label: '违纪', deduct: 20 }
        ]
      }
    ]
  },

  selectOption(e) {
    const { index, optIndex } = e.currentTarget.dataset
    const items = this.data.items
    const item = items[index]

    // 更新选中状态
    item.options = item.options.map((o, i) => ({
      ...o,
      active: i === optIndex
    }))
    item.deducted = item.options[optIndex].deduct

    // 重新计算总分
    let totalScore = 0
    for (const it of items) {
      totalScore += (20 - (it.deducted || 0))
    }

    this.setData({ items, totalScore })
  },

  takePhoto() {
    wx.chooseImage({
      count: 1,
      success: () => showToast('已拍照留证', 'success')
    })
  },

  submit() {
    showToast('评分已提交', 'success')
  }
})
