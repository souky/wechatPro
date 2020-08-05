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
  const { ENV, OPENID, APPID } = cloud.getWXContext()
  const {planId , _id , inMoney } = event


  try{
    const transaction = await db.startTransaction()

    let dateNow = new Date()

    const planInfo = await transaction.collection('user_plan').doc(planId).get()
    let isDone = inMoney > 0
    const updateFlag = await transaction.collection('user_plan_items').doc(_id).update({
      data:{isDone:isDone,inDate:dateNow}
    })
    if(updateFlag.stats.updated == 1){
      // 更新主任务进度
      let totalMoney = planInfo.data.totalMoney + inMoney
      const targetMoney = planInfo.data.targetMoney

      let completeDegree = (totalMoney / targetMoney * 100).toFixed(2)
      let isComplete = planInfo.data.isComplete
      let isActive = planInfo.data.isActive
      if(totalMoney == targetMoney){
        isComplete = true
        isActive = false
      }
      const updateFlag_ = await transaction.collection('user_plan').doc(planInfo.data._id).update({
        data:{
          totalMoney:totalMoney,
          completeDegree:completeDegree,
          isComplete:isComplete,
          isActive:isActive
        }
      })

      if(updateFlag_.stats.updated == 1){
        transaction.commit()
        return {success:true}
      }else{
        console.error('更新主任务失败');
        transaction.rollback()
        return {success: false}
      }

    }else{
      console.error('更新子任务失败');
      return {success: false}
    }


  }catch (e) {
    console.error(`transaction error`, e)
    return {
      success: false,
      error: e
    }
  }
}
