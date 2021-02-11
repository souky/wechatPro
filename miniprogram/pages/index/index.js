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
    buttons:[{text: '取消'}, {text: '确定'}],
    // 授权弹框
    syncShow:false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
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
  // 同步信息
  syncUser:function(){
    let that = this
    // 查看是否授权
    wx.getSetting({
      success (res){
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function(res) {
              // 更新用户头像以及姓名
              that.updateUserInfo(res.userInfo)
            }
          })
        } else {
          that.setData({syncShow:true})
        }
      }
    })
  },
  bindGetUserInfo:function(e){
    this.updateUserInfo(e.detail.userInfo)
  },
  updateUserInfo:function(userInfo){
    wx.showLoading({title: '加载中',mask:true})
    if(userInfo){
      app.$db.collection('user_info').doc(app.globalData.userInfo._id).update({
        // data 传入需要局部更新的数据
        data: {
          // 表示将 done 字段置为 true
          nickName: userInfo.nickName,
          avatarUrl: userInfo.avatarUrl
        },
        success: res=>{
          this.setData({syncShow:false})
          wx.hideLoading()
          wx.showToast({icon: 'success',title: '同步成功了鸭'})
          app.globalData.userInfo = userInfo
          this.initData()
        },
        fail: err=>{
          this.setData({syncShow:false})
          wx.hideLoading()
          wx.showToast({icon: 'error',title: '同步失败了鸭,稍等在试试吧'})
        }
      })
    }else{
      wx.hideLoading()
      wx.showToast({icon: 'none',title: '请先进行授权哟'})
    }
    
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

  // 订阅状态
  changeRemind(e){
    if(e.detail.value) {
      let id = this.data.baseInfo._id
      let this_ = this
      wx.requestSubscribeMessage({
        tmplIds: ['Zfx6gEoTCnkPyMsPToYisufGxBC_wiM7LI2QbzwvPjs'],
        success (res) {
          if(res.errMsg == 'requestSubscribeMessage:ok'){
            if(res['Zfx6gEoTCnkPyMsPToYisufGxBC_wiM7LI2QbzwvPjs'] == 'accept'){
              app.$db.collection('user_plan').doc(id).update({
                data:{isRemind:true}
              }).then(ress=>{
                if(ress.stats.updated == 1){
                  wx.showToast({icon: 'success',title: '订阅成功了鸭'})
                  this_.setData({[`baseInfo.isRemind`]:true})
                }else{
                  wx.showToast({icon: 'none',title: '订阅失败了鸭'})
                  this_.setData({[`baseInfo.isRemind`]:false})
                }
              })
            }else{
              this_.setData({[`baseInfo.isRemind`]:false})
              wx.showToast({icon: 'none',title: '不要拒绝哦'})
            }
          }else{
            this_.setData({[`baseInfo.isRemind`]:false})
            wx.showToast({icon: 'none',title: '订阅失败了鸭'})
          }
        }
      })
    }else{
      app.$db.collection('user_plan').doc(this.data.baseInfo._id).update({
        data:{isRemind:false}
      }).then(res=>{
        if(res.stats.updated == 1){
          wx.showToast({icon: 'success',title: '取消订阅成功'})
          this_.setData({[`baseInfo.isRemind`]:false})
        }else{
          wx.showToast({icon: 'none',title: '取消订阅失败'})
          this_.setData({[`baseInfo.isRemind`]:true})
        }
      })
    }
  },

  initData:function(){
    wx.showLoading({title: '加载中',mask:true})
    // 用户信息
    let user = app.globalData.userInfo
    this.setData({
      userInfo:user
    })
    // 任务信息加载
    app.$query('user_plan',{openid:user.openid,isActive:true},'createData',res=>{
      if(res.length != 0){
        let e = res[0]
        e.days = this.getDays(e.planStartDate,e.planEndDate)
        e.planStartDate = this.formatData(e.planStartDate)
        e.planEndDate = this.formatData(e.planEndDate)
        this.setData({showAdd:false,baseInfo:e})
        this.selectComponent('#canvasRing').onLoad()
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
