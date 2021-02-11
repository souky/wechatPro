const app = getApp()
Page({

  data: {
   
  },

  onGetOpenid: function(e) {
    wx.showLoading({title: '加载中',mask:true})

    // if(e.detail.userInfo == undefined){
    //   wx.showToast({
    //     title: '请先进行授权哟',
    //     icon: 'none',
    //     duration: 2000
    //   })
    //   return;
    // }
    // let userInfo = e.detail.userInfo
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        let userInfo = {}
        userInfo.openid = res.result.openid
        app.$query('user_info',{openid:userInfo.openid},'openid',res=>{
          if(res.length == '0'){
            // 需要增加用户信息
            let user = {
              openid:userInfo.openid,
              nickName:'可爱的存钱小鸭',
              gender:'',
              avatarUrl:'../../images/duck.png',
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
            app.globalData.userInfo = user
          }else{
            app.globalData.userInfo = res[0]
            wx.hideLoading()
            console.log('已经注册');
          }
          wx.redirectTo({
            url: '../index/index'
          })
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
