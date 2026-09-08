// utils/mock-data.js
// 演示数据：正式项目改为从云数据库读取

const student = {
  name: '阿依古丽',
  studentId: '2021010123',
  college: '马克思主义学院',
  major: '思想政治教育',
  className: '21思政1班',
  grade: 2021,
  dorm: '新泉社区3 · 3号楼201',
  dormLeader: '阿依古丽'
}

const scoreResult = {
  academicYear: '2023-2024',
  weighted: 73.93,  // = 68*0.3 + 80.6*0.3 + 83*0.15 + 70*0.1 + 66*0.15
  rank: { class: 3, college: 87, school: 1280 },
  moral: { base: 60, add: 8, deduct: 0, total: 68 },
  intellectual: { base: 86, add: 12, deduct: 5, total: 80.6 },
  physical: { base: 78, add: 5, deduct: 0, total: 83 },
  aesthetic: { base: 60, add: 10, deduct: 0, total: 70 },
  labor: { base: 60, add: 6, deduct: 0, total: 66 }
}

// 多年份历史数据：报告页学年切换使用
// 正式项目：从云数据库按学年聚合
// 注：weighted 均按 PDF 公式 30%+30%+15%+10%+15% 计算得出，与五育明细自洽
const scoreHistory = {
  '2021-2022': {
    academicYear: '2021-2022',
    weighted: 67.74,  // = 64*0.3 + 72.8*0.3 + 74*0.15 + 63*0.1 + 62*0.15
    rank: { class: 8, college: 312, school: 4567 },
    moral: { base: 60, add: 4, deduct: 0, total: 64 },
    intellectual: { base: 78, add: 6, deduct: 2, total: 72.8 },
    physical: { base: 72, add: 2, deduct: 0, total: 74 },
    aesthetic: { base: 60, add: 3, deduct: 0, total: 63 },
    labor: { base: 60, add: 2, deduct: 0, total: 62 }
  },
  '2022-2023': {
    academicYear: '2022-2023',
    weighted: 70.52,  // = 66*0.3 + 76.4*0.3 + 78*0.15 + 65*0.1 + 64*0.15
    rank: { class: 5, college: 156, school: 2340 },
    moral: { base: 60, add: 6, deduct: 0, total: 66 },
    intellectual: { base: 82, add: 8, deduct: 3, total: 76.4 },
    physical: { base: 75, add: 3, deduct: 0, total: 78 },
    aesthetic: { base: 60, add: 5, deduct: 0, total: 65 },
    labor: { base: 60, add: 4, deduct: 0, total: 64 }
  },
  '2023-2024': {
    academicYear: '2023-2024',
    weighted: 73.93,
    rank: { class: 3, college: 87, school: 1280 },
    moral: { base: 60, add: 8, deduct: 0, total: 68 },
    intellectual: { base: 86, add: 12, deduct: 5, total: 80.6 },
    physical: { base: 78, add: 5, deduct: 0, total: 83 },
    aesthetic: { base: 60, add: 10, deduct: 0, total: 70 },
    labor: { base: 60, add: 6, deduct: 0, total: 66 }
  }
}

const dormRating = {
  dormId: 'xinqu-3-201',
  dorm: '新泉社区3 · 3号楼201',
  totalScore: 94,
  level: '优秀',
  candidate: true,
  dimensions: [
    { name: '思想品德强', full: 20, score: 19 },
    { name: '民族团结强', full: 20, score: 20 },
    { name: '文明安全强', full: 20, score: 19 },
    { name: '学习创新优', full: 15, score: 14 },
    { name: '卫生环境优', full: 15, score: 13 },
    { name: '身心体魄优', full: 10, score: 9 }
  ]
}

const activities = [
  { title: '民族团结联谊活动', location: '新泉社区1', time: '3月20日 19:00' },
  { title: '劳动周 · 爱国卫生运动', location: '全校', time: '3月22日' },
  { title: '红色歌曲传唱展演', location: '高台校区礼堂', time: '3月25日 15:00' }
]

const pendingReviews = [
  {
    id: 'r1',
    name: '阿依古丽',
    category: '德育加分',
    detail: '入党积极分子 · 加 3 分',
    evidence: '学院党委合格名单.pdf',
    status: 'pending'
  },
  {
    id: 'r2',
    name: '买买提',
    category: '智育加分',
    detail: '英语四级（二年级）· 加 4 分',
    evidence: 'CET4 成绩单.pdf',
    status: 'pending'
  }
]

// 各学院 × 各学年 × 五育明细（用于统计页联动：点柱状图某学院 → 雷达图展示该学院五育）
// 注：weighted = moral*0.3 + intellectual*0.3 + physical*0.15 + aesthetic*0.1 + labor*0.15
const COLLEGE_DETAILS = {
  '马克思主义学院': {
    '2021-2022': { weighted: 77.95, wuyu: { moral: 84, intellectual: 76, physical: 74, aesthetic: 76, labor: 75 } },
    '2022-2023': { weighted: 79.25, wuyu: { moral: 85, intellectual: 77, physical: 76, aesthetic: 77, labor: 77 } },
    '2023-2024': { weighted: 80.85, wuyu: { moral: 86, intellectual: 79, physical: 77, aesthetic: 78, labor: 80 } }
  },
  '数学与统计学院': {
    '2021-2022': { weighted: 75.65, wuyu: { moral: 76, intellectual: 82, physical: 70, aesthetic: 71, labor: 71 } },
    '2022-2023': { weighted: 76.80, wuyu: { moral: 77, intellectual: 83, physical: 72, aesthetic: 72, labor: 72 } },
    '2023-2024': { weighted: 78.10, wuyu: { moral: 78, intellectual: 84, physical: 74, aesthetic: 73, labor: 74 } }
  },
  '物理与电子学院': {
    '2021-2022': { weighted: 73.25, wuyu: { moral: 73, intellectual: 79, physical: 71, aesthetic: 68, labor: 68 } },
    '2022-2023': { weighted: 74.40, wuyu: { moral: 74, intellectual: 80, physical: 73, aesthetic: 69, labor: 69 } },
    '2023-2024': { weighted: 75.50, wuyu: { moral: 75, intellectual: 81, physical: 74, aesthetic: 71, labor: 70 } }
  },
  '化学与环境学院': {
    '2021-2022': { weighted: 71.80, wuyu: { moral: 73, intellectual: 75, physical: 72, aesthetic: 67, labor: 66 } },
    '2022-2023': { weighted: 72.80, wuyu: { moral: 74, intellectual: 76, physical: 73, aesthetic: 68, labor: 67 } },
    '2023-2024': { weighted: 74.05, wuyu: { moral: 75, intellectual: 77, physical: 75, aesthetic: 70, labor: 68 } }
  },
  '生命科学与技术学院': {
    '2021-2022': { weighted: 70.35, wuyu: { moral: 72, intellectual: 73, physical: 70, aesthetic: 66, labor: 65 } },
    '2022-2023': { weighted: 71.50, wuyu: { moral: 73, intellectual: 74, physical: 72, aesthetic: 67, labor: 66 } },
    '2023-2024': { weighted: 72.60, wuyu: { moral: 74, intellectual: 75, physical: 73, aesthetic: 69, labor: 67 } }
  },
  '信息工程学院': {
    '2021-2022': { weighted: 70.25, wuyu: { moral: 70, intellectual: 76, physical: 68, aesthetic: 65, labor: 65 } },
    '2022-2023': { weighted: 71.40, wuyu: { moral: 71, intellectual: 77, physical: 70, aesthetic: 66, labor: 66 } },
    '2023-2024': { weighted: 72.50, wuyu: { moral: 72, intellectual: 78, physical: 71, aesthetic: 68, labor: 67 } }
  }
}

// 全校五育按学年平均
const SCHOOL_WUYU_BY_YEAR = {
  '2021-2022': { intellectual: 78, physical: 71, labor: 69, aesthetic: 70, moral: 76 },
  '2022-2023': { intellectual: 80, physical: 73, labor: 70, aesthetic: 71, moral: 77 },
  '2023-2024': { intellectual: 82, physical: 75, labor: 71, aesthetic: 73, moral: 78 }
}

const statsData = {
  totalStudents: 12480,
  completionRate: '94.2%',
  avgScore: 76.8,
  collegeDorms: 412,
  schoolDorms: 100,
  // 全校五育平均（智育/体育/劳育/美育/德育 顺序对应 stats.js 雷达图）
  // 正式项目：从云数据库 aggregate 计算
  wuyuAverages: { intellectual: 82, physical: 75, labor: 71, aesthetic: 73, moral: 78 },
  // 兼容旧字段：默认 2023-2024 学年的学院排名（与 collegeDetails 一致）
  colleges: [
    { name: '马克思主义学院', avg: 80.85 },
    { name: '数学与统计学院', avg: 78.10 },
    { name: '物理与电子学院', avg: 75.50 },
    { name: '化学与环境学院', avg: 74.05 },
    { name: '生命科学与技术学院', avg: 72.60 },
    { name: '信息工程学院', avg: 72.50 }
  ],
  // ===== 筛选交互新增字段 =====
  // 学年列表与默认值（统计页顶部 tab 切换）
  years: ['2021-2022', '2022-2023', '2023-2024'],
  currentYear: '2023-2024',
  // 各学院按学年的综合分 + 五育明细（柱状图 + 雷达图联动）
  collegeDetails: COLLEGE_DETAILS,
  // 全校五育按学年平均（切换学年时雷达图切换）
  schoolWuyuByYear: SCHOOL_WUYU_BY_YEAR
}

// 用户与角色管理：admin 后台用户列表
// 5 类角色：student / monitor / counselor / college / dorm
// status: active（启用）/ disabled（停用）
const mockUsers = [
  // 学生
  { id: 'u001', name: '阿依古丽', avatar: '阿', role: 'student', roleLabel: '学生', identifier: '2021010123', college: '马克思主义学院', status: 'active', phone: '138****0123', joinedAt: '2021-09-01' },
  { id: 'u002', name: '买买提', avatar: '买', role: 'student', roleLabel: '学生', identifier: '2022020456', college: '数学与统计学院', status: 'active', phone: '139****0789', joinedAt: '2022-09-01' },
  { id: 'u003', name: '热依拉', avatar: '热', role: 'student', roleLabel: '学生', identifier: '2023030789', college: '信息工程学院', status: 'disabled', phone: '137****0456', joinedAt: '2023-09-01' },
  { id: 'u004', name: '依明江', avatar: '依', role: 'student', roleLabel: '学生', identifier: '2021010567', college: '物理与电子学院', status: 'active', phone: '136****0345', joinedAt: '2021-09-01' },
  { id: 'u005', name: '古丽妮萨', avatar: '古', role: 'student', roleLabel: '学生', identifier: '2022020234', college: '化学与环境学院', status: 'active', phone: '135****0567', joinedAt: '2022-09-01' },

  // 班委
  { id: 'u101', name: '艾克拜尔', avatar: '艾', role: 'monitor', roleLabel: '班委', identifier: 'M-2021-01', college: '马克思主义学院', status: 'active', phone: '139****1111', joinedAt: '2021-09-15' },
  { id: 'u102', name: '木尼热', avatar: '木', role: 'monitor', roleLabel: '班委', identifier: 'M-2022-05', college: '数学与统计学院', status: 'active', phone: '138****2222', joinedAt: '2022-09-15' },

  // 辅导员
  { id: 'u201', name: '王晓燕', avatar: '王', role: 'counselor', roleLabel: '辅导员', identifier: 'T-2018-023', college: '马克思主义学院', status: 'active', phone: '139****3333', joinedAt: '2018-07-01' },
  { id: 'u202', name: '李建国', avatar: '李', role: 'counselor', roleLabel: '辅导员', identifier: 'T-2019-045', college: '信息工程学院', status: 'active', phone: '138****4444', joinedAt: '2019-07-01' },
  { id: 'u203', name: '张丽', avatar: '张', role: 'counselor', roleLabel: '辅导员', identifier: 'T-2017-012', college: '生命科学与技术学院', status: 'disabled', phone: '137****5555', joinedAt: '2017-07-01' },

  // 学院管理员
  { id: 'u301', name: '刘伟', avatar: '刘', role: 'college', roleLabel: '学院', identifier: 'C-MARX', college: '马克思主义学院', status: 'active', phone: '136****6666', joinedAt: '2016-03-01' },
  { id: 'u302', name: '陈红梅', avatar: '陈', role: 'college', roleLabel: '学院', identifier: 'C-MATH', college: '数学与统计学院', status: 'active', phone: '135****7777', joinedAt: '2018-03-01' },

  // 宿管
  { id: 'u401', name: '马合木提', avatar: '马', role: 'dorm', roleLabel: '宿管', identifier: 'D-XQ-007', college: '新泉社区', status: 'active', phone: '134****8888', joinedAt: '2020-04-01' },
  { id: 'u402', name: '帕提曼', avatar: '帕', role: 'dorm', roleLabel: '宿管', identifier: 'D-NG-012', college: '南光社区', status: 'active', phone: '133****9999', joinedAt: '2019-04-01' }
]

// 测评参数配置：admin 参数配置页默认值
const defaultParams = {
  // 五育权重（默认 30/30/15/10/15，合计必须 = 100）
  weights: {
    moral: 30,
    intellectual: 30,
    physical: 15,
    aesthetic: 10,
    labor: 15
  },
  // 加减分规则
  // catKey 用于 wxml 动态类名（微信小程序 wxss 不支持中文类名选择器）
  rules: [
    { id: 'r001', category: '德育', catKey: 'moral', name: '入党积极分子', score: 3, type: 'add' },
    { id: 'r002', category: '德育', catKey: 'moral', name: '优秀共青团员', score: 2, type: 'add' },
    { id: 'r003', category: '德育', catKey: 'moral', name: '志愿服务 / 献血', score: 5, type: 'add' },
    { id: 'r004', category: '智育', catKey: 'intellectual', name: '英语四级 CET-4（二年级）', score: 4, type: 'add' },
    { id: 'r005', category: '智育', catKey: 'intellectual', name: '英语六级 CET-6', score: 6, type: 'add' },
    { id: 'r006', category: '智育', catKey: 'intellectual', name: '计算机等级考试二级', score: 3, type: 'add' },
    { id: 'r007', category: '智育', catKey: 'intellectual', name: '学科竞赛校级以上获奖', score: 5, type: 'add' },
    { id: 'r008', category: '体育', catKey: 'physical', name: '运动会校级前三名', score: 5, type: 'add' },
    { id: 'r009', category: '体育', catKey: 'physical', name: '体测优秀（≥90）', score: 3, type: 'add' },
    { id: 'r010', category: '美育', catKey: 'aesthetic', name: '文艺演出 / 校级展览', score: 3, type: 'add' },
    { id: 'r011', category: '美育', catKey: 'aesthetic', name: '书画比赛校级以上获奖', score: 4, type: 'add' },
    { id: 'r012', category: '劳育', catKey: 'labor', name: '劳动周出勤 / 宿舍内务', score: 2, type: 'add' },
    { id: 'r013', category: '德育', catKey: 'moral', name: '违反校规校纪（情节较轻）', score: -2, type: 'deduct' },
    { id: 'r014', category: '智育', catKey: 'intellectual', name: '考试作弊 / 学术不端', score: -10, type: 'deduct' },
    { id: 'r015', category: '宿舍', catKey: 'dorm', name: '夜不归宿 / 违规电器', score: -3, type: 'deduct' }
  ],
  // 加分上限
  limits: {
    yearMax: 30,         // 每年累计加分上限
    perCategoryMax: 8    // 单类累计加分上限
  },
  // 修改历史（用于审计）
  history: [
    { time: '2026-09-01 14:30', operator: 'admin', desc: '初始化五育权重 30/30/15/10/15' },
    { time: '2026-08-28 10:15', operator: 'admin', desc: '新增规则"考试作弊 -10"' },
    { time: '2026-08-20 09:00', operator: 'admin', desc: '调整加分上限：每年 25 → 30' }
  ]
}

// 系统公告：admin 公告发布页数据
const mockAnnouncements = [
  {
    id: 'a001',
    title: '关于开展 2024 学年综合素质测评工作的通知',
    type: 'notice',         // notice / urgent / system
    typeLabel: '通知',
    priority: 'high',       // high / medium / normal（仅已发布公告生效）
    content: '各学院、各班级：根据《喀什大学学生综合素质测评办法》，2023-2024 学年综合素质测评工作于 9 月 15 日正式启动。请各学院及时组织学生申报材料。',
    author: 'admin',
    createdAt: '2026-09-08 09:00',
    publishedAt: '2026-09-08 09:30',
    status: 'published'      // draft / published / offline
  },
  {
    id: 'a002',
    title: '紧急通知：测评系统维护公告（9 月 12 日 0:00-6:00）',
    type: 'urgent',
    typeLabel: '紧急',
    content: '系统将于 9 月 12 日 0:00-6:00 进行升级维护，期间无法访问。请合理安排申报时间。',
    author: 'admin',
    createdAt: '2026-09-08 14:00',
    publishedAt: null,
    status: 'draft'
  },
  {
    id: 'a003',
    title: '关于 2024 学年三强三优宿舍评选启动的通知',
    type: 'system',
    typeLabel: '系统',
    priority: 'medium',
    content: '三强三优宿舍评选工作已启动，请各宿舍按要求准备材料。',
    author: 'admin',
    createdAt: '2026-08-25 10:00',
    publishedAt: '2026-08-25 10:30',
    status: 'published'
  },
  {
    id: 'a004',
    title: '关于 2023 学年测评结果公示的通知',
    type: 'notice',
    typeLabel: '通知',
    content: '2022-2023 学年综合素质测评结果公示期为 7 天，如有异议请于公示期内提出申诉。',
    author: 'admin',
    createdAt: '2026-07-15 10:00',
    publishedAt: '2026-07-15 11:00',
    status: 'offline'
  }
]

// admin 后台：宿舍管理页面数据
// 6 学院 × 3 宿舍 = 18 宿舍
// 评分维度按"三强三优"：思想品德/民族团结/文明安全（强）+ 学习创新/卫生环境/身心体魄（优）
// 总分 100：3 项×20 + 2 项×15 + 1 项×10
// 校级文明宿舍门槛 = 90 分（用于"候选名单"）
const mockDormRatings = [
  // 马克思主义学院
  { id: 'd001', dormId: '3-201', name: '新泉社区3·3号楼201', college: '马克思主义学院', leader: '阿依古丽·吐尔逊', total: 94, level: 'school',   dims: [19, 20, 19, 14, 13, 9] },
  { id: 'd002', dormId: '3-202', name: '新泉社区3·3号楼202', college: '马克思主义学院', leader: '买买提·艾力',     total: 88, level: 'college',  dims: [18, 19, 18, 13, 12, 8] },
  { id: 'd003', dormId: '3-203', name: '新泉社区3·3号楼203', college: '马克思主义学院', leader: '帕提曼·玉素甫',  total: 76, level: 'normal',   dims: [16, 16, 15, 12, 10, 7] },
  // 数学与统计学院
  { id: 'd004', dormId: '5-101', name: '新泉社区5·5号楼101', college: '数学与统计学院', leader: '李明',              total: 92, level: 'school',   dims: [19, 19, 18, 14, 13, 9] },
  { id: 'd005', dormId: '5-102', name: '新泉社区5·5号楼102', college: '数学与统计学院', leader: '王芳',              total: 86, level: 'college',  dims: [18, 18, 17, 13, 12, 8] },
  { id: 'd006', dormId: '5-103', name: '新泉社区5·5号楼103', college: '数学与统计学院', leader: '张伟',              total: 73, level: 'normal',   dims: [15, 15, 14, 12, 10, 7] },
  // 物理与电子学院
  { id: 'd007', dormId: '2-301', name: '新泉社区2·2号楼301', college: '物理与电子学院', leader: '艾克拜尔·亚森',  total: 90, level: 'school',   dims: [18, 19, 18, 14, 12, 9] },
  { id: 'd008', dormId: '2-302', name: '新泉社区2·2号楼302', college: '物理与电子学院', leader: '乃吉米丁·麦麦提', total: 84, level: 'college',  dims: [17, 18, 17, 12, 12, 8] },
  { id: 'd009', dormId: '2-303', name: '新泉社区2·2号楼303', college: '物理与电子学院', leader: '木合塔尔·买买提', total: 71, level: 'normal',   dims: [15, 15, 13, 11, 10, 7] },
  // 化学与环境学院
  { id: 'd010', dormId: '4-401', name: '新泉社区4·4号楼401', college: '化学与环境学院', leader: '热依拉·买买提',  total: 91, level: 'school',   dims: [19, 19, 18, 14, 12, 9] },
  { id: 'd011', dormId: '4-402', name: '新泉社区4·4号楼402', college: '化学与环境学院', leader: '马龙',              total: 82, level: 'college',  dims: [17, 17, 16, 12, 12, 8] },
  { id: 'd012', dormId: '4-403', name: '新泉社区4·4号楼403', college: '化学与环境学院', leader: '黄海',              total: 68, level: 'normal',   dims: [14, 14, 13, 10, 10, 7] },
  // 生命科学与技术学院
  { id: 'd013', dormId: '1-101', name: '新泉社区1·1号楼101', college: '生命科学与技术学院', leader: '古丽娜孜·赛买提', total: 93, level: 'school', dims: [19, 20, 18, 14, 13, 9] },
  { id: 'd014', dormId: '1-102', name: '新泉社区1·1号楼102', college: '生命科学与技术学院', leader: '苏比·吐尔逊',  total: 80, level: 'college',  dims: [16, 17, 16, 12, 11, 8] },
  { id: 'd015', dormId: '1-103', name: '新泉社区1·1号楼103', college: '生命科学与技术学院', leader: '张琳',          total: 65, level: 'normal',   dims: [13, 14, 12, 10, 9, 7] },
  // 信息工程学院
  { id: 'd016', dormId: '6-501', name: '新泉社区6·6号楼501', college: '信息工程学院', leader: '阿不都热合曼·克依木', total: 95, level: 'school', dims: [20, 20, 19, 14, 13, 9] },
  { id: 'd017', dormId: '6-502', name: '新泉社区6·6号楼502', college: '信息工程学院', leader: '再努热姆·阿布拉',   total: 87, level: 'college',  dims: [18, 18, 17, 13, 12, 9] },
  { id: 'd018', dormId: '6-503', name: '新泉社区6·6号楼503', college: '信息工程学院', leader: '刘洋',                  total: 74, level: 'normal',   dims: [15, 16, 14, 11, 10, 8] }
]

// 6 个校级文明宿舍候选（total >= 90）
const mockSchoolCandidates = mockDormRatings.filter(d => d.total >= 90).sort((a, b) => b.total - a.total)

module.exports = {
  student,
  scoreResult,
  scoreHistory,
  dormRating,
  activities,
  pendingReviews,
  statsData,
  mockUsers,
  defaultParams,
  mockAnnouncements,
  mockDormRatings,
  mockSchoolCandidates
}
