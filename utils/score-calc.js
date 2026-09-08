// utils/score-calc.js
// 喀什大学学生综合素质测评计算引擎
// 依据《喀什大学学生综合素质测评办法（试行）》

/**
 * 第五条：学年综合素质测评分
 * = 德育×30% + 智育×30% + 体育×15% + 美育×10% + 劳育×15%
 */
function calcYearTotal(moral, intellectual, physical, aesthetic, labor) {
  const total =
    moral * 0.30 +
    intellectual * 0.30 +
    physical * 0.15 +
    aesthetic * 0.10 +
    labor * 0.15
  return Number(total.toFixed(2))
}

/**
 * 第七条（四）：德育素质测评成绩 = 基础分 + 应加分 - 应减分
 * 超过 100 按 100 计
 */
function calcMoral(base, add, deduct) {
  return Math.min(100, Math.max(0, base + add - deduct))
}

/**
 * 第八条（一）：智育基础分 = Σ(课程百分制成绩×学分) / Σ学分
 * 第八条（四）：智育测评成绩 = 基础分×80% + (应加分-应减分)×20%
 */
function calcIntellectual(courses, add, deduct) {
  let totalCredit = 0
  let weightedSum = 0
  for (const c of courses) {
    totalCredit += c.credit
    weightedSum += c.score * c.credit
  }
  const base = totalCredit > 0 ? weightedSum / totalCredit : 0
  return Number((base * 0.8 + (add - deduct) * 0.2).toFixed(2))
}

/**
 * 第九条（一）：体育基础分
 * = (体质健康测试成绩×60% + 专业考试成绩×40%)×80% + 课外锻炼分×20%
 * 课外锻炼分 = 实际出勤次数/应出勤次数×100
 */
function calcPhysical(physicalTest, profScore, attendanceRate, add, deduct) {
  const base =
    (physicalTest * 0.6 + profScore * 0.4) * 0.8 +
    attendanceRate * 100 * 0.2
  return Math.min(100, Math.max(0, base + add - deduct))
}

/**
 * 第十条/第十一条：美育/劳育测评成绩 = 基础分 + 应加分 - 应减分
 * 超过 100 按 100 计
 */
function calcSimple(base, add, deduct) {
  return Math.min(100, Math.max(0, base + add - deduct))
}

/**
 * 第五条（二）：毕业生综合素质测评平均分 = 各学年综合分之和 / 学年数
 */
function calcGraduateAverage(yearScores) {
  if (!yearScores || !yearScores.length) return 0
  const sum = yearScores.reduce((s, y) => s + y.weighted, 0)
  return Number((sum / yearScores.length).toFixed(2))
}

/**
 * 第六条：同类项目加分只计一次最高分，不重复累计
 * @param {Array} items 加减分记录数组
 * @param {Function} keyFn 生成分类 key 的函数
 */
function dedupByHighest(items, keyFn) {
  const map = new Map()
  for (const it of items) {
    const key = keyFn ? keyFn(it) : it.itemCode
    if (!map.has(key) || map.get(key).score < it.score) {
      map.set(key, it)
    }
  }
  return Array.from(map.values())
}

/**
 * 第八条（二）1：英语等级 / MHK 加分（按年级差异）
 * majorType: 'non-english' | 'art' | 'english'
 * level: 'cet4' | 'cet6' | 'tem4' | 'tem8'
 * grade: 1~4
 * 返回对应加分值，无匹配返回 0
 */
const ENGLISH_BONUS = {
  'non-english': {
    cet4: [5, 4, 3, 2],
    cet6: [0, 6, 5, 4]
  },
  art: {
    cet4: [6, 5, 4, 3],
    cet6: [0, 7, 6, 5]
  },
  english: {
    tem4: [0, 5, 4, 3],
    tem8: [0, 0, 6, 5]
  }
}

function calcEnglishBonus(majorType, level, grade) {
  const table = ENGLISH_BONUS[majorType]
  if (!table || !table[level]) return 0
  const arr = table[level]
  const idx = Math.min(Math.max(grade, 1), 4) - 1
  return arr[idx] || 0
}

/**
 * 第八条（二）1（2）：全国计算机等级考试加分
 * level: 1~4, result: 'pass' | 'excellent', grade: 1~4
 */
const COMPUTER_BONUS = {
  1: { pass: [3, 2, 0, 0], excellent: [4, 3, 2, 0] },
  2: { pass: [5, 4, 3, 2], excellent: [6, 5, 4, 3] },
  3: { pass: [7, 6, 5, 4], excellent: [8, 7, 6, 5] },
  4: { pass: [10, 10, 10, 10], excellent: [11, 11, 11, 11] }
}

function calcComputerBonus(level, result, grade) {
  const table = COMPUTER_BONUS[level]
  if (!table || !table[result]) return 0
  const idx = Math.min(Math.max(grade, 1), 4) - 1
  return table[result][idx] || 0
}

/**
 * 竞赛获奖加分：作者排序系数（第八条（二）2）
 * 奖励分值 = 等级加分 × 系数(80%/60%/40%/20%)，取整
 */
function calcCompetitionBonus(baseScore, authorRank) {
  const coeff = [0, 0.8, 0.6, 0.4, 0.2]
  const c = coeff[Math.min(authorRank, 4)] || 0.2
  return Math.round(baseScore * c)
}

module.exports = {
  calcYearTotal,
  calcMoral,
  calcIntellectual,
  calcPhysical,
  calcSimple,
  calcGraduateAverage,
  dedupByHighest,
  calcEnglishBonus,
  calcComputerBonus,
  calcCompetitionBonus,
  ENGLISH_BONUS,
  COMPUTER_BONUS
}
