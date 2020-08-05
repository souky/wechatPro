const cloud = require('wx-server-sdk')
cloud.init({
  // env: cloud.DYNAMIC_CURRENT_ENV
  env:'planplus-k5djb'
})
const db = cloud.database()
const MAX_LIMIT = 100
exports.main = async (event, context) => {
  let planId = event.planId
  // 先取出集合记录总数
  const countResult = await db.collection('user_plan_items').where({planId:planId}).count()
  const total = countResult.total
  // 计算需分几次取
  const batchTimes = Math.ceil(total / 100)
  // 承载所有读操作的 promise 的数组
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection('user_plan_items')
    .where({planId:planId})
    .orderBy('inMoney','asc')
    .field({
      _id: true,
      inMoney: true,
      isDone: true,
    })
    .skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  // 等待所有
  return (await Promise.all(tasks)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }
  })
}