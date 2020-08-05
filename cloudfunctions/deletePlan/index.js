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
  let planId = event.planId

  try{
    const transaction = await db.startTransaction()

    const deleteFlag = await transaction.collection('user_plan').doc(planId).remove()
    if(addFlag.stats.removed == 1){
      // 查询子项目数量

      const count = await db.collection('user_plan_items').aggregate().match({planId:planId}).count('count').end()

      const res = await transaction.collection('user_plan_items').where({planId:planId}).remove()
      
      if(res.stats.removed == count){
        transaction.commit()
        return {success:true}
      }else{
        transaction.rollback()
        console.error('子项目删除失败')
        return {success: false}
      }

    }else{
      console.error('主项目删除失败')
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
