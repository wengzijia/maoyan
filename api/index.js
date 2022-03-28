const request = require('./request.js');
exports.fetchCity = function (latitude,longitude) {
  let url=`http://api.map.baidu.com/geocoder/v2/?location=${latitude},${longitude}&output=json&ak=WEc8RlPXzSifaq9RHxE1WW7lRKgbid6Y`;
  return request({
    url
  })
}

// 获取热映电影列表
exports.fetchMovieList = function (page,pagesize) {
  let url = `http://maoyan.wengzijia.top/comingList?page=${page}&pagesize=${pagesize}`;
  return request({url})
}

// 获取待映的近期最受期待的电影
exports.fetchExpectMovies = function(){
  let url  = `https://m.maoyan.com/ajax/topRatedMovies`;
  return request({
    url
  })
}

// 获取待映电影列表
exports.fetchToHitMovie = function(){
  let url = `https://m.maoyan.com/ajax/movieOnInfoList`;
  return request({
    url
  })
}

// 获取电影详情
exports.fetchMovieDetail=function(id){
  let url = `https://api.maoyan.com/mmdb/movie/v5/${id}.json?ci=30&channelId=70001&utm_medium=android&version=wallet-v2.18.25&uuid=80953d06272e3a9a90419c58a4f97933&platform=13&partner=1&riskLevel=71&optimusCode=10`;
  return request({
    url
  })
}

// 获取电影详情的演员
exports.fetchDetailActor = function(movieId){
  let url = `https://api.maoyan.com/mmdb/v7/movie/${movieId}/celebrities.json?channelId=70001&version=wallet-v2.18.25&uuid=80953d06272e3a9a90419c58a4f97933&platform=13&partner=1&riskLevel=71&optimusCode=10`
  return request({
    url
  })
}

// 获取电影详情的视频推荐
exports.fetchVideoList = function(movieId){
  let url = `https://api.maoyan.com/mmdb/movie/${movieId}/videos.json?videoId=483630&token=MY_S4reBoIo01AVruNQznKtg0dImSsAAAAwfFdvk10CuvLNNif9o5sP9mcwzDwaACOu36NrxaBxCixzMn3JEJstUIFUbiDFmOXjAAAAZAAAAAEB&version=wallet-v2.18.25&uuid=80953d06272e3a9a90419c58a4f97933&platform=13&partner=1&riskLevel=71&optimusCode=10`
  return request({
    url
  })
}


// 加入想看的电影
exports.fetchJoinSeeMovie = function(movieid){
  return request({
    method:"POST",
    url:`http://127.0.0.1:5566/updSeeMovie`,
    data:{
      movieid
    }
  })
}


// 获取用户想看的电影
 exports.fetchSeeMovie = function (){
   return request({
     url:`http://127.0.0.1:5566/seeMovie`
   })
 }
