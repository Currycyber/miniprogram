// pages/stats/stats.js
// 统计看板：学年切换 + 学院点击高亮 + 柱状图与雷达图联动

const mock = require('../../utils/mock-data.js')
const { showToast } = require('../../utils/request.js')

Page({
  data: {
    stats: {},
    years: [],
    yearIndex: 2,            // 默认 2023-2024（数组索引）
    currentYear: '',
    colleges: [],            // 当前学年下渲染的学院列表
    selectedIdx: -1,         // 学院高亮索引（-1 表示无）
    radarMode: 'school',     // 'school' 显示全校五育，'college' 显示所选学院五育
    radarTitle: '全校五育均衡度'
  },

  // 雷达图动画 RAF
  _radarRAF: null,

  onLoad() {
    this.setData({
      stats: mock.statsData,
      years: mock.statsData.years,
      yearIndex: mock.statsData.years.indexOf(mock.statsData.currentYear)
    })
    this._applyYear()
  },

  onReady() {
    this._drawRadar()
  },

  onUnload() {
    if (this._radarRAF) {
      this._radarRAF.forEach(id => cancelAnimationFrame(id))
      this._radarRAF = null
    }
  },

  // 学年切换（顶部 tab）
  onYearChange(e) {
    const idx = e.currentTarget.dataset.idx
    if (idx === this.data.yearIndex) return
    this.setData({ yearIndex: idx, selectedIdx: -1, radarMode: 'school' })
    this._applyYear()
  },

  // 应用当前学年：渲染学院列表 + 重绘雷达图
  _applyYear() {
    const year = this.data.years[this.data.yearIndex]
    const colleges = mock.statsData.colleges.map(c => {
      const detail = mock.statsData.collegeDetails[c.name]?.[year]
      return {
        ...c,
        weighted: detail?.weighted ?? c.avg,
        wuyu: detail?.wuyu ?? null,
        highlighted: false
      }
    })
    this.setData({
      currentYear: year,
      colleges,
      radarTitle: `${year} 学年 · 全校五育均衡度`
    })
    // 等 DOM 更新后重绘
    setTimeout(() => this._drawRadar(), 0)
  },

  // 点击学院柱条：toggle 高亮 + 雷达图联动
  onCollegeTap(e) {
    const idx = e.currentTarget.dataset.idx
    const colleges = this.data.colleges.map((c, i) => ({
      ...c,
      highlighted: i === idx ? !c.highlighted : false
    }))
    const newSelected = colleges[idx].highlighted ? idx : -1
    const radarMode = newSelected >= 0 ? 'college' : 'school'
    const c = colleges[newSelected] || null
    const radarTitle = c
      ? `${c.name} · 五育分布（${this.data.currentYear}）`
      : `${this.data.currentYear} 学年 · 全校五育均衡度`
    this.setData({ colleges, selectedIdx: newSelected, radarMode, radarTitle })
    setTimeout(() => this._drawRadar(), 0)
  },

  // 重置：返回全校雷达图
  onResetSelection() {
    const colleges = this.data.colleges.map(c => ({ ...c, highlighted: false }))
    this.setData({
      colleges,
      selectedIdx: -1,
      radarMode: 'school',
      radarTitle: `${this.data.currentYear} 学年 · 全校五育均衡度`
    })
    setTimeout(() => this._drawRadar(), 0)
  },

  // 绘制雷达图（school 或 college 模式 + 700ms 缓动动画）
  _drawRadar() {
    const mode = this.data.radarMode
    let wuyu
    if (mode === 'college' && this.data.selectedIdx >= 0) {
      wuyu = this.data.colleges[this.data.selectedIdx].wuyu
    } else {
      wuyu = mock.statsData.schoolWuyuByYear[this.data.currentYear]
    }
    if (!wuyu) return

    const query = wx.createSelectorQuery()
    query.select('#radar').fields({ node: true, size: true }).exec((res) => {
      if (!res || !res[0]) return
      const canvas = res[0].node
      const ctx = canvas.getContext('2d')
      const dpr = wx.getSystemInfoSync().pixelRatio
      canvas.width = res[0].width * dpr
      canvas.height = res[0].height * dpr
      ctx.scale(dpr, dpr)
      const w = res[0].width
      const h = res[0].height
      const target = [wuyu.intellectual, wuyu.physical, wuyu.labor, wuyu.aesthetic, wuyu.moral]
      this._animateRadar(ctx, w, h, target, mode)
    })
  },

  // 动画：从 0 缓动到 target，700ms ease-out cubic
  _animateRadar(ctx, w, h, target, mode) {
    if (this._radarRAF) this._radarRAF.forEach(id => cancelAnimationFrame(id))
    this._radarRAF = []

    const duration = 700
    const startTime = Date.now()
    const current = [0, 0, 0, 0, 0]

    const tick = () => {
      const elapsed = Date.now() - startTime
      const t = Math.min(1, elapsed / duration)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3)
      const values = current.map((_, i) => target[i] * eased)
      this._paintRadar(ctx, w, h, values, mode)
      if (t < 1) {
        const id = requestAnimationFrame(tick)
        this._radarRAF.push(id)
      } else {
        this._radarRAF = null
      }
    }
    const id = requestAnimationFrame(tick)
    this._radarRAF.push(id)
  },

  _paintRadar(ctx, w, h, values, mode) {
    const names = ['智育', '体育', '劳育', '美育', '德育']
    const cx = w / 2
    const cy = h / 2 + 10
    const r = Math.min(w, h) / 2 - 36
    const n = 5

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

    // 数据区
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
    ctx.fillStyle = mode === 'college' ? 'rgba(255, 149, 0, 0.22)' : 'rgba(127, 119, 221, 0.25)'
    ctx.fill()
    ctx.strokeStyle = mode === 'college' ? '#FF9500' : '#534ab7'
    ctx.lineWidth = 2
    ctx.stroke()

    // 顶点圆点
    for (let i = 0; i < n; i++) {
      const angle = -Math.PI / 2 + i * 2 * Math.PI / n
      const vr = r * (values[i] / 100)
      ctx.beginPath()
      ctx.arc(cx + vr * Math.cos(angle), cy + vr * Math.sin(angle), 3, 0, 2 * Math.PI)
      ctx.fillStyle = mode === 'college' ? '#FF9500' : '#534ab7'
      ctx.fill()
    }

    // 标签 + 数值
    ctx.fillStyle = '#2c2c2a'
    ctx.font = '11px sans-serif'
    ctx.textAlign = 'center'
    for (let i = 0; i < n; i++) {
      const angle = -Math.PI / 2 + i * 2 * Math.PI / n
      const x = cx + (r + 18) * Math.cos(angle)
      const y = cy + (r + 18) * Math.sin(angle)
      ctx.fillText(names[i] + ' ' + values[i].toFixed(0), x, y)
    }
  },

  exportExcel() {
    showToast('报表生成中，请稍候...', 'success')
    // 正式项目：调用云函数用 exceljs 生成 xlsx 并上传云存储
  }
})