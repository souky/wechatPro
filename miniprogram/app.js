//app.js
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'planplus-k5djb',
        traceUser: true,
      })
    }
    
    const db_ = wx.cloud.database()
    this.$db = db_
  
    // query通用方法
    this.$query = (collection,params,fn) => {
      db_.collection(collection).where(params).get({
        success: res => {
          fn(res.data)
        },
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
        success: res => {
          fn(true)
        },
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
