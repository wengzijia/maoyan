const request = require('./request.js');
// const apiUrl = 'https://maoyanapi.w0824.com'
const API_URL = 'http://127.0.0.1:5566'
// 获取token 
exports.fetchGetToken = function(code){
  let url = `http://127.0.0.1:5566/wxlogin`;
  return request({
    method:"POST",
    url,
    data:{
      code
    }
  })
}

// 下单接口
exports.fetchPlaceAnOrder = function(movieid,openid){
  let url = `${API_URL}/wxpay`;
  return request({
    method:"POST",
    url,
    data:{
      movieid,openid
    }
  })
}

// 获取用户订单
exports.fetchUserOrder = function(){
  let url = `${API_URL}/userOrder`;
  return request({
    url
  })
}