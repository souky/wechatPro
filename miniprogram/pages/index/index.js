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
          e.planStartDate = this.formatData(e.planStartDate)
          e.planEndDate = this.formatData(e.planEndDate)
          e.days = this.getDays(e.planEndDate)
          if(e.isActive) this.setData({showAdd:false,baseInfo:e})
          else hisList.push(e)
        })
        
        this.selectComponent('#canvasRing').onLoad()
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
  getDays:(date)=>{
    date = new Date(date)
    date.setDate(date.getDate()+1)
    date.setHours(0)
    date.setMinutes(0)
    date.setSeconds(0)
    let dataNow = new Date()
    dataNow.setHours(0)
    dataNow.setMinutes(0)
    dataNow.setSeconds(0)
    return parseInt((date-dataNow)/24/60/60/1000)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  }
})