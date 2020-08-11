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
  let planId = event.planId

  try{
    const transaction = await db.startTransaction()

    const deleteFlag = await transaction.collection('user_plan').doc(planId).remove()
    if(deleteFlag.stats.removed == 1){
      // 查询子项目数量
      const count = await transaction.collection('user_plan_items').where({planId:planId}).count()
      const res = await transaction.collection('user_plan_items').where({planId:planId}).remove()

      if(res.stats.removed == count.total){
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
