// pages/admin-dorm/admin-dorm.js
// admin 宿舍管理：全校宿舍评分表 + 6 学院汇总 + 校级候选名单 + 一键发布

const mock = require('../../utils/mock-data.js')

const DIM_NAMES = ['思想品德强', '民族团结强', '文明安全强', '学习创新优', '卫生环境优', '身心体魄优']
const DIM_FULL = [20, 20, 20, 15, 15, 10]
const LEVEL_META = {
  school:  { label: '校级', color: '#534ab7' },
  college: { label: '院级', color: '#1989fa' },
  normal:  { label: '普通', color: '#999'    }
}
const COLLEGES = ['马克思主义学院', '数学与统计学院', '物理与电子学院', '化学与环境学院', '生命科学与技术学院', '信息工程学院']

Page({
  data: {
    dorms: [],
    candidates: [],
    collegeStats: [],     // 6 学院汇总
    levelStats: { school: 0, college: 0, normal: 0, total: 0 },
    tab: 'all',           // all / school / college / candidates
    filterCollege: 'all',
    colleges: ['全部', ...COLLEGES],
    DIM_NAMES,
    DIM_FULL,
    LEVEL_META
  },

  onLoad() {
    this._render()
  },

  onShow() {
    this._render()
  },

  _render() {
    let dorms = mock.mockDormRatings.map(d => ({ ...d, levelMeta: LEVEL_META[d.level] }))
    if (this.data.filterCollege !== 'all') {
      dorms = dorms.filter(d => d.college === this.data.filterCollege)
    }

    // 学院汇总
    const collegeStats = COLLEGES.map(c => {
      const list = mock.mockDormRatings.filter(d => d.college === c)
      const total = list.length
      const schoolCount = list.filter(d => d.level === 'school').length
      const collegeCount = list.filter(d => d.level === 'college').length
      const avg = (list.reduce((s, d) => s + d.total, 0) / total).toFixed(1)
      return { name: c, total, schoolCount, collegeCount, avg }
    })

    // 等级统计
    const all = mock.mockDormRatings
    const levelStats = {
      total: all.length,
      school: all.filter(d => d.level === 'school').length,
      college: all.filter(d => d.level === 'college').length,
      normal: all.filter(d => d.level === 'normal').length
    }

    // 校级候选名单
    const candidates = mock.mockSchoolCandidates
      .map(d => ({ ...d, levelMeta: LEVEL_META[d.level] }))

    // tab 过滤
    let view = dorms
    if (this.data.tab === 'school') view = dorms.filter(d => d.level === 'school')
    else if (this.data.tab === 'college') view = dorms.filter(d => d.level === 'college')
    else if (this.data.tab === 'candidates') view = candidates
    if (this.data.filterCollege !== 'all' && this.data.tab !== 'candidates') {
      view = view.filter(d => d.college === this.data.filterCollege)
    }

    this.setData({
      dorms: view,
      candidates,
      collegeStats,
      levelStats,
      tab: this.data.tab,
      filterCollege: this.data.filterCollege
    })
  },

  // 切换学院筛选
  onCollegeFilter(e) {
    this.setData({ filterCollege: e.currentTarget.dataset.key })
    this._render()
  },

  // 切换 tab
  onTabChange(e) {
    this.setData({ tab: e.currentTarget.dataset.key })
    this._render()
  },

  // 一键发布校级名单
  onPublishSchool() {
    const list = mock.mockSchoolCandidates
    const text = list.map(d => `${d.name}（${d.total} 分，${d.leader}）`).join('\n')
    wx.showModal({
      title: `发布 ${list.length} 个校级文明宿舍`,
      content: `即将向全校发布下列宿舍为"校级文明宿舍"：\n\n${text}\n\n确认发布？`,
      success: (res) => {
        if (res.confirm) {
          // 演示阶段：弹 Toast + 写入全局公告（mock）
          wx.showToast({ title: `已发布 ${list.length} 个`, icon: 'success' })
        }
      }
    })
  },

  // 一键发布院级名单（按学院发布）
  onPublishCollege(e) {
    const college = e.currentTarget.dataset.college
    const list = mock.mockDormRatings.filter(d => d.college === college && (d.level === 'school' || d.level === 'college'))
    const text = list.map(d => `${d.name}（${d.total} 分，${LEVEL_META[d.level].label}）`).join('\n')
    wx.showModal({
      title: `发布 ${college} 院级名单`,
      content: `共 ${list.length} 个：\n\n${text}`,
      success: (res) => {
        if (res.confirm) {
          wx.showToast({ title: `已发布 ${list.length} 个`, icon: 'success' })
        }
      }
    })
  },

  goBack() {
    const pages = getCurrentPages()
    if (pages.length > 1) {
      wx.navigateBack({ delta: 1, fail: () => wx.redirectTo({ url: '/pages/admin-dashboard/admin-dashboard' }) })
    } else {
      wx.redirectTo({ url: '/pages/admin-dashboard/admin-dashboard' })
    }
  }
})
