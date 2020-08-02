const app = getApp()

Page({
  data: {
    dataList: [
      {"icon": "home","text": "首页"},
      {"icon": "me","text": "我的"},
    ],
    userInfo:{},
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
      }
      wx.hideLoading()
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  }
})