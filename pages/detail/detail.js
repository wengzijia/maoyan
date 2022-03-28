// pages/detail/detail.js
const {fetchMovieDetail,fetchDetailActor,fetchVideoList } = require("../../api/index.js")
const { fetchJoinSeeMovie } = require('../../api/index.js')
const { fetchPlaceAnOrder } = require('../../api/user.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
      id:"",
      isUnfold:true, // 是否展开     true 收起     false  展开
      isUnfoldText:'展开v',
      detailData:{},
      coverPicture:"",
      actorList:[],
      videoList:[],
      isRed:false
  },


  isAddHeight(){
     this.setData({
      isUnfold:!this.data.isUnfold,
      isUnfoldText:this.data.isUnfold ? "展开v" : "收起^"
     }) 
  },

  // 图片预览
  imgPreview(){
    let _this = this;
    let imgList = []
    
    _this.data.detailData.photos.forEach(item=>{
     imgList.push(item)
    })
    wx.previewImage({
      urls:imgList,
      current:""
    })
  },

  // 加入想看的电影 
  async joinSeeMovie(){
    let {errcode,message} = await fetchJoinSeeMovie(this.data.id);
    if(errcode === 200){
      this.setData({
        isRed:true
      })
      wx.showToast({
        title: message,
      })
    }
  },

  // 优惠购票
  async buyTicket(){
    let openid = wx.getStorageSync('openid');
    console.log(openid);
    if(!openid){
      wx.navigateTo({
        url: '/pages/login/login',
      })
      return;
    }
    try{
    let paymentData = await fetchPlaceAnOrder(this.data.id,openid)
    if(paymentData.errcode !== 200){
      wx.showToast({
        title:paymentData.message,
      })
      return;
    }
    let {nonce_str,mypackage,sign_type,paySign,timeStamp} = paymentData.result.xml;
     // 调用wxwx.requestPayment拉起微信支付
     wx.requestPayment({
      nonceStr: nonce_str,
      package: mypackage,
      signType: sign_type,
      paySign: paySign,
      timeStamp: timeStamp,
      complete(){
          wx.redirectTo({
            url: '/pages/order/order',
          })
      },
  })
  }catch(err){
    console.log('errMessage',err.message);
  }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    let movieId = options.id;
    this.setData({
      id:movieId
    })
    let {data} = await fetchMovieDetail(movieId)
    data.movie.img = data.movie.img.replace(/\/w.h/,'')
    let result =  data.movie;
    let actorData = await fetchDetailActor(movieId)
    let actorList = actorData.data;
    let newActorList = [];
    actorList.forEach(item=>{
      item.forEach(item=>{
        newActorList.push(item)
      })
    })
    newActorList =  newActorList.map(item=>{
     item.avatar = item.avatar.replace(/\/w.h/,'')
     return item
    })

    let {vlist}  = await fetchVideoList(movieId);
    this.setData({
      detailData:result,
      coverPicture:data.movie.img,
      actorList:newActorList,
      videoList:vlist
    }) 
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})