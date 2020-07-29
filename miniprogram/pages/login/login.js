const app = getApp()
Page({

  data: {

  },

  onGetOpenid: function(e) {
    wx.showLoading({title: '加载中',mask:true})
    
    if(e.detail.userInfo == undefined){
      wx.showToast({
        title: '请先进行授权哟',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    let userInfo = e.detail.userInfo
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        userInfo.openid = res.result.openid 
        app.globalData.userInfo = userInfo
        app.$query('user_info',{openid:userInfo.openid},res=>{
          if(res.length == '0'){
            // 需要增加用户信息
            let user = {
              openid:userInfo.openid,
              nickName:userInfo.nickName,
              gender:userInfo.gender,
              avatarUrl:userInfo.avatarUrl,
              planGroupId:''
            }
            app.$add('user_info',user,ress=>{
              if(!ress) {
                wx.showToast({
                  icon: 'none',
                  title: '授权失败'
                })
              }
              wx.hideLoading()
            })
          }else{
            wx.hideLoading()
            wx.navigateTo({
              url: '../index/index'
            })
            console.log('已经注册');
          }
        })
        
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})