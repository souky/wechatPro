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

  const plans = await db.collection('user_plan').where({
    isActive:true,
    isRemind:true
  }).field({
    openid: true,
    _id: true
  }).get()

  if(plans && plans.data.length > 0){
    // 发送模板信息

    let date = new Date()
    let year = date.getFullYear()+'年'
    let month = date.getMonth() + 1
    let dates = date.getDate()
    let date_ = year + (month<10?'0'+month:month) + '月' + (dates<10?'0'+dates:dates) + '日'

    let list = plans.data
    for(let i = 0;i < list.length;i++){
      let e = list[i]
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
