// components/canvas-ring/canvas-ring.js
var windWidth = wx.getSystemInfoSync().windowWidth;
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    //画布的宽度 默认占屏幕宽度的0.4倍
    canvasWidth: {
      type: Number,
      value: 150
    },
    //线条宽度 默认10
    lineWidth: {
      type: Number,
      value: 10
    },
    //线条颜色 默认"#393"
    lineColor: {
      type: String,
      value: "#7890ad"
    },
    //标题 默认“完成率”
    title: {
      type: String,
      value: "完成率"
    },
    //当前的值 默认45
    value: {
      type: Number,
      value: 45
    },
    //值的颜色 默认"#ff9c07"
    valueColor:{
      type: String,
      value: "#7890ad"
    },
    //最大值 默认100
    maxValue: {
      type: Number,
      value: 100
    },
    //最小值 默认0
    minValue: {
      type: Number,
      value: 0
    },
    //当前值的后缀名
    suffix: {
      type: null,
      value: "%"
    },
    //从什么角度开始 0~360之间 （12点方向为0,18点方向为180,0点方向为360）
    startDegree: {
      type: Number,
      value: 180
    }

  },

  /**
   * 组件的初始数据
   */
  data: {
    canvasWidth: 200,
    isMarginTop: true
  },

  ready: function() { 
    
  },

  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () { 
      this.onLoad()
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onLoad() {
      //作画
      const ctx = wx.createCanvasContext('firstCanvas',this)
      var circle_r = this.data.canvasWidth / 2; //画布的一半，用来找中心点和半径
      var startDegree = this.data.startDegree; //从什么角度开始
      var maxValue = this.data.maxValue; //最大值
      var minValue = this.data.minValue; //最小值
      var value = this.data.value; //当前的值
      var lineColor = this.data.lineColor; //线条颜色
      var lineWidth = this.data.lineWidth; //线条宽度
      var percent = 360 * ((value - minValue) / (maxValue - minValue)); //计算结果
      //定义起始点
      ctx.translate(circle_r, circle_r);
      //灰色圆弧
      ctx.beginPath();
      ctx.setStrokeStyle("#ebebeb");
      ctx.setLineWidth(lineWidth);
      ctx.arc(0, 0, circle_r - 10, 0, 2 * Math.PI, true);
      ctx.stroke();
      ctx.closePath();
      //有色彩的圆弧
      ctx.beginPath();
      ctx.setStrokeStyle(lineColor);
      ctx.setLineWidth(lineWidth);
      ctx.arc(0, 0, circle_r - 10, startDegree * Math.PI / 180 - 0.5 * Math.PI, percent * Math.PI / 180 + startDegree * Math.PI / 180 - 0.5 * Math.PI, false);
      ctx.stroke();
      ctx.closePath();

      ctx.draw();

    }
  }
})