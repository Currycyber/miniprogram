// pages/admin-params/admin-params.js
// 测评参数配置：五育权重 + 加减分规则 + 加分上限 + 修改历史

const mock = require('../../utils/mock-data.js')

const WUYU_META = [
  { key: 'moral', label: '德育', icon: '德', color: '#534ab7' },
  { key: 'intellectual', label: '智育', icon: '智', color: '#1989fa' },
  { key: 'physical', label: '体育', icon: '体', color: '#07c160' },
  { key: 'aesthetic', label: '美育', icon: '美', color: '#FF9500' },
  { key: 'labor', label: '劳育', icon: '劳', color: '#9c27b0' }
]

const DEFAULT_PARAMS = JSON.parse(JSON.stringify(mock.defaultParams))

Page({
  data: {
    wuyuMeta: WUYU_META,
    weights: { ...mock.defaultParams.weights },
    rules: mock.defaultParams.rules,
    limits: { ...mock.defaultParams.limits },
    history: mock.defaultParams.history,
    weightsSum: 0,
    weightsValid: true,
    dirty: false
  },

  onLoad() {
    this._recalcSum()
  },

  // 权重滑杆变化
  onWeightChange(e) {
    const key = e.currentTarget.dataset.key
    const val = Number(e.detail.value)
    const weights = { ...this.data.weights, [key]: val }
    this.setData({ weights, dirty: true })
    this._recalcSum()
  },

  _recalcSum() {
    const w = this.data.weights
    const sum = w.moral + w.intellectual + w.physical + w.aesthetic + w.labor
    const weightsValid = sum === 100
    this.setData({ weightsSum: sum, weightsValid })
  },

  // 加分上限变化
  onLimitChange(e) {
    const key = e.currentTarget.dataset.key
    const val = Number(e.detail.value)
    const limits = { ...this.data.limits, [key]: val }
    this.setData({ limits, dirty: true })
  },

  // 保存（演示阶段：仅写入 history 弹 Toast）
  onSave() {
    if (!this.data.weightsValid) {
      wx.showToast({ title: '权重合计必须等于 100', icon: 'none' })
      return
    }
    const w = this.data.weights
    const sum = w.moral + w.intellectual + w.physical + w.aesthetic + w.labor
    const oldSum = `${this.data.weights.moral}/${this.data.weights.intellectual}/${this.data.weights.physical}/${this.data.weights.aesthetic}/${this.data.weights.labor}`
    const newSum = `${w.moral}/${w.intellectual}/${w.physical}/${w.aesthetic}/${w.labor}`
    const desc = oldSum === newSum
      ? `更新加分上限：每年 ${this.data.limits.yearMax}、单类 ${this.data.limits.perCategoryMax}`
      : `调整五育权重：${oldSum} → ${newSum}`
    const history = [
      {
        time: this._nowStr(),
        operator: 'admin',
        desc
      },
      ...this.data.history
    ]
    this.setData({ history, dirty: false })
    wx.showToast({ title: '保存成功', icon: 'success' })
  },

  // 重置默认
  onReset() {
    wx.showModal({
      title: '恢复默认参数',
      content: '当前所有未保存的修改将丢失，是否恢复默认？',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            weights: { ...DEFAULT_PARAMS.weights },
            rules: DEFAULT_PARAMS.rules,
            limits: { ...DEFAULT_PARAMS.limits },
            dirty: false
          })
          this._recalcSum()
          wx.showToast({ title: '已恢复默认', icon: 'success' })
        }
      }
    })
  },

  _nowStr() {
    const d = new Date()
    const pad = (n) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
  }
})