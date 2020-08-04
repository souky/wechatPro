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
            wx.cloud.callFunction({
              name: 'addPlan',
              data: {
                baseInfo:this.data.baseInfo
              },
              complete: res => {
                if(res.result.success) {
                  wx.hideLoading()
                  wx.redirectTo({url: '../index/index'})
                }else{
                  wx.showToast({
                    icon: 'none',
                    title: '新增失败,请稍后再试'
                  })
                }
              }
            })
          }else{
            wx.showToast({
              icon: 'none',
              title: '只能开启一个计划哟'
            })
          }
        })
      }
    })
  }
})