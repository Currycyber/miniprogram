// pages/admin-dashboard/admin-dashboard.js
// 校级数据看板：核心指标 + 全校五育平均雷达 + 学院排名 + 三年趋势

const mock = require('../../utils/mock-data.js')
const auth = require('../../utils/auth.js')

// 多年份全校五育平均（mock）
const HISTORY_5YU = {
  '2021-2022': { intellectual: 75, physical: 70, labor: 68, aesthetic: 70, moral: 74 },
  '2022-2023': { intellectual: 78, physical: 72, labor: 70, aesthetic: 71, moral: 76 },
  '2023-2024': { intellectual: 82, physical: 75, labor: 71, aesthetic: 73, moral: 78 }
}

Page({
  data: {
    user: null,
    metrics: {
      totalStudents: mock.statsData.totalStudents,
      completionRate: mock.statsData.completionRate,
      avgScore: mock.statsData.avgScore,
      collegeCount: mock.statsData.colleges.length + 8  // 总学院数（含未列出）
    },
    colleges: mock.statsData.colleges.map(c => ({
      ...c,
      highlighted: false
    })),
    highlightedCollege: null
  },

  onLoad() {
    const { user, token } = auth.getSession()
    if (!token) {
      wx.redirectTo({ url: '/pages/admin-login/admin-login' })
      return
    }
    this.setData({ user })
    this.drawRadar(mock.statsData.wuyuAverages)
  },

  onReady() {
    // 趋势折线放后面
  },

  // 点击学院条：选中并高亮
  onCollegeTap(e) {
    const idx = e.currentTarget.dataset.idx
    const colleges = this.data.colleges.map((c, i) => ({
      ...c,
      highlighted: i === idx ? !c.highlighted : false
    }))
    this.setData({ colleges, highlightedCollege: idx })
  },

  // 退出登录
  onLogout() {
    wx.showModal({
      title: '退出登录',
      content: '确认退出管理后台？',
      success: (res) => {
        if (res.confirm) {
          auth.logout()
          wx.reLaunch({ url: '/pages/home/home' })
        }
      }
    })
  },

  // 返回学生端
  goBack() {
    wx.reLaunch({ url: '/pages/home/home' })
  },

  // 管理模块入口跳转
  goModule(e) {
    const target = e.currentTarget.dataset.target
    const map = {
      users: '/pages/admin-users/admin-users',
      params: '/pages/admin-params/admin-params',
      announce: '/pages/admin-announce/admin-announce'
    }
    const url = map[target]
    if (!url) {
      wx.showToast({ title: '该模块即将上线', icon: 'none' })
      return
    }
    wx.navigateTo({ url, fail: () => {
      wx.showToast({ title: '页面未注册', icon: 'none' })
    } })
  },

  // 全校五育平均雷达图
  drawRadar(wuyu) {
    const query = wx.createSelectorQuery()
    query.select('#adminRadar').fields({ node: true, size: true }).exec((res) => {
      if (!res[0]) return
      const canvas = res[0].node
      const ctx = canvas.getContext('2d')
      const dpr = wx.getSystemInfoSync().pixelRatio
      canvas.width = res[0].width * dpr
      canvas.height = res[0].height * dpr
      ctx.scale(dpr, dpr)
      const w = res[0].width
      const h = res[0].height
      this._paintRadar(ctx, w, h, wuyu)
    })
  },

  _paintRadar(ctx, w, h, wuyu) {
    const values = [wuyu.intellectual, wuyu.physical, wuyu.labor, wuyu.aesthetic, wuyu.moral]
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
    // 数据
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
    ctx.fillStyle = 'rgba(127, 119, 221, 0.25)'
    ctx.fill()
    ctx.strokeStyle = '#534ab7'
    ctx.lineWidth = 2
    ctx.stroke()
    // 点
    for (let i = 0; i < n; i++) {
      const angle = -Math.PI / 2 + i * 2 * Math.PI / n
      const vr = r * (values[i] / 100)
      ctx.beginPath()
      ctx.arc(cx + vr * Math.cos(angle), cy + vr * Math.sin(angle), 3, 0, 2 * Math.PI)
      ctx.fillStyle = '#534ab7'
      ctx.fill()
    }
    // 标签
    ctx.fillStyle = '#2c2c2a'
    ctx.font = '11px sans-serif'
    ctx.textAlign = 'center'
    for (let i = 0; i < n; i++) {
      const angle = -Math.PI / 2 + i * 2 * Math.PI / n
      const x = cx + (r + 18) * Math.cos(angle)
      const y = cy + (r + 18) * Math.sin(angle)
      ctx.fillText(names[i] + ' ' + values[i], x, y)
    }
  }
})