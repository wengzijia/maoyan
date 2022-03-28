// pages/movie/movie.js
const {fetchCity,fetchMovieList,fetchExpectMovies,fetchToHitMovie} = require('../../api/index.js')
const { apiCurrying} = require("../../utils/util.js")

const wxLogin = apiCurrying(wx.login)
const wxGetLocation = apiCurrying(wx.getLocation)
const wxGetSystemInfo = apiCurrying(wx.getSystemInfo)
Page({

  /**
   * 页面的初始数据
   */
  data: {
    city:"汕头",
    tabs:[
      {title:"热映"},
      {title:"待映"},
    ],
    activeIndex:0,
    isAgreeGetLocation:true,
    isFirstTime:true,
    windowHeight:0,
    movieListData:[],  // 热映电影数据
    isLoadFinish:true,  // 是否加载完成,   // true 未加载完毕    false  加载完毕
    page:1,
    pagesize:10,
    expectMoviesData:"", // 待映期待电影
    reflectedData:[],  // 待映电影数据,
    isPullRefresh:false
  },
  // 获取用户位置
  getUserLocation(){
    let _this = this;
    wx.getLocation({
      type: 'wgs84',
      isHighAccuracy: true,
     async success(res){
        let { latitude,longitude} = res;
        let data = await fetchCity(latitude,longitude);
        console.log(data);
        let city = data.result.addressComponent.city;
        wx.setStorageSync('city', city)
        _this.setData({
          city
        })
      },
      fail(err){
        _this.setData({
          isAgreeGetLocation:false
        })
      }
    })
  },

  // 获取设备窗口的高度
  async getWindowHeight(){
      let {windowHeight} = await wxGetSystemInfo()
      this.setData({
        windowHeight
      })
  },

  // 获取热映电影列表
  async movieList(){
      let result = await fetchMovieList(this.data.page,this.data.pagesize);
      // 说明加载完毕
      if(result.length < this.data.pagesize){
       this.setData({
          isLoadFinish:false
       })
       wx.showToast({
         title: '加载完毕了',
       })
       return;
      }
      // 正则替换   w.h 替换为空    图片才能加载出来
      result = result.map(item=>{
        item.img = item.img.replace(/\/w.h/,'')  
        return item
      })
      // 合并数据
      result = [...this.data.movieListData,...result]
      this.setData({
        movieListData:result
      })
  },

  // 获取待映电影列表
  // async ToHitMovie(){
  //    let {movieList} = await  fetchToHitMovie();
  //    movieList = movieList.map(item=>{
  //      item.img = item.img.replace(/\/w.h/,'')
  //      return item
  //    })
  //    // 日期分组  {  1月1日 周六: [{…}] }
  //    let dateGroupMovies = {};
  //    movieList.forEach(item=>{
  //      // 如果里面有日期(key)就把每一项数据加进去作为值(value)
  //      // 没有日期(key)就把每一项数据作为他的key
  //      if(dateGroupMovies[item.comingTitle]){
  //        dateGroupMovies[item.comingTitle].push(item)
  //      }else{
  //        dateGroupMovies[item.comingTitle] = [item]
  //      }
  //    })
  //    this.setData({
  //     reflectedData:dateGroupMovies
  //    })
  // },

  

  // tabBar切换的时候触发
  onChange(event){
    // 切换的时候把下标进行赋值
    let {index} = event.detail;
    this.setData({
      activeIndex:index
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(){
    //获取设备窗口高度
    this.getWindowHeight()
    let city = wx.getStorageSync('city');
    if(city){
      this.setData({
        city
      })
    }else{
      //调用方法 重新获取用户位置
      this.getUserLocation()
    }
    // 初始化热映电影列表
    this.movieList()
    // // 获取待映近期期待的电影
    // let expectMoviesData = await  fetchExpectMovies();
    // this.setData({
    //   expectMoviesData
    // })

    // 初始化待映电影
    // this.ToHitMovie()

    // let {movieList} = await  fetchToHitMovie();
    let result = await Promise.all([fetchExpectMovies(),fetchToHitMovie()])
    // 获取待映近期期待的电影 
    let expectMoviesData = result[0]
    this.setData({
      expectMoviesData
    })

    // 获取待映电影列表
    let {movieList} = result[1]
    movieList = movieList.map(item=>{
      item.img = item.img.replace(/\/w.h/,'')
      return item
    })
    // 日期分组  {  1月1日 周六: [{…}] }
    let dateGroupMovies = {};
    movieList.forEach(item=>{
      // 如果里面有日期(key)就把每一项数据加进去作为值(value)
      // 没有日期(key)就把每一项数据作为他的key
      if(dateGroupMovies[item.comingTitle]){
        dateGroupMovies[item.comingTitle].push(item)
      }else{
        dateGroupMovies[item.comingTitle] = [item]
      }
    })
    this.setData({
     reflectedData:dateGroupMovies
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
  // 页面显示的时候触发
  onShow: function () {
    let _this = this;
    console.log('显示');
    // 不是第一次就不再往下执行
    if(this.data.isFirstTime){
      return
    }
    wx.getSetting({
      success(res){
        // 如果用户同意,就获取位置,并且隐藏授权按钮
       if(res.authSetting['scope.userLocation']){
          _this.getUserLocation();
          _this.setData({
            isAgreeGetLocation:true
          })
       }else{
         // 否则就提示授权,并且把授权按钮显示
         wx.showToast({
           title: '请打开授权页面进行授权',
         }),
         _this.setData({
           isAgreeGetLocation:false
         })
       }
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  // 页面隐藏的时候触发
  onHide: function () {
    console.log('隐藏');
    this.setData({
      isFirstTime:false
    })
  },


  // 上拉加载更多   页码++  然后再发送请求获取
  scrollLoadMore(){
    // 说明加载完毕就不再执行
    if(!this.data.isLoadFinish){
      return;
    }
    this.data.page++,
    this.movieList()
  },

  // 下拉刷新  页码始终为第一页   
  pullToRefresh (){
    if(this.data.activeIndex === 0){
    this.data.page = 1,
    this.data.isLoadFinish=true,
    this.setData({
      movieListData:[],
      isPullRefresh:false
    })
    this.movieList()
    return
    }
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