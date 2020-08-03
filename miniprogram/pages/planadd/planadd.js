const app = getApp()

var n = 1;
var arrayZ = []
search:while (n<1092) {
    n += 1;
    for (var i = 2; i <= Math.sqrt(n); i++) {
        if (n % i == 0) {
            continue search;
        }
    }
    arrayZ.push(n)
}

Page({
  data: {
    error:'',
    rules:[
      {name: 'palnDates',rules: {required: true, message: '计划时长必选'}},
      {name: 'palnType',rules: {required: true, message: '计划类型必选'}},
      {name: 'planStartDate',rules: {required: true, message: '计划开始时间必选'}}
    ],
    baseInfo:{isRemind:false},
    palnDatess:["月(30天)", "季度(90天)", "年(365天)"],
    palnTypes:["自然序列和", "1000内质数序列和"],
  },
  onLoad: function (options) {

  },
  onShow: function () {
    
  },

  onHide: function () {

  },
  commonChange:function(e){
    let field = e.currentTarget.dataset.field
    this.setData({
      [`baseInfo.${field}`]:e.detail.value
    })
  },

  submitForm:function(){
    this.selectComponent('#form').validate((valid, errors) => {
      if (!valid) {
        // 验证不通过
        const firstError = Object.keys(errors)
        if (firstError.length)  this.setData({error: errors[firstError[0]].message})
      } else {
        wx.showLoading({title: '加载中',mask:true})
        // 验证通过 查重
        app.$query('user_plan',{
          openid : app.globalData.userInfo.openid,
          isActive : true
        },'openid',res=>{
          if(res.length == 0){
            // 可以新增
            this.planAddDB()
          }else{
            wx.showToast({
              icon: 'none',
              title: '只能开启一个计划哟'
            })
          }
        })
      }
    })
  },
  planAddDB:function(){
    let planId = new Date().getTime()+''
    let planEndDate = new Date(this.data.baseInfo.planStartDate)
    let days = [30,90,365]
    planEndDate.setDate(planEndDate.getDate() + days[this.data.baseInfo.palnDates])
    planEndDate.setHours(23)
    planEndDate.setMinutes(59)
    planEndDate.setSeconds(59)
    let temp_ = this.getMoney(planId,this.data.baseInfo.palnType,days[this.data.baseInfo.palnDates])
    let targetMoney = temp_.sum
    let data = {
      _id:planId,
      openid:app.globalData.userInfo.openid,
      palnDates:this.data.baseInfo.palnDates,
      palnType:this.data.baseInfo.palnType,
      planStartDate:new Date(this.data.baseInfo.planStartDate),
      planEndDate:planEndDate,
      completeDegree:0,
      totalMoney:0,
      targetMoney:targetMoney,
      isComplete:false,
      createData:new Date(),
      isActive:true,
    }
    app.$add('user_plan',data,res=>{
      if(res){
        let objArray = temp_.objArray
        objArray.forEach(e=>{
          app.$add('user_plan_items',e,res=>{})
        })
        wx.hideLoading()
        wx.navigateTo({
          url: '../index/index',
        })
      }else{
        wx.hideLoading()
        wx.showToast({
          icon: 'none',
          title: '添加失败'
        })
      }
    })
    
    console.log(data);
  },
  getMoney:function(planId,type,days){
    let array = new Array()
    let sum = 0 
    let objArray = new Array()
    if(type == 0){
      for(let i = 1;i <= days;i++){
        array.push(i)
        sum += i
        let obj = {
          openid:app.globalData.userInfo.openid,
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
            openid:app.globalData.userInfo.openid,
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
})