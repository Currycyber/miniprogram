// utils/request.js
// 云函数调用封装（正式项目用 wx.cloud.callFunction）
// 演示阶段直接返回 mock 数据

/**
 * 调用云函数
 * @param {string} name 云函数名
 * @param {object} data 入参
 * @param {object} [options] 演示阶段测试用：{ fail: true } 时返回失败
 */
function callFunction(name, data = {}, options = {}) {
  return new Promise((resolve, reject) => {
    // 正式项目：
    // wx.cloud.callFunction({ name, data })
    //   .then(res => resolve(res.result))
    //   .catch(reject)

    // 演示阶段：模拟延迟后返回成功（或测试用失败）
    setTimeout(() => {
      if (options.fail) {
        reject(new Error('mock failure'))
        return
      }
      resolve({ code: 0, data: {}, msg: 'mock' })
    }, 100)
  })
}

function showToast(title, icon = 'none') {
  wx.showToast({ title, icon })
}

module.exports = {
  callFunction,
  showToast
}
