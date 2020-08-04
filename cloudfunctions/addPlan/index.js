const cloud = require('wx-server-sdk')
cloud.init({
  // env: cloud.DYNAMIC_CURRENT_ENV
  env:'planplus-k5djb'
})

const db = cloud.database({
  throwOnNotFound: false,
})
const _ = db.command

var n = 1;
var arrayZ = []
search:while (n<1000) {
    n += 1;
    for (var i = 2; i <= Math.sqrt(n); i++) {
        if (n % i == 0) {
            continue search;
        }
    }
    arrayZ.push(n)
}

getMoney = (planId,type,days,openid)=>{
  let array = new Array()
    let sum = 0
    let objArray = new Array()
    if(type == 0){
      for(let i = 1;i <= days;i++){
        array.push(i)
        sum += i
        let obj = {
          openid:openid,
          planId:planId,
          inMoney:i,
          isDone:false
        }
        objArray.push(obj)
      }
    }else{
      for(let i = 0;i < days;i++){
        if(arrayZ[i]){
          array.push(arrayZ[i])
          sum += arrayZ[i]
          let obj = {
            openid:openid,
            planId:planId,
            inMoney:arrayZ[i],
            isDone:false
          }
          objArray.push(obj)
        }else break;
      }
    }
    return {
      array:array,
      sum:sum,
      objArray:objArray
    }
}

addPlanItems = async (target,transaction)=>{
    let count = 0
    for(let e in target){
      let addFlag = await transaction.collection('user_plan_items').add({data:target[e]})
      if(addFlag.errMsg == 'collection.add:ok') count += 1
    }
    if(count == target.length) return true
    else return false
}

exports.main = async (event) => {
  const { ENV, OPENID, APPID } = cloud.getWXContext()
  let planInfo = event.baseInfo

  try{
    const transaction = await db.startTransaction()

    let dateNow = new Date()

    let planId = dateNow.getTime()+''
    let planStartDate = new Date(planInfo.planStartDate)
    planStartDate.setHours(0,0,0,0)
    
    let planEndDate = new Date(planStartDate.getTime())
    let days = [30,90,365]
    planEndDate.setDate(planEndDate.getDate() + days[planInfo.palnDates])
    planEndDate.setHours(23,59,59,0)
    

    let temp_ = getMoney(planId,planInfo.palnType,days[planInfo.palnDates],OPENID)
    let targetMoney = temp_.sum
    let data = {
      _id:planId,
      openid:OPENID,
      palnDates:planInfo.palnDates,
      palnType:planInfo.palnType,
      planStartDate:planStartDate,
      planEndDate:planEndDate,
      completeDegree:0,
      totalMoney:0,
      targetMoney:targetMoney,
      isComplete:false,
      createData:dateNow,
      isActive:true,
    }
    const addFlag = await transaction.collection('user_plan').add({data:data})
    if(addFlag.errMsg == 'collection.add:ok'){
      const res = await addPlanItems(temp_.objArray,transaction)
      if(res){
        transaction.commit()
        return {success:true}
      }else{
        transaction.rollback()
        return {success: false}
      }

    }else{
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
