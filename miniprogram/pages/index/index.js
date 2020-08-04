const app = getApp()

Page({
  data: {
    dataList: [
      {"icon": "home","text": "首页"},
      {"icon": "me","text": "我的"},
    ],
    userInfo:{},
    baseInfo:{},
    hisList:[],
    // 是否显示新增
    showAdd:true,
    // 不存在记录
    noRecord:true
  },
  onReady: function () {
    
  },
  onShow:function(){
    this.initData()
  },

  // 添加计划
  addPlan:function(){
    wx.navigateTo({
      url: '../planadd/planadd',
    })
  },

  initData:function(){
    wx.showLoading({title: '加载中',mask:true})
    // 用户信息
    let user = app.globalData.userInfo
    this.setData({
      userInfo:user
    })
    // 任务信息加载
    app.$query('user_plan',{openid:user.openid},'createData',res=>{
      if(res.length != 0){
        let hisList = new Array()
        res.forEach(e=>{
          e.days = this.getDays(e.planStartDate,e.planEndDate)
          e.planStartDate = this.formatData(e.planStartDate)
          e.planEndDate = this.formatData(e.planEndDate)
          if(e.isActive) {
            this.setData({showAdd:false,baseInfo:e})
            this.selectComponent('#canvasRing').onLoad()
          }
          else hisList.push(e)
        })
        
        if(hisList.length != 0) {
          this.setData({
            noRecord:false,
            hisList:hisList
          })
        }
      }

      wx.hideLoading()
    })
  },

  formatData:(date)=>{
    date = new Date(date)
    let strings = ''
    strings += date.getFullYear() + '/'
    strings += date.getMonth() + 1 + '/'
    strings += date.getDate()
    return strings
  },
  getDays:(dateS,dateE)=>{
    dateE.setHours(0)
    dateE.setMinutes(0)
    dateE.setSeconds(0)
    dateE = dateE.getTime()
    let dataNow = new Date()
    if(dateS > dataNow){
      dataNow = dateS
    }
    dataNow.setHours(0)
    dataNow.setMinutes(0)
    dataNow.setSeconds(0)
    return parseInt((dateE-dataNow)/24/60/60/1000) + 1
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  }
})