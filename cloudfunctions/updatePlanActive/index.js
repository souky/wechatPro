const cloud = require('wx-server-sdk')
cloud.init({
  // env: cloud.DYNAMIC_CURRENT_ENV
  env:'planplus-k5djb'
})

const db = cloud.database({
  throwOnNotFound: false,
})
const _ = db.command


exports.main = async (event) => {

  const countResult = await db.collection('user_plan').where({
    isActive:true
  }).count()
  const total = countResult.total
  // 计算需分几次取
  const batchTimes = Math.ceil(total / 100)
  // 承载所有读操作的 promise 的数组
  const plans = []
  for (let i = 0; i < batchTimes; i++) {
    const result = await db.collection('user_plan')
    .where({
      isActive:true
    })
    .orderBy('inMoney','asc')
    .skip(i * 100).limit(100).get()
    plans.concat(result.data)
  }

  let dateNow = new Date().getTime()
  if(plans && plans.length > 0){
    for(let i = 0;i < plans.length;i++){
      let e = plans[i]
      if(e.endDate.getTime() < dateNow){
        db.collection('user_plan').doc(e._id).update({
          data:{isActive:false}
        })
      }
    }
  }

}
