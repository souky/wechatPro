const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    planId:'',
    moneyInfo:{},
    dialogShow:false,
    dialogShowIn:false,
    buttons:[{text:'取消'},{text:'确认'}]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({title: '加载中',mask:true})
    this.setData({
      planId:options.id
    })
    wx.cloud.callFunction({
      name: 'getAllPlanItems',
      data: {
        planId:options.id
      },
      complete: res => {
        wx.hideLoading()
        this.setData({
          list:res.result.data
        })
      }
    })
  },

  inMoney:function(e){
    this.setData({
      moneyInfo:{
        id:e.currentTarget.dataset.id,
        index:e.currentTarget.dataset.index,
        inMoney:e.currentTarget.dataset.in
      }
    })
    this.setData({
      dialogShow:true
    })
  },
  outMoney:function(e){
    this.setData({
      moneyInfo:{
        id:e.currentTarget.dataset.id,
        index:e.currentTarget.dataset.index,
        inMoney:0 - e.currentTarget.dataset.in
      }
    })
    this.setData({
      dialogShowIn:true
    })
  },
  updateMoney:function(e){
    this.setData({dialogShow:false,dialogShowIn:false})
    if(e.detail.index == 1){
      wx.showLoading({title: '加载中',mask:true})
      wx.cloud.callFunction({
        name: 'updatePlanItem',
        data: {
          planId:this.data.planId,
          _id:this.data.moneyInfo.id,
          inMoney:this.data.moneyInfo.inMoney
        },
        complete: res => {
          if(res.result.success) {
            wx.hideLoading()
            let list_ = this.data.list
            list_[this.data.moneyInfo.index].isDone = this.data.moneyInfo.inMoney > 0
            this.setData({
              list:list_
            })
          }else{
            wx.showToast({
              icon: 'none',
              title: '存入失败,请稍后再试'
            })
          }
        }
      })
    }
  },

  onReady: function () {

  },

  onShareAppMessage: function () {

  }
})