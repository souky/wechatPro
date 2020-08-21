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
  let plans = new Array()
  const countResult = await db.collection('user_plan').where({
    isActive:true,
    isRemind:true
  }).count()
  const total = countResult.total
  // 计算需分几次取
  const batchTimes = Math.ceil(total / 100)
  // 承载所有读操作的 promise 的数组
  const plans = []
  for (let i = 0; i < batchTimes; i++) {
    const result = await db.collection('user_plan')
    .where({
      isActive:true,
      isRemind:true
    }).field({
      openid: true,
      _id: true
    })
    .orderBy('inMoney','asc')
    .skip(i * 100).limit(100).get()
    plans.concat(result.data)
  }

  if(plans && plans.length > 0){
    // 发送模板信息

    let date = new Date()
    let year = date.getFullYear()+'年'
    let month = date.getMonth() + 1
    let dates = date.getDate()
    let date_ = year + (month<10?'0'+month:month) + '月' + (dates<10?'0'+dates:dates) + '日'

    for(let i = 0;i < plans.length;i++){
      let e = plans[i]
      try{
        let result = await cloud.openapi.subscribeMessage.send({
          touser:e.openid,
          page:'pages/login/login',
          data:{
            time1:{
              value:date_
            },
            thing3:{
              value:'快来存钱鸭!'
            },
            thing4:{
              value:'今天有没有好好存钱鸭?没存就快来吧!'
            }
          },
          // miniprogramState:'trial',
          templateId:'Zfx6gEoTCnkPyMsPToYisufGxBC_wiM7LI2QbzwvPjs'
        })
        console.log(result);

      }catch(ex){
        console.error(e);
        if(ex.errCode == '43101'){
          // 用户取消订阅 改变计划状态
          db.collection('user_plan').doc(e._id).update({
            data:{isRemind:false}
          })
        }
      }
    }
  }

}
