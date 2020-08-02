Page({
  data: {
    error:'',
    rules:[
      {name: 'palnDates',rules: {required: true, message: '计划时长必选'}},
      {name: 'palnType',rules: {required: true, message: '计划类型必选'}},
      {name: 'planStartDate',rules: {required: true, message: '计划开始时间必选'}}
    ],
    baseInfo:{isRemind:false},
    palnDatess:["月(30天)", "季度(90天)", "年(365天)"],
    palnTypes:["自然序列和", "质数序列和"],
  },
  onLoad: function (options) {

  },
  onShow: function () {
    
  },

  onHide: function () {

  },
  commonChange:function(e){
    let field = e.currentTarget.dataset.field
    this.setData({
      [`baseInfo.${field}`]:e.detail.value
    })
  },

  submitForm:function(){
    this.selectComponent('#form').validate((valid, errors) => {
      console.log('valid', valid, errors)
      if (!valid) {
          const firstError = Object.keys(errors)
          if (firstError.length) {
              this.setData({
                  error: errors[firstError[0]].message
              })

          }
      } else {
          wx.showToast({
              title: '校验通过'
          })
      }
    })
    console.log(this.data.baseInfo);
    
  }
})