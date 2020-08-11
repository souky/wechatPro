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
    let date = date.getDate()
    let date_ = year + (month<10?'0'+month:month) + '月' + (date<10?'0'+date:date) + '日'

    plans.data.forEach(e=>{
      let result = await cloud.openapi.templateMessage.send({
        touser:e.openid,
        page:'pages/index/inedx',
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
        templateId:'Zfx6gEoTCnkPyMsPToYisufGxBC_wiM7LI2QbzwvPjs',
        miniprogramState:'trial'
      })

      console.log(result);

      if(result.errCode == '43101'){
        // 用户取消订阅 改变计划状态
        db.collection('user_plan').doc(e._id).update({
          isRemind:false
        })
      }
    })
  }

}
