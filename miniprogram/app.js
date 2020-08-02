//app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'planplus-k5djb',
        traceUser: true,
      })
    }
    
    const db_ = wx.cloud.database()
    this.$db = db_
  
    // query通用方法
    this.$query = (collection,params,order,fn) => {
      db_.collection(collection).where(params).orderBy(order,'asc').get({
        success: res => {fn(res.data)},
        fail: err => {
          fn([])
          wx.showToast({
            icon: 'none',
            title: '查询记录失败'
          })
        }
      })
    }

    // install通用方法
    this.$add = (collection,params,fn) => {
      db_.collection(collection).add({
        data:params,
        success: res => {fn(true) },
        fail: err => {
          fn(false)
          wx.showToast({
            icon: 'none',
            title: '新增记录失败'
          })
        }
      })
    }
    this.globalData = {}
  }
})
