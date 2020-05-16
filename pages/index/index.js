//index.js
//获取应用实例
const app = getApp()
let videoCtx = null

Page({
  data: {
    hiddenmoda:true,
    hiddenImg:true,
    hiddenVideo:true,
    loading:true,
    modalText:'',
    internation:'en',
    internationList:[
      {key:'en',value:'English'},
      {key:'zh',value:'简体中文'}
    ],
    tempImgList:[],
    index:0,
    videoposter:'',
    videosrc:'',
    timeLineList:[{en:{title:"Mirafiori Agriculture Market Resuscitation Project",text:"This project aimed to resuscitate the district Mirafiori where is the old residential area of F.I.A.T. As a important part of community, the market has various function.To resuscitate this area, my team decided to reorganize these functions, such as workshop, playground and city farming. Introducing new roles into the market and expanding the selling space bring new blood to the area."},zh:{title:"米拉菲奥里农业市场复苏项目",text:"该项目旨在复兴米拉菲奥里区，该区是F.I.A.T.的老居民区，作为社区的重要组成部分，市场具有多种功能。为了复兴该区，我的团队决定重组这些功能，如车间、游乐场和城市农业。将新角色引入市场，拓展销售空间，为该地区带来新的血液。"},showPage:"http://file.soukys.com/A.jpg",type:"banner",bannerList:["http://file.soukys.com/scroll_1/1.jpg","http://file.soukys.com/scroll_1/2.jpg","http://file.soukys.com/scroll_1/3.jpg","http://file.soukys.com/scroll_1/4.jpg","http://file.soukys.com/scroll_1/5.jpg","http://file.soukys.com/scroll_1/6.jpg","http://file.soukys.com/scroll_1/7.jpg","http://file.soukys.com/scroll_1/8.jpg",]},{en:{title:"Educational Internet Security Game Design",text:"This game is designed to guide young children to learn how to use Internet to get useful information and how to avoid risk on Internet.The video is introduction of the game, 2D part and 3D part represent real world and the world inside Internet respectively."},zh:{title:"教育网络安全游戏设计",text:"这个游戏旨在引导幼儿学习如何使用互联网获取有用的信息，以及如何避免风险互联网视频是游戏的介绍，二维部分和三维部分分别代表真实世界和互联网内部的世界。"},showPage:"https://file.soukys.com/C.jpg",type:"video",videoSrc:"https://file.soukys.com/video/C.mp4"},{en:{title:"ROME 2017: 21st Century River Renaissance",text:'The project is designed for Eleven magazine competition "ROME 2017". The competition aim to renascent the area around Tiber river especially the space under river bank.The Tiber Living Lab is a set of service facilities rather than a building. My team mate and I considered these units as products, given them a comprehensive business strategy.'},zh:{title:"罗马2017：21世纪河流复兴",text:"该项目是为11个杂志比赛“罗马2017”设计的。本次比赛旨在复兴泰伯河周边地区，特别是河岸下的空间，泰伯生活实验室是一套服务设施，而不是一座建筑。我和我的同事把这些部门看作是产品，因为他们有一个全面的商业战略。"},showPage:"http://file.soukys.com/B.jpg",type:"banner",bannerList:["http://file.soukys.com/scroll_2/1.jpg","http://file.soukys.com/scroll_2/2.jpg","http://file.soukys.com/scroll_2/3.jpg","http://file.soukys.com/scroll_2/4.jpg","http://file.soukys.com/scroll_2/5.jpg","http://file.soukys.com/scroll_2/6.jpg","http://file.soukys.com/scroll_2/7.jpg"]},{en:{title:"Meat Breeding Industry Redesign in 9 BlackBrid",text:"9 blackbird is an area in north Italy, near Turin. This project is a part of Regional Renewal Plan. The current mode of local meat breeding is lacking of Sustainability.As designers, what my team and I need to do is to cut down non-renewable consuming and generating energy with output. Enhancing the efficiency of resource utilization, and cooperate with other local industries to bring more benefits to the whole area.The attached pdf is the final economic report of the meet breeding industry, which shows our research and how we solve the current problems."},zh:{title:"黑鹂养殖业再设计",text:"黑鹂是意大利北部靠近都灵的一个地区。该项目是区域更新计划的一部分。目前当地的肉品养殖模式缺乏可持续性，作为设计师，我和我的团队需要做的就是减少不可再生的消耗，用产出来产生能源。提高资源利用效率，与当地其他产业合作，为全区带来更多效益，所附pdf是会议种业的最终经济报告，展示了我们的研究成果和解决当前问题的方法。"},showPage:"http://file.soukys.com/D.jpg",type:"PDF",PDFSrc:"https://file.soukys.com/pdf/Pdf1.pdf"},{en:{title:"Open Source Service System Design",text:"This is a business design research aimed to connect IP market with E-commerce to avoid pirates behaviors. The project is based on China’s current situation, developed e-commerce brings rampant piracy, every individual could be manufacturer. The project try to turn individual pirates to be authorised, squeeze market share of bigger pirates by lower the authorising fee of IPs.The attached images is our diagrams and a prototype of the design."},zh:{title:"开源服务系统设计",text:"这是一项商业设计研究，旨在将IP市场与电子商务联系起来，避免盗版行为。该项目是基于中国的现状，发达的电子商务带来猖獗的盗版，每个人都可以成为制造商。该项目试图通过降低授权费，使单个盗版者获得授权，从而挤压更大盗版者的市场份额知识产权。附加图片是我们的图表和设计原型。"},showPage:"http://file.soukys.com/E.jpg",type:"PDF",PDFSrc:"https://file.soukys.com/pdf/Pdf2.pdf"}]
  },
  
  openModal:function(e){
    let modalText = e.currentTarget.dataset.text
    this.setData({
      modalText:modalText,
      hiddenmoda:false
    })
  },
  closeModal:function(){
    this.setData({
      hiddenmoda:true
    })
  },
  closeImg:function(){
    this.setData({
      hiddenImg:true
    })
  },
  closeVideo:function(){
    this.setData({
      hiddenVideo:true
    })
    videoCtx.pause()
  },
  stopEvent:function(){
    return
  },
  handleChange(e){
    let keys = ['en','zh']
    this.setData({
      index: e.detail.value,
      internation:keys[e.detail.value]
    })
  },
  showImg(e){
    let tempImgList = e.currentTarget.dataset.list
    this.setData({
      tempImgList:tempImgList,
      hiddenImg:false
    })
  },
  showVideo(e){
    let videosrc = e.currentTarget.dataset.videosrc
    let videoposter = e.currentTarget.dataset.videoposter
    this.setData({
      videosrc:videosrc,
      videoposter:videoposter,
      hiddenVideo:false
    })
    if(!videoCtx){
      videoCtx = wx.createVideoContext('myvideo', this)
    }
  },
  
  showPDF(e){
    let url = e.currentTarget.dataset.url
    this.setData({loading:false});
    wx.downloadFile({
      url: url,
      success: res=> {
        this.setData({loading:true});
        const filePath = res.tempFilePath
        wx.openDocument({
          filePath: filePath,
          success: function (res) {
            
          }
        })
      }
    })
  }
  
})
