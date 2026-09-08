// utils/announce-storage.js
// 学生已读公告 ID 列表的本地持久化管理
// 正式项目：替换为云数据库 users.readAnnouncementIds 字段

const KEY = 'readAnnouncementIds'

function _read() {
  try { return wx.getStorageSync(KEY) || [] } catch (e) { return [] }
}

function _write(ids) {
  try { wx.setStorageSync(KEY, ids) } catch (e) {}
}

// 标记已读
function markRead(id) {
  const ids = _read()
  if (!ids.includes(id)) {
    ids.push(id)
    _write(ids)
  }
}

// 是否已读
function isRead(id) {
  return _read().includes(id)
}

// 取已发布公告中未读的数量
function countUnread(publishedList) {
  const ids = _read()
  return publishedList.filter(a => !ids.includes(a.id)).length
}

// 标记全部已读
function markAllRead(publishedList) {
  const ids = _read()
  publishedList.forEach(a => { if (!ids.includes(a.id)) ids.push(a.id) })
  _write(ids)
}

// 清除（用于演示/重置）
function clearAll() {
  _write([])
}

module.exports = { markRead, isRead, countUnread, markAllRead, clearAll }
