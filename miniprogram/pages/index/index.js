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
    noRecord:true,
    dialogShow:false,
    buttons:[{text: '取消'}, {text: '确定'}]
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
  // 删除计划
  deletePlan:function(){
    this.setData({dialogShow:true})
  },
  tapDialogButton:function(e){
    if(e.detail.index == 1){
      this.setData({dialogShow:false})
      wx.showLoading({title: '删除中',mask:true})
      wx.cloud.callFunction({
        name: 'deletePlan',
        data: {
          planId:this.data.baseInfo._id
        },
        complete: res => {
          if(res.result.success) {
            wx.hideLoading()
            this.initData()
          }else{
            wx.showToast({
              icon: 'none',
              title: '删除失败,请稍后再试'
            })
          }
        }
      })
      
    }else{
      this.setData({dialogShow:false})
    }
  },

  // 计划详情
  planInfo:function(){
    let id = this.data.baseInfo._id
    wx.navigateTo({
      url: '/pages/planInfo/planInfo?id='+id,
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

        if(hisList.length == res.length) {
          this.setData({
            showAdd:true,
            baseInfo:{}
          })
        }
        
        if(hisList.length != 0) {
          this.setData({
            noRecord:false,
            hisList:hisList
          })
        }
      }else{
        this.setData({showAdd:true,baseInfo:{}})
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