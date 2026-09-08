// pages/report/report.js
// 个人成长报告：支持 3 学年切换 + 雷达图加载动画 + 五维明细弹层

const mock = require('../../utils/mock-data.js')

// 五育维度定义（key 须与 mock.scoreHistory 字段名一致）
const DIMENSIONS = [
  { key: 'moral', name: '德育', weight: '30%' },
  { key: 'intellectual', name: '智育', weight: '30%' },
  { key: 'physical', name: '体育', weight: '15%' },
  { key: 'aesthetic', name: '美育', weight: '10%' },
  { key: 'labor', name: '劳育', weight: '15%' }
]

const YEARS = ['2021-2022', '2022-2023', '2023-2024']

Page({
  data: {
    years: YEARS,
    yearOptions: [],
    currentYear: '2023-2024',
    result: {},
    dimensions: [],
    addCount: 0,
    deductCount: 0,
    detail: {
      visible: false,
      name: '',
      weight: '',
      data: {}
    }
  },

  onReady() {
    this.setData({
      yearOptions: YEARS.map(y => ({ year: y, active: y === this.data.currentYear }))
    })
    this.loadYear(this.data.currentYear, true)
  },

  onUnload() {
    if (this._rafId) {
      cancelAnimationFrame(this._rafId)
      this._rafId = null
    }
  },

  // 切换学年
  switchYear(e) {
    const year = e.currentTarget.dataset.year
    if (!year || year === this.data.currentYear) return
    this.setData({
      yearOptions: YEARS.map(y => ({ year: y, active: y === year })),
      currentYear: year
    })
    this.loadYear(year, true)
  },

  // 加载指定学年数据并重绘雷达图
  loadYear(year, animate) {
    const result = mock.scoreHistory[year] || mock.scoreResult
    const dimensions = DIMENSIONS.map(d => ({
      key: d.key,
      name: d.name,
      weight: d.weight,
      total: result[d.key].total,
      base: result[d.key].base,
      add: result[d.key].add,
      deduct: result[d.key].deduct
    }))
    const addCount = dimensions.filter(x => x.add > 0).length
    const deductCount = dimensions.filter(x => x.deduct > 0).length
    this.setData({ result, dimensions, addCount, deductCount })
    this.drawRadar(dimensions.map(x => x.total), animate)
  },

  // 点击五维明细行：弹出明细层
  showDimensionDetail(e) {
    const key = e.currentTarget.dataset.key
    const dim = DIMENSIONS.find(d => d.key === key)
    if (!dim) return
    this.setData({
      detail: {
        visible: true,
        name: dim.name,
        weight: dim.weight,
        data: this.data.result[key]
      }
    })
  },

  // 关闭弹层
  closeDetail() {
    this.setData({ 'detail.visible': false })
  },

  // 弹层面板点击不冒泡到遮罩
  noop() {},

  // ---------------- 雷达图绘制 ----------------
  drawRadar(targetValues, animate) {
    const query = wx.createSelectorQuery()
    query.select('#radar').fields({ node: true, size: true }).exec((res) => {
      if (!res[0]) return
      const canvas = res[0].node
      const ctx = canvas.getContext('2d')
      const dpr = wx.getSystemInfoSync().pixelRatio
      canvas.width = res[0].width * dpr
      canvas.height = res[0].height * dpr
      ctx.scale(dpr, dpr)
      const w = res[0].width
      const h = res[0].height

      const drawFrame = (progress) => {
        const values = targetValues.map(v => v * progress)
        this._paintRadar(ctx, w, h, values)
      }

      if (!animate) {
        drawFrame(1)
        return
      }

      // 取消上一帧动画
      if (this._rafId) cancelAnimationFrame(this._rafId)

      const start = Date.now()
      const duration = 700
      const tick = () => {
        const elapsed = Date.now() - start
        const t = Math.min(1, elapsed / duration)
        // ease-out cubic
        const eased = 1 - Math.pow(1 - t, 3)
        drawFrame(eased)
        if (t < 1) {
          this._rafId = requestAnimationFrame(tick)
        } else {
          this._rafId = null
        }
      }
      this._rafId = requestAnimationFrame(tick)
    })
  },

  // 实际绘制函数
  _paintRadar(ctx, w, h, values) {
    const cx = w / 2
    const cy = h / 2 + 10
    const r = Math.min(w, h) / 2 - 40
    const n = 5
    const names = ['智育', '体育', '劳育', '美育', '德育']

    ctx.clearRect(0, 0, w, h)

    // 网格
    for (let layer = 1; layer <= 3; layer++) {
      const lr = r * layer / 3
      ctx.beginPath()
      for (let i = 0; i < n; i++) {
        const angle = -Math.PI / 2 + i * 2 * Math.PI / n
        const x = cx + lr * Math.cos(angle)
        const y = cy + lr * Math.sin(angle)
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.closePath()
      ctx.strokeStyle = '#dddddd'
      ctx.lineWidth = 1
      ctx.stroke()
    }

    // 轴线
    for (let i = 0; i < n; i++) {
      const angle = -Math.PI / 2 + i * 2 * Math.PI / n
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.lineTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle))
      ctx.strokeStyle = '#dddddd'
      ctx.stroke()
    }

    // 数据区域
    ctx.beginPath()
    for (let i = 0; i < n; i++) {
      const angle = -Math.PI / 2 + i * 2 * Math.PI / n
      const vr = r * (values[i] / 100)
      const x = cx + vr * Math.cos(angle)
      const y = cy + vr * Math.sin(angle)
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.closePath()
    ctx.fillStyle = 'rgba(38,33,92,0.2)'
    ctx.fill()
    ctx.strokeStyle = '#26215c'
    ctx.lineWidth = 2
    ctx.stroke()

    // 数据点
    for (let i = 0; i < n; i++) {
      const angle = -Math.PI / 2 + i * 2 * Math.PI / n
      const vr = r * (values[i] / 100)
      const x = cx + vr * Math.cos(angle)
      const y = cy + vr * Math.sin(angle)
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, 2 * Math.PI)
      ctx.fillStyle = '#26215c'
      ctx.fill()
    }

    // 标签
    ctx.fillStyle = '#2c2c2a'
    ctx.font = '12px sans-serif'
    ctx.textAlign = 'center'
    for (let i = 0; i < n; i++) {
      const angle = -Math.PI / 2 + i * 2 * Math.PI / n
      const lr = r + 22
      const x = cx + lr * Math.cos(angle)
      const y = cy + lr * Math.sin(angle)
      ctx.fillText(names[i] + ' ' + values[i].toFixed(0), x, y)
    }
  }
})